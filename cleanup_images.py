import os

# 图片目录
output_dir = 'd:/code/web/public/assets/products/amazon'

# 获取所有文件
files = os.listdir(output_dir)

# 删除 0 字节的文件
removed = 0
for f in files:
    filepath = os.path.join(output_dir, f)
    if os.path.getsize(filepath) == 0:
        os.remove(filepath)
        removed += 1
        print(f"删除空文件: {f}")

print(f"\n删除了 {removed} 个空文件")

# 删除 v2 版本的重复文件（因为 zipfile 方法已经提取了所有图片）
for f in files:
    if f.startswith('amazon_product_v2_'):
        filepath = os.path.join(output_dir, f)
        os.remove(filepath)
        print(f"删除重复文件: {f}")

# 列出最终文件
final_files = [f for f in os.listdir(output_dir) if f.startswith('amazon_product_') and not f.startswith('amazon_product_v2_')]
final_files.sort()

print(f"\n{'='*50}")
print(f"最终保存了 {len(final_files)} 张图片:")
for f in final_files[:10]:
    filepath = os.path.join(output_dir, f)
    size = os.path.getsize(filepath)
    print(f"  - {f} ({size} bytes)")
if len(final_files) > 10:
    print(f"  ... 还有 {len(final_files) - 10} 张图片")

print(f"\n图片保存位置: {output_dir}")
