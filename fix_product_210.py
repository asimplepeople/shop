import json
import os

products_file = 'src/data/products.json'
public_folder = r'D:\code\web\public'
product_folder = r'D:\code\web\public\金冠\桌面收纳210#-216轻奢收纳盒(2)'
sku_subfolder = r'D:\code\web\public\金冠\桌面收纳210#-216轻奢收纳盒(2)\2025.3.11-收纳箱-发送 - 副本'

sku_images = []
main_images = []
detail_images = []

for root, dirs, files in os.walk(sku_subfolder):
    folder_name = os.path.basename(root)
    for file in files:
        if file.lower().endswith(('.jpg', '.jpeg', '.png', '.gif')) and file != 'Thumbs.db':
            file_path = os.path.join(root, file)
            relative_path = os.path.relpath(file_path, public_folder)
            path = '/shop/' + relative_path.replace('\\', '/')

            if 'sku' in folder_name.lower():
                price_match = None
                for part in file.split('-'):
                    try:
                        p = float(part.replace('.jpg', '').replace('.png', '').replace('.jpeg', ''))
                        if p > 0 and p < 100:
                            price_match = p
                            break
                    except:
                        pass
                sku_images.append({
                    'size': os.path.splitext(file)[0],
                    'price': price_match if price_match else 0.99,
                    'isUSD': True,
                    'image': path
                })
            elif '主图' in folder_name:
                main_images.append(path)
            elif '切片' in folder_name:
                detail_images.append(path)

with open(products_file, 'r', encoding='utf-8') as f:
    products = json.load(f)

for product in products:
    if product['name'] == '桌面收纳210#-216轻奢收纳盒(2)':
        product['price'] = sku_images[0]['price'] if sku_images else 0.99
        product['images'] = main_images if main_images else [img['image'] for img in sku_images]
        product['sizes'] = sku_images
        print(f"产品: {product['name']}")
        print(f"  价格: {product['price']}")
        print(f"  SKU数量: {len(sku_images)}")
        print(f"  主图数量: {len(main_images)}")
        print(f"  详情图数量: {len(detail_images)}")
        break

with open(products_file, 'w', encoding='utf-8') as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

print("\n修复完成！")