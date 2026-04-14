import zipfile
import xml.etree.ElementTree as ET
import json

excel_file = r'D:\BaiduNetdiskDownload\products_with_images.xlsx'
products_file = 'src/data/products.json'

# 读取Excel
with zipfile.ZipFile(excel_file, 'r') as z:
    shared_strings = []
    if 'xl/sharedStrings.xml' in z.namelist():
        with z.open('xl/sharedStrings.xml') as f:
            tree = ET.parse(f)
            root = tree.getroot()
            for si in root.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}si'):
                text = ''
                for t in si.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t'):
                    if t.text:
                        text += t.text
                shared_strings.append(text)

    with z.open('xl/worksheets/sheet1.xml') as f:
        tree = ET.parse(f)
        root = tree.getroot()

        excel_products = []
        for row in root.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row'):
            row_data = []
            for cell in row.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c'):
                cell_type = cell.get('t')
                value = cell.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v')
                if value is not None and value.text:
                    if cell_type == 's':
                        row_data.append(shared_strings[int(value.text)])
                    else:
                        row_data.append(value.text)
                else:
                    row_data.append('')
            excel_products.append(row_data)

# 跳过表头
excel_data = excel_products[1:]

# 读取products.json
with open(products_file, 'r', encoding='utf-8') as f:
    products = json.load(f)

# 更新产品
updated_count = 0
error_count = 0
for row in excel_data:
    if len(row) >= 5:
        try:
            product_id = int(row[0]) if row[0] else None
            new_name = row[1].strip() if row[1] else ''
            new_price = float(row[3]) if row[3] else None
            new_desc = row[4].strip() if row[4] else ''

            if product_id and new_name:
                for product in products:
                    if product['id'] == product_id:
                        old_name = product['name']
                        product['name'] = new_name
                        if new_price:
                            product['price'] = new_price
                        if new_desc:
                            product['description'] = new_desc
                        updated_count += 1
                        print(f"ID {product_id}: {old_name} -> {new_name}")
                        break
        except (ValueError, IndexError) as e:
            error_count += 1
            print(f"跳过无效行: {row[0] if row else 'empty'}")
            continue

# 保存
with open(products_file, 'w', encoding='utf-8') as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

print(f"\n共更新了 {updated_count} 个产品，跳过了 {error_count} 行无效数据")