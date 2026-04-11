Title at top in bold Chinese: "ConfidenceRouter 六阶段管线"

A vertical pipeline/waterfall diagram with 6 stage nodes flowing top-to-bottom, each stage acting as a gate that can short-circuit to the right:

ENTRY POINT (top):
A small rounded box labeled "KnowledgeEntry 输入" with an arrow pointing down into Stage 1.

STAGE 1 (pale blue fill):
A rounded rectangle labeled "阶段 1: 基本内容验证"
Inside: "isValid() — title + content 存在？"
- RIGHT exit arrow (✗): leads to a small "pending" tag (pale yellow) with label "内容不完整"
- DOWN exit arrow (✓): continues to Stage 2

STAGE 2 (pale blue fill):
A rounded rectangle labeled "阶段 2: 低置信度驳回"
Inside: "confidence < 0.2 且 > 0？"
- RIGHT exit arrow (✗): leads to a small "reject" tag (pale pink) with label "→ deprecated"
- DOWN exit arrow (✓): continues to Stage 3

STAGE 3 (pale blue fill):
A rounded rectangle labeled "阶段 3: 最短内容检查"
Inside: "内容长度 < 20 字符？"
- RIGHT exit arrow (✗): leads to a small "pending" tag (pale yellow) with label "内容太短"
- DOWN exit arrow (✓): continues to Stage 4

STAGE 4 (pale blue fill):
A rounded rectangle labeled "阶段 4: Reasoning 完整性"
Inside: "reasoning.isValid()？"
- RIGHT exit arrow (✗): leads to a small "pending" tag (pale yellow) with label "缺少推理链"
- DOWN exit arrow (✓): continues to Stage 5

STAGE 5 (pale yellow fill):
A rounded rectangle labeled "阶段 5: 质量交叉验证"
Inside: "QualityScorer.score() < 0.3？"
A small "(可选)" annotation next to the stage label.
- RIGHT exit arrow (✗): leads to a small "pending" tag (pale yellow) with label "质量分过低"
- DOWN exit arrow (✓): continues to Stage 6

STAGE 6 (pale blue fill, slightly thicker border):
A rounded rectangle labeled "阶段 6: 自动批准判定"
Inside shows a forking decision:
Left branch: "可信来源 (bootstrap/mcp)" with threshold "≥ 0.7"
Right branch: "外部来源" with threshold "≥ 0.85"

Below Stage 6, two output paths:

LEFT OUTPUT (✓ 达标):
Arrow leads to a rounded box with pale blue fill labeled "auto_approve → staging"
Below it, two small clock icons:
- "≥ 0.90 → Grace 24h"
- "0.85-0.89 → Grace 72h"

RIGHT OUTPUT (✗ 未达标):
Arrow leads to a small "pending" tag (pale yellow) with label "需人工审核"

BOTTOM ANNOTATION:
"六阶段短路管线 · 置信度 × 质量分交叉验证 · 宁可误发人工不误放知识库"
