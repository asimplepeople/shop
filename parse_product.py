import os
import json

# 产品文件夹路径
product_folder = "public/00_001_160L收纳箱多功能带轮衣物折叠家用塑料翻盖整理筐四件套收纳 - 阿里巴巴"

# 读取现有的products.json
with open('src/data/products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

# 确定新产品的ID
if products:
    new_id = max(p['id'] for p in products) + 1
else:
    new_id = 1

# 读取产品信息.txt
try:
    with open(f'{product_folder}/产品信息.txt', 'r', encoding='utf-8') as f:
        info_lines = f.readlines()
    
    # 解析产品信息
    product_info = {}
    for line in info_lines:
        line = line.strip()
        if ':' in line:
            key, value = line.split(':', 1)
            product_info[key.strip()] = value.strip()
    
    # 提取产品名称和价格
    product_name = product_info.get('产品标题', '160L收纳箱多功能带轮衣物折叠家用塑料翻盖整理筐四件套收纳')
    product_price = float(product_info.get('产品价格', '69.00'))
    
except Exception as e:
    print(f"读取产品信息.txt失败: {e}")
    product_name = '160L收纳箱多功能带轮衣物折叠家用塑料翻盖整理筐四件套收纳'
    product_price = 69.00

# 收集所有图片路径
images = []

# 产品主图
main_images_folder = f'{product_folder}/产品主图'
if os.path.exists(main_images_folder):
    for filename in sorted(os.listdir(main_images_folder)):
        if filename.endswith(('.jpg', '.jpeg', '.png')):
            images.append(f"/shop/{main_images_folder}/{filename}")

# 产品SKU图片
sku_images_folder = f'{product_folder}/产品SKU图片'
if os.path.exists(sku_images_folder):
    for filename in sorted(os.listdir(sku_images_folder)):
        if filename.endswith(('.jpg', '.jpeg', '.png')):
            images.append(f"/shop/{sku_images_folder}/{filename}")

# 产品详情图片
detail_images_folder = f'{product_folder}/产品详情图片'
if os.path.exists(detail_images_folder):
    for filename in sorted(os.listdir(detail_images_folder)):
        if filename.endswith(('.jpg', '.jpeg', '.png')):
            images.append(f"/shop/{detail_images_folder}/{filename}")

# 如果没有图片，使用默认图片
if not images:
    images = ["/shop/assets/products/storage-1.jpg"] * 4

# 创建新产品数据
new_product = {
    "id": new_id,
    "modelId": f"ALB-{new_id:03d}",
    "name": product_name,
    "description": "160L收纳箱多功能带轮衣物折叠家用塑料翻盖整理筐四件套收纳，优质塑料材质，耐用环保，带轮设计，移动方便，翻盖设计，存取便捷，四件套组合，满足不同收纳需求。",
    "price": int(product_price * 100),  # 转换为分
    "sizes": [
        {
            "size": "标准版",
            "price": int(product_price * 100)
        }
    ],
    "images": images,
    "category": "收纳",
    "rating": 4.5,
    "sales": 0,
    "info": {
        "size": "160L",
        "weight": "5.0kg",
        "color": "灰色,咖色",
        "material": "塑料",
        "package": "四件套",
        "origin": "中国",
        "warranty": "1年"
    }
}

# 将新产品追加到products列表
products.append(new_product)

# 写回products.json
with open('src/data/products.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

print(f"成功添加新产品: {product_name}")
print(f"产品ID: {new_id}")
print(f"图片数量: {len(images)}")
print("产品数据已更新到 src/data/products.json")
