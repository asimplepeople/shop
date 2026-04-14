import json
import re

# 读取产品数据
with open('src/data/products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

# 分类关键词
categories = {
    '厨房收纳': ['厨房', '餐具', '厨具', '调料', '锅具', '碗', '碟', '杯', '盘', '烹饪', '烘焙', '冰箱'],
    '客厅收纳': ['客厅', '沙发', '茶几', '电视', '遥控器', '装饰', '摆件', '收纳盒', '收纳箱'],
    '衣物收纳': ['衣物', '内衣', '袜子', '内裤', '衣柜', '衣架', '折叠', '整理箱', '收纳袋', '衣物箱'],
    '桌面收纳': ['桌面', '办公桌', '书桌', '文具', '笔', '文件', '抽屉', '键盘', '鼠标', '显示器']
}

# 遍历所有产品，根据名称重新分类
for product in products:
    product_name = product['name']
    assigned = False
    
    # 检查每个分类的关键词
    for category, keywords in categories.items():
        for keyword in keywords:
            if keyword in product_name:
                product['category'] = category
                assigned = True
                break
        if assigned:
            break
    
    # 如果没有匹配到任何分类，默认分类为收纳
    if not assigned:
        product['category'] = '收纳'

# 保存更新后的数据
with open('src/data/products.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

print('分类更新完成！')
