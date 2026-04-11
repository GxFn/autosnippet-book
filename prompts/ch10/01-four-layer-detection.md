Title at top in bold Chinese: "Guard 四层检测架构"

A vertical diagram showing 4 detection layers as stacked horizontal bands, widening from top to bottom (like a trapezoid/funnel). Each layer has increasing width to represent growing detection cost and capability.

ENTRY (top):
A small rounded box labeled "源代码文件" with a file icon, arrow pointing down.

LAYER 1 (topmost band, pale blue fill, narrowest):
Label on left: "Layer 1"
Main label: "正则匹配"
Right side stats: "60+ 规则 · 微秒级 · 8 语言"
Example tags: "dispatch_sync", "no-eval", "no-panic"
Small icon: a magnifying glass with "regex" text

Down arrow to →

LAYER 2 (pale blue fill, slightly wider):
Label on left: "Layer 2"
Main label: "代码级跨行分析"
Right side stats: "15 检查 · 毫秒级"
Example tags: "KVO 配对", "Promise.catch", "defer in loop", "资源泄漏"
Small icon: two overlapping lines of code

Down arrow to →

LAYER 3 (pale yellow fill, wider):
Label on left: "Layer 3"
Main label: "AST 语义查询"
Right side: 3 query type boxes: "mustCallThrough", "mustNotUseInContext", "mustConformToProtocol"
Stats: "Tree-sitter · 十毫秒级"
Small icon: a simple syntax tree diagram

Down arrow to →

LAYER 4 (pale pink fill, widest, with two sub-sections):
Label on left: "Layer 4"
Left sub-section: "AST 深度度量" with tags: "类膨胀 >20", "圈复杂度 >15", "God Class", "继承深度 >4"
Stats: "13 规则"
Right sub-section: "跨文件分析" with tags: "循环导入", "重复类名", "Category 冲突"
Stats: "6 规则"

OUTPUT (bottom):
Three arrows emerging from the bottom of Layer 4, pointing to three boxes side by side:
- Left box (pale blue fill): "✓ pass" with subtitle "确定合规"
- Center box (pale pink fill): "✗ violation" with subtitle "确定违规 · fixSuggestion"
- Right box (pale yellow fill): "? uncertain" with subtitle "检测边界 · 能力报告"

Right margin annotation (vertical text):
"渐进式深度 · 简单问题快速解决 · 复杂问题深入分析"

Bottom annotation: "四层全部执行 · 互补而非递进 · UncertaintyCollector 追踪每一个未确定规则"
