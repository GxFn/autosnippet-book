Title at top in bold Chinese: "结构分析链 — 五阶段管线"

A vertical pipeline diagram showing 5 phases of code analysis, flowing top to bottom. Each phase is a wide rounded rectangle with inputs on the left and outputs on the right.

ENTRY (top):
A stack of small file icons labeled "源文件" with language tags: ".swift", ".ts", ".py", ".java", ".go"
Arrow pointing down.

PHASE 1 (pale blue fill):
Label: "Phase 1: 单文件 AST 解析"
Left icon: a single file with a tree icon
Center: "Tree-sitter WASM · 10 语言"
Right output: a small card "AstFileSummary[]" with items "类 · 方法 · 属性 · 导入"
Annotation: "并行 · 文件独立 · 原始事实"

Down arrow to →

PHASE 2 (pale blue fill):
Label: "Phase 2: 继承图构建"
Left icon: a tree diagram with parent-child nodes
Center: "跨文件聚合 · 类/协议/扩展关系"
Right output: a small graph sketch showing "A → B → C" hierarchy with "InheritanceEdge[]" label
Annotation: "superclass · protocol · extension"

Down arrow to →

PHASE 3 (pale yellow fill, slightly larger):
Label: "Phase 3: 调用图推断"
Left icon: interconnected nodes with arrows
Center: 5 small step cards in a horizontal row:
- "①静态调用" → "②方法归属" → "③层间推断" → "④去重合并" → "⑤置信度标注"
Right output: a graph sketch with "CallGraphEdge[]" and confidence values "0.8", "0.6"
Annotation: "5 步增量管线 · 静态推断无需执行"

Down arrow to →

PHASE 4 (pale yellow fill):
Label: "Phase 4: 设计模式检测"
Left icon: a puzzle piece icon
Center: 4 pattern cards in a row: "Singleton", "Delegate", "Factory", "Observer"
Right output: "DetectedPattern[]" with confidence gauge icon
Annotation: "AST 特征匹配 · 非 AI"

Down arrow to →

PHASE 5 (pale pink fill):
Label: "Phase 5: Tarjan SCC + Kahn 拓扑"
Left icon: a circular graph (SCC) and a layered stack (topo)
Two sub-sections side by side:
- Left sub-box: "Tarjan SCC" with a sketch of a circular dependency cluster, labeled "耦合度分析"
- Right sub-box: "Kahn 拓扑排序" with a sketch of horizontal layers, labeled "层次结构"
Annotation: "强连通分量 → 模块耦合 · 拓扑序 → 层次分离"

EXIT (bottom):
Arrow pointing down to a rounded box labeled "ProjectGraph → Panorama 全景图"

Bottom annotation: "源文件 → 语法树 → 继承图 → 调用图 → 模式 → 拓扑层次 → 项目理解"
