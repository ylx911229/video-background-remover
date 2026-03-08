# 部署指南

## 本地开发

### 1. 安装依赖
```bash
cd ~/project/video-background-remover
npm install
```

### 2. 配置环境变量
```bash
cp .env.example .env.local
```

编辑 `.env.local`，填入你的 API Key：
```env
REPLICATE_API_TOKEN=你的_Replicate_API_Token
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:3000

---

## 部署到 Cloudflare Pages

### 方式一：通过 Cloudflare Dashboard（推荐）

1. **登录 Cloudflare**
   - 访问 https://dash.cloudflare.com/
   - 进入 **Workers & Pages**

2. **连接 GitHub**
   - 点击 **Create application** → **Pages**
   - 点击 **Connect to Git**
   - 选择 **GitHub**，授权访问
   - 选择仓库：`ylx911229/video-background-remover`

3. **配置构建**
   - **Framework preset**: Next.js
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`
   - **Root directory**: `/` (默认)

4. **环境变量**
   点击 **Environment variables**，添加：
   ```
   REPLICATE_API_TOKEN = 你的_Replicate_API_Token
   NEXT_PUBLIC_APP_URL = https://你的域名.pages.dev
   ```

5. **部署**
   - 点击 **Save and Deploy**
   - 等待构建完成（约 2-3 分钟）
   - 获得域名：`xxx.pages.dev`

### 方式二：通过 Wrangler CLI

```bash
# 安装 Wrangler
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 部署
npx wrangler pages deploy .next --project-name=video-bg-remover
```

---

## 部署到 Vercel（备选）

### 1. 安装 Vercel CLI
```bash
npm install -g vercel
```

### 2. 登录并部署
```bash
cd ~/project/video-background-remover
vercel login
vercel
```

### 3. 配置环境变量
在 Vercel Dashboard 添加：
- `REPLICATE_API_TOKEN`
- `NEXT_PUBLIC_APP_URL`

---

## 自动部署

### GitHub Actions（已配置）

每次 push 到 `main` 分支，Cloudflare Pages 会自动：
1. 检测到新 commit
2. 拉取代码
3. 运行 `npm install`
4. 运行 `npm run build`
5. 部署到生产环境

---

## 域名配置

### 1. 在 Cloudflare Pages 绑定自定义域名

1. 进入 Pages 项目设置
2. 点击 **Custom domains**
3. 添加域名（如 `videomatte.com`）
4. 按提示配置 DNS 记录

### 2. DNS 配置示例
```
Type: CNAME
Name: @
Target: video-bg-remover.pages.dev
Proxy: Enabled (橙色云朵)
```

---

## 性能优化

### 1. 启用 Cloudflare CDN
- 自动启用，全球加速

### 2. 图片优化
- 使用 Next.js Image 组件
- 自动 WebP 转换

### 3. 缓存策略
```javascript
// next.config.ts
const nextConfig = {
  images: {
    domains: ['replicate.delivery'],
  },
  async headers() {
    return [
      {
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400',
          },
        ],
      },
    ];
  },
};
```

---

## 监控与日志

### Cloudflare Analytics
- 访问量统计
- 性能监控
- 错误追踪

### Sentry（可选）
```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

---

## 成本估算

### Cloudflare Pages
- **免费额度**:
  - 500 次构建/月
  - 无限请求
  - 无限带宽

### Replicate API
- **按使用计费**:
  - ~$0.021/视频
  - 100 视频/天 = $2.1/天 = $63/月

### 总成本
- 开发阶段: $0-10/月
- 100 用户/天: ~$70/月
- 500 用户/天: ~$320/月

---

## 故障排查

### 构建失败
```bash
# 本地测试构建
npm run build

# 检查日志
cat .next/build-manifest.json
```

### API 调用失败
- 检查 Replicate API Token 是否正确
- 检查环境变量是否设置
- 查看 Cloudflare Pages 日志

### 视频上传失败
- 检查文件大小限制（50MB）
- 检查文件格式（MP4/MOV/WEBM）
- 检查网络连接

---

## 下一步

1. ✅ 本地测试完整流程
2. ✅ 部署到 Cloudflare Pages
3. ⬜ 配置自定义域名
4. ⬜ 添加 Google Analytics
5. ⬜ 实现用户反馈功能
6. ⬜ 优化 SEO

---

**部署完成后，记得测试完整流程！** 🔥
