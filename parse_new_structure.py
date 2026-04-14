import os
import json
import re
import math

public_folder = r'D:\code\web\public'
products_file = 'src/data/products.json'

def get_all_images(folder_path, exclude_folders=None):
    if exclude_folders is None:
        exclude_folders = ['Thumbs.db']

    images = []
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            if file.lower().endswith(('.jpg', '.jpeg', '.png', '.gif')) and file not in exclude_folders:
                file_path = os.path.join(root, file)
                relative_path = os.path.relpath(file_path, public_folder)
                images.append('/shop/' + relative_path.replace('\\', '/'))
    return images

def parse_price(filename, manufacturer):
    basename = os.path.splitext(filename)[0]

    if manufacturer == '鑫乐':
        price_match = re.search(r'\{(\d+(?:\.\d+)?)\}', basename)
        if price_match:
            return math.ceil(float(price_match.group(1)) * 100) / 100
        price_match = re.search(r'-(\d+(?:\.\d+)?)$', basename)
        if price_match:
            return math.ceil(float(price_match.group(1)) * 100) / 100
        parts = basename.split('_')
        for part in parts:
            if re.match(r'^\d+(\.\d+)?$', part):
                return math.ceil(float(part) * 100) / 100
    elif manufacturer == '金冠':
        price_match = re.search(r'-(\d+(?:\.\d+)?)$', basename)
        if price_match:
            return math.ceil(float(price_match.group(1)) * 100) / 100
    elif manufacturer == '飞达三和':
        parts = basename.split('_')
        for part in parts:
            if re.match(r'^\d+(\.\d+)?$', part):
                price = float(part) * 0.24
                return math.ceil(price * 100) / 100
    else:
        parts = basename.split('_')
        for part in parts:
            if re.match(r'^\d+(\.\d+)?$', part):
                return math.ceil(float(part) * 100) / 100

    return 0.99

def find_sku_files(folder_path):
    sku_files = []
    for root, dirs, files in os.walk(folder_path):
        folder_name = os.path.basename(root).lower()
        if 'sku' in folder_name:
            for file in files:
                if file.lower().endswith(('.jpg', '.jpeg', '.png', '.gif')) and file != 'Thumbs.db':
                    sku_files.append(os.path.join(root, file))
    return sku_files

def find_main_images(folder_path):
    main_images = []
    for root, dirs, files in os.walk(folder_path):
        folder_name = os.path.basename(root)
        if '主图' in folder_name or '产品主图' in folder_name:
            for file in files:
                if file.lower().endswith(('.jpg', '.jpeg', '.png', '.gif')) and file != 'Thumbs.db':
                    main_images.append(os.path.join(root, file))
    return main_images

def find_detail_images(folder_path):
    detail_images = []
    for root, dirs, files in os.walk(folder_path):
        folder_name = os.path.basename(root)
        if '详情' in folder_name or '产品详情图片' in folder_name:
            for file in files:
                if file.lower().endswith(('.jpg', '.jpeg', '.png', '.gif')) and file != 'Thumbs.db':
                    detail_images.append(os.path.join(root, file))
    return detail_images

def get_product_name_from_folder(folder_name):
    return folder_name.strip()

products = []
product_id = 1

for manufacturer in os.listdir(public_folder):
    manufacturer_path = os.path.join(public_folder, manufacturer)
    if not os.path.isdir(manufacturer_path):
        continue
    if manufacturer in ['首页', '.git', 'node_modules']:
        continue

    print(f"\n处理厂家: {manufacturer}")

    for item in os.listdir(manufacturer_path):
        item_path = os.path.join(manufacturer_path, item)
        if not os.path.isdir(item_path):
            continue

        product_name = get_product_name_from_folder(item)
        print(f"  发现产品: {product_name}")

        sku_files = find_sku_files(item_path)
        main_files = find_main_images(item_path)
        detail_files = find_detail_images(item_path)

        sku_images = []
        for file in sku_files:
            filename = os.path.basename(file)
            relative_path = os.path.relpath(file, public_folder)
            price = parse_price(filename, manufacturer)
            sku_images.append({
                'size': os.path.splitext(filename)[0],
                'price': price,
                'isUSD': True,
                'image': '/shop/' + relative_path.replace('\\', '/')
            })

        main_images = []
        for file in main_files:
            filename = os.path.basename(file)
            relative_path = os.path.relpath(file, public_folder)
            main_images.append('/shop/' + relative_path.replace('\\', '/'))

        detail_images = []
        for file in detail_files:
            filename = os.path.basename(file)
            relative_path = os.path.relpath(file, public_folder)
            detail_images.append('/shop/' + relative_path.replace('\\', '/'))

        if sku_images or main_images:
            product = {
                'id': product_id,
                'name': product_name,
                'price': sku_images[0]['price'] if sku_images else 0.99,
                'isUSD': True,
                'sales': 0,
                'description': f'{product_name}，优质材料，耐用环保，设计合理，使用方便。',
                'category': manufacturer,
                'images': main_images if main_images else ([img['image'] for img in sku_images] if sku_images else []),
                'rating': 5,
                'reviews': 0,
                'isFeatured': False,
                'stock': 100,
                'sku': f'SKU-{product_id}',
                'weight': 0.5,
                'dimensions': {'length': 10, 'width': 10, 'height': 10},
                'materials': '塑料',
                'careInstructions': '正常清洁',
                'warranty': '无'
            }
            if sku_images:
                product['sizes'] = sku_images

            products.append(product)
            product_id += 1
            print(f"    SKU数量: {len(sku_images)}, 主图数量: {len(main_images)}, 详情图数量: {len(detail_images)}")

with open(products_file, 'w', encoding='utf-8') as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

print(f"\n\n=== 解析完成 ===")
print(f"共解析 {len(products)} 个产品")