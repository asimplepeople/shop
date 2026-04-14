import pandas as pd
import openpyxl

# 读取 Excel 文件
df = pd.read_excel('d:/code/web/src/Amazon商品数据（含图片）.xlsx')

print("列名:")
print(df.columns.tolist())
print("\n前5行数据:")
print(df.head())

print("\n\n主图列的前10个值:")
for i, val in enumerate(df['主图'].head(10)):
    print(f"{i+1}. {type(val)}: {val}")

# 使用 openpyxl 检查是否有嵌入式图片
wb = openpyxl.load_workbook('d:/code/web/src/Amazon商品数据（含图片）.xlsx')
ws = wb.active

print("\n\n检查单元格内容:")
for row_idx in range(2, 7):  # 检查前5行
    cell = ws.cell(row=row_idx, column=1)  # 第一列
    print(f"\n行 {row_idx}:")
    print(f"  值: {cell.value}")
    print(f"  类型: {type(cell.value)}")
    print(f"  数据类型: {cell.data_type}")
    if cell.hyperlink:
        print(f"  超链接: {cell.hyperlink.target}")
    else:
        print(f"  超链接: 无")
