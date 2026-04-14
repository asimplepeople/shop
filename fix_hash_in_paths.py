import json

products_file = 'src/data/products.json'

with open(products_file, 'r', encoding='utf-8') as f:
    products = json.load(f)

count = 0
for product in products:
    fixed_images = []
    for img in product.get('images', []):
        fixed_images.append(img.replace('#', '%23'))
    product['images'] = fixed_images

    if 'sizes' in product:
        for size in product['sizes']:
            if 'image' in size:
                size['image'] = size['image'].replace('#', '%23')

    if count < 5:
        print(f"产品: {product['name']}")
        if product['images']:
            print(f"  图片示例: {product['images'][0][:80]}...")

with open(products_file, 'w', encoding='utf-8') as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

print(f"\n已修复所有产品图片路径中的 # 符号为 %23")