# 相册展览馆

一个现代化的照片展览网页应用，支持照片分组、分类浏览和详细查看功能。

## 在线演示

[点击查看在线演示（main分支）](https://ybyrzlll.github.io/gallery_gsrx/)
[点击查看天线宝宝版本（happybir分支）](https://ybyrzlll.github.io/gallery_gsrx/)

## 功能特性

- 📸 **照片分组管理** - 每个照片组可自定义索引和封面
- 🏷️ **分类导航** - 左侧分类栏支持快速筛选（婚礼风、学院风、时间分类等）
- 🏠 **首页展示** - 以卡片形式展示各分组封面
- 🔍 **详细浏览** - 点击分组进入详细照片浏览页面
- 🖼️ **模态框查看** - 支持大图查看和照片导航
- 📱 **响应式设计** - 适配桌面和移动设备
- 🔄 **侧边栏折叠** - 可收起/展开分类导航栏

## 项目结构

```
gallery_web/
├── index.html          # 主页面
├── styles.css          # 样式文件
├── script.js           # 交互逻辑
├── data.json           # 示例数据
├── deploy-guide.md     # 部署指南
└── README.md          # 说明文档
```

## 本地运行

1. 下载所有文件到本地
2. 使用本地服务器运行：
   ```bash
   # 使用 Python
   python -m http.server 8000
   
   # 使用 Node.js
   npx http-server
   ```
3. 在浏览器中访问 `http://localhost:8000`

## 部署到网络

### GitHub Pages（推荐，免费）
1. 创建GitHub仓库
2. 上传所有文件到仓库
3. 在仓库设置中启用GitHub Pages
4. 访问：`https://用户名.github.io/仓库名`

详细部署说明请查看 [deploy-guide.md](deploy-guide.md)

## 自定义配置

### 添加新分类
在 `script.js` 的 `galleryData.categories` 数组中添加新分类。

### 添加新照片组
在 `galleryData.groups` 数组中添加新分组。

## 技术特点

- 纯前端实现，无需后端
- 使用现代CSS Grid布局
- 响应式设计，支持移动端
- 键盘导航支持（左右箭头、ESC键）
- 平滑动画过渡效果

## 浏览器支持

支持所有现代浏览器：
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 注意事项

- 当前使用在线图片服务（picsum.photos）作为示例
- 实际使用时请替换为您的真实图片URL
- 支持本地图片文件路径