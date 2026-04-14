import json

products_file = 'src/data/products.json'

with open(products_file, 'r', encoding='utf-8') as f:
    products = json.load(f)

original_count = len(products)
products = [p for p in products if p['name'] != '桌面收纳210#-216轻奢收纳盒(2)']

with open(products_file, 'w', encoding='utf-8') as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

print(f"已删除产品: 桌面收纳210#-216轻奢收纳盒(2)")
print(f"产品数量: {original_count} -> {len(products)}")