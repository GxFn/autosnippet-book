# Guard 规则清单

> 50+ 内置 Guard 规则的触发条件与检测逻辑。

Guard 检测引擎分 4 层，从快到慢、从浅到深：**正则**（行级匹配）→ **代码级**（跨行配对）→ **AST 语义**（Tree-sitter 解析）→ **跨文件**（多文件关联分析）。

## Layer 0：正则规则

行级正则模式匹配，速度最快，覆盖最广。

### ObjC / Swift

| 规则 ID | 级别 | 语言 | 分类 | 说明 |
|:---|:---|:---|:---|:---|
| `no-main-thread-sync` | error | objc, swift | correctness | 禁止在主线程上使用 `dispatch_sync(main)`，易死锁 |
| `main-thread-sync-swift` | error | swift | correctness | 禁止 `DispatchQueue.main.sync`，易死锁 |
| `objc-dealloc-async` | error | objc | correctness | `dealloc` 内禁止 `dispatch_async` / `dispatch_after` / `postNotification` |
| `objc-block-retain-cycle` | warning | objc | correctness | block 内直接使用 self 可能循环引用，建议 weakSelf |
| `objc-assign-object` | warning | objc | correctness | `assign` 用于对象类型会产生悬垂指针，建议 `weak` 或 `strong` |
| `swift-force-cast` | warning | swift | safety | `as!` 强制转换在失败时崩溃，建议 `as?` 或 `guard let` |
| `swift-force-try` | warning | swift | safety | `try!` 在异常时崩溃，建议 `do-catch` 或 `try?` |
| `objc-timer-retain-cycle` | warning | objc | correctness | NSTimer 以 self 为 target 会强引用 self |
| `objc-possible-main-thread-blocking` | warning | objc | performance | `sleep` / `usleep` 可能造成主线程阻塞 |

### JavaScript / TypeScript

| 规则 ID | 级别 | 语言 | 分类 | 说明 |
|:---|:---|:---|:---|:---|
| `js-no-eval` | error | js, ts | safety | `eval()` 存在安全风险和性能问题 |
| `js-no-var` | warning | js, ts | style | 使用 `let` / `const` 替代 `var` |
| `js-no-console-log` | info | js, ts | style | 生产代码应移除 `console.log` |
| `js-no-debugger` | error | js, ts | style | 生产代码中不应包含 `debugger` 语句 |
| `js-no-alert` | warning | js, ts | style | 生产代码中不应使用 `alert()` |
| `ts-no-non-null-assertion` | warning | ts | safety | 非空断言 `!` 可能掩盖 null/undefined 错误 |

### Python

| 规则 ID | 级别 | 语言 | 分类 | 说明 |
|:---|:---|:---|:---|:---|
| `py-no-bare-except` | warning | python | correctness | 裸 `except:` 会捕获所有异常（含 SystemExit） |
| `py-no-exec` | error | python | safety | `exec()` 存在安全风险 |
| `py-no-mutable-default` | warning | python | correctness | 函数默认参数使用可变对象会导致共享状态 bug |
| `py-no-star-import` | warning | python | style | `from module import *` 命名空间污染 |
| `py-no-assert-in-prod` | info | python | correctness | `assert` 在 `-O` 模式下移除，不应用于生产逻辑 |

### Java / Kotlin

| 规则 ID | 级别 | 语言 | 分类 | 说明 |
|:---|:---|:---|:---|:---|
| `java-no-system-exit` | error | java, kotlin | correctness | `System.exit()` 直接终止 JVM |
| `java-no-raw-type` | warning | java | style | 使用泛型集合替代原始类型 |
| `java-no-empty-catch` | warning | java, kotlin | correctness | 空 catch 块静默吞异常 |
| `java-no-thread-stop` | error | java | safety | `Thread.stop()` 已废弃且不安全 |
| `kotlin-no-force-unwrap` | warning | kotlin | safety | `!!` 非空断言在值为 null 时抛 NPE |

### Go

| 规则 ID | 级别 | 语言 | 分类 | 说明 |
|:---|:---|:---|:---|:---|
| `go-no-panic` | warning | go | correctness | `panic` 应仅用于不可恢复错误 |
| `go-no-err-ignored` | warning | go | correctness | 错误值不应用 `_` 忽略 |
| `go-no-init-abuse` | info | go | style | `init()` 函数副作用难以追踪 |
| `go-no-global-var` | info | go | style | 全局可变变量导致并发安全问题 |

### Dart (Flutter)

| 规则 ID | 级别 | 语言 | 分类 | 说明 |
|:---|:---|:---|:---|:---|
| `dart-no-print` | info | dart | style | 生产代码应使用 logger 替代 `print()` |
| `dart-avoid-dynamic` | warning | dart | style | 避免直接使用 `dynamic` 作为类型 |
| `dart-no-set-state-after-dispose` | info | dart | correctness | `setState` 前应检查 `mounted` 状态 |
| `dart-avoid-bang-operator` | warning | dart | correctness | 避免使用 `!` 空断言操作符 |
| `dart-prefer-const-constructor` | info | dart | performance | `const` 构造函数优化 Widget 重建 |
| `dart-no-relative-import` | info | dart | style | `lib/` 内应使用 `package:` 绝对导入 |
| `dart-dispose-controller` | warning | dart | correctness | Controller 须在 `dispose()` 中释放 |
| `dart-no-build-context-across-async` | warning | dart | correctness | BuildContext 不应跨越 async gap |

### Rust

| 规则 ID | 级别 | 语言 | 分类 | 说明 |
|:---|:---|:---|:---|:---|
| `rust-no-unwrap` | warning | rust | correctness | 生产代码避免 `.unwrap()`，使用 `?` 或 `expect` |
| `rust-no-expect-without-msg` | info | rust | style | `expect()` 应提供有意义的错误消息 |
| `rust-unsafe-block` | warning | rust | safety | `unsafe` 块需要 `// SAFETY:` 注释 |
| `rust-no-todo-macro` | warning | rust | correctness | 生产代码不应包含 `todo!` / `unimplemented!` |
| `rust-clone-overuse` | info | rust | performance | 频繁 `.clone()` 可能暗示所有权设计问题 |
| `rust-no-panic-in-lib` | warning | rust | correctness | `panic!` 在库代码中应避免 |
| `rust-std-mutex-in-async` | warning | rust | correctness | async 代码中不应使用 `std::sync::Mutex` |
| `rust-no-string-push-in-loop` | info | rust | performance | 循环中 String 拼接可能导致多次分配 |

## Layer 1：代码级检查

跨行配对检查，检测跨越多行的结构性问题。

| 规则 ID | 语言 | 级别 | 说明 | 可配置阈值 |
|:---|:---|:---|:---|:---|
| `objc-kvo-missing-remove` | objc | warning | 存在 `addObserver` 未发现配对 `removeObserver` | — |
| `objc-duplicate-category` | objc | warning | 同文件内 Category 重名 | — |
| `js-unhandled-promise` | js, ts | warning | Promise 链缺少 `.catch()` 错误处理 | — |
| `go-defer-in-loop` | go | warning | `defer` 在循环内会延迟到函数返回 | — |
| `py-mixed-indentation` | python | warning | 文件混用 tab 和 space 缩进 | — |
| `swift-excessive-force-unwrap` | swift | warning | 文件包含过多强制解包 (`!`) | 默认: 5 |
| `java-resource-leak` | java | warning | 资源分配后未使用 try-with-resources | — |
| `java-sync-non-final` | java | warning | `synchronized` 使用了非 final 变量 | — |
| `kotlin-global-scope` | kotlin | warning | `GlobalScope.launch/async` 不绑定生命周期 | — |
| `kotlin-run-blocking` | kotlin | warning | `runBlocking` 会阻塞当前线程 | — |
| `rust-excessive-unwrap` | rust | warning | 文件包含过多 `.unwrap()` | 默认: 3 |
| `rust-excessive-unsafe` | rust | warning | 文件包含过多 `unsafe` 块 | 默认: 3 |
| `dart-setstate-after-dispose` | dart | warning | `setState` 调用未检查 `mounted` 状态 | — |
| `dart-excessive-late` | dart | warning | 过多 `late` 非 final 变量无初始值 | 默认: 3 |

## Layer 2：AST 语义规则

基于 Tree-sitter 解析的语义级检查，检测结构性代码质量问题。

| 规则 ID | 级别 | 说明 | 默认阈值 |
|:---|:---|:---|:---|
| `ast_class_bloat` | warning | 类方法数过多 | 20 |
| `ast_method_complexity` | warning | 方法圈复杂度过高 | 15 |
| `ast_method_too_long` | warning | 方法行数过长 | 80 |
| `ast_deep_nesting` | warning | 方法嵌套过深 | 5 |
| `ast_deep_inheritance` | warning | 继承链过深 | 4 |
| `ast_wide_protocol_conformance` | warning | 单类遵守协议过多 | 5 |
| `ast_god_class` | warning | God Class（方法 >30 且属性 >15） | methods: 30, properties: 15 |
| `ast_singleton_abuse` | info | 文件中过多单例模式 | 2 |
| `ast_assign_object_property` | warning | ObjC `assign` 修饰对象类型属性 | — |
| `ast_missing_nonatomic` | info | ObjC 属性缺少 `nonatomic` | — |
| `ast_mutable_public_collection` | warning | ObjC 公开可变集合属性 | — |
| `ast_missing_weakify` | warning | ObjC block 捕获 self 未使用 weakify | — |

## Layer 3：跨文件规则

跨文件关联分析，检测文件间的结构性问题。

| 规则 ID | 语言 | 级别 | 说明 |
|:---|:---|:---|:---|
| `objc-cross-file-duplicate-category` | objc | warning | Category 跨文件重复声明 |
| `js-circular-import` | js, ts | warning | 直接双向循环依赖（A→B 且 B→A） |
| `java-duplicate-class-name` | java, kotlin | info | 同名类在多个文件中定义 |
| `go-multiple-init` | go | info | 同 package 多文件都有 `init()` |
| `swift-cross-file-extension-conflict` | swift | warning | Extension 方法跨文件冲突 |

## 规则统计

| 检测层 | 规则数 | 覆盖语言 |
|:---|:---|:---|
| Layer 0 正则 | 39 | ObjC · Swift · JS/TS · Python · Java · Kotlin · Go · Dart · Rust |
| Layer 1 代码级 | 14 | ObjC · JS/TS · Swift · Java · Kotlin · Go · Python · Rust · Dart |
| Layer 2 AST | 12 | 通用（所有 Tree-sitter 支持的语言） |
| Layer 3 跨文件 | 5 | ObjC · JS/TS · Java/Kotlin · Go · Swift |
| **合计** | **70** | **10 语言** |
