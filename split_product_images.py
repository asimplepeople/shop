import json

# 读取现有的products.json
with open('src/data/products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

# 遍历所有产品
for product in products:
    # 检查是否有images字段
    if 'images' in product:
        images = product['images']
        
        # 分离图片类型
        main_images = []
        sku_images = []
        description_images = []
        
        for img in images:
            if '产品主图' in img:
                main_images.append(img)
            elif '产品SKU图片' in img:
                sku_images.append(img)
            elif '产品详情图片' in img:
                description_images.append(img)
            else:
                # 其他图片默认为主图
                main_images.append(img)
        
        # 更新产品数据结构
        product['images'] = main_images
        if sku_images:
            product['skuImages'] = sku_images
        if description_images:
            product['descriptionImages'] = description_images

# 写回products.json
with open('src/data/products.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

print("成功修改产品数据结构，将SKU图片和产品描述图片分开")
print("修改后的产品数据已更新到 src/data/products.json")
