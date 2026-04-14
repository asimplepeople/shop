import json
import random

# 读取 products.json
with open('d:/code/web/src/data/products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

# 定义可能的商品信息
colors = ['白色', '黑色', '灰色', '蓝色', '粉色', '绿色', '黄色']
materials = ['塑料', '金属', '木材', '布料', '玻璃', '陶瓷']
sizes = [
    '20x30x40cm', '30x30x30cm', '40x20x15cm', '50x30x20cm',
    '25x25x25cm', '35x25x15cm', '45x35x25cm', '30x40x50cm'
]

# 为每个产品添加商品信息
for product in products:
    # 随机生成商品信息
    product['info'] = {
        'size': random.choice(sizes),
        'weight': f"{random.uniform(0.5, 5.0):.1f}kg",
        'color': random.choice(colors),
        'material': random.choice(materials),
        'package': f"{random.choice(['彩盒', '白盒', '牛皮纸盒', '无纺布袋'])}",
        'origin': '中国',
        'warranty': '1年'
    }

# 保存更新后的 products.json
with open('d:/code/web/src/data/products.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

print(f"已为 {len(products)} 个产品添加商品信息")
print("示例产品信息:")
for i, product in enumerate(products[:2]):
    print(f"{i+1}. {product['name'][:30]}...")
    for key, value in product['info'].items():
        print(f"  - {key}: {value}")
