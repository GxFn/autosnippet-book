Title at top in bold Chinese: "DecayDetector 四维衰退评分"

A horizontal layout divided into 2 sections: LEFT shows the 4 scoring dimensions, RIGHT shows the 5 health levels.

LEFT SECTION (labeled "评分模型"):
A central circle/gauge icon labeled "decayScore" with the formula below it: "= F×0.3 + U×0.3 + Q×0.2 + A×0.2"

Four dimension cards arranged in a 2×2 grid around the gauge, each a rounded rectangle:

Top-left (pale blue fill): "freshness 新鲜度" weight "×0.3"
- Small calendar icon with "最后使用时间"
- Mini scale: "7天内=满分 ... 90天+=零分"

Top-right (pale blue fill): "usage 使用率" weight "×0.3"
- Small bar chart icon with "累计 guardHit + searchHit"
- Mini label: "含趋势因子"

Bottom-left (pale yellow fill): "quality 质量" weight "×0.2"
- Small checkmark list icon with "QualityScorer 综合分"
- Mini label: "字段完整度 · 代码质量"

Bottom-right (pale yellow fill): "authority 权威性" weight "×0.2"
- Small file/shield icon with "SourceRef 健康度"
- Mini formula: "base × (1 - staleRatio × 0.3)"

RIGHT SECTION (labeled "健康等级"):
A vertical thermometer or bar meter showing 5 levels from top to bottom, each level is a horizontal band:

Level 1 (top, white/no fill): "80-100 healthy ✓" with label "无动作"
Level 2 (pale yellow fill): "60-79 watch ⚠" with label "Dashboard 黄色警告"
Level 3 (pale pink fill): "40-59 decaying" with label "→ active → decaying"
Level 4 (slightly darker pink): "20-39 severe" with label "Grace Period 缩至 15 天"
Level 5 (bottom, gray fill): "0-19 dead ☠" with label "直接 → deprecated"

A thin arrow connecting the gauge on the left to the thermometer on the right, labeled "映射"

Bottom annotation: "信号驱动 · 非定时扫描 · 六种衰退策略任一命中即触发"
