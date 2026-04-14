---
name: "upload-code"
description: "上传源代码到GitHub仓库。触发词：上传代码。设置代理并推送代码到远程仓库。"
---

# 上传代码

## 触发条件
当用户说以下词语时触发：
- 上传代码

## 执行步骤

### 1. 设置代理（Windows PowerShell）
```powershell
set https_proxy=http://127.0.0.1:33210
set http_proxy=http://127.0.0.1:33210
set all_proxy=socks5://127.0.0.1:33210
```

### 2. 推送代码到GitHub
```bash
git add .
git commit -m "自动上传"
git push
```

### 3. 提示上传成功
上传完成后，向用户报告：
- 提交是否成功
- 推送是否成功
- 如有错误，显示错误信息

## 注意事项
- 确保在Windows PowerShell环境下执行
- 代理设置仅对当前终端会话有效
- 如推送失败，检查网络连接或代理设置
