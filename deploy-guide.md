# 相册网站部署指南

## 部署选项对比

| 平台 | 成本 | 优点 | 缺点 |
|------|------|------|------|
| GitHub Pages | 免费 | 完全免费，简单易用 | 国内访问可能较慢 |
| Netlify | 免费 | 自动部署，全球CDN | 免费套餐有流量限制 |
| Vercel | 免费 | 性能优秀，开发友好 | 国内访问可能受限 |
| 腾讯云COS | 极低 | 国内访问快，稳定 | 需要实名认证 |

## GitHub Pages 部署步骤（推荐）

### 1. 准备GitHub账户
- 注册GitHub账号（https://github.com）
- 创建新的代码仓库，名称如 `gallery-website`

### 2. 上传代码到GitHub
```bash
# 初始化Git仓库
git init
git add .
git commit -m "初始提交：相册网站"

# 连接到GitHub仓库
git remote add origin https://github.com/你的用户名/gallery-website.git
git push -u origin main
```

### 3. 启用GitHub Pages
- 进入仓库设置（Settings）
- 找到Pages选项
- 选择部署分支（通常是main）
- 保存后等待几分钟

### 4. 访问网站
- 地址：`https://你的用户名.github.io/gallery-website`
- 部署完成后即可分享给他人访问

## Netlify 部署步骤（备选）

### 1. 注册Netlify账户
- 访问 https://netlify.com
- 使用GitHub账号登录

### 2. 部署网站
- 将代码上传到GitHub
- 在Netlify中选择"New site from Git"
- 连接GitHub仓库
- 自动部署完成

### 3. 自定义域名（可选）
- 在Netlify设置中添加自定义域名
- 配置DNS解析

## 腾讯云COS部署（国内优化）

### 1. 准备腾讯云账户
- 注册腾讯云账号并实名认证
- 开通对象存储（COS）服务

### 2. 上传文件
- 创建存储桶（选择公有读权限）
- 上传所有网站文件到存储桶
- 开启静态网站功能

### 3. 访问地址
- 默认地址：`https://存储桶名称.cos.区域.myqcloud.com`
- 可绑定自定义域名

## 注意事项

1. **图片资源**：当前使用在线图片，实际部署时需要替换为真实图片URL
2. **数据持久化**：当前为前端静态数据，如需动态数据可考虑Supabase等后端服务
3. **域名备案**：国内部署需要域名备案
4. **HTTPS**：所有现代部署平台都自动提供HTTPS

## 推荐方案
- **个人使用**：GitHub Pages（完全免费）
- **正式项目**：腾讯云COS + CDN（成本低，国内访问快）
- **国际用户**：Netlify或Vercel（部署简单，性能好）

选择最适合您需求的方案进行部署！