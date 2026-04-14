import pandas as pd
import json
import re

# 读取 Excel 文件
df = pd.read_excel('d:/code/web/src/Amazon商品数据（含图片）.xlsx')

# 读取现有的 products.json
with open('d:/code/web/src/data/products.json', 'r', encoding='utf-8') as f:
    existing_products = json.load(f)

# 获取现有产品的最大 ID
max_id = max([p['id'] for p in existing_products])

# 处理 Excel 数据
new_products = []
for idx, row in df.iterrows():
    if pd.isna(row.get('商品名称')):
        continue
    
    # 提取价格
    price_str = str(row.get('价格', '0'))
    price_match = re.search(r'\$?([\d,]+\.?\d*)', price_str)
    price = float(price_match.group(1).replace(',', '')) if price_match else 0
    
    # 转换为人民币 (假设汇率 7.2)
    price_cny = int(price * 7.2)
    
    # 提取材质
    material = str(row.get('材质', '塑料'))
    
    # 提取尺寸
    size_str = str(row.get('尺寸', ''))
    
    # 提取商品名称
    name = str(row.get('商品名称', '')).strip()
    
    # 生成产品 ID
    product_id = max_id + idx + 1
    
    # 生成 modelId
    model_id = f"AMZ-{product_id:03d}"
    
    # 生成描述
    description = f"{material}材质，{name}。优质收纳产品，适合家居整理。"
    
    # 生成尺寸选项
    sizes = [
        {"size": "标准版", "price": price_cny}
    ]
    
    # 生成图片 URL (使用占位符，实际应该使用真实图片)
    images = [
        f"https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=amazon%20storage%20product%20{idx}%20minimalist%20design&image_size=landscape_16_9"
        for _ in range(4)
    ]
    
    # 确定分类
    category = "收纳"
    if '化妆品' in name or '化妆' in name:
        category = "化妆品收纳"
    elif '药' in name or '药品' in name:
        category = "药品收纳"
    elif '食品' in name or '食物' in name:
        category = "食品收纳"
    elif '鞋' in name:
        category = "鞋类收纳"
    elif '玩具' in name:
        category = "玩具收纳"
    
    # 生成评分 (随机 4.0-4.9)
    import random
    rating = round(random.uniform(4.0, 4.9), 1)
    
    product = {
        "id": product_id,
        "modelId": model_id,
        "name": name[:50] + "..." if len(name) > 50 else name,
        "description": description,
        "price": price_cny,
        "sizes": sizes,
        "images": images,
        "category": category,
        "rating": rating
    }
    
    new_products.append(product)

# 合并新产品到现有产品列表前面
all_products = new_products + existing_products

# 重新排序 ID
for i, product in enumerate(all_products):
    product['id'] = i + 1

# 保存到 products.json
with open('d:/code/web/src/data/products.json', 'w', encoding='utf-8') as f:
    json.dump(all_products, f, ensure_ascii=False, indent=2)

print(f"成功转换 {len(new_products)} 个新产品")
print(f"总共 {len(all_products)} 个产品")
