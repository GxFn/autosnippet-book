# 向量引擎深度解析

> 从 HNSW 论文到纯 JavaScript 实现 — 一个零外部依赖向量引擎的算法细节与工程抉择。

## 为什么需要这一章

ch11 介绍了搜索系统的全貌：字段加权、向量语义、RRF 融合、七信号排序。向量引擎在其中只占了一节篇幅——足够理解"它能做什么"，但不够理解"它怎么做的"。

这一章聚焦于向量引擎本身：15 个源文件、从 HNSW 图算法到 SQ8 量化数学、从 AST 感知分块到二进制持久化格式。如果你想理解每一行距离计算的由来、每一个字节在 `.asvec` 文件中的位置、每一次降级的触发条件——这一章就是为你准备的。

**源码地图**：

| 层级 | 目录 | 文件数 | 职责 |
|:---|:---|:---|:---|
| 基础设施 | `lib/infrastructure/vector/` | 12 | 索引、量化、持久化、分块、Embedding |
| 服务层 | `lib/service/vector/` | 3 | 统一入口、上下文富化、事件同步 |

```text
              VectorService (统一入口)
                    │
     ┌──────────────┼──────────────┐
     ▼              ▼              ▼
SyncCoordinator  ContextualEnricher  HnswVectorAdapter
(事件同步)       (上下文富化)         (核心存储)
                                      │
                 ┌─────────┬─────────┼─────────┐
                 ▼         ▼         ▼         ▼
           HnswIndex  ScalarQuantizer  BinaryPersistence  AsyncPersistence
           (图算法)   (SQ8 量化)       (.asvec 二进制)    (WAL 日志)
```

---

## HNSW：分层可导航小世界图

### 论文背景

HNSW 由 Malkov 和 Yashunin 在 2018 年提出（*Efficient and robust approximate nearest neighbor search using Hierarchical Navigable Small World graphs*）。核心思想来自两个观察：

1. **小世界网络**（Small World Network）中，任意两点之间的最短路径都很短——平均路径长度与节点总数的对数成正比。
2. **跳表**（Skip List）通过多层稀疏化实现 $O(\log N)$ 查找——高层是稀疏索引，低层是完整数据。

HNSW 把这两个思想融合：**在每一层建立一个 Navigable Small World 图，跨层形成类似跳表的分层结构**。搜索时从最高层的入口节点开始贪心下降，高层跨步大、快速逼近目标区域；低层连接密、精确定位最近邻。

### 超参数体系

AutoSnippet 的 HNSW 实现使用以下超参数：

```typescript
// lib/infrastructure/vector/HnswIndex.ts
M = 16;            // 每层最大邻居连接数
M0 = M * 2;        // Layer 0 最大邻居数 (= 32)
efConstruct = 200;  // 构建时搜索的候选集大小
efSearch = 100;      // 查询时搜索的候选集大小
mL = 1 / Math.log(M); // 层级采样因子 ≈ 0.361
```

这些参数之间的关系：

| 参数 | 影响 | 值偏大 | 值偏小 |
|:---|:---|:---|:---|
| M | 图的连通性 | 更高 Recall、更多内存 | 更快构建、可能降低 Recall |
| M0 | Layer 0 密度 | 精确搜索更好 | 减少 Layer 0 内存 |
| efConstruct | 构建质量 | 更好的图连接、更慢的插入 | 更快插入、图质量下降 |
| efSearch | 搜索精度 | 更高 Recall、更慢 | 更快搜索、可能漏掉结果 |
| mL | 层级分布 | 更多高层节点（图更高） | 更扁平的图结构 |

**为什么 M=16？** 这是论文推荐的默认值，在 Recall 和速度之间取得平衡。对于 AutoSnippet 的典型规模（100-5000 条 Recipe），M=16 足够保证 > 95% 的 Recall@10。

**为什么 M0=2M？** Layer 0 包含所有节点，是搜索的最终定位层。双倍连接数保证在最密集的层中有足够的连通性，避免搜索陷入局部最优。

### 数据结构

```typescript
// 节点数组 —— null 表示已软删除
nodes: Array<{
  id: string;              // 文档 ID
  vector: Float32Array;    // 原始向量 (768 维)
  level: number;           // 节点最高层级
  qvector?: Uint8Array;    // SQ8 量化向量 (可选)
} | null> = [];

// 图邻接表 —— 每层一个 Map<节点索引, 邻居索引集>
graphs: Map<number, Set<number>>[] = [];

// 全局状态
entryPoint = -1;     // 入口节点索引
maxLevel = -1;       // 当前图的最高层级

// 快速查找
idToIndex = new Map<string, number>();  // id → 数组索引
```

**为什么用 `Array<... | null>` 而不是 Map？** 因为节点索引在图的邻接表中被广泛引用，使用连续数组可以保持索引稳定——删除节点时设为 null（软删除），不会导致其他节点的索引失效。紧凑化在持久化时做（BinaryPersistence 编码时过滤 null 并重映射索引）。

**为什么用 `Map<number, Set<number>>` 而不是 `number[][]`？** Set 保证了邻居不重复，Map 支持稀疏存储——某一层可能只有少数几个节点，不需要为所有节点分配空间。

### 自定义堆实现

HNSW 的搜索核心依赖两种堆结构，AutoSnippet 实现了完整的 MinHeap 和 MaxHeap：

```typescript
class MinHeap {
  // 候选队列：距离最小的优先弹出（用于 BFS 扩展）
  #data: { nodeIdx: number; dist: number }[] = [];

  push(nodeIdx: number, dist: number) {
    this.#data.push({ nodeIdx, dist });
    this.#siftUp(this.#data.length - 1);
  }

  pop() {
    // 弹出最小距离元素
    const top = this.#data[0];
    const last = this.#data.pop();
    if (this.#data.length > 0 && last) {
      this.#data[0] = last;
      this.#siftDown(0);
    }
    return top;
  }
}

class MaxHeap {
  // 结果集：距离最大的在堆顶（方便淘汰最远候选）
  // ...结构对称，仅比较方向相反
  toSortedArray() {
    return [...this.#data].sort((a, b) => a.dist - b.dist);
  }
}
```

**为什么不用 JavaScript 的 Array.sort()？** 堆的插入和弹出都是 $O(\log n)$，而 `sort()` 是 $O(n \log n)$。在 searchLayer 中每处理一个邻居都需要一次插入/弹出操作，堆的效率优势在高 efSearch 值时尤为明显。

### 距离函数

AutoSnippet 使用**余弦距离**作为默认度量：

$$d_\text{cosine}(\mathbf{a}, \mathbf{b}) = 1 - \frac{\mathbf{a} \cdot \mathbf{b}}{\lVert\mathbf{a}\rVert \times \lVert\mathbf{b}\rVert}$$

```typescript
function cosineDistance(a: ArrayLike<number>, b: ArrayLike<number>): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot   += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return 1 - dot / (Math.sqrt(normA) * Math.sqrt(normB));
}
```

余弦距离值域为 $[0, 2]$：0 表示完全相同方向、1 表示正交、2 表示完全相反。对于归一化的 embedding 向量，余弦距离和欧氏距离的排序是等价的（$d_\text{euclidean}^2 = 2 \times d_\text{cosine}$），但余弦距离对向量长度不敏感，更适合文本 embedding 场景。

距离函数支持**注入替换**：当启用 SQ8 量化时，HNSW 的粗排阶段使用量化空间的 L2 距离替代余弦距离。

### 层级选择：几何分布

每个新节点的层级由几何分布随机决定：

$$\text{level} = \lfloor -\ln(1 - U) \times m_L \rfloor, \quad U \sim \text{Uniform}(0, 1)$$

其中 $m_L = 1 / \ln(M)$。

```typescript
#randomLevel(): number {
  return Math.floor(-Math.log(1 - Math.random()) * this.mL);
}
```

::: info 为什么用 `1 - Math.random()` 而不是 `Math.random()`？
`Math.random()` 返回 $[0, 1)$，取 $\ln(0) = -\infty$ 会导致无限大层级。`1 - Math.random()` 的值域是 $(0, 1]$，规避了这个边界问题。
:::

这个分布的特征：

| 层级 | 概率（M=16） |
|:---|:---|
| 0 | ~93.9% |
| 1 | ~5.7% |
| 2 | ~0.35% |
| 3 | ~0.02% |

绝大多数节点只存在于 Layer 0。1000 个节点中，大约 57 个出现在 Layer 1，3-4 个出现在 Layer 2，Layer 3 几乎没有。这种稀疏性正是 HNSW 高效的关键——高层充当"高速公路"，用极少的节点实现大跨步导航。

### 插入算法

向量的插入分两个阶段：

```text
addPoint(id, vector):
  ① 如果 id 已存在 → removePoint 移除旧节点（支持更新语义）
  ② 随机选层 nodeLevel
  ③ 创建节点、存入 nodes[]、建立 idToIndex 映射
  ④ 如果是首个节点 → 设为 entryPoint，直接返回

  Phase 1 — 贪心下降到 nodeLevel + 1:
  ┌─────────────────────────────────────────────────┐
  │ for level = maxLevel ↓ to nodeLevel + 1:        │
  │   current = greedySearch(vector, current, level) │
  │   // 每层只找 1 个最近邻作为下一层入口            │
  └─────────────────────────────────────────────────┘

  Phase 2 — 逐层建立连接:
  ┌─────────────────────────────────────────────────┐
  │ for level = min(nodeLevel, maxLevel) ↓ to 0:    │
  │   candidates = searchLayer(vector, current,     │
  │                            efConstruct, level)   │
  │   neighbors = selectNeighborsSimple(candidates, │
  │               level == 0 ? M0 : M)              │
  │   for each neighbor:                             │
  │     双向连接 (node ↔ neighbor)                   │
  │     if neighbor.连接数 > limit:                  │
  │       pruneConnections(neighbor)                 │
  │   current = candidates[0]  // 最近邻作为下一层入口│
  └─────────────────────────────────────────────────┘

  ⑤ 如果 nodeLevel > maxLevel → 更新 entryPoint 和 maxLevel
```

**Phase 1** 的目的是快速定位到插入层附近的区域。从最高层的入口开始，每层只做贪心搜索（ef=1），找到该层最近的节点作为下一层的起点。这是 $O(L \times M)$ 的操作，其中 $L$ 是层级差。

**Phase 2** 才是真正的连接建立。在每一层中：

1. **搜索候选**：用 `searchLayer` 以 efConstruct 的宽度搜索，找到足够多的高质量候选邻居。
2. **选择邻居**：从候选中选出距离最近的 M 个（Layer 0 选 M0 个）。
3. **双向连接**：新节点连接到邻居，邻居也连接到新节点。
4. **裁剪**：如果某个邻居的连接数超过限制（被太多节点连接了），裁剪掉最远的连接。

### 搜索算法

搜索也分两个阶段，但语义不同：

```text
searchKnn(queryVector, k):

  Phase 1 — 贪心下降 L_max → L1:
  ┌──────────────────────────────────────────────────┐
  │ for level = maxLevel ↓ to 1:                     │
  │   current = greedySearch(query, current, level,  │
  │                          quantizer?, qQuery?)    │
  │   // 可选: 使用量化距离加速                        │
  └──────────────────────────────────────────────────┘

  Phase 2 — Layer 0 宽搜索:
  ┌──────────────────────────────────────────────────┐
  │ ef = max(efSearch, k)                            │
  │ candidates = searchLayer(query, current, ef, 0,  │
  │                          quantizer?, qQuery?)    │
  └──────────────────────────────────────────────────┘

  Phase 3 — 精排 (仅 2-pass 模式):
  ┌──────────────────────────────────────────────────┐
  │ for each candidate:                              │
  │   candidate.dist = cosineDistance(query,          │
  │                                  candidate.vec)  │
  │   // 用 Float32 精确距离替换 SQ8 近似距离          │
  │ sort by dist ascending                           │
  └──────────────────────────────────────────────────┘

  return top-k
```

Phase 1 用贪心搜索快速逼近——每层只保留 1 个最近邻。Phase 2 在 Layer 0 展开宽度为 ef 的束搜索（Beam Search），这是精度的关键所在。

### searchLayer：核心束搜索

`searchLayer` 是 HNSW 中最核心的子过程，同时被插入和查询使用：

```text
searchLayer(query, entryNodeIdx, ef, level):
  visited = Set{entryNodeIdx}
  candidates = MinHeap{(entryNode, dist)}   // 待探索，最近优先
  results    = MaxHeap{(entryNode, dist)}   // 当前 top-ef，最远在顶

  while candidates 非空:
    nearest = candidates.pop()              // 弹出距离最近的候选
    farthest = results.peek()               // 结果集中最远的

    if nearest.dist > farthest.dist:
      BREAK                                 // 剪枝：最近候选都比结果远了

    for neighborIdx in getNeighbors(level, nearest.nodeIdx):
      if neighborIdx in visited: continue
      visited.add(neighborIdx)

      dist = distance(query, neighbor.vector)

      if dist < farthest.dist OR results.size < ef:
        candidates.push(neighborIdx, dist)  // 加入候选队列
        results.push(neighborIdx, dist)     // 加入结果集
        if results.size > ef:
          results.pop()                     // 淘汰最远的，保持 ef 大小

  return results.toSortedArray()
```

这个算法的核心是**两个堆的协作**：

- **MinHeap（candidates）** 决定**探索顺序**——总是先探索离查询最近的候选。
- **MaxHeap（results）** 维护**当前最优**——堆顶是结果集中最远的，方便判断新候选是否值得加入。

**剪枝条件** `nearest.dist > farthest.dist` 是关键的效率保障：当候选队列中最近的候选都比当前结果集中最远的还远，说明继续探索不可能改善结果，可以提前终止。

### 邻居选择与裁剪

AutoSnippet 使用的是 **Simple 选择策略**——按距离升序取前 M 个最近邻：

```typescript
selectNeighborsSimple(candidates, maxNeighbors):
  // candidates 已按距离升序排列
  return candidates.slice(0, maxNeighbors)
```

::: info Simple vs. Heuristic
HNSW 论文提出了两种邻居选择策略：Simple（按距离选最近的）和 Heuristic（考虑邻居之间的多样性）。Heuristic 在高维空间中倾向于选择方向更分散的邻居，理论上能提高 Recall。AutoSnippet 选择 Simple 策略，因为在知识库规模（< 10K）下差异不大，且实现更简单可靠。
:::

**裁剪**发生在新节点连接时——如果某个已有节点的邻居数超过了 M（或 M0），需要移除最远的邻居：

```text
pruneConnections(nodeIdx, level):
  neighbors = getNeighbors(level, nodeIdx)
  if neighbors.size <= limit: return

  // 计算每个邻居到 nodeIdx 的距离
  scored = neighbors.map(n => ({ n, dist: distance(node, n) }))
  scored.sort(by dist ascending)

  // 保留最近的 limit 个
  keep = scored.slice(0, limit)
  remove = scored.slice(limit)

  // 清理被移除邻居的反向链接
  for each r in remove:
    neighbors.delete(r.n)
    getNeighbors(level, r.n).delete(nodeIdx)
```

### 删除策略：软删除

```typescript
removePoint(id):
  nodeIdx = idToIndex.get(id)

  // 断开所有层级的连接
  for level = 0 to node.level:
    neighbors = getNeighbors(level, nodeIdx)
    for each neighbor:
      getNeighbors(level, neighbor).delete(nodeIdx)
    graphs[level].delete(nodeIdx)

  // 软删除：slot 置 null
  nodes[nodeIdx] = null
  idToIndex.delete(id)

  // 如果删除的是入口节点 → 重新选择
  if nodeIdx === entryPoint:
    // 遍历所有节点，找最高层级的作为新入口
    findNewEntryPoint()
```

**为什么是软删除而不是物理删除？** 因为节点通过数组索引被引用：`graphs[level].get(3)` 中的 `3` 就是 `nodes[3]`。如果删除 `nodes[3]` 后所有索引前移，整个图的连接关系就乱了。软删除保持了索引稳定，紧凑化延迟到持久化时执行。

### 序列化设计

```typescript
serialize() → {
  M, M0, efConstruct, efSearch,
  entryPoint, maxLevel,
  nodes: [{ id, vector: number[], level } | null, ...],
  graphs: [level_entries, ...]
  // qvector 不序列化 — 启动时由量化器重新编码
}
```

`graphs` 的序列化格式是 `[number, number[]][][]`——把 `Map<number, Set<number>>` 转换为 `[nodeIdx, [...neighborIdxs]][]` 的二维数组。这既是 JSON 兼容格式（用于 `HnswIndex.serialize()` 内部），也是 `BinaryPersistence` 编码的中间表示。

---

## SQ8 标量量化

### 量化数学

标量量化（Scalar Quantization）是最简单的向量压缩方案：对每个维度独立地做线性映射，把 Float32 压缩为 Uint8。

**训练阶段**——统计每个维度的值域：

$$\min_i = \min_j v_{j,i}, \quad \max_i = \max_j v_{j,i}$$

其中 $j$ 遍历所有训练向量，$i$ 是维度索引。

**量化阶段**——线性映射到 [0, 255]：

$$q_i = \text{round}\left(\frac{v_i - \min_i}{\text{range}_i} \times 255\right), \quad \text{range}_i = \max(\max_i - \min_i, 10^{-10})$$

**反量化**：

$$\hat{v}_i = \frac{q_i}{255} \times \text{range}_i + \min_i$$

::: warning range 保护
如果某个维度的所有值完全相同（range = 0），除法会产生 NaN。代码中用 $\max(\text{range}, 10^{-10})$ 做了保护，将零 range 视为极小值。
:::

### 量化空间距离

SQ8 粗排阶段不需要反量化回 Float32——直接在 Uint8 空间计算 L2 距离：

```typescript
distance(a: Uint8Array, b: Uint8Array): number {
  let sum = 0;
  for (let i = 0; i < this.dimension; i++) {
    const diff = a[i] - b[i];
    sum += diff * diff;
  }
  return sum / (255 * 255 * this.dimension);  // 归一化到 ~[0, 1]
}
```

这个距离是**近似的**——它用 L2 in quantized space 来近似余弦距离。由于量化引入的误差，这个近似在局部会有排序偏差，但统计上 Recall > 95%。更重要的是：**整数运算比浮点运算快得多**，尤其在 JavaScript 引擎中 V8 可以把整数循环优化为 JIT 编译的高效代码。

归一化因子 $255^2 \times \text{dim}$ 把距离值映射到 $[0, 1]$ 量级，使其可以和余弦距离在相同尺度上比较。

### 内存效益

| 规模 | Float32 内存 | SQ8 内存 | 节省 |
|:---|:---|:---|:---|
| 1,000 条 × 768 维 | 3.07 MB | 0.77 MB | 75% |
| 3,000 条 × 768 维 | 9.22 MB | 2.30 MB | 75% |
| 10,000 条 × 768 维 | 30.72 MB | 7.68 MB | 75% |

### 2-Pass 搜索策略

量化后的搜索分两步：

1. **粗排（Coarse）**：用 SQ8 Uint8 距离在 HNSW 图中搜索，得到 ef 个候选。整数运算速度快，可以搜索更大的候选集。
2. **精排（Refine）**：对候选集用原始 Float32 向量重新计算余弦距离，按精确距离排序后返回 Top-K。

```text
              SQ8 Uint8 距离          Float32 余弦距离
全部节点 ──────────────────► ef 候选 ──────────────────► Top-K 结果
          粗排（快，近似）            精排（慢，精确）
```

**为什么不直接用 Float32？** 因为 2-Pass 本质上是用更廉价的运算做初筛，减少昂贵运算的候选数量。在 5000 条 Recipe 的规模下，粗排可能扫描 200+ 个节点的量化向量，但精排只需计算 ef=100 次 Float32 距离。

### 量化器训练时机

```typescript
#maybeTrainQuantizer():
  if quantize === 'none': return           // 明确关闭
  if quantize === 'auto' && size < 3000: return  // 规模不够
  if quantizer.trained: return              // 已训练
  if vectors.length < 100: return           // 数据太少，统计不稳定

  // 收集所有节点的 Float32 向量
  vectors = nodes.filter(n => n !== null).map(n => n.vector)
  quantizer.train(vectors)

  // 为所有已有节点生成量化向量
  index.setQuantizedVectors(quantizer)
```

::: info 为什么设 100 条下限？
量化需要可靠的 per-dimension 统计。如果只有 10 个向量，某些维度的 min/max 可能极端偏斜，导致量化后的距离排序严重失真。100 条是一个经验值——足够覆盖大部分维度的值域分布。
:::

训练后的量化参数（per-dimension 的 min 和 max）随索引一起持久化到 `.asvec` 文件中。

---

## 持久化层

### .asvec 二进制格式

AutoSnippet 设计了一套自定义二进制格式来持久化 HNSW 索引，替代了早期的 JSON 存储。文件扩展名 `.asvec`（AutoSnippet Vector）。

**文件布局**：

```text
┌─────────────────────────────────────┐
│ Header (32 bytes)                   │
│  [0..4]   Magic: "ASVEC" (5B)      │
│  [5]      Version: uint8 (1B)      │
│  [6..7]   Flags: uint16 LE (2B)    │
│  [8..9]   Dimension: uint16 LE     │
│  [10..13] NumVectors: uint32 LE    │
│  [14..15] HnswM: uint16 LE        │
│  [16..17] HnswMaxLevel: uint16 LE  │
│  [18..21] EntryPoint: uint32 LE    │
│  [22..31] Reserved (10B)           │
├─────────────────────────────────────┤
│ Quantizer Section (if flags bit 0)  │
│  Mins: Float32LE × dim             │
│  Maxs: Float32LE × dim             │
├─────────────────────────────────────┤
│ Vectors Section                     │
│  Per vector:                        │
│    idLen: uint16 LE                 │
│    id: utf8[idLen]                  │
│    level: uint8                     │
│    vector: Float32LE × dim          │
├─────────────────────────────────────┤
│ Graph Section                       │
│  numLevels: uint16 LE              │
│  Per level:                         │
│    numEntries: uint32 LE           │
│    Per entry:                       │
│      nodeIdx: uint32 LE            │
│      numNeighbors: uint16 LE       │
│      neighbors: uint32LE[]         │
├─────────────────────────────────────┤
│ Metadata Section                    │
│  metadataLen: uint32 LE            │
│  json: utf8[metadataLen]           │
│  (含 metadata Map + contents Map)   │
└─────────────────────────────────────┘
```

**Header Flags**：

| Bit | 名称 | 含义 |
|:---|:---|:---|
| 0 | HAS_QUANTIZER | 文件中包含量化器参数 |
| 1 | HAS_HNSW_GRAPH | 文件中包含图结构 |
| 2 | SQ8_VECTORS | 向量以 Uint8 存储（未启用，预留） |

**编码时紧凑化**：序列化过程中会过滤掉 `nodes[]` 中的 null 节点（软删除的），建立 `oldIndex → newIndex` 的映射表，重写所有邻居引用。这意味着 `.asvec` 文件中的数据总是紧凑的——没有空洞。

```text
编码前: nodes = [A, null, B, null, C]  (3 个有效 + 2 个空洞)
编码后: vectors = [A', B', C']          (紧凑连续)
        映射: {0→0, 2→1, 4→2}
        图中邻居索引同步重映射
```

**文件大小估算**（1000 条 768 维向量、M=16）：

| 段 | 大小 |
|:---|:---|
| Header | 32 B |
| Quantizer | ~6 KB (768 × 2 × 4B) |
| Vectors | ~3 MB (1000 × (2+~20+1+768×4)) |
| Graph | ~128 KB (1000 × ~16 neighbors × 6B) |
| Metadata | 变长，通常 100KB-1MB |
| **总计** | **~3-4 MB** |

对比 JSON 格式（同样数据量）约 15-20 MB——二进制格式节省 75-80%，且加载速度快一个数量级（无需 JSON.parse）。

### WAL（Write-Ahead Log）

WAL 是崩溃安全的关键。每次写操作先追加到 `.wal` 文件，成功后才修改内存状态。如果进程崩溃，重启时 replay WAL 即可恢复。

**WAL 格式**（NDJSON + CRC32）：

```text
每行: <JSON_PAYLOAD>\t<CRC32_HEX>\n
```

操作类型编码：

| 类型码 | 含义 | JSON 字段 |
|:---|:---|:---|
| `t=1` | UPSERT | `id`, `c`(content), `v`(vector), `m`(metadata) |
| `t=2` | REMOVE | `id` |
| `t=3` | CLEAR | — |

示例：

```text
{"t":1,"id":"recipe_singleton","c":"...","v":[0.12,0.34,...],"m":{"type":"pattern"}}\tab12cd34
{"t":2,"id":"recipe_old_entry"}\t9f8e7d6c
```

**CRC32 校验**：

```typescript
// ISO 3309 / ITU-T V.42 polynomial 0xEDB88320
// 纯 JS 实现，256 项查找表预计算
const CRC32_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let crc = i;
    for (let j = 0; j < 8; j++) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
    }
    table[i] = crc;
  }
  return table;
})();
```

每行 JSON 都带有独立的 CRC32 校验码。恢复时逐行验证：CRC 不匹配的行跳过（可能是写到一半崩溃了），CRC 匹配的行正常回放。这保证了部分写入不会导致数据损坏。

### 刷盘策略

```text
写操作 → appendWal(op)
  ① 追加到 pendingOps[] 内存队列
  ② appendFileSync 追加到 .wal 文件（同步，保证不丢）
  ③ scheduleFlush()
        │
        ├── pendingOps >= 100 → 立即 flush
        └── otherwise → 2 秒防抖定时器

doFlush():
  ① 调用 onPersist() → 写完整 .asvec 文件
  ② 成功 → 清理 .wal 文件（truncate 或 unlink）
  ③ 失败 → 保留 WAL，操作放回队列头部
```

这个设计在**写延迟**和**持久化频率**之间取得了平衡：

- 单次 upsert 的延迟仅为 WAL append 的耗时（微秒级）。
- `.asvec` 的完整写入是重操作（需要序列化整个索引），通过 2 秒防抖批量合并。
- 100 条的批量阈值提供了一个安全网——如果短时间内大量写入，不会让 WAL 膨胀过大。

### 恢复流程

```text
启动时:
  ① 加载 .asvec 主文件 → 恢复 HnswIndex + ScalarQuantizer
  ② 检查 .wal 文件是否存在
  ③ 存在 → 逐行读取:
       分割 JSON\tCRC32
       验证 CRC32
       CRC 不匹配 → 跳过该行（损坏）
       CRC 匹配 → JSON.parse → onReplay(op)
         t=1 → upsert 到内存索引
         t=2 → remove 从内存索引
         t=3 → clear 整个索引
  ④ replay 完成 → 清理 .wal → 立即执行一次 flush（持久化恢复后状态）
```

---

## 智能分块系统

### 为什么分块？

Embedding 模型有 token 限制（通常 512-8192），单个文档可能远超这个限制。更重要的是，一个大文档包含多个语义主题——把整个文档嵌入为一个向量会"稀释"每个主题的语义信号。分块后每个 chunk 聚焦于单一主题，搜索时能更精确地匹配。

### Chunker v2：五策略自适应

```typescript
DEFAULT_MAX_CHUNK_TOKENS = 512;
DEFAULT_OVERLAP_TOKENS = 50;
```

策略决策树（`auto` 模式）：

```text
输入 content
  │
  ├── estimateTokens(content) ≤ 512? ─────────► whole（整体一个 chunk）
  │
  ├── isCode(language) && AST 可用? ──────────► ast（语法感知分块）
  │
  ├── 包含 Markdown 标题（# / ## / ###）? ───► section（按标题分段）
  │
  └── DEFAULT ────────────────────────────────► fixed（固定大小 + 重叠）
```

**支持 AST 分块的语言**：JavaScript、TypeScript、TSX、Python、Java、Kotlin、Go、Swift、Rust、Dart、Objective-C。

### whole 策略

最简单的情况——文档足够短，直接作为单个 chunk。不需要分割，没有信息丢失。Token 估算使用 `1 token ≈ 4 chars` 的近似公式。

### section 策略

按 Markdown 标题（`#`、`##`、`###`）切分段落：

```text
# 标题 A
段落内容...

## 子标题 A.1
段落内容...

## 子标题 A.2
段落内容...
```

会被切分为 3 个 chunk。如果某个段落过短，会和相邻段落合并；如果过长（超过 maxChunkTokens），会用 `fixed` 策略进一步拆分。

### fixed 策略

按字符数的固定窗口切割，带重叠：

```typescript
maxChars = maxChunkTokens * 4;     // 512 × 4 = 2048 chars
overlapChars = overlapTokens * 4;  // 50 × 4 = 200 chars

// 尽量在行边界 (\n) 切割
// 下一个 chunk 的开始位置包含 overlapChars 的重叠
```

重叠的目的是防止语义在切割点断裂——如果一个关键概念恰好跨越了两个 chunk 的边界，重叠区域能保证至少有一个 chunk 包含完整信息。

**安全保障**：如果 overlap >= maxChars，切割点不会前进，导致死循环。代码中有 `nextStart > start` 的断言保护。

### AST 感知分块

这是最精巧的分块策略，利用 `web-tree-sitter` 解析源码的 AST（抽象语法树），按函数/类/方法边界分块：

```text
源代码
  │
  ▼ tree-sitter 解析
AST 根节点
  │
  ├── import 语句 ──────────► preamble（累积到前导区）
  ├── function foo() { } ──► 独立 chunk（≤ maxTokens）
  ├── class Bar {          ─► 独立 chunk（≤ maxTokens）
  │     method1()
  │     method2()
  │   }
  └── function huge() {    ─► splitLargeNode() 递归拆分
        // 超过 maxTokens
      }
```

**顶层可分块节点类型**：

```typescript
const TOP_LEVEL_TYPES = new Set([
  'function_declaration', 'class_declaration',
  'interface_declaration', 'type_alias_declaration',
  'enum_declaration', 'export_statement',
  'function_definition', 'class_definition',     // Python
  'decorated_definition',                         // Python @decorator
  'method_declaration', 'constructor_declaration', // Java/Kotlin
  'function_item', 'struct_item', 'trait_item',   // Rust
  'impl_item',                                    // Rust
  'protocol_declaration', 'extension_declaration', // Swift
  // ...
]);
```

**递归拆分超大节点**：

```text
splitLargeNode(node):
  chunks = []
  currentGroup = ""

  for child in node.children:
    if currentGroup + child.text > maxTokens:
      if currentGroup 非空:
        chunks.push(currentGroup)
        currentGroup = ""
      if child.text > maxTokens:
        chunks.push(...splitLargeNode(child))  // 递归
      else:
        currentGroup = child.text
    else:
      currentGroup += child.text

  // 最终手段：如果单个叶节点仍超过限制
  return splitByLines(node.text)  // 按行强制拆分
```

每个 AST chunk 携带结构元数据：`nodeType`（如 `function_declaration`）、`name`（函数名）、`startLine`、`endLine`。这些元数据在搜索结果中帮助用户快速定位源码位置。

### chunk ID 生成

```typescript
const baseId = relative(projectRoot, absolutePath).replace(/\//g, '_');
// 每个 chunk: `${baseId}_${chunkIndex}`
// 例: "recipes_singleton-pattern_md_0"、"recipes_singleton-pattern_md_1"
```

这个 ID 是稳定的——同一文件的同一 chunk 在多次构建中产生相同的 ID，使增量更新能够精确匹配旧 chunk 并判断是否需要重新 embed。

---

## 上下文富化

### Anthropic Contextual Retrieval

2024 年 9 月，Anthropic 发布了 *Contextual Retrieval* 论文，指出一个常见的 RAG 问题：**分块后的 chunk 缺乏文档级上下文**。

例如，一个 chunk 的内容是：

> The company's revenue grew 3% over the previous quarter.

单独看这段话，embedding 模型无法知道"the company"是哪家公司、这是哪个季度的报告。搜索"ACME Corp Q2 revenue"时，这个 chunk 的语义匹配度会很低。

**Contextual Retrieval 的解法**：为每个 chunk 生成一段 50-100 token 的**上下文前缀**，描述这个 chunk 在文档中的位置和主题：

```text
[This chunk is from ACME Corp's Q2 2024 earnings report,
discussing quarterly revenue growth.]

The company's revenue grew 3% over the previous quarter.
```

这段前缀和原始内容拼接后一起 embed，使得向量中编码了文档级的上下文信息。

### AutoSnippet 的实现

```typescript
// lib/service/vector/ContextualEnricher.ts
class ContextualEnricher {
  async enrich(chunks: ChunkData[], document: DocumentInfo): Promise<ChunkData[]> {
    // System prompt (Prompt Caching 候选)
    const system = `<document title="${doc.title}" kind="${doc.kind}">
      ${doc.content.slice(0, 8000)}
    </document>

    Given the above document, provide 1-2 sentences of context
    for the following chunk. Focus on: what topic, function, or
    section this chunk belongs to.
    Answer ONLY with the context sentences.`;

    for (const chunk of chunks) {
      const context = await this.#aiProvider.chat(chunk.content, {
        system,
        maxTokens: 128,
        temperature: 0,
      });
      chunk.content = `[${context}]\n\n${chunk.content}`;
    }
  }
}
```

**Prompt Caching 优化**：同一文档的多个 chunk 共享相同的 system prompt（包含完整文档内容）。现代 LLM API（如 Anthropic 的 prompt caching、OpenAI 的 cached tokens）会缓存 system prompt，使后续 chunk 的处理成本降到首条的 ~10%。

对于一篇 10 个 chunk 的文档：
- 无 Prompt Caching：10 × full_cost
- 有 Prompt Caching：1 × full_cost + 9 × 0.1 × full_cost = 1.9 × full_cost（**节省 81%**）

### 缓存策略

```typescript
// 内存缓存，key 基于文件路径 + 内容前 200 字符的 hash
const cacheKey = `ctx_${hash(sourcePath + content.slice(0, 200)).toString(36)}`;
```

文件内容变化时 hash 改变，自动失效。内容不变时跳过 AI 调用，直接返回缓存的上下文前缀。

### 效果

Anthropic 论文报告的效果：

| 方案 | Retrieval Failure Rate |
|:---|:---|
| 普通 embedding | 基准 |
| + Contextual Retrieval | 降低 35% |
| + Contextual Retrieval + Reranking | 降低 67% |

AutoSnippet 实现了 Contextual Retrieval 部分（不含 reranking），作为 IndexingPipeline 的可选步骤。

---

## BatchEmbedder：批量 Embedding

### 批处理策略

```typescript
// lib/infrastructure/vector/BatchEmbedder.ts
batchSize = 32;       // 每批文本数
maxConcurrency = 2;   // 最大并行批次 (p-limit 控制)
```

**性能对比**：

```yaml
串行:  100 条 × 300ms/条 = 30s
批量:  ceil(100/32) = 4 批 × 300ms/批 / 2 并发 = 0.6s
加速:  ~50×
```

每条文本在送入 embedding API 前截断到 8000 字符（`content.slice(0, 8000)`），防止超长文本超出模型的 token 限制。

### 三级降级

```text
embedAll(items):
  batches = chunkArray(items, 32)
  await Promise.all(batches.map(batch => limit(() => embedBatch(batch))))

embedBatch(items):
  try:
    vectors = await aiProvider.embed(texts)
    ├── 返回 number[][] → 批量成功，zip 映射
    └── 返回 number[]   → 单条返回
         ├── items.length == 1 → 直接映射
         └── items.length > 1  → 降级到逐条 embed ①
  catch:
    // 整批失败 → 降级到逐条 embed ②
    for each item:
      try:
        embed(item.content)
      catch:
        skip  // 单条失败不影响其他 ③
```

三级降级路径：

| 级别 | 触发条件 | 行为 |
|:---|:---|:---|
| L0 正常 | 批量 API 返回正确格式 | 批量映射 |
| L1 格式降级 | 批量 API 返回非数组格式 | 逐条重新调用 |
| L2 异常降级 | 整批 API 调用失败 | 逐条重试，失败跳过 |

单条失败不会影响同批其他条目，更不会影响其他批次。这种"尽力而为"的策略确保即使 AI 服务不稳定，索引构建也能最大程度完成。

---

## 索引构建管线

### 五阶段 Pipeline

```text
IndexingPipeline.run():

Phase 0: Clear (可选, forceRebuild=true 时)
  vectorStore.clear() → 清空索引重建

Phase 1: Scan
  递归遍历 scanDirs (recipes/) + README.md
  │ 过滤: .md .markdown .txt .swift .m .h .js .ts .jsx .tsx
  │       .py .java .kt .go .rs .rb
  │
  ▼
Phase 2: Chunk + 增量检测
  for each file:
    hash = SHA256(content).slice(0, 16)
    if hash === lastBuildHash → skip (未变更)
    chunks = Chunker.chunk(content, metadata)
  │
  ▼
Phase 2.5: Contextual Enrichment (可选)
  按 sourcePath 分组:
    ContextualEnricher.enrich(chunks, document)
  │
  ▼
Phase 3: Batch Embed
  BatchEmbedder.embedAll(allChunks, onProgress)
  │
  ▼
Phase 4: Batch Upsert
  vectorStore.batchUpsert(chunks)
  │
  ▼
Phase 5: Cleanup
  oldChunkIds - newChunkIds → stale chunks
  vectorStore.remove(staleIds)
```

### 增量检测

```typescript
function hashContent(content: string): string {
  return createHash('sha256').update(content).digest('hex').slice(0, 16);
}
```

16 个 hex 字符 = 64 bits = 碰撞概率 $\approx 1/2^{64}$，对于知识库规模绰绰有余。hash 存储在向量的 metadata 中（`sourceHash` 字段），下次构建时比较：

| 情况 | 行为 |
|:---|:---|
| hash 相同 | 跳过 chunk + embed + upsert |
| hash 不同 | 重新分块 → embed → upsert |
| 文件删除 | 对应 chunks 标记为 stale → 删除 |

### Stale Chunk 清理

如果一个 Recipe 从 5 个 chunk 变成了 3 个（内容缩短了），chunk 4 和 chunk 5 成为"孤儿"。Pipeline 在最后阶段比较新旧 chunk ID 集合，删除多余的 stale chunks。

```text
旧版: recipe_foo_md_0, recipe_foo_md_1, ..., recipe_foo_md_4
新版: recipe_foo_md_0, recipe_foo_md_1, recipe_foo_md_2
Stale: recipe_foo_md_3, recipe_foo_md_4 → 删除
```

---

## 工程防护

### 熔断器（Circuit Breaker）

Embedding 服务是外部依赖——网络超时、API 限速、服务宕机都可能发生。如果每次搜索都卡在 embed 超时上，用户体验会极差。

```typescript
// lib/service/vector/VectorService.ts
#embedConsecutiveFailures = 0;
#embedCircuitOpenUntil = 0;
EMBED_CIRCUIT_THRESHOLD = 3;       // 连续 3 次失败触发熔断
EMBED_CIRCUIT_COOLDOWN_MS = 60_000; // 熔断 60 秒

hybridSearch(query):
  if Date.now() < #embedCircuitOpenUntil:
    // 熔断状态 → 跳过 embed，仅用 keyword 搜索
    return keywordOnlySearch(query)

  try:
    vector = await embed(query)
    #embedConsecutiveFailures = 0     // 成功 → 重置计数器
    return hybridSearch(query, vector)
  catch:
    #embedConsecutiveFailures++
    if #embedConsecutiveFailures >= 3:
      #embedCircuitOpenUntil = Date.now() + 60_000  // 打开熔断器
    return keywordOnlySearch(query)   // 本次降级
```

熔断器的三个状态：

| 状态 | 条件 | 行为 |
|:---|:---|:---|
| **Closed** | `failures < 3` | 正常调用 embed，失败累计 |
| **Open** | `failures >= 3` 且 `now < openUntil` | 跳过 embed，直接 keyword 搜索 |
| **Half-Open** | `now >= openUntil` | 尝试一次 embed，成功 → Close，失败 → 重新 Open |

这是经典的**快速失败**模式——与其让用户等待 embed 超时（通常 30 秒），不如快速返回降级结果。60 秒后自动尝试恢复，无需人工干预。

### 事件驱动同步

`SyncCoordinator` 通过 EventBus 监听知识库变更事件，自动将 Recipe 的 CRUD 操作同步到向量索引：

```text
EventBus('knowledge:changed') ──► SyncCoordinator.enqueue(entryId)
EventBus('knowledge:deleted') ──► SyncCoordinator.enqueue(entryId, 'remove')
                                     │
                                     ▼
                              debounce 2s / maxBatch 20
                                     │
                                     ▼
                              processBatch()
                                embed + upsert / remove
```

**最终一致性**：同一个 entryId 在 2 秒内的多次变更，队列中只保留最后一次操作。这避免了不必要的 embed 调用——用户快速连续编辑同一条 Recipe 时，只有最终版本会被 embed。

### 对账（Reconcile）

系统启动时或定期执行对账，确保向量索引和数据库保持一致：

```text
reconcile():
  vectorIds  = vectorStore.listIds()      // 向量索引中的所有 ID
  dbEntryIds = db.listActiveEntryIds()    // 数据库中的所有活跃条目

  孤儿向量 = vectorIds 中有 "entry_" 前缀但 dbEntryIds 中没有 → remove
  缺失向量 = dbEntryIds 中有但 vectorIds 中没有 → enqueue upsert

  立即 flush 队列
```

### 数据迁移

从早期 JSON 存储迁移到 HNSW 二进制格式是自动完成的：

| 场景 | 检测 | 动作 |
|:---|:---|:---|
| 全新安装 | 无 `.asvec`、无 `.json` | 标记为 `'new'`，不需要迁移 |
| 存在 JSON | 无 `.asvec`、有 `.json` | 读取 JSON → batchUpsert → rename `.json → .json.bak` |
| 存在 .asvec | 有 `.asvec` | 验证 magic bytes，有效 → 直接加载 |
| .asvec 损坏 | `.asvec` magic 校验失败 | 如有 `.json` 备份 → 从 JSON 迁移 |

迁移完成后原 JSON 文件不会被删除，而是重命名为 `.json.bak`，作为最后的安全网。

---

## 设计抉择

### 为什么不用 FAISS / Annoy / Qdrant？

AutoSnippet 是通过 `npm install -g` 分发的 CLI 工具，必须在任何 macOS/Linux/Windows 环境下开箱即用。

| 方案 | 问题 |
|:---|:---|
| FAISS | C++ native addon，需要编译工具链，Windows 支持差 |
| Annoy | C++ binding，同上 |
| Qdrant / Milvus | 独立服务进程，用户需要额外安装和维护 |
| Pinecone / Weaviate | SaaS，需要网络连接和 API Key |
| hnswlib-node | C++ binding，node-gyp 编译经常失败 |

纯 JavaScript 实现意味着：零编译、零外部服务、`npm install` 即可用。对于知识库的典型规模（100-5000 条 Recipe），纯 JS 的性能完全足够——单次搜索 1-10ms，远快于任何外部服务的网络往返。

### 为什么不用纯向量搜索？

纯向量搜索有一个根本性的弱点：**精确匹配不如关键词搜索**。

当用户搜索 `dispatch_sync` 时，他们期望找到包含这个精确标识符的 Recipe。向量搜索可能把 `dispatch_async` 排得更高（因为语义相似度接近），而关键词搜索能准确命中精确匹配。

AutoSnippet 的解法是 RRF 融合（详见 ch11），向量搜索和关键词搜索各自召回、排名融合。向量引擎只负责"语义这一路"的能力，最终排序由两路共同决定。

### 为什么自定义二进制格式而不是 SQLite / LevelDB？

| 方案 | 问题 |
|:---|:---|
| SQLite | 向量数据是紧密耦合的（图结构 + 向量 + metadata），SQLite 的行列模型不适合 |
| LevelDB | Key-Value 模型，图的邻接关系需要多次 IO |
| MessagePack / BSON | 通用序列化格式，不支持直接内存映射，仍需全量解析 |

`.asvec` 格式是为 HNSW 索引量身定制的：Header 前置允许快速验证文件类型和版本、向量段连续存储便于后续做内存映射（mmap）优化、图段分层分块符合 HNSW 的访问模式。

---

## 小结

向量引擎是 AutoSnippet 搜索系统的语义理解层。它的设计围绕三个核心约束展开：

1. **零外部依赖**——纯 JavaScript HNSW 实现，`npm install` 即可用，无需编译工具链或外部服务。
2. **知识库规模适配**——为 100-5000 条 Recipe 优化，而非百万级通用向量数据库。M=16、efSearch=100 的超参数在这个规模下提供 > 95% Recall 和 1-10ms 延迟。
3. **崩溃安全与渐进降级**——WAL 保证数据不丢失，SQ8 量化在规模增长时自动启用，三级 embed 降级和熔断器在 AI 服务不可用时优雅退化。

从算法层面看，HNSW 的分层图结构实现了 $O(\log N)$ 近似最近邻搜索；SQ8 量化在 75% 内存节省的前提下保持 > 95% Recall；2-Pass 搜索用整数粗排减少浮点精排的候选集。

从工程层面看，`.asvec` 二进制格式比 JSON 节省 75-80% 存储空间和一个数量级的加载时间；WAL + CRC32 提供了行级别的崩溃恢复能力；AST 感知分块和 Contextual Retrieval 从数据质量源头提升了搜索精度。

::: tip 下一章
[Panorama · Signal · 知识代谢](./ch12-metabolism)
:::
