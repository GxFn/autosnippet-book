Title at top in bold Chinese: "Candidate → Recipe 审核流程"

The flow runs top-to-bottom in a vertical layout with the following nodes connected by hand-drawn arrows:

NODE 1 (top, pale yellow fill): A stick-figure robot icon labeled "AI Agent 扫描代码" with a magnifying glass scanning a code file icon

↓ arrow with label "构建实体"

NODE 2: Rounded box "KnowledgeEntry (pending)" with a small clock icon indicating "待审核" status. A dotted annotation on the side shows key fields: "title + content + coreCode + reasoning"

↓ arrow

NODE 3 (pale blue fill): A shield/checklist icon labeled "UnifiedValidator 三层校验", with 3 tiny sub-steps listed vertically inside:
  "L1: 字段完整性"
  "L2: 内容质量"
  "L3: 唯一性去重"
A small branching arrow to the right goes to a red X labeled "拒绝 + 错误信息" (rejection path)

↓ arrow (pass path, labeled "✓ 通过")

NODE 4: A file folder icon labeled "candidates/" with a document "entry.md" being placed inside. Side annotation: "FileWriter 持久化"

↓ arrow

NODE 5: A monitor/dashboard screen icon labeled "Dashboard 展示候选列表" with a simple table sketch showing rows of entries

↓ arrow with a human stick figure icon pressing a button labeled "开发者批准 ✓"

NODE 6 (highlighted with pale yellow fill): A transition arrow showing "publish()" with lifecycle text changing: "pending → active", drawn as two circles with the left one (pending, gray) transforming via an arrow to the right one (active, blue with a star)

↓ arrow

NODE 7: Two folder icons with an arrow between them: "candidates/" → "recipes/", showing a file moving from left folder to right folder

↓ arrow

NODE 8 (bottom, pale blue fill): A broadcast/signal icon labeled "EventBus 事件发布" with 3 small arrows radiating out to:
  - "Guard 检查引擎"
  - "搜索索引更新"
  - "Cursor .mdc 刷新"

At the very bottom, a small annotation: "从这一刻起，知识开始生效 ✨"
