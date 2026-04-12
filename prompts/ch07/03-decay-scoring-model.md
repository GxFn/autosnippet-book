Title at top in bold Chinese: "DecayDetector 四维衰退评分"

A horizontal layout with clear left and right sections. A thin arrow labeled "映射" connects the two sections horizontally.

LEFT SECTION (bottom label: "评分模型"):

Top area — two dimension cards side by side, each a rounded rectangle:

Top-left card (pale blue (#A8D4F0) fill):
- Bold title: "freshness 新鲜度" with weight badge "×0.3" in top-right corner
- A small calendar/clock icon
- Text: "最后使用时间"
- Mini annotation below: "7天内=满分" on left, "90天+=零分" on right, connected by a small gradient bar or scale line

Top-right card (pale blue (#A8D4F0) fill):
- Bold title: "usage 使用率" with weight badge "×0.3" in top-right corner
- A small bar chart icon with ascending bars
- Text: "累计 guardHit + searchHit"
- Mini annotation below: "含趋势因子"

Center area — below the two top cards, a formula display:
Bold text: "decayScore"
Formula below: "= F×0.3 + U×0.3 + Q×0.2 + A×0.2"

Bottom area — two more dimension cards side by side:

Bottom-left card (pale yellow (#F9E79F) fill):
- Bold title: "quality 质量" with weight badge "×0.2" in top-right corner
- A small checklist/clipboard icon
- Text: "QualityScorer 综合分"
- Mini annotation below: "字段完整度 · 代码质量"

Bottom-right card (pale yellow (#F9E79F) fill):
- Bold title: "authority 权威性" with weight badge "×0.2" in top-right corner
- A small shield icon with a file behind it
- Text: "SourceRef 健康度"
- Mini formula below: "base × (1 - staleRatio × 0.3)"

RIGHT SECTION (bottom label: "健康等级"):

A tall vertical thermometer shape (rounded at top and bottom). The thermometer is divided into 5 horizontal bands from top to bottom, each band with a different fill color and a label on the right side:

Band 1 (top, white/no fill, clean):
- Bold: "80-100 healthy" with a green checkmark ✓ icon
- Right label: "无动作"

Band 2 (pale yellow (#F9E79F) fill):
- Bold: "60-79 watch" with a yellow warning triangle ⚠ icon
- Right label: "Dashboard 黄色警告"

Band 3 (pale pink (#FADBD8) fill):
- Bold: "40-59 decaying"
- Right label: "→ active → decaying"

Band 4 (slightly darker pink/salmon fill):
- Bold: "20-39 severe"
- Right label: "Grace Period 缩至 15 天"

Band 5 (bottom, gray fill):
- Bold: "0-19 dead" with a skull ☠ icon
- Right label: "直接 → deprecated"

The thermometer has a "mercury" fill indicator on the left side of the tube, rising from bottom, with the current level shown around the 60-79 zone as an example.

Bottom annotation centered in lighter gray text: "信号驱动 · 非定时扫描 · 六种衰退策略任一命中即触发"
