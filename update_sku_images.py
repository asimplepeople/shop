import json

# 读取现有的products.json
with open('src/data/products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

# 遍历所有产品
for product in products:
    # 检查是否有sizes和skuImages字段
    if 'sizes' in product and 'skuImages' in product:
        sizes = product['sizes']
        sku_images = product['skuImages']
        
        # 为每个size添加image字段
        for i, size in enumerate(sizes):
            if i < len(sku_images):
                size['image'] = sku_images[i]
            else:
                # 如果skuImages数量不足，使用主图的第一张
                if 'images' in product and product['images']:
                    size['image'] = product['images'][0]

# 写回products.json
with open('src/data/products.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

print("成功更新产品数据结构，为每个尺寸添加了对应的SKU图片")
print("修改后的产品数据已更新到 src/data/products.json")
