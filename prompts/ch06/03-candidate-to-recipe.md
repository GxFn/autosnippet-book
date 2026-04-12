Title at top in bold Chinese: "Candidate → Recipe 审核流程"

A vertical top-to-bottom flowchart with 8 nodes connected by hand-drawn arrows. The flow occupies the center of the image with annotations on each side.

NODE 1 (top, pale yellow (#F9E79F) fill):
A stick-figure robot icon holding a magnifying glass, scanning a code file icon with curly braces "{ }" on it. Bold label: "AI Agent 扫描代码"
Small annotation to the right: "Bootstrap · 增量扫描"

↓ thick hand-drawn arrow, label on right side: "构建实体"

NODE 2 (white fill, thicker border):
A rounded rectangle labeled "KnowledgeEntry (pending)" with a small clock/hourglass icon indicating waiting status. 
Dotted annotation box to the left showing 4 key fields in a mini list:
- "title + trigger"
- "content.markdown"
- "coreCode"
- "reasoning.sources"
Small text below the dotted box: "19 REQUIRED 字段"

↓ arrow

NODE 3 (pale blue (#A8D4F0) fill, slightly wider):
A shield icon with a checklist inside, bold label: "UnifiedValidator 三层校验"
Inside the node, 3 tiny sub-steps listed vertically with thin dividing lines:
- "L1: 字段完整性" — small checkmark icon
- "L2: 内容质量" — small checkmark icon  
- "L3: 唯一性去重" — small checkmark icon
A branching arrow to the right leads to a small pale pink (#FADBD8) rounded box with red X icon labeled "拒绝 + 错误信息" (the rejection path). This is a dead end.

↓ arrow on the main path (pass path), label: "✓ 通过"

NODE 4 (white fill):
A file folder icon labeled "candidates/" with a small document icon labeled "entry.md" being placed inside the folder (suggesting file write).
Small annotation to the right: "FileWriter 持久化"
Tiny code path annotation: ".autosnippet/candidates/"

↓ arrow

NODE 5 (white fill):
A monitor/screen icon showing a simplified dashboard interface with a tiny table sketch (3 rows with a status column). Bold label: "Dashboard 展示候选列表"
Small annotation to the right: "React UI · 实时更新"

↓ arrow with a human stick figure icon to the left, pressing a button/checkmark. Label: "开发者批准 ✓"

NODE 6 (pale yellow (#F9E79F) fill, highlighted with a subtle glow):
A transition diagram showing lifecycle change. Bold label: "publish()"
Two circles connected by a thick arrow:
- Left circle (gray outline, unfilled): "pending"
- Right circle (pale blue fill, with a small star): "active"
The arrow between them is labeled "状态转换"
Small code annotation below: "entry.publish(userId)"

↓ arrow

NODE 7 (white fill):
Two folder icons side by side with a thick curved arrow between them showing file movement:
- Left folder: "candidates/" (source, with a document leaving)
- Right folder: "recipes/" (destination, with a document arriving)
Label above the arrow: "文件迁移"
Small annotation: "Repository.update() 同步数据库"

↓ arrow

NODE 8 (bottom, pale blue (#A8D4F0) fill):
A broadcast/radio signal icon (concentric arcs radiating outward). Bold label: "EventBus 事件发布"
3 small arrows radiating outward to the right, each pointing to a small label:
- "Guard 检查引擎"
- "搜索索引更新"  
- "Cursor .mdc 刷新"
Small annotation to the left: "lifecycle:transition 事件"

Bottom annotation centered, in lighter gray with a small sparkle icon: "从这一刻起，知识开始生效 ✨"
