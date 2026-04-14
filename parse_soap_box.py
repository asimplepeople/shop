import json
import os

# 读取products.json文件
with open('src/data/products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

# 获取最后一个产品的ID
last_id = products[-1]['id']
new_id = last_id + 1

# 构建产品数据
new_product = {
    "id": new_id,
    "modelId": f"ALB-{new_id:03d}",
    "name": "严选肥皂盒创意沥水香皂盒卫生间浴室免打孔壁挂式肥皂架",
    "description": "严选肥皂盒创意沥水香皂盒卫生间浴室免打孔壁挂式肥皂架，优质材料，耐用环保，设计合理，使用方便。",
    "price": 25,
    "sizes": [
        {
            "size": "款式1",
            "price": 23,
            "image": "/shop/肥皂盒-详情/sku/1.jpg"
        },
        {
            "size": "款式2",
            "price": 25,
            "image": "/shop/肥皂盒-详情/sku/2.jpg"
        }
    ],
    "images": [
        "/shop/肥皂盒-详情/800/1.jpg",
        "/shop/肥皂盒-详情/800/2.jpg",
        "/shop/肥皂盒-详情/800/3.jpg",
        "/shop/肥皂盒-详情/800/4.jpg",
        "/shop/肥皂盒-详情/800/5.jpg",
        "/shop/肥皂盒-详情/800/6.jpg",
        "/shop/肥皂盒-详情/800/7.jpg",
        "/shop/肥皂盒-详情/800/8.jpg",
        "/shop/肥皂盒-详情/800/9.jpg",
        "/shop/肥皂盒-详情/800/10.jpg"
    ],
    "category": "浴室收纳",
    "rating": 4.5,
    "sales": 0,
    "info": {
        "size": "标准",
        "weight": "0.2kg",
        "color": "多种颜色",
        "material": "塑料",
        "package": "单个装",
        "origin": "中国",
        "warranty": "1年"
    },
    "descriptionImages": [
        "/shop/肥皂盒-详情/images/肥皂盒_01.jpg",
        "/shop/肥皂盒-详情/images/肥皂盒_02.jpg",
        "/shop/肥皂盒-详情/images/肥皂盒_03.jpg",
        "/shop/肥皂盒-详情/images/肥皂盒_04.jpg",
        "/shop/肥皂盒-详情/images/肥皂盒_05.jpg",
        "/shop/肥皂盒-详情/images/肥皂盒_06.jpg",
        "/shop/肥皂盒-详情/images/肥皂盒_07.jpg",
        "/shop/肥皂盒-详情/images/肥皂盒_08.jpg",
        "/shop/肥皂盒-详情/images/肥皂盒_09.jpg",
        "/shop/肥皂盒-详情/images/肥皂盒_10.jpg",
        "/shop/肥皂盒-详情/images/肥皂盒_11.jpg",
        "/shop/肥皂盒-详情/images/肥皂盒_12.jpg"
    ],
    "video": "/shop/肥皂盒-详情/肥皂盒视频.mp4"
}

# 追加新产品
products.append(new_product)

# 写回文件
with open('src/data/products.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

print(f"成功添加新产品，ID: {new_id}")
print(f"产品名称: {new_product['name']}")
print(f"产品数量: {len(products)}")
