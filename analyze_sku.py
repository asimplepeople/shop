import os
import json

public_folder = r'D:\code\web\public'
products_file = 'src/data/products.json'

def get_sku_images(folder_path):
    sku_images = []
    main_images = []
    detail_images = []
    all_images = []

    for root, dirs, files in os.walk(folder_path):
        folder_name = os.path.basename(root)
        for file in files:
            if file.lower().endswith(('.jpg', '.jpeg', '.png', '.gif')):
                file_path = os.path.join(root, file)
                relative_path = os.path.relpath(file_path, public_folder)
                full_path = '/shop/' + relative_path.replace('\\', '/')

                if 'sku' in folder_name.lower() or '切片' in folder_name:
                    sku_images.append(full_path)
                elif '主图' in folder_name or 'images' in folder_name.lower():
                    main_images.append(full_path)
                elif '详情' in folder_name:
                    detail_images.append(full_path)
                all_images.append(full_path)

    return sku_images, main_images, detail_images, all_images

def find_sku_folder(folder_path):
    for item in os.listdir(folder_path):
        item_lower = item.lower()
        if 'sku' in item_lower or '切片' in item:
            sku_folder = os.path.join(folder_path, item)
            if os.path.isdir(sku_folder):
                return sku_folder
    return None

products_data = []

for item in os.listdir(public_folder):
    if item.startswith('03_'):
        folder_path = os.path.join(public_folder, item)
        if os.path.isdir(folder_path):
            sku_folder = find_sku_folder(folder_path)
            sku_images, main_images, detail_images, all_images = get_sku_images(folder_path)

            sku_sizes = []
            if sku_folder:
                for file in os.listdir(sku_folder):
                    if file.lower().endswith(('.jpg', '.jpeg', '.png', '.gif')):
                        file_path = os.path.join(sku_folder, file)
                        relative_path = os.path.relpath(file_path, public_folder)
                        sku_sizes.append({
                            'size': os.path.splitext(file)[0],
                            'price': 0.99,
                            'image': '/shop/' + relative_path.replace('\\', '/')
                        })

            products_data.append({
                'folder': item,
                'sku_folder': os.path.basename(sku_folder) if sku_folder else None,
                'sku_count': len(sku_images),
                'main_count': len(main_images),
                'detail_count': len(detail_images),
                'total_count': len(all_images),
                'sizes': sku_sizes
            })

print("=== 03前缀文件夹SKU分析 ===\n")
for p in products_data:
    print(f"文件夹: {p['folder']}")
    print(f"  SKU文件夹: {p['sku_folder']}")
    print(f"  SKU图片数: {p['sku_count']}")
    print(f"  主图数: {p['main_count']}")
    print(f"  详情图数: {p['detail_count']}")
    print(f"  总图片数: {p['total_count']}")
    if p['sizes']:
        print(f"  SKU尺寸: {[s['size'] for s in p['sizes'][:5]]}...")
    print()

print(f"\n共有 {len(products_data)} 个03前缀产品")