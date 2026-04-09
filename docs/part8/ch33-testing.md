# Ch33. 测试策略

> 单元测试与集成测试的边界划分。

## 本章概要

AutoSnippet 使用 Vitest 作为测试框架，测试分为单元测试和集成测试。本章解析测试的组织方式、mock 策略和 CI 集成。

## 测试分层

### 单元测试 (`test/unit/`)

<!-- TODO: 纯逻辑测试，不依赖外部资源 -->
<!-- TODO: 覆盖哪些模块 -->

### 集成测试 (`test/integration/`)

<!-- TODO: 跨层测试，涉及数据库和 AI Provider -->
<!-- TODO: 测试夹具与数据准备 -->

## Mock 策略

<!-- TODO: 哪些依赖被 mock -->
<!-- TODO: AI Provider mock 的实现 -->

## CI 集成

```
GitHub Actions:
  build → lint → dashboard build → unit tests → integration tests
```

<!-- TODO: CI 配置详解 -->
<!-- TODO: 测试覆盖率目标 -->

## 测试命令

```bash
npm run test:unit           # 单元测试
npm run test:integration    # 集成测试
npx vitest run test/path    # 单文件测试
```

## 关键代码

<!-- TODO: 典型测试用例示例 -->

## 小结

<!-- TODO -->
