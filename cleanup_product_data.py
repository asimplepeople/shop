import json
import re

# 读取现有的products.json
with open('src/data/products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

# 遍历所有产品
for product in products:
    # 移除skuImages字段
    if 'skuImages' in product:
        del product['skuImages']
    
    # 对descriptionImages进行排序
    if 'descriptionImages' in product and product['descriptionImages']:
        # 定义排序函数，提取文件名中的数字
        def sort_key(img_path):
            # 提取文件名
            filename = img_path.split('/')[-1]
            # 提取文件名中的数字
            numbers = re.findall(r'\d+', filename)
            if numbers:
                return int(numbers[0])
            return 0
        
        # 排序
        product['descriptionImages'].sort(key=sort_key)

# 写回products.json
with open('src/data/products.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

print("成功清理产品数据：")
print("1. 移除了所有产品中的skuImages字段")
print("2. 对所有产品中的descriptionImages字段进行了正确排序")
print("修改后的产品数据已更新到 src/data/products.json")
