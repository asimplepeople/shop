import json
import os

# 读取 products.json
with open('d:/code/web/src/data/products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

# 图片目录
image_dir = 'd:/code/web/public/assets/products/amazon'

# 获取所有 Amazon 图片
image_files = [f for f in os.listdir(image_dir) if f.startswith('amazon_product_')]
image_files.sort()

print(f"找到 {len(image_files)} 张 Amazon 图片")
print(f"共有 {len(products)} 个产品")

# 更新前 62 个产品的图片（这些是从 Excel 转换过来的 Amazon 产品）
amazon_product_count = 62
updated_count = 0

for i in range(min(amazon_product_count, len(products))):
    product = products[i]
    
    # 为每个产品分配图片（循环使用图片）
    image_idx = i % len(image_files)
    image_file = image_files[image_idx]
    
    # 创建 4 张相同的图片（模拟多图）
    base_path = '/shop/assets/products/amazon/'
    product_images = [
        base_path + image_file,
        base_path + image_file,
        base_path + image_file,
        base_path + image_file
    ]
    
    product['images'] = product_images
    updated_count += 1
    
    print(f"更新产品 {product['id']}: {product['name'][:30]}... -> {image_file}")

# 保存更新后的 products.json
with open('d:/code/web/src/data/products.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

print(f"\n{'='*50}")
print(f"成功更新了 {updated_count} 个产品的图片")
print(f"更新后的文件已保存到: d:/code/web/src/data/products.json")
