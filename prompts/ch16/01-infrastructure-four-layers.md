Title at top center in bold Chinese: "数据基础设施四层架构"

A vertical diagram with four distinct horizontal layers, connected by downward arrows. The overall layout flows top-to-bottom. The middle layer has three parallel columns side by side.

════════════════════════════════════════
TOP LAYER — ServiceContainer (DI 容器)
════════════════════════════════════════

A wide rounded rectangle spanning full width, with a thin border and very light gray fill.

Bold title at top: "ServiceContainer（DI 容器）"

Inside, two sub-sections side by side:

Left sub-section (~55% width, white fill with thin border):
- Header: "9 模块 · 15 步启动序列"
- Below: 9 small rounded pill tags arranged in 2 rows (5+4) with pale blue (#A8D4F0) fill:
  Row 1: "Signal", "Infra", "App", "Knowledge", "Vector"
  Row 2: "Guard", "Agent", "AI", "Panorama"

Right sub-section (~40% width, white fill with thin border):
- Header: "70+ lazy singletons"
- Below: a small icon showing a generic type symbol "T" in a box, with code-style text: "get<T>()" and sub-label "类型安全"

Below both sub-sections, centered annotation: "AI Provider 热重载 · 延迟初始化"

Three downward arrows fan out from bottom of ServiceContainer into the three middle columns.

════════════════════════════════════════
MIDDLE LAYER — Three parallel data engine columns
════════════════════════════════════════

Three columns arranged side by side, roughly equal width (~30% each), with small gaps between them.

── COLUMN 1: SQLite 关系存储 (pale blue #A8D4F0 fill) ──

Bold header: "SQLite 关系存储"

Top: a hand-drawn database cylinder icon with label "better-sqlite3 + WAL"

Below: a small table-like list with 4 rows (white fill with thin borders):
- "knowledge_entries (10 索引)"
- "knowledge_edges (唯一索引)"
- "audit_logs"
- "...共 15 张表"

Below: two small boxes side by side:
- Left box (white fill): bold "Drizzle ORM", sub-text "类型安全 CRUD"
- Right box (white fill): bold "Raw SQL", sub-text "动态查询 · JSON 字段"

Bottom annotation in small text: "busy_timeout = 3000ms · foreign_keys = ON"

── COLUMN 2: Vector 向量存储 (pale yellow #F9E79F fill) ──

Bold header: "Vector 向量存储"

Two stacked engine boxes with a small toggle/switch icon between them:
- Top box (white fill): bold "JsonVectorAdapter", sub-text "O(N) 暴力搜索 · ≤3000 条"
- Bottom box (white fill): bold "HnswVectorAdapter", sub-text "O(log N) · M=16 · efSearch=100"

Below: a small diagram showing compression arrow:
"SQ8 量化" with text "768×4B → 768×1B (75% 节省)"

Below: a box (white fill): bold "BatchEmbedder", sub-text "32/batch × 2 并发 → 50× 加速"

Bottom: bold "IndexingPipeline" with a horizontal flow in small text:
"scan → chunk → detect → embed → upsert"

── COLUMN 3: Cache 缓存体系 (pale pink #FADBD8 fill) ──

Bold header: "Cache 缓存体系"

Three stacked boxes connected by downward arrows:

Box 1 (white fill): bold "CacheService (LRU)", sub-text "内存 · TTL 300s · 60s 清理"
↓
Box 2 (white fill): bold "GraphCache", sub-text "文件持久化 · contentHash 校验"
↓
Box 3 (white fill): bold "CacheCoordinator", sub-text "PRAGMA data_version · 2s 轮询 · 跨进程失效"

Right side of Box 3: 4 small rounded subscriber tags stacked vertically:
"Subscriber", "Panorama", "Guard", "Search"

════════════════════════════════════════
FAR LEFT MARGIN — 开发仓库保护 (outside main columns)
════════════════════════════════════════

Along the left edge, a vertical annotation bar with three small icons stacked:
- File icon + "DB → $TMPDIR"
- Shield icon + "PathGuard 阻止"
- Cross icon + "Setup 拒绝"

Bottom label: "isOwnDevRepo() 三重防护"

════════════════════════════════════════
BOTTOM LAYER — 审计与监控
════════════════════════════════════════

A wide rounded rectangle spanning full width, pale yellow (#F9E79F) fill.

Bold header at top center: "审计与监控"

Inside, three components arranged horizontally:

Left component:
- Pencil/log icon (✏️) + bold "AuditLogger"
- Sub-text: "双格式兼容 · EventBus 实时推送"
- Small arrow pointing to label: "audit_logs 表"

Center component:
- Megaphone icon (📢) + bold "Logger (Winston)"
- Three small arrows diverging right to three labels:
  - "error.log"
  - "combined.log"
  - "audit.log (独立通道)"

Right component:
- Gear icon (⚙️) + bold "ConfigLoader"
- Below: a small horizontal chain: "default.json → {env}.json → local.json"
- Sub-text: "Zod 校验"
