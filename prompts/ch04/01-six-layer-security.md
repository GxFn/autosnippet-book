Title at top in bold Chinese: "六层安全链路"

A vertical pipeline/waterfall diagram showing 6 security layers stacked from top to bottom, with a request flowing through all layers. Each layer is a wide rounded rectangle with an icon, name, and key question.

ENTRY (top):
A small rounded box with an arrow icon, labeled "MCP / HTTP / CLI 请求"
Arrow pointing down into Layer 1.

LAYER 1 (pale blue fill):
Icon: a scroll/document icon
Label: "Constitution — 角色权限"
Key question in lighter text: "这个角色被定义了什么权限？"
Right side annotation: "YAML 配置 · 5 种角色 · O(1) 查找"
Failure output (small arrow pointing right to a red X): "角色未定义 → PermissionDenied"

Down arrow (✓ labeled "通过") to →

LAYER 2 (pale blue fill):
Icon: a gate/funnel icon
Label: "Gateway — 4 步管线"
Key question: "请求格式和权限合规吗？"
Inside: 4 tiny steps in a row: "validate → guard → route → audit"
Failure output: "缺少 actor → InternalError"

Down arrow (✓) to →

LAYER 3 (pale yellow fill):
Icon: a key icon
Label: "PermissionManager — 3-tuple RBAC"
Key question: "actor 有权对 resource 执行 action？"
Right side: "8 级递进匹配"
Failure output: "权限不足 → PermissionDenied"

Down arrow (✓) to →

LAYER 4 (pale yellow fill):
Icon: a sandbox/box icon
Label: "SafetyPolicy — Agent 行为沙箱"
Key question: "命令/文件操作安全吗？"
Right side: "10 条黑名单 · 20+ 白名单"
Failure output: "危险命令 → 工具调用拦截"

Down arrow (✓) to →

LAYER 5 (pale pink fill):
Icon: a folder/shield icon
Label: "PathGuard — 文件系统沙箱"
Key question: "写入路径在允许范围内？"
Right side: "双层防护 · 项目边界 + 白名单"
Failure output: "越界写入 → PathGuardError"

Down arrow (✓) to →

LAYER 6 (pale pink fill):
Icon: a gauge/meter icon
Label: "ConfidenceRouter — 知识质量门控"
Key question: "这条知识质量足以自动发布？"
Right side: "6 级决策 · 置信度 + Grace Period"
Failure output: "低置信度 → pending 人工审核"

EXIT (bottom):
A small rounded box with a checkmark icon, labeled "操作执行 ✓"

RIGHT MARGIN annotation (vertical text):
"任何一层失败 → 请求阻断 · 每层独立审计日志"

Bottom annotation: "纵深防御 — 不是六层做同一件事，而是六层各自守护一个安全维度"
