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
    "name": "严选双层便当盒保温饭盒上班族学生餐盒带盖分隔餐盒",
    "description": "严选双层便当盒保温饭盒上班族学生餐盒带盖分隔餐盒，优质材料，耐用环保，设计合理，使用方便。",
    "price": 58,
    "sizes": [
        {
            "size": "款式1",
            "price": 55,
            "image": "/shop/20201111 便当盒/sku/sku（1）.jpg"
        },
        {
            "size": "款式2",
            "price": 58,
            "image": "/shop/20201111 便当盒/sku/sku（2）.jpg"
        },
        {
            "size": "款式3",
            "price": 60,
            "image": "/shop/20201111 便当盒/sku/sku（3）.jpg"
        }
    ],
    "images": [
        "/shop/20201111 便当盒/主图/主图 (1).jpg",
        "/shop/20201111 便当盒/主图/主图 (2).jpg",
        "/shop/20201111 便当盒/主图/主图 (3).jpg",
        "/shop/20201111 便当盒/主图/主图 (4).jpg",
        "/shop/20201111 便当盒/主图/主图 (5).jpg",
        "/shop/20201111 便当盒/主图/主图 (6).jpg",
        "/shop/20201111 便当盒/主图/主图 (7).jpg",
        "/shop/20201111 便当盒/主图/主图 (8).jpg",
        "/shop/20201111 便当盒/主图/主图 (9).jpg",
        "/shop/20201111 便当盒/主图/主图 (10).jpg"
    ],
    "category": "厨房收纳",
    "rating": 4.5,
    "sales": 0,
    "info": {
        "size": "标准",
        "weight": "0.6kg",
        "color": "多种颜色",
        "material": "塑料",
        "package": "单个装",
        "origin": "中国",
        "warranty": "1年"
    },
    "descriptionImages": [
        "/shop/20201111 便当盒/images/双层便当盒_01.jpg",
        "/shop/20201111 便当盒/images/双层便当盒_02.jpg",
        "/shop/20201111 便当盒/images/双层便当盒_03.jpg",
        "/shop/20201111 便当盒/images/双层便当盒_04.jpg",
        "/shop/20201111 便当盒/images/双层便当盒_05.jpg",
        "/shop/20201111 便当盒/images/双层便当盒_06.jpg",
        "/shop/20201111 便当盒/images/双层便当盒_07.jpg",
        "/shop/20201111 便当盒/images/双层便当盒_08.jpg",
        "/shop/20201111 便当盒/images/双层便当盒_09.jpg",
        "/shop/20201111 便当盒/images/双层便当盒_10.jpg",
        "/shop/20201111 便当盒/images/双层便当盒_11.jpg",
        "/shop/20201111 便当盒/images/双层便当盒_12.jpg",
        "/shop/20201111 便当盒/images/双层便当盒_13.jpg",
        "/shop/20201111 便当盒/images/双层便当盒_14.jpg",
        "/shop/20201111 便当盒/images/双层便当盒_15.jpg"
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
