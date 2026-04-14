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
    "name": "严选多巴胺水果盘创意家用水果篮客厅茶几零食盘",
    "description": "严选多巴胺水果盘创意家用水果篮客厅茶几零食盘，优质材料，耐用环保，设计合理，使用方便。",
    "price": 68,
    "sizes": [
        {
            "size": "款式1",
            "price": 65,
            "image": "/shop/多巴胺水果盘-发送/SKu/1.jpg"
        },
        {
            "size": "款式2",
            "price": 68,
            "image": "/shop/多巴胺水果盘-发送/SKu/2.jpg"
        },
        {
            "size": "款式3",
            "price": 70,
            "image": "/shop/多巴胺水果盘-发送/SKu/3.jpg"
        },
        {
            "size": "款式4",
            "price": 72,
            "image": "/shop/多巴胺水果盘-发送/SKu/4.jpg"
        }
    ],
    "images": [
        "/shop/多巴胺水果盘-发送/主图/800主图/1.jpg",
        "/shop/多巴胺水果盘-发送/主图/800主图/2.jpg",
        "/shop/多巴胺水果盘-发送/主图/800主图/3.jpg",
        "/shop/多巴胺水果盘-发送/主图/800主图/4.jpg",
        "/shop/多巴胺水果盘-发送/主图/800主图/5.jpg",
        "/shop/多巴胺水果盘-发送/主图/800主图/6.jpg",
        "/shop/多巴胺水果盘-发送/主图/800主图/7.jpg",
        "/shop/多巴胺水果盘-发送/主图/800主图/8.jpg",
        "/shop/多巴胺水果盘-发送/主图/800主图/9.jpg",
        "/shop/多巴胺水果盘-发送/主图/800主图/10.jpg"
    ],
    "category": "客厅收纳",
    "rating": 4.5,
    "sales": 0,
    "info": {
        "size": "标准",
        "weight": "0.5kg",
        "color": "多种颜色",
        "material": "塑料",
        "package": "单个装",
        "origin": "中国",
        "warranty": "1年"
    },
    "descriptionImages": [
        "/shop/多巴胺水果盘-发送/切片/多巴胺水果盘_01.jpg",
        "/shop/多巴胺水果盘-发送/切片/多巴胺水果盘_02.jpg",
        "/shop/多巴胺水果盘-发送/切片/多巴胺水果盘_03.jpg",
        "/shop/多巴胺水果盘-发送/切片/多巴胺水果盘_04.jpg",
        "/shop/多巴胺水果盘-发送/切片/多巴胺水果盘_05.jpg",
        "/shop/多巴胺水果盘-发送/切片/多巴胺水果盘_06.jpg",
        "/shop/多巴胺水果盘-发送/切片/多巴胺水果盘_07.jpg",
        "/shop/多巴胺水果盘-发送/切片/多巴胺水果盘_08.jpg",
        "/shop/多巴胺水果盘-发送/切片/多巴胺水果盘_09.jpg",
        "/shop/多巴胺水果盘-发送/切片/多巴胺水果盘_10.jpg",
        "/shop/多巴胺水果盘-发送/切片/多巴胺水果盘_11.jpg",
        "/shop/多巴胺水果盘-发送/切片/多巴胺水果盘_12.jpg"
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
