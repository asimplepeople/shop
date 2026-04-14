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
    "name": "严选兔耳杯8859创意可爱水杯少女心杯子家用喝水杯",
    "description": "严选兔耳杯8859创意可爱水杯少女心杯子家用喝水杯，优质材料，耐用环保，设计合理，使用方便。",
    "price": 45,
    "sizes": [
        {
            "size": "款式1",
            "price": 42,
            "image": "/shop/兔耳杯8859/主图/sku（1）.jpg"
        },
        {
            "size": "款式2",
            "price": 45,
            "image": "/shop/兔耳杯8859/主图/sku（2）.jpg"
        },
        {
            "size": "款式3",
            "price": 48,
            "image": "/shop/兔耳杯8859/主图/sku（3）.jpg"
        },
        {
            "size": "款式4",
            "price": 50,
            "image": "/shop/兔耳杯8859/主图/sku（4）.jpg"
        }
    ],
    "images": [
        "/shop/兔耳杯8859/主图/1.jpg",
        "/shop/兔耳杯8859/主图/2.jpg",
        "/shop/兔耳杯8859/主图/3.jpg",
        "/shop/兔耳杯8859/主图/4.jpg",
        "/shop/兔耳杯8859/主图/5.jpg",
        "/shop/兔耳杯8859/主图/6.jpg",
        "/shop/兔耳杯8859/主图/7.jpg"
    ],
    "category": "浴室收纳",
    "rating": 4.5,
    "sales": 0,
    "info": {
        "size": "标准",
        "weight": "0.3kg",
        "color": "多种颜色",
        "material": "塑料",
        "package": "单个装",
        "origin": "中国",
        "warranty": "1年"
    },
    "descriptionImages": [
        "/shop/兔耳杯8859/images/兔耳杯_01.jpg",
        "/shop/兔耳杯8859/images/兔耳杯_02.jpg",
        "/shop/兔耳杯8859/images/兔耳杯_03.jpg",
        "/shop/兔耳杯8859/images/兔耳杯_04.jpg",
        "/shop/兔耳杯8859/images/兔耳杯_05.jpg",
        "/shop/兔耳杯8859/images/兔耳杯_06.jpg",
        "/shop/兔耳杯8859/images/兔耳杯_07.jpg",
        "/shop/兔耳杯8859/images/兔耳杯_08.jpg",
        "/shop/兔耳杯8859/images/兔耳杯_09.jpg",
        "/shop/兔耳杯8859/images/兔耳杯_10.jpg",
        "/shop/兔耳杯8859/images/兔耳杯_11.jpg",
        "/shop/兔耳杯8859/images/兔耳杯_12.jpg",
        "/shop/兔耳杯8859/images/兔耳杯_13.jpg",
        "/shop/兔耳杯8859/images/兔耳杯_14.jpg",
        "/shop/兔耳杯8859/images/兔耳杯_15.jpg",
        "/shop/兔耳杯8859/images/兔耳杯_16.jpg"
    ]
}

# 追加新产品
products.append(new_product)

# 写回文件
with open('src/data/products.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

print(f"成功添加新产品，ID: {new_id}")
print(f"产品名称: {new_product['name']}")
print(f"产品数量: {len(products)}")
