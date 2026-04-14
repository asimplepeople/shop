---
name: "deploy-project"
description: "部署项目到GitHub仓库。触发词：部署项目、发布、一键部署。执行打包、设置代理并推送到远程仓库。"
---

# 部署项目

## 触发条件
当用户说以下任一词语时触发：
- 部署项目
- 发布
- 一键部署

## 执行步骤

### 1. 项目打包
```bash
npm run build
```

### 2. 跳转到dist目录
```bash
cd dist
```

### 3. 设置代理（Windows PowerShell）
```powershell
set https_proxy=http://127.0.0.1:33210
set http_proxy=http://127.0.0.1:33210
set all_proxy=socks5://127.0.0.1:33210
```

### 4. 推送打包产物到GitHub
```bash
git add .
git commit -m "自动部署"
git push
```

### 5. 提示部署成功
部署完成后，向用户报告：
- 打包是否成功
- 推送是否成功
- 如有错误，显示错误信息

## 注意事项
- 确保在Windows PowerShell环境下执行
- 代理设置仅对当前终端会话有效
- 如推送失败，检查网络连接或代理设置
