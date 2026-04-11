# 插图生成操作手册

## 工具链

- **生图引擎**: `baoyu-imagine` → Google Gemini (`gemini-3.1-flash-image-preview`)
- **Runtime**: `bun`（已安装）
- **脚本路径**: `/Users/gaoxuefeng/Documents/github/baoyu-skills/skills/baoyu-imagine/scripts/main.ts`

## 目录结构

```
autosnippet-book/
├── prompts/
│   ├── style-prompt-suffix.md      # 全局风格约束（每次 prompt 必须附加）
│   └── ch06/                        # 各章 prompt 文件（按需创建）
│       ├── 01-v3-field-overview.md
│       ├── 02-inheritance-vs-unified.md
│       └── 03-candidate-to-recipe.md
└── docs/public/images/
    ├── style-anchor.png             # 全书风格锚点图（必须最先生成）
    ├── ch01/
    ├── ch06/
    │   ├── 01-knowledge-card-v3-field-overview.png
    │   ├── 02-versus-inheritance-vs-unified.png
    │   └── 03-flow-candidate-to-recipe.png
    └── ...
```

## 生成流程

### Step 0: 生成风格锚点图（全书仅一次）

这张图决定整本书的视觉基调。反复调整直到满意。

```bash
bun /Users/gaoxuefeng/Documents/github/baoyu-skills/skills/baoyu-imagine/scripts/main.ts \
  --prompt "A minimal hand-drawn knowledge card illustration. Clean black ink wobble lines on pure white background. A centered rounded rectangle contains structured information in 3 rows with small geometric icons (circle, hexagon, arrow). Chinese title '知识条目全景' at top in bold. Subtle pale blue (#A8D4F0) fill on one section, pale yellow (#F9E79F) on another. Large white space margins. Sketch doodle aesthetic, intellectual and calm feel. No photographs, no 3D, no gradients. Pure flat hand-drawn style." \
  --image docs/public/images/style-anchor.png \
  --provider google --model gemini-3.1-flash-image-preview \
  --ar 3:4 --quality 2k
```

验证满意后继续。如果不满意，删除重新生成，直到锚点图确定。

### Step 1: 为章节编写 prompt 文件

每张图创建一个 prompt 文件到 `prompts/chXX/` 目录。文件只写**内容描述**，不写风格约束（风格由 `style-prompt-suffix.md` 统一提供）。

示例 `prompts/ch06/01-v3-field-overview.md`：
```
Title at top in bold Chinese: "KnowledgeEntry V3 字段全景"

A large rounded rectangle divided into 6 horizontal layers:
Layer 1 "核心身份": 4 boxes — id, title(≤20字), description(≤80字), trigger(@前缀). Pale blue tint.
Layer 2 "内容体": content.markdown(≥200字符) + coreCode(3-8行)
...（具体内容描述）
```

### Step 2: 生成图片

```bash
# 通用命令模板
bun /Users/gaoxuefeng/Documents/github/baoyu-skills/skills/baoyu-imagine/scripts/main.ts \
  --promptfiles prompts/chXX/NN-slug.md prompts/style-prompt-suffix.md \
  --image docs/public/images/chXX/NN-type-slug.png \
  --ref docs/public/images/style-anchor.png \
  --provider google --model gemini-3.1-flash-image-preview \
  --ar 3:4 --quality 2k
```

**三个关键点**：
1. `--promptfiles` 组合内容 prompt + 风格 suffix，顺序：内容在前，风格在后
2. `--ref` 始终指向 `style-anchor.png`，**不要链式引用上一张图**
3. `--ar 3:4 --quality 2k` 固定不变

### Step 3: 质检

每章生成完后检查：

| 检查项 | 合格 | 不合格 → 重新生成 |
|--------|------|-------------------|
| 配色 | 仅黑/白/淡蓝/淡黄/淡粉 | 出现其他颜色 |
| 线条 | 手绘抖动感 | 光滑矢量线条 |
| 文字 | 中文、清晰可读 | 英文、乱码、模糊 |
| 背景 | 纯白 | 灰色/纹理/渐变 |
| 元素 | 简笔几何图形 | 写实/3D/照片质感 |
| 留白 | 四周充足白边 | 元素贴边 |

### Step 4: 插入文章

在章节 markdown 中替换占位标记：

```markdown
<!-- illustration: xxx | 描述 -->
```

替换为：

```markdown
![描述](/images/chXX/NN-type-slug.png)
```

## 生成顺序

```
锚点图 → Ch01(2张) → Ch02(3张) → Ch03(3张) → ... → Ch18(2张)
```

同一章连续生成，不要跨章交叉。

## 参数速查

| 参数 | 固定值 | 说明 |
|------|--------|------|
| `--provider` | `google` | Google Gemini API |
| `--model` | `gemini-3.1-flash-image-preview` | 支持 ref + 中文 |
| `--ar` | `3:4` | 竖版，适配 VitePress |
| `--quality` | `2k` | 高清输出 |
| `--ref` | `docs/public/images/style-anchor.png` | 始终同一锚点 |

## 命名规范

- **prompt 文件**: `prompts/chXX/NN-slug.md`
- **图片文件**: `docs/public/images/chXX/NN-type-slug.png`
- **type 取值**: `knowledge-card`, `versus`, `flow`, `concept-map`, `checklist`, `swot`, `cover`

## 注意事项

1. **锚点图是一切的基础** — 不满意就反复重做，不要将就
2. **不要链式 ref** — 所有图都 ref 锚点图，避免风格漂移
3. **风格 suffix 不要改** — 如需微调，只改内容 prompt
4. **文件格式验证** — 生成后 `file xxx.png` 确认是真正的 PNG，避免 MIME 不匹配
5. **每章独立目录** — images/chXX/ 和 prompts/chXX/ 一一对应

## 各章插图计划

### Ch06: KnowledgeEntry — 一个实体表达所有知识

| # | Prompt 文件 | 输出图片 | 类型 | 描述 |
|---|---|---|---|---|
| 01 | `ch06/01-v3-field-overview.md` | `ch06/01-knowledge-card-v3-field-overview.png` | knowledge-card | KnowledgeEntry V3 六层字段全景 |
| 02 | `ch06/02-inheritance-vs-unified.md` | `ch06/02-versus-inheritance-vs-unified.png` | versus | 继承体系 vs 统一实体对比 |
| 03 | `ch06/03-candidate-to-recipe.md` | `ch06/03-flow-candidate-to-recipe.png` | flow | Candidate → Recipe 审核流程 |

### Ch07: 生命周期与进化 — 知识的生老病死

| # | Prompt 文件 | 输出图片 | 类型 | 描述 |
|---|---|---|---|---|
| 01 | `ch07/01-six-state-lifecycle.md` | `ch07/01-state-six-state-lifecycle.png` | state | 六态生命周期状态机（6 节点 + 转换箭头 + 触发条件） |
| 02 | `ch07/02-evolution-proposal-flow.md` | `ch07/02-flow-evolution-proposal-flow.png` | flow | 进化提案机制（发现 → 创建 → 评估执行三阶段） |
| 03 | `ch07/03-decay-scoring-model.md` | `ch07/03-data-decay-scoring-model.png` | data | DecayDetector 四维评分模型 + 五级健康等级 |

**生成命令**（在 `autosnippet-book/` 目录下执行）：

```bash
# 01 — 六态状态机
bun /Users/gaoxuefeng/Documents/github/baoyu-skills/skills/baoyu-imagine/scripts/main.ts \
  --promptfiles prompts/ch07/01-six-state-lifecycle.md prompts/style-prompt-suffix.md \
  --image docs/public/images/ch07/01-state-six-state-lifecycle.png \
  --ref docs/public/images/style-anchor.png \
  --provider google --model gemini-3.1-flash-image-preview \
  --ar 3:4 --quality 2k

# 02 — 进化提案流程
bun /Users/gaoxuefeng/Documents/github/baoyu-skills/skills/baoyu-imagine/scripts/main.ts \
  --promptfiles prompts/ch07/02-evolution-proposal-flow.md prompts/style-prompt-suffix.md \
  --image docs/public/images/ch07/02-flow-evolution-proposal-flow.png \
  --ref docs/public/images/style-anchor.png \
  --provider google --model gemini-3.1-flash-image-preview \
  --ar 3:4 --quality 2k

# 03 — 衰退评分模型
bun /Users/gaoxuefeng/Documents/github/baoyu-skills/skills/baoyu-imagine/scripts/main.ts \
  --promptfiles prompts/ch07/03-decay-scoring-model.md prompts/style-prompt-suffix.md \
  --image docs/public/images/ch07/03-data-decay-scoring-model.png \
  --ref docs/public/images/style-anchor.png \
  --provider google --model gemini-3.1-flash-image-preview \
  --ar 3:4 --quality 2k
```
