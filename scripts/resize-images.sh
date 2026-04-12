#!/bin/bash
# 批量调整 book 插图尺寸
# 目标宽度 880px（VitePress 内容区 ~688px，留 retina 余量）
# 使用 macOS 自带 sips，无需安装额外依赖

set -euo pipefail

TARGET_WIDTH=880
IMAGE_DIR="$(cd "$(dirname "$0")/../docs/public/images" && pwd)"

if [[ ! -d "$IMAGE_DIR" ]]; then
  echo "Error: image directory not found: $IMAGE_DIR"
  exit 1
fi

echo "Image directory: $IMAGE_DIR"
echo "Target width: ${TARGET_WIDTH}px"
echo "---"

SKIP_FILES="style-anchor.png"

count=0
saved_total=0

while IFS= read -r img; do
  basename_img=$(basename "$img")
  if echo "$SKIP_FILES" | grep -qw "$basename_img"; then
    echo "SKIP  $basename_img (excluded)"
    continue
  fi

  current_width=$(sips -g pixelWidth "$img" | awk '/pixelWidth/{print $2}')

  if [[ "$current_width" -le "$TARGET_WIDTH" ]]; then
    echo "SKIP  $(basename "$img") (${current_width}px <= ${TARGET_WIDTH}px)"
    continue
  fi

  size_before=$(stat -f%z "$img")

  sips --resampleWidth "$TARGET_WIDTH" "$img" --out "$img" >/dev/null 2>&1

  size_after=$(stat -f%z "$img")
  saved=$((size_before - size_after))
  saved_total=$((saved_total + saved))
  new_width=$(sips -g pixelWidth "$img" | awk '/pixelWidth/{print $2}')
  new_height=$(sips -g pixelHeight "$img" | awk '/pixelHeight/{print $2}')

  printf "DONE  %-50s %4dpx → %4dx%4dpx  saved %sKB\n" \
    "$(echo "$img" | sed "s|$IMAGE_DIR/||")" \
    "$current_width" "$new_width" "$new_height" \
    "$((saved / 1024))"

  count=$((count + 1))
done < <(find "$IMAGE_DIR" -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" \) | sort)

echo "---"
echo "Resized: $count files"
echo "Total saved: $((saved_total / 1024 / 1024))MB"
