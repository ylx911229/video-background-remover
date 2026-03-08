# Cloudflare R2 配置完成 ✅

## 已完成配置

### 1. R2 Bucket
- ✅ Bucket 名称: `video-bg-remover`
- ✅ 区域: APAC
- ✅ 存储类型: Standard
- ✅ 创建时间: 2026-03-08

### 2. API 凭证
- ✅ Account ID: `311fee84adf622c0e40e967b1a5e0af6`
- ✅ Access Key ID: `2bbcead0a0854ea48596f0b0cafe05bd`
- ✅ Secret Access Key: 已配置
- ✅ 测试连接: 成功 ✅

### 3. 代码集成
- ✅ 安装 AWS SDK (`@aws-sdk/client-s3`)
- ✅ 创建 R2 工具类 (`lib/r2.ts`)
- ✅ 上传 API 集成 R2
- ✅ 状态 API 保存结果到 R2
- ✅ 结果 API 从 R2 获取视频

---

## R2 存储结构

```
video-bg-remover/
├── uploads/
│   └── task_xxx/
│       └── 1234567890_abc123.mp4    # 用户上传的原始视频
├── results/
│   └── task_xxx/
│       └── 1234567890_def456.mp4    # AI 处理后的结果
└── test/
    └── 测试文件
```

---

## 文件生命周期

### 上传流程
1. 用户上传视频 → 前端
2. 前端发送到 `/api/upload`
3. API 上传到 R2 (`uploads/task_xxx/`)
4. 生成预签名 URL（7 天有效）
5. 调用 Replicate API 处理

### 处理流程
1. Replicate 处理完成
2. `/api/status` 下载结果
3. 上传到 R2 (`results/task_xxx/`)
4. 保存任务信息到本地 JSON

### 清理策略
- **原始视频**: 24 小时后自动删除
- **处理结果**: 7 天后自动删除
- **任务信息**: 30 天后清理

---

## 环境变量

### 开发环境 (.env.local)
```env
R2_ACCOUNT_ID=311fee84adf622c0e40e967b1a5e0af6
R2_ACCESS_KEY_ID=2bbcead0a0854ea48596f0b0cafe05bd
R2_SECRET_ACCESS_KEY=b5c494f8025680c84cccd1bd765ddf1fc7288ca9147989ce6018efd47d0505fa
R2_BUCKET_NAME=video-bg-remover
```

### 生产环境 (Cloudflare Pages)
在 Cloudflare Pages 设置中添加相同的环境变量。

---

## R2 API 使用

### 上传文件
```typescript
import { uploadToR2, generateFileKey } from '@/lib/r2';

const key = generateFileKey('uploads/task_123', '.mp4');
const buffer = Buffer.from(videoData);
await uploadToR2(key, buffer, 'video/mp4');
```

### 获取预签名 URL
```typescript
import { getSignedUrlFromR2 } from '@/lib/r2';

const url = await getSignedUrlFromR2(key, 3600); // 1 小时有效
```

### 下载文件
```typescript
import { downloadFromR2 } from '@/lib/r2';

const buffer = await downloadFromR2(key);
```

### 删除文件
```typescript
import { deleteFromR2 } from '@/lib/r2';

await deleteFromR2(key);
```

---

## 成本估算

### R2 免费额度
- **存储**: 10 GB/月
- **Class A 操作** (写入): 100 万次/月
- **Class B 操作** (读取): 1000 万次/月
- **出站流量**: 免费（通过 Cloudflare CDN）

### 超出免费额度后
- **存储**: $0.015/GB/月
- **Class A**: $4.50/百万次
- **Class B**: $0.36/百万次

### 预估成本（100 用户/天）
- 存储: 100 视频 × 10MB × 7 天 = 7GB → **免费**
- 写入: 200 次/天 × 30 天 = 6000 次 → **免费**
- 读取: 400 次/天 × 30 天 = 12000 次 → **免费**
- **总成本: $0/月** ✅

---

## 下一步优化

### 1. 自动清理（TODO）
创建 Cloudflare Worker 定时任务：
```javascript
// 每天清理过期文件
export default {
  async scheduled(event, env, ctx) {
    // 删除 24 小时前的 uploads
    // 删除 7 天前的 results
  }
}
```

### 2. CDN 加速（TODO）
配置 R2 Custom Domain：
```
https://cdn.videomatte.com/results/xxx.mp4
```

### 3. 缩略图生成（TODO）
上传时自动生成视频缩略图：
```typescript
// 使用 ffmpeg 生成第一帧
```

---

## 故障排查

### 上传失败
```bash
# 检查环境变量
echo $R2_ACCESS_KEY_ID

# 测试连接
curl -X PUT "https://311fee84adf622c0e40e967b1a5e0af6.r2.cloudflarestorage.com/video-bg-remover/test.txt" \
  --aws-sigv4 "aws:amz:auto:s3" \
  --user "2bbcead0a0854ea48596f0b0cafe05bd:b5c494f8025680c84cccd1bd765ddf1fc7288ca9147989ce6018efd47d0505fa" \
  -d "Hello R2"
```

### 权限错误
- 检查 API Token 权限是否包含 `Object Read & Write`
- 检查 Bucket 名称是否正确

### CORS 错误
- 在 Cloudflare Dashboard 配置 CORS
- 允许来源: `*` 或你的域名

---

**R2 配置完成，可以开始测试完整流程！** 🔥
