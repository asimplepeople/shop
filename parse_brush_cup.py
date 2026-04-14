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
    "name": "严选刷牙杯套装漱口杯情侣洗漱杯家用牙缸杯牙刷杯创意简约刷牙杯子",
    "description": "严选刷牙杯套装漱口杯情侣洗漱杯家用牙缸杯牙刷杯创意简约刷牙杯子，优质材料，耐用环保，设计合理，使用方便。",
    "price": 35,
    "sizes": [
        {
            "size": "款式1",
            "price": 32,
            "image": "/shop/20230508刷牙杯完成/主图SKU/SKU1.jpg"
        },
        {
            "size": "款式2",
            "price": 35,
            "image": "/shop/20230508刷牙杯完成/主图SKU/SKU2.jpg"
        },
        {
            "size": "款式3",
            "price": 38,
            "image": "/shop/20230508刷牙杯完成/主图SKU/SKU3.jpg"
        },
        {
            "size": "款式4",
            "price": 40,
            "image": "/shop/20230508刷牙杯完成/主图SKU/SKU4.jpg"
        }
    ],
    "images": [
        "/shop/20230508刷牙杯完成/主图SKU/1.jpg",
        "/shop/20230508刷牙杯完成/主图SKU/2.jpg",
        "/shop/20230508刷牙杯完成/主图SKU/3.jpg",
        "/shop/20230508刷牙杯完成/主图SKU/4.jpg",
        "/shop/20230508刷牙杯完成/主图SKU/5.jpg",
        "/shop/20230508刷牙杯完成/主图SKU/6.jpg",
        "/shop/20230508刷牙杯完成/主图SKU/7.jpg",
        "/shop/20230508刷牙杯完成/主图SKU/8.jpg",
        "/shop/20230508刷牙杯完成/主图SKU/9.jpg",
        "/shop/20230508刷牙杯完成/主图SKU/10.jpg",
        "/shop/20230508刷牙杯完成/主图SKU/11.png"
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
        "/shop/20230508刷牙杯完成/images/详情页_01.jpg",
        "/shop/20230508刷牙杯完成/images/详情页_02.jpg",
        "/shop/20230508刷牙杯完成/images/详情页_03.jpg",
        "/shop/20230508刷牙杯完成/images/详情页_04.jpg",
        "/shop/20230508刷牙杯完成/images/详情页_05.jpg",
        "/shop/20230508刷牙杯完成/images/详情页_06.jpg",
        "/shop/20230508刷牙杯完成/images/详情页_07.jpg",
        "/shop/20230508刷牙杯完成/images/详情页_08.jpg",
        "/shop/20230508刷牙杯完成/images/详情页_09.jpg",
        "/shop/20230508刷牙杯完成/images/详情页_10.jpg",
        "/shop/20230508刷牙杯完成/images/详情页_11.jpg",
        "/shop/20230508刷牙杯完成/images/详情页_12.jpg",
        "/shop/20230508刷牙杯完成/images/详情页_13.jpg",
        "/shop/20230508刷牙杯完成/images/详情页_14.jpg",
        "/shop/20230508刷牙杯完成/images/详情页_15.jpg",
        "/shop/20230508刷牙杯完成/images/详情页_16.jpg"
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
