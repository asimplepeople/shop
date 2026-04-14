import json

products_file = 'src/data/products.json'

with open(products_file, 'r', encoding='utf-8') as f:
    data = json.load(f)

if isinstance(data, list):
    print(f"原有 {len(data)} 个产品")
    data = []
elif isinstance(data, dict) and 'products' in data:
    print(f"原有 {len(data['products'])} 个产品")
    data['products'] = []

with open(products_file, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("已清空所有产品数据")