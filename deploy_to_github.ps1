# 构建项目
Write-Host "正在构建项目..."
npm run build

# 检查构建是否成功
if ($LASTEXITCODE -ne 0) {
    Write-Host "构建失败，请检查错误信息" -ForegroundColor Red
    exit $LASTEXITCODE
}

# 进入dist目录
Write-Host "进入dist目录..."
Set-Location dist

# 初始化git仓库（如果还没有）
if (-not (Test-Path ".git")) {
    Write-Host "初始化git仓库..."
    git init
}

# 添加远程仓库
Write-Host "添加远程仓库..."
git remote remove origin 2>$null
git remote add origin https://github.com/yangbing612-ui/shop.git

# 添加所有文件
Write-Host "添加所有文件..."
git add .

# 提交更改
$commitMessage = "Deploy: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Write-Host "提交更改: $commitMessage"
git commit -m "$commitMessage" 2>$null

# 推送到master分支
Write-Host "推送到master分支..."
git push -u origin master --force

# 检查推送是否成功
if ($LASTEXITCODE -ne 0) {
    Write-Host "推送失败，请检查网络连接或权限" -ForegroundColor Red
    exit $LASTEXITCODE
}

Write-Host "部署成功！" -ForegroundColor Green

# 返回到项目根目录
Set-Location ..
