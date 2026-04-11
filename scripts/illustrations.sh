#!/bin/bash
# ============================================================================
#  AutoSnippet Book — 插图生成与修正工具
#  自动发现 prompts/chXX/*.md，按顺序生成对应图片
#
#  用法:
#    bash scripts/illustrations.sh              # 生成所有缺失的插图
#    bash scripts/illustrations.sh ch06         # 只生成 ch06 的插图
#    bash scripts/illustrations.sh ch06 ch14    # 生成 ch06 和 ch14
#    bash scripts/illustrations.sh --force ch06 # 强制重新生成 ch06（覆盖已有）
#    bash scripts/illustrations.sh --force      # 强制重新生成所有插图
#    bash scripts/illustrations.sh --list       # 列出所有插图状态
#    bash scripts/illustrations.sh --dry-run    # 预览将要执行的操作
# ============================================================================

set -euo pipefail

# 切换到项目根目录
cd "$(dirname "$0")/.."

# ---- 配置 ----
IMAGINE_SCRIPT="/Users/gaoxuefeng/Documents/github/baoyu-skills/skills/baoyu-imagine/scripts/main.ts"
STYLE_SUFFIX="prompts/style-prompt-suffix.md"
STYLE_ANCHOR="docs/public/images/style-anchor.png"
PROVIDER="google"
MODEL="gemini-3.1-flash-image-preview"
AR="3:4"
QUALITY="2k"
PROMPTS_DIR="prompts"
IMAGES_DIR="docs/public/images"

# ---- 参数解析 ----
FORCE=false
DRY_RUN=false
LIST_ONLY=false
declare -a CHAPTERS=()

while [[ $# -gt 0 ]]; do
  case "$1" in
    --force|-f)   FORCE=true; shift ;;
    --dry-run|-n) DRY_RUN=true; shift ;;
    --list|-l)    LIST_ONLY=true; shift ;;
    --help|-h)
      echo "用法: bash scripts/illustrations.sh [选项] [章节...]"
      echo ""
      echo "选项:"
      echo "  --force, -f    强制重新生成（覆盖已有图片）"
      echo "  --dry-run, -n  预览模式（不实际生成）"
      echo "  --list, -l     列出所有插图状态"
      echo "  --help, -h     显示帮助"
      echo ""
      echo "章节:"
      echo "  ch01 ch06 ...  指定要处理的章节（默认全部）"
      echo ""
      echo "示例:"
      echo "  bash scripts/illustrations.sh                # 生成所有缺失的插图"
      echo "  bash scripts/illustrations.sh ch06           # 只处理 ch06"
      echo "  bash scripts/illustrations.sh --force ch14   # 重新生成 ch14 的插图"
      exit 0
      ;;
    ch[0-9]*)     CHAPTERS+=("$1"); shift ;;
    *)            echo "❌ 未知参数: $1"; exit 1 ;;
  esac
done

# ---- 收集任务 ----
# 自动发现 prompts/chXX/*.md，映射到 docs/public/images/chXX/*.png
declare -a PROMPT_FILES=()
declare -a IMAGE_FILES=()

for prompt_file in "$PROMPTS_DIR"/ch[0-9][0-9]/*.md; do
  [[ -f "$prompt_file" ]] || continue
  [[ "$(basename "$prompt_file")" == "style-prompt-suffix.md" ]] && continue

  # 提取章节号: prompts/ch06/01-xxx.md → ch06
  chapter=$(basename "$(dirname "$prompt_file")")

  # 章节过滤
  if [[ ${#CHAPTERS[@]} -gt 0 ]]; then
    local_match=false
    for ch in "${CHAPTERS[@]}"; do
      [[ "$chapter" == "$ch" ]] && local_match=true && break
    done
    $local_match || continue
  fi

  # 生成输出路径: prompts/ch06/01-xxx.md → docs/public/images/ch06/01-xxx.png
  slug=$(basename "$prompt_file" .md)
  image_file="$IMAGES_DIR/$chapter/$slug.png"

  PROMPT_FILES+=("$prompt_file")
  IMAGE_FILES+=("$image_file")
done

TOTAL=${#PROMPT_FILES[@]}

if [[ $TOTAL -eq 0 ]]; then
  echo "没有找到匹配的 prompt 文件"
  exit 0
fi

# ---- 列表模式 ----
if $LIST_ONLY; then
  echo "📋 插图状态一览（共 ${TOTAL} 张）"
  echo ""
  for i in "${!PROMPT_FILES[@]}"; do
    prompt="${PROMPT_FILES[$i]}"
    image="${IMAGE_FILES[$i]}"
    if [[ -f "$image" ]]; then
      size=$(du -h "$image" | cut -f1 | xargs)
      echo "  ✅ $image ($size)"
    else
      echo "  ⬜ $image (未生成)"
    fi
  done

  existing=$(find "$IMAGES_DIR"/ch[0-9][0-9] -name '*.png' 2>/dev/null | wc -l | xargs)
  missing=0
  for i in "${!IMAGE_FILES[@]}"; do
    [[ ! -f "${IMAGE_FILES[$i]}" ]] && missing=$((missing + 1))
  done
  echo ""
  echo "已生成: ${existing}, 待生成: ${missing}, 合计: ${TOTAL}"
  exit 0
fi

# ---- 前置检查 ----
if [[ ! -f "$STYLE_SUFFIX" ]]; then
  echo "❌ 缺少风格文件: $STYLE_SUFFIX"
  exit 1
fi

if [[ ! -f "$STYLE_ANCHOR" ]]; then
  echo "❌ 缺少锚点图: $STYLE_ANCHOR"
  echo "   请先生成风格锚点图（参考 prompts/README.md Step 0）"
  exit 1
fi

if ! command -v bun &>/dev/null; then
  echo "❌ 未安装 bun，请运行: brew install oven-sh/bun/bun"
  exit 1
fi

# ---- 计算实际任务数 ----
declare -a TODO_IDX=()
for i in "${!PROMPT_FILES[@]}"; do
  image="${IMAGE_FILES[$i]}"
  if $FORCE || [[ ! -f "$image" ]]; then
    TODO_IDX+=("$i")
  fi
done

TODO_COUNT=${#TODO_IDX[@]}

if [[ $TODO_COUNT -eq 0 ]]; then
  echo "✅ 所有插图均已生成（共 ${TOTAL} 张），无需操作"
  echo "   使用 --force 强制重新生成"
  exit 0
fi

# ---- 执行 ----
LABEL="生成"
$FORCE && LABEL="重新生成"
$DRY_RUN && LABEL="[预览] $LABEL"

echo "=========================================="
echo "  AutoSnippet Book 插图${LABEL}"
echo "  待处理 ${TODO_COUNT} / ${TOTAL} 张"
echo "=========================================="
echo ""

CURRENT=0
SUCCEEDED=0
FAILED=0

for idx in "${TODO_IDX[@]}"; do
  prompt="${PROMPT_FILES[$idx]}"
  image="${IMAGE_FILES[$idx]}"
  chapter=$(basename "$(dirname "$prompt")")
  slug=$(basename "$prompt" .md)
  CURRENT=$((CURRENT + 1))

  echo "──────────────────────────────────────────"
  echo "  [${CURRENT}/${TODO_COUNT}] ${chapter}/${slug}"
  echo "  📝 ${prompt}"
  echo "  🖼️  ${image}"
  echo "──────────────────────────────────────────"

  if $DRY_RUN; then
    echo "  ⏭️  预览模式，跳过实际生成"
    echo ""
    continue
  fi

  # 创建输出目录
  mkdir -p "$(dirname "$image")"

  # 如果强制模式且文件存在，先备份
  if $FORCE && [[ -f "$image" ]]; then
    backup="${image%.png}.bak.png"
    cp "$image" "$backup"
    echo "  📦 已备份: $(basename "$backup")"
  fi

  # 执行生成
  if bun "$IMAGINE_SCRIPT" \
    --promptfiles "$prompt" "$STYLE_SUFFIX" \
    --image "$image" \
    --ref "$STYLE_ANCHOR" \
    --provider "$PROVIDER" --model "$MODEL" \
    --ar "$AR" --quality "$QUALITY"; then
    SUCCEEDED=$((SUCCEEDED + 1))
    echo ""
    echo "  ✅ 成功"

    # 验证输出
    if [[ -f "$image" ]]; then
      size=$(du -h "$image" | cut -f1 | xargs)
      echo "  📐 文件大小: $size"
    fi
  else
    FAILED=$((FAILED + 1))
    echo ""
    echo "  ❌ 失败"

    # 如果有备份，恢复
    backup="${image%.png}.bak.png"
    if [[ -f "$backup" ]]; then
      mv "$backup" "$image"
      echo "  🔄 已恢复备份"
    fi
  fi

  echo ""
done

# ---- 清理备份 ----
if $FORCE; then
  find "$IMAGES_DIR" -name '*.bak.png' -delete 2>/dev/null || true
fi

# ---- 汇总 ----
echo "=========================================="
if $DRY_RUN; then
  echo "  预览完成，实际需处理: ${TODO_COUNT} 张"
else
  echo "  完成！成功: ${SUCCEEDED} / ${TODO_COUNT}"
  [[ $FAILED -gt 0 ]] && echo "  失败: ${FAILED}"
fi
echo "=========================================="
