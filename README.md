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

## 4.1 GitHub Pages 一键部署（已配置）
本仓库已内置 GitHub Actions：`.github/workflows/deploy-pages.yml`  
每次 `push` 到 `main` 会自动构建并发布到 GitHub Pages。

### 启用步骤
1. 进入 GitHub 仓库 `Settings -> Pages`
2. `Source` 选择 `GitHub Actions`
3. 推送一次 `main`（或在 `Actions` 页面手动运行 `Deploy to GitHub Pages`）
4. 发布地址通常为：
   - `https://<你的GitHub用户名>.github.io/<仓库名>/`

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

## 7. 后台使用（第一期）
- 访问地址：`/#/admin`
- 默认账号：`wangyan`
- 默认密码：`wangyan1234`
- 首次登录会自动把当前静态内容初始化为可管理数据（已发布状态）

### 可配置管理员账号
可通过环境变量覆盖默认账号密码：

```bash
ADMIN_EMAIL=your_admin_email ADMIN_PASSWORD=your_admin_password npm run dev
```

### 服务器本地持久化目录
后台数据已改为 SQLite + 本地上传目录，不再使用临时目录。可配置：

```bash
APP_BASE_DIR=/var/www/nocode
APP_DATA_DIR=/var/www/nocode/data
APP_UPLOADS_DIR=/var/www/nocode/uploads
APP_BACKUPS_DIR=/var/www/nocode/backups
```

默认（未配置时）会使用当前项目目录下的 `data/`、`uploads/`、`backups/`。

### 每日备份（仅保留最近2份）
已提供脚本：

- `scripts/backup.sh`：手动执行一次备份
- `scripts/install-cron.sh`：安装每天 `03:30` 自动备份的 crontab

常用命令：

```bash
# 手动备份（可先验证）
APP_BASE_DIR=/var/www/nocode /var/www/nocode/scripts/backup.sh

# 安装定时备份（每天03:30）
APP_BASE_DIR=/var/www/nocode /var/www/nocode/scripts/install-cron.sh
```

### 已支持能力
- 仪表盘：模块统计、待发布数量
- 内容管理：列表查询、新建/编辑/删除、发布/下线、自动草稿（每10秒）
- 图片库：上传（自动压缩）、引用查询、批量替换、删除保护
- 线索管理：查看公益报名/项目咨询、状态标记、CSV 导出（Excel 可打开）
- 操作日志：记录后台变更动作
