# 项目审查发布指南（GitHub + Vercel）

## 1. 本地运行
### NVM 安装
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```

### Node.js 18 安装
```bash
nvm install 18
nvm use 18
```

### 安装依赖与启动
```bash
npm install
npm run dev
```

## 2. 构建命令（用于部署）
```bash
npm run build
```

- 框架：Vite
- 构建输出目录：`build`

## 3. GitHub 发布（公开仓库）
当前目录如果还未初始化 Git，请先执行：

```bash
git init
git add .
git commit -m "chore: prepare review release"
git branch -M main
git remote add origin <你的GitHub仓库地址>
git push -u origin main
```

## 4. Vercel 自动部署
1. 登录 Vercel
2. 选择 `Add New... -> Project`
3. `Import` 你的 GitHub 仓库
4. Build 设置：
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `build`
5. 点击 Deploy，获取 Production URL

## 5. 审查交付信息
把以下信息发送给审查方：
1. GitHub 仓库地址（代码审查）
2. Vercel 线上地址（在线演示）
3. 推荐审查路径：
   - 首页 -> 协会简介 -> 专题视频 -> 关爱产品 -> 教育培训 -> 工作站

## 6. 验收检查清单
- 首页可打开，静态资源无 404
- 顶部导航关键路由可跳转：
  - `/association`
  - `/news`
  - `/notices`
  - `/experts`
  - `/videos`
  - `/products`
  - `/training`
  - `/stations`
- 分页页面可用（讲座回放、视频总览、工作站）
- 页尾相关链接可点击
- 移动端页面布局无明显错位
