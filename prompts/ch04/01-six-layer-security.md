Title at top center in bold Chinese, large: "六层安全链路"

A vertical waterfall/pipeline diagram showing 6 security layers stacked from top to bottom. A request enters at the top and must pass through ALL 6 layers to reach "操作执行". Each layer can reject the request to the right.

════════════════════════════════════════
ENTRY (top of diagram)
════════════════════════════════════════

A small rounded box with a tiny pen/arrow icon (✏️) on the left, text: "MCP / HTTP / CLI 请求"
A single downward arrow leads from this box into Layer 1.

════════════════════════════════════════
LAYER 1 — Constitution (pale blue #A8D4F0 fill)
════════════════════════════════════════

Wide rounded rectangle, pale blue fill.

Left side: a small scroll/document icon (📜)
Bold title (large): "Constitution — 角色权限"
Second line (smaller, normal weight): "这个角色被定义了什么权限？"
Right side annotation in small gray text: "YAML 配置 · 5 种角色 · O(1) 查找"

Below the box, a fork:
- Left branch: "✓通过" label, downward arrow continues to Layer 2
- Right branch: "✗" in red, then small text: "角色未定义 → PermissionDenied"

════════════════════════════════════════
LAYER 2 — Gateway (pale blue #A8D4F0 fill)
════════════════════════════════════════

Wide rounded rectangle, pale blue fill.

Left side: a small gate/funnel icon (🚪)
Bold title: "Gateway — 4 步管线"
Second line: "请求格式和权限合规吗？"
Right side: a small rounded pill containing 4 tiny steps in a chain: "validate → guard → route → audit" (each step separated by a small arrow)

Below the box, a fork:
- Left: "✓通过" + downward arrow to Layer 3
- Right: "→ ✗ 缺少 actor → InternalError" in red text

════════════════════════════════════════
LAYER 3 — PermissionManager (pale yellow #F9E79F fill)
════════════════════════════════════════

Wide rounded rectangle, pale yellow fill.

Left side: a small shield/key icon (🔑)
Bold title: "PermissionManager — 3-tuple RBAC"
Second line: "actor 有权对 resource 执行 action？"
Right side annotation: "8 级递进匹配"

Below the box, a fork:
- Left: "✓通过" + downward arrow to Layer 4
- Right: "→ ✗ 权限不足 → PermissionDenied" in red text

════════════════════════════════════════
LAYER 4 — SafetyPolicy (pale yellow #F9E79F fill)
════════════════════════════════════════

Wide rounded rectangle, pale yellow fill.

Left side: a small open box/sandbox icon (📦)
Bold title: "SafetyPolicy — Agent 行为沙箱"
Second line: "命令/文件操作安全吗？"
Right side annotation: "10 条黑名单 · 20+ 白名单"

Below the box, a fork:
- Left: "✓通过" + downward arrow to Layer 5
- Right: "→ ✗ 危险命令 → 工具调用拦截" in red text

════════════════════════════════════════
LAYER 5 — PathGuard (pale pink #FADBD8 fill)
════════════════════════════════════════

Wide rounded rectangle, pale pink fill.

Left side: a small shield/folder icon (🛡️)
Bold title: "PathGuard — 文件系统沙箱"
Second line: "写入路径在允许范围内？"
Right side annotation: "双层防护 · 项目边界 + 白名单"

Below the box, a fork:
- Left: "✓通过" + downward arrow to Layer 6
- Right: "→ ✗ 越界写入 → PathGuardError" in red text

════════════════════════════════════════
LAYER 6 — ConfidenceRouter (pale pink #FADBD8 fill)
════════════════════════════════════════

Wide rounded rectangle, pale pink fill.

Left side: a small gauge/meter icon (⏱️)
Bold title: "ConfidenceRouter — 知识质量门控"
Second line: "这条知识质量足以自动发布？"
Right side annotation: "6 级决策 · 置信度 + Grace Period"

Below the box, a fork:
- Right: "✗ 低置信度 → pending 人工审核" in red text
- Left/down: downward arrow to EXIT

════════════════════════════════════════
EXIT (bottom)
════════════════════════════════════════

A small rounded box with green fill, containing: "操作执行 ✓"

════════════════════════════════════════
RIGHT MARGIN — Vertical annotation
════════════════════════════════════════

Along the entire RIGHT edge of the diagram (outside the layer stack), a tall vertical text block running from top to bottom:

"任何一层失败 → 请求阻断 · 每层独立审计日志"

The text is written vertically (top-to-bottom reading direction), in dark bold.

════════════════════════════════════════
BOTTOM ANNOTATION
════════════════════════════════════════

Centered below the entire diagram in bold Chinese:
"纵深防御 — 不是六层做同一件事，而是六层各自守护一个安全维度"
