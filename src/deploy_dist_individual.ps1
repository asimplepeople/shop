# 进入dist目录
cd dist

git init
git remote add origin https://github.com/asimplepeople/shop.git

# 获取所有文件夹和文件
$items = Get-ChildItem -Path . -Force

# 遍历每个项目
foreach ($item in $items) {
  # 排除.git文件夹
  if ($item.Name -ne ".git") {
    Write-Host "Processing: $($item.Name)"
    
    git add "$($item.Name)"
    git diff --cached --quiet -- "$($item.Name)"
    if ($LASTEXITCODE -eq 0) { 
        Write-Host "✅ 无变更，跳过：$($item.Name)"
        continue 
    }

    git commit -m "Add: $($item.Name)"
    Write-Host "✅ 已提交：$($item.Name)"
    
    git push -f origin master
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ 推送失败：$($item.Name)"
        break
    }
    Start-Sleep -Seconds 1
}

Write-Host "🎉 Deployment completed!"