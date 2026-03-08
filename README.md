# VideoMatte - AI Video Background Remover

AI-powered video background removal tool. Remove video backgrounds without green screen.

## Features

- 🎬 **AI Background Removal** - Powered by Robust Video Matting (RVM)
- ⚡ **Fast Processing** - 1-3 minutes for most videos
- 🔒 **Privacy First** - Videos auto-deleted after 24 hours
- 📱 **Easy to Use** - Drag & drop interface
- 🎨 **Multiple Formats** - WebM (transparent) & MP4 (green screen)

## Tech Stack

- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **AI Processing**: Replicate API (RVM model)
- **Storage**: Cloudflare R2
- **Deployment**: Cloudflare Pages

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Replicate API key
- Cloudflare R2 credentials (optional for MVP)

### Installation

```bash
# Clone the repository
git clone https://github.com/ylx911229/video-background-remover.git
cd video-background-remover

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Add your API keys to .env.local
```

### Environment Variables

```env
# Replicate API
REPLICATE_API_TOKEN=your_replicate_token_here

# Cloudflare R2 (optional for MVP)
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=video-bg-remover
```

### Development

```bash
# Run development server
npm run dev

# Open http://localhost:3000
```

### Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
video-background-remover/
├── app/
│   ├── api/
│   │   ├── upload/          # Video upload endpoint
│   │   └── status/[id]/     # Processing status endpoint
│   ├── processing/[id]/     # Processing page
│   ├── result/[id]/         # Result & download page
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── public/                  # Static assets
├── docs-mvp.md.bak         # MVP requirements (Chinese)
└── package.json
```

## Roadmap

### MVP (Week 1-4)
- [x] Basic UI (upload, processing, result)
- [ ] Replicate API integration
- [ ] Cloudflare R2 storage
- [ ] Video processing pipeline
- [ ] Download functionality

### Phase 2
- [ ] User authentication
- [ ] Payment integration (Stripe)
- [ ] Batch processing
- [ ] 4K support
- [ ] Custom watermark removal

### Phase 3
- [ ] Self-hosted GPU processing
- [ ] API for developers
- [ ] Mobile app
- [ ] Advanced editing features

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Contact

- Author: 姚路行
- Email: yaoluxing@openclaw.com
- GitHub: [@ylx911229](https://github.com/ylx911229)

---

**Built with ❤️ by 小炼炼 🔥**
