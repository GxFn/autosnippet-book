Title at top in bold Chinese: "数据基础设施四层架构"

A vertical diagram with four distinct layers, connected by downward arrows.

TOP LAYER — "ServiceContainer (DI 容器)" (pale purple background):
A wide rounded rectangle. Inside:
Left section: "9 模块 · 15 步启动序列" with 9 small labeled boxes in a row: "Signal", "Infra", "App", "Knowledge", "Vector", "Guard", "Agent", "AI", "Panorama"
Right section: "70+ lazy singletons" with a type-safe icon and text "get<T>() 类型安全"
Below the boxes: "AI Provider 热重载 · 延迟初始化"
Three downward arrows from ServiceContainer fan out to the three data layers below.

MIDDLE LAYER — Three parallel columns (data engines):

COLUMN 1 — "SQLite 关系存储" (pale blue background):
A database cylinder icon labeled "better-sqlite3 + WAL"
Below: A small table grid showing 4 rows of table names:
  "knowledge_entries (10 索引)"
  "knowledge_edges (唯一索引)"
  "audit_logs"
  "...共 15 张表"
Below the grid: Two side-by-side boxes:
  Left box: "Drizzle ORM" with label "类型安全 CRUD"
  Right box: "Raw SQL" with label "动态查询 · JSON 字段"
Bottom annotation: "busy_timeout = 3000ms · foreign_keys = ON"

COLUMN 2 — "Vector 向量存储" (pale green background):
Top: Two stacked engine boxes with a switch/toggle between them:
  Box A: "JsonVectorAdapter" with "O(N) 暴力搜索 · ≤3000 条"
  Box B: "HnswVectorAdapter" with "O(log N) · M=16 · efSearch=100"
Below Box B: A small diagram showing "SQ8 量化" with arrow "768×4B → 768×1B (75% 节省)"
Below: "BatchEmbedder" box with "32/batch × 2 并发 → 50× 加速"
Bottom: "IndexingPipeline" horizontal flow: "scan → chunk → detect → embed → upsert"

COLUMN 3 — "Cache 缓存体系" (pale orange background):
Three stacked boxes connected by downward arrows:
  Box 1: "CacheService (LRU)" with "内存 · TTL 300s · 60s 清理"
  Box 2: "GraphCache" with "文件持久化 · contentHash 校验"
  Box 3: "CacheCoordinator" with "PRAGMA data_version · 2s 轮询 · 跨进程失效"
Right side of Box 3: Three small subscriber tags: "Panorama", "Guard", "Search"

BOTTOM LAYER — "审计与监控" (pale yellow background, spanning full width):
A horizontal bar containing three components:
  Left: "AuditLogger" icon with "双格式兼容 · EventBus 实时推送" and an arrow to "audit_logs 表"
  Center: "Logger (Winston)" with three output arrows: "error.log", "combined.log", "audit.log (独立通道)"
  Right: "ConfigLoader" with a chain diagram: "default.json → {env}.json → local.json" and "Zod 校验"

FAR LEFT — A vertical annotation bar labeled "开发仓库保护":
  Three shield icons stacked: "DB → $TMPDIR", "PathGuard 阻止", "Setup 拒绝"
  Text: "isOwnDevRepo() 三重防护"
