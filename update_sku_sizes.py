import os
import json
import re

public_folder = r'D:\code\web\public'
products_file = 'src/data/products.json'

def find_sku_folder(folder_path):
    sku_patterns = ['SKU', '03-SKU', '切片', 'sku']
    for item in os.listdir(folder_path):
        item_lower = item.lower()
        for pattern in sku_patterns:
            if pattern.lower() in item_lower:
                sku_folder = os.path.join(folder_path, item)
                if os.path.isdir(sku_folder):
                    return sku_folder, item
    return None, None

def get_sku_sizes(sku_folder):
    if not sku_folder:
        return []

    sizes = []
    for file in os.listdir(sku_folder):
        if file.lower().endswith(('.jpg', '.jpeg', '.png', '.gif')):
            file_path = os.path.join(sku_folder, file)
            relative_path = os.path.relpath(file_path, public_folder)
            size_name = os.path.splitext(file)[0]

            size_name_clean = size_name.replace('sku（', 'sku(').replace('）', ')')

            sizes.append({
                'size': size_name_clean,
                'price': 0.99,
                'image': '/shop/' + relative_path.replace('\\', '/')
            })

    sizes.sort(key=lambda x: x['size'])
    return sizes

def get_main_images(folder_path):
    main_images = []
    patterns = ['主图', 'images', '01-主图', '750', '800']

    for root, dirs, files in os.walk(folder_path):
        folder_name = os.path.basename(root)
        skip = False
        for pattern in patterns:
            if pattern.lower() in folder_name.lower():
                skip = True
                break
        if 'SKU' in root or 'sku' in root or '切片' in root or '详情' in root:
            continue

        for file in files:
            if file.lower().endswith(('.jpg', '.jpeg', '.png', '.gif')):
                file_path = os.path.join(root, file)
                relative_path = os.path.relpath(file_path, public_folder)
                main_images.append('/shop/' + relative_path.replace('\\', '/'))

    return main_images

with open(products_file, 'r', encoding='utf-8') as f:
    products = json.load(f)

folder_to_product = {}
for product in products:
    folder_to_product[product['name']] = product

updated_count = 0
not_found = []

for item in os.listdir(public_folder):
    if item.startswith('03_'):
        folder_path = os.path.join(public_folder, item)
        if not os.path.isdir(folder_path):
            continue

        clean_name = item.replace('03_', '').replace('-发送', '').replace(' - 副本', '').strip()

        product = None
        for p in products:
            p_name_clean = p['name'].replace('03_', '').replace('-发送', '').replace(' - 副本', '').strip()
            if p_name_clean in clean_name or clean_name in p_name_clean:
                product = p
                break

        if not product:
            for p in products:
                if clean_name.split('-')[0] in p['name'] or p['name'].split('-')[0] in clean_name:
                    product = p
                    break

        if not product:
            not_found.append(item)
            continue

        sku_folder, sku_folder_name = find_sku_folder(folder_path)
        sku_sizes = get_sku_sizes(sku_folder)

        if sku_sizes:
            product['sizes'] = sku_sizes
            product['images'] = [s['image'] for s in sku_sizes]

        updated_count += 1
        print(f"更新产品: {product['name']}")
        if sku_sizes:
            print(f"  SKU数量: {len(sku_sizes)}")
            print(f"  SKU示例: {[s['size'] for s in sku_sizes[:3]]}")

with open(products_file, 'w', encoding='utf-8') as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

print(f"\n共更新了 {updated_count} 个产品")
if not_found:
    print(f"未找到的产品: {not_found}")