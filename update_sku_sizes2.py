import os
import json

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

with open(products_file, 'r', encoding='utf-8') as f:
    products = json.load(f)

def normalize_name(name):
    return name.replace(' ', '').replace('_', '').replace('-', '').lower()

folder_mapping = {
    '03_2025.10.10-金冠2款透明收纳罐-发送': '艺术感高透居家小粮仓',
    '03_2025.11.28-沙拉碗-发送': '品味收纳轻奢高透沙拉碗',
    '03_2025.12.9-收纳盒-发送': '轻奢水波纹化妆品收纳盒',
    '03_2025.12.9-盘子-发送': '功能水晶甜品架',
    '03_2025.3.11-收纳箱-发送 - 副本': '透明收纳箱',
    '03_3033-3035-发送': '海绵宝宝卡通形象肥皂盒',
}

updated_count = 0
for folder_name, expected_product_name in folder_mapping.items():
    folder_path = os.path.join(public_folder, folder_name)
    if not os.path.isdir(folder_path):
        print(f"文件夹不存在: {folder_name}")
        continue

    product = None
    for p in products:
        if normalize_name(p['name']) == normalize_name(expected_product_name):
            product = p
            break

    if not product:
        for p in products:
            if normalize_name(p['name']) in normalize_name(folder_name) or normalize_name(folder_name) in normalize_name(p['name']):
                product = p
                break

    if not product:
        for p in products:
            key_words = ['金冠', '沙拉碗', '收纳盒', '盘子', '收纳箱', '肥皂盒']
            for kw in key_words:
                if kw in folder_name and kw in p['name']:
                    product = p
                    break
            if product:
                break

    if not product:
        print(f"未找到产品: {folder_name} (期望: {expected_product_name})")
        continue

    sku_folder, sku_folder_name = find_sku_folder(folder_path)
    sku_sizes = get_sku_sizes(sku_folder)

    if sku_sizes:
        product['sizes'] = sku_sizes
        product['images'] = [s['image'] for s in sku_sizes]
        updated_count += 1
        print(f"更新产品: {product['name']}")
        print(f"  SKU数量: {len(sku_sizes)}")
        print(f"  SKU示例: {[s['size'] for s in sku_sizes[:5]]}")

with open(products_file, 'w', encoding='utf-8') as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

print(f"\n共额外更新了 {updated_count} 个产品")