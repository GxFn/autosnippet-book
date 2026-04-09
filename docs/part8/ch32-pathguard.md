# Ch32. PathGuard 与开发仓库保护

> 两层路径安全防御 + isOwnDevRepo 开发环境保护。

## 本章概要

PathGuard 是 AutoSnippet 的文件系统安全层，防止路径遍历攻击和意外写入。isOwnDevRepo 检测机制进一步保护 AutoSnippet 自身的源码仓库不受运行时数据污染。

## PathGuard 双层防御

### Layer 1: 路径规范化

<!-- TODO: 路径遍历防护（../ 攻击） -->
<!-- TODO: 符号链接解析 -->

### Layer 2: 白名单校验

<!-- TODO: 允许写入的目录白名单 -->
<!-- TODO: 文件类型限制 -->

## isOwnDevRepo 保护机制

<!-- TODO: 如何检测"当前项目是 AutoSnippet 源码" -->
<!-- TODO: 检测到后的行为变更 -->

### 数据库重定向

<!-- TODO: DB 重定向到 $TMPDIR/autosnippet-dev/ -->

### Setup 拒绝

<!-- TODO: SetupService 拒绝在开发仓库执行 -->

### PathGuard 阻止

<!-- TODO: 阻止在源码中创建 .autosnippet/ -->

## 关键代码

<!-- TODO: PathGuard 核心实现 -->
<!-- TODO: isOwnDevRepo 检测逻辑 -->

## 小结

<!-- TODO -->

::: tip 下一章
[Ch33. 测试策略](./ch33-testing)
:::
