import zipfile
import xml.etree.ElementTree as ET
import os

excel_file = r'D:\BaiduNetdiskDownload\products_with_images.xlsx'

# Excel是一个zip文件，包含XML
with zipfile.ZipFile(excel_file, 'r') as z:
    # 读取共享字符串表
    shared_strings = []
    if 'xl/sharedStrings.xml' in z.namelist():
        with z.open('xl/sharedStrings.xml') as f:
            tree = ET.parse(f)
            root = tree.getroot()
            ns = {'ns': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
            for si in root.findall('ns:si', ns):
                text = ''
                for t in si.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t'):
                    if t.text:
                        text += t.text
                shared_strings.append(text)

    # 读取工作表
    with z.open('xl/worksheets/sheet1.xml') as f:
        tree = ET.parse(f)
        root = tree.getroot()
        ns = {'ns': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}

        rows = []
        for row in root.findall('.//ns:row', ns):
            row_data = []
            for cell in row.findall('ns:c', ns):
                cell_type = cell.get('t')
                value = cell.find('ns:v', ns)
                if value is not None and value.text:
                    if cell_type == 's':
                        row_data.append(shared_strings[int(value.text)])
                    else:
                        row_data.append(value.text)
                else:
                    row_data.append('')
            rows.append(row_data)

        print(f"总行数: {len(rows)}")
        print(f"列数: {len(rows[0]) if rows else 0}")
        print("\n表头:")
        print(rows[0] if rows else [])
        print("\n前5行数据:")
        for i, row in enumerate(rows[1:6], 1):
            print(f"行{i}: {row}")