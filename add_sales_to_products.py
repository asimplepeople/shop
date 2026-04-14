import json
import random

# 读取 products.json
with open('d:/code/web/src/data/products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

# 为每个产品添加销量字段
for product in products:
    # 生成 100-9999 之间的随机销量
    sales = random.randint(100, 9999)
    product['sales'] = sales

# 保存更新后的 products.json
with open('d:/code/web/src/data/products.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

print(f"已为 {len(products)} 个产品添加销量数据")
print("示例产品:")
for i, product in enumerate(products[:3]):
    print(f"{i+1}. {product['name'][:30]}... - 销量: {product['sales']}")
