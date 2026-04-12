Title at top in bold Chinese: "进化提案机制"

A vertical flow diagram showing the evolution proposal lifecycle, divided into 3 phases by thin dashed horizontal lines. Each phase has a small label icon on the left margin.

PHASE 1 (top section, left margin label: "🔍 发现"):
Three parallel trigger sources arranged in a horizontal row at the top, each inside a small rounded rectangle with an icon:
- Left box: a stick-figure robot icon with a magnifying glass, bold label "Agent 分析" below. A small annotation: "代码变更检测"
- Center box: a circular arrow/metabolism icon, bold label "Metabolism 治理" below. A small annotation: "周期性健康扫描"
- Right box: a human stick figure icon, bold label "开发者提交" below. A small annotation: "手工触发"

All three boxes have thin arrows converging downward into Phase 2.

PHASE 2 (middle section, left margin label: "📋 提案创建"):
A large central rounded rectangle with a slightly thicker border, serving as a card for the Evolution Proposal entity:
- Bold title at top of card: "Evolution Proposal"
- First row: "type:" followed by 6 small pill/tag labels in 2 rows of 3:
  Row 1: "enhance" (pale blue), "merge" (pale blue), "correction" (pale blue)
  Row 2: "supersede" (pale yellow), "deprecate" (pale yellow), "contradiction" (pale pink)
- Second row: "confidence: 0-1"
- Third row: "status: pending → observing"

Below the card, a diamond-shaped fork splitting into two paths:

LEFT PATH (pale blue (#A8D4F0) fill on the path box):
- Diamond label: "低风险"
- Small tags inside: "enhance / merge / correction"
- Arrow pointing down with label "自动进入观察期"
- Destination: a small clock icon with time range "24h-72h" (correction=24h, enhance=48h, merge=72h)

RIGHT PATH (pale pink (#FADBD8) fill on the path box):
- Diamond label: "高风险"
- Small tags inside: "contradiction / reorganize"
- Arrow pointing down with label "等待人工确认"
- Destination: a padlock icon with a human stick figure, indicating manual approval required

PHASE 3 (bottom section, left margin label: "⚖️ 评估与执行"):

From the LEFT PATH (low-risk), an arrow leads to a rounded evaluation box labeled "观察期满" with sub-label "评估性":
- Inside the evaluation box, 4 criteria listed with small bullet icons:
  "FP率 <40%"
  "仍有使用"
  "分数未回升"
  "新版已活跃"

Two exit arrows from the evaluation box:
- Left exit (green checkmark ✓, label "通过"): arrow pointing down to a rounded box with pale blue fill labeled "执行", containing 3 outcome lines:
  "evolving → staging (内容更新)"
  "old → decaying (被取代)"
  "→ deprecated (衰退确认)"
- Right exit (red X mark ✗, label "未通过"): arrow pointing right to a rounded box with pale pink fill labeled "拒绝 → 恢复原状态"

From the RIGHT PATH (high-risk), an arrow leads directly down to a monitor/dashboard screen icon with a mini table sketch inside, labeled "Dashboard 人工审批" below the screen.

Bottom annotation centered in lighter gray text: "旧内容不变 · 提案来源可追溯 · 符合 SOUL 原则"
