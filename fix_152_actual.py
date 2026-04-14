import json
import os

products_file = 'src/data/products.json'
public_folder = r'D:\code\web\public'

with open(products_file, 'r', encoding='utf-8') as f:
    products = json.load(f)

def get_existing_images(folder_name):
    folder_path = os.path.join(public_folder, folder_name)
    images = []
    if os.path.exists(folder_path):
        for root, dirs, files in os.walk(folder_path):
            for file in files:
                if file.lower().endswith(('.jpg', '.jpeg', '.png', '.gif')):
                    relative_path = os.path.relpath(os.path.join(root, file), public_folder)
                    images.append('/shop/' + relative_path.replace('\\', '/'))
    return images

for product in products:
    if product['id'] == 152:
        folder_name = '03_2025.10.10-金冠2款透明收纳罐-发送'
        existing_images = get_existing_images(folder_name)
        old_count = len(product['images'])
        product['images'] = existing_images
        new_count = len(existing_images)
        print(f"产品: {product['name']}")
        print(f"旧图片数量: {old_count}")
        print(f"新图片数量: {new_count}")
        print(f"移除图片数量: {old_count - new_count}")
        print(f"实际存在图片: {sorted(existing_images)[:5]}...")

with open(products_file, 'w', encoding='utf-8') as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

print("\n修复完成！")