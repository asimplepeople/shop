import json

products_file = 'src/data/products.json'

with open(products_file, 'r', encoding='utf-8') as f:
    products = json.load(f)

count = 0
for product in products:
    images = product.get('images', [])
    if images:
        first_image = images[0]
        if not first_image.startswith('/shop/'):
            product['images'] = ['/shop/' + img for img in images]
            count += 1
            print(f"修复产品 {product['id']}: {product['name']}")

with open(products_file, 'w', encoding='utf-8') as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

print(f"\n共修复 {count} 个产品的图片路径")