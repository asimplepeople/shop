import json
import csv
import os

products_file = 'src/data/products.json'
output_file = r'D:\BaiduNetdiskDownload\products.csv'

with open(products_file, 'r', encoding='utf-8') as f:
    products = json.load(f)

os.makedirs(os.path.dirname(output_file), exist_ok=True)

with open(output_file, 'w', newline='', encoding='utf-8-sig') as f:
    writer = csv.writer(f)
    writer.writerow(['ID', '产品名称', '价格', '产品描述', '主图URL'])

    for product in products:
        main_image = product['images'][0] if product.get('images') else ''
        writer.writerow([
            product['id'],
            product['name'],
            product['price'],
            product.get('description', ''),
            main_image
        ])

print(f"已导出 {len(products)} 个产品到 {output_file}")