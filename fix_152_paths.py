import json

products_file = 'src/data/products.json'

with open(products_file, 'r', encoding='utf-8') as f:
    products = json.load(f)

for product in products:
    if product['id'] == 152:
        print(f"修复产品: {product['name']}")
        old_images = product['images'].copy()
        new_images = []
        for img in old_images:
            new_img = img.replace('/1/', '/')
            new_images.append(new_img)
        product['images'] = new_images
        print(f"修复了 {len(old_images)} 张图片路径")

with open(products_file, 'w', encoding='utf-8') as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

print("修复完成")