import json
import random

# 读取现有的products.json
with open('src/data/products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

# 定义不同分类的价格范围
category_price_ranges = {
    '收纳': (50, 500),
    '厨房': (30, 300),
    '浴室': (20, 200),
    '卧室': (40, 400),
    '办公室': (30, 300),
    '医疗': (50, 500),
    '儿童': (40, 400),
    '宠物': (30, 300)
}

# 遍历所有产品
for product in products:
    # 确定产品分类的价格范围
    category = product.get('category', '收纳')
    price_range = category_price_ranges.get(category, (50, 500))
    
    # 生成随机价格（保留整数）
    base_price = random.randint(price_range[0], price_range[1])
    product['price'] = base_price
    
    # 更新sizes中的价格
    if 'sizes' in product:
        for size in product['sizes']:
            # 为不同尺寸设置略微不同的价格
            size_price = base_price + random.randint(-20, 30)
            # 确保价格不低于10
            size_price = max(10, size_price)
            size['price'] = size_price
    
    # 生成随机销量（10-500之间）
    product['sales'] = random.randint(10, 500)

# 写回products.json
with open('src/data/products.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

print("成功为所有产品生成了价格和销量数据")
print("修改后的产品数据已更新到 src/data/products.json")
