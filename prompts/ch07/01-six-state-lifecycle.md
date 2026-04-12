Title at top in bold Chinese: "六态生命周期状态机"

A state machine diagram with 6 state nodes arranged in a roughly hexagonal layout across 2 rows, with numerous arrows showing transitions between states.

TOP ROW (3 nodes, left to right, spaced evenly across the upper portion):

Node 1 — "pending" (top-left position):
Rounded rectangle, pale yellow (#F9E79F) fill. Inside: a small clock/hourglass icon on the left, bold text "pending" on the right. Below the English name in smaller text: "待审核"

Node 2 — "staging" (top-center position):
Rounded rectangle, pale blue (#A8D4F0) fill. Inside: a small eye icon on the left, bold text "staging" on the right. Below: "暂存观察"

Node 3 — "active" (top-right position):
Rounded rectangle, pale blue (#A8D4F0) fill, with a noticeably thicker hand-drawn border to emphasize it as the key state. Inside: a small star icon on the left, bold text "active" on the right. Below: "已发布"

BOTTOM ROW (3 nodes, left to right, spaced evenly across the lower portion):

Node 4 — "evolving" (bottom-left position):
Rounded rectangle, pale yellow (#F9E79F) fill. Inside: a small wrench/flame icon on the left, bold text "evolving" on the right. Below: "进化中"

Node 5 — "decaying" (bottom-center position):
Rounded rectangle, pale pink (#FADBD8) fill. Inside: a small wilting leaf icon on the left, bold text "decaying" on the right. Below: "衰退观察"

Node 6 — "deprecated" (bottom-right position):
Rounded rectangle with a gray dashed border (no solid fill, slightly faded). Inside: a small X-in-square icon on the left, bold text "deprecated" on the right. Below: "已废弃"

ARROWS — solid lines for normal transitions, dashed lines for special paths. Each arrow has a small Chinese label next to it:

Forward flow (solid arrows):
- pending → staging: arrow curving right, label "置信度达标"
- pending → active: long arrow arcing over staging to active, label "用户批准" (this is the direct approval shortcut)
- staging → active: short arrow right, label "7天观察期满"
- active → evolving: arrow curving down-left, label "收到进化提案"
- active → decaying: arrow curving down to decaying, label "衰退评分 <60"
- active → deprecated: arrow curving down-right, label "用户手动废弃"
- evolving → staging: arrow curving up, label "提案接受"
- decaying → deprecated: arrow going right, label "30天无恢复"

Return/special paths (dashed arrows):
- staging → pending: short arrow curving left/back, label "打回审核"
- evolving → active: arrow curving up-right back to active, label "提案拒绝 / 7天超时"
- evolving → decaying: arrow going right, label "衰退信号"
- decaying → active: dashed arrow curving up-right with a small ↻ refresh icon, label "重新被使用 ↻"
- pending → deprecated: dashed arrow curving far down, label "30天超时"
- deprecated → pending: long dashed arrow curving below the entire diagram from bottom-right back to top-left, label "复活 ↻"

LEGEND at bottom-right corner, a small boxed area with 3 items stacked vertically:
- A short solid arrow → with label "正常转换"
- A short dashed arrow --> with label "特殊路径"
- A ↻ symbol with label "自动恢复"

Bottom annotation centered in lighter gray text: "所有转换经 RecipeLifecycleSupervisor 守卫检查"
