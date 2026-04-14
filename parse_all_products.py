import os
import json

# 读取现有的products.json
with open('src/data/products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

# 找到当前最大的产品ID
max_id = max(product['id'] for product in products) if products else 0

# 定义产品分类映射
category_map = {
    '收纳': ['收纳箱', '收纳盒', '收纳架', '整理箱', '整理盒', '储物箱', '储物盒'],
    '厨房': ['厨房', '洗菜篮', '保鲜盒', '冷水壶', '泡面碗', '餐具'],
    '浴室': ['浴室', '泡脚桶', '马桶凳', '卫生间'],
    '卧室': ['卧室', '化妆品', '内衣', '首饰', '药盒'],
    '办公室': ['办公室', '桌面', '文件', '书立', '书架'],
    '医疗': ['医药箱', '医疗', '急救箱'],
    '儿童': ['儿童', '玩具', '绘本', '宝宝'],
    '宠物': ['猫窝', '猫粮', '狗粮', '猫笼']
}

# 遍历public目录下所有00_001_开头的文件夹
public_dir = 'public'
for folder_name in os.listdir(public_dir):
    if folder_name.startswith('00_001_'):
        folder_path = os.path.join(public_dir, folder_name)
        if os.path.isdir(folder_path):
            # 提取产品名称（从文件夹名称中）
            product_name = folder_name.replace('00_001_', '').replace(' - 阿里巴巴', '')
            
            # 确定产品分类
            product_category = '收纳'  # 默认分类
            for category, keywords in category_map.items():
                if any(keyword in product_name for keyword in keywords):
                    product_category = category
                    break
            
            # 生成产品ID和modelId
            max_id += 1
            model_id = f"ALB-{max_id:03d}"
            
            # 收集图片和视频
            images = []
            sku_images = []
            description_images = []
            video = None
            
            # 检查主图
            main_images_dir = os.path.join(folder_path, '产品主图')
            if os.path.exists(main_images_dir):
                for img_file in sorted(os.listdir(main_images_dir)):
                    if img_file.endswith(('.jpg', '.jpeg', '.png', '.gif')):
                        img_path = f"/shop/{folder_name}/产品主图/{img_file}"
                        images.append(img_path)
            
            # 检查SKU图片
            sku_images_dir = os.path.join(folder_path, '产品SKU图片')
            if os.path.exists(sku_images_dir):
                for img_file in sorted(os.listdir(sku_images_dir)):
                    if img_file.endswith(('.jpg', '.jpeg', '.png', '.gif')):
                        img_path = f"/shop/{folder_name}/产品SKU图片/{img_file}"
                        sku_images.append(img_path)
            
            # 检查详情图片
            description_images_dir = os.path.join(folder_path, '产品详情图片')
            if os.path.exists(description_images_dir):
                for img_file in sorted(os.listdir(description_images_dir)):
                    if img_file.endswith(('.jpg', '.jpeg', '.png', '.gif')):
                        img_path = f"/shop/{folder_name}/产品详情图片/{img_file}"
                        description_images.append(img_path)
            
            # 检查视频
            video_dir = os.path.join(folder_path, '产品主图视频')
            if os.path.exists(video_dir):
                for video_file in os.listdir(video_dir):
                    if video_file.endswith(('.mp4', '.avi', '.mov')):
                        video_path = f"/shop/{folder_name}/产品主图视频/{video_file}"
                        video = video_path
                        break
            
            # 创建sizes数组
            sizes = []
            if sku_images:
                # 为每个SKU图片创建一个size选项
                for i, img_path in enumerate(sku_images):
                    # 尝试从图片文件名中提取尺寸名称
                    size_name = f"款式{i+1}"
                    img_filename = os.path.basename(img_path)
                    if '咖色' in img_filename:
                        size_name = '咖色'
                    elif '灰色' in img_filename:
                        size_name = '灰色'
                    elif '蓝色' in img_filename:
                        size_name = '蓝色'
                    elif '粉色' in img_filename:
                        size_name = '粉色'
                    
                    sizes.append({
                        'size': size_name,
                        'price': 6900,  # 默认价格
                        'image': img_path
                    })
            else:
                # 如果没有SKU图片，创建一个默认的size选项
                sizes.append({
                    'size': '标准版',
                    'price': 6900,
                    'image': images[0] if images else ''
                })
            
            # 创建产品信息
            product_info = {
                'size': '标准',
                'weight': '1.0kg',
                'color': '多种颜色',
                'material': '塑料',
                'package': '单个装',
                'origin': '中国',
                'warranty': '1年'
            }
            
            # 创建产品数据
            product = {
                'id': max_id,
                'modelId': model_id,
                'name': product_name,
                'description': f'{product_name}，优质材料，耐用环保，设计合理，使用方便。',
                'price': 6900,
                'sizes': sizes,
                'images': images,
                'category': product_category,
                'rating': 4.5,
                'sales': 0,
                'info': product_info,
                'skuImages': sku_images,
                'descriptionImages': description_images
            }
            
            # 添加视频（如果有）
            if video:
                product['video'] = video
            
            # 添加到产品列表
            products.append(product)
            print(f"添加产品: {product_name} (ID: {max_id})")

# 写回products.json
with open('src/data/products.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

print(f"\n成功解析并添加了 {max_id - 71} 个新产品")
print("修改后的产品数据已更新到 src/data/products.json")
