import json

products_file = 'src/data/products.json'

with open(products_file, 'r', encoding='utf-8') as f:
    products = json.load(f)

for product in products:
    if product['name'] == '厨房收纳331-334-336小熊果盘系列(1)':
        product['price'] = 0.67
        print(f"已修改: {product['name']} -> 价格 {product['price']}")
        break

with open(products_file, 'w', encoding='utf-8') as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

print("修复完成")