import json

products_file = 'src/data/products.json'

with open(products_file, 'r', encoding='utf-8') as f:
    products = json.load(f)

for product in products:
    if product['name'] == '厨房收纳331-334-336小熊果盘系列(1)':
        for size in product.get('sizes', []):
            if '橙色10x10x5.5' in size['size']:
                size['price'] = 0.67
                print(f"已修改: {size['size']} -> 价格 {size['price']}")
                break

with open(products_file, 'w', encoding='utf-8') as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

print("修复完成")