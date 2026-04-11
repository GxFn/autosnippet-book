Title at top in bold Chinese: "六态生命周期状态机"

A state machine diagram with 6 state nodes arranged in a flowing layout (roughly 2 rows of 3):

TOP ROW (left to right):
- "pending" node: a rounded rectangle with a clock icon, pale yellow fill, labeled "待审核"
- "staging" node: a rounded rectangle with an eye/observation icon, pale blue fill, labeled "暂存观察"
- "active" node: a rounded rectangle with a star icon, highlighted with a slightly thicker border, labeled "已发布"

BOTTOM ROW (left to right):
- "evolving" node: a rounded rectangle with a wrench/gear icon, pale yellow fill, labeled "进化中"
- "decaying" node: a rounded rectangle with a wilting leaf icon, pale pink fill, labeled "衰退观察"
- "deprecated" node: a rounded rectangle with an X/archive icon, gray dashed border, labeled "已废弃"

ARROWS (with hand-drawn style, labeled with trigger conditions):
- pending → staging: arrow labeled "置信度达标"
- pending → active: arrow labeled "用户批准"
- pending → deprecated: dashed arrow labeled "30天超时"
- staging → active: arrow labeled "7天观察期满"
- staging → pending: arrow labeled "打回审核"
- active → evolving: arrow labeled "收到进化提案"
- active → decaying: arrow labeled "衰退评分 <60"
- active → deprecated: arrow labeled "用户手动废弃"
- evolving → staging: arrow labeled "提案接受"
- evolving → active: arrow labeled "提案拒绝 / 7天超时"
- evolving → decaying: arrow labeled "衰退信号"
- decaying → active: arrow labeled "重新被使用 ↻"
- decaying → deprecated: arrow labeled "30天无恢复"
- deprecated → pending: dashed arrow labeled "复活 ↻"

LEGEND at bottom-right corner, 3 small items:
- Solid arrow = "正常转换"
- Dashed arrow = "特殊路径"
- ↻ symbol = "自动恢复"

Annotation at bottom: "所有转换经 RecipeLifecycleSupervisor 守卫检查"
