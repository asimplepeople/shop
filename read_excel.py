import pandas as pd

excel_file = r'D:\BaiduNetdiskDownload\products_with_images.xlsx'
df = pd.read_excel(excel_file)
print("列名:", df.columns.tolist())
print("\n前10行数据:")
print(df.head(10))
print(f"\n总行数: {len(df)}")