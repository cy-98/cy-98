# Personal site (`web/`)

Vite + TypeScript + Three.js 个人站（星夜湖 · 借火岩 2.5D 整站背景），部署到 GitHub Pages：**https://cy-98.github.io/cy-98/**

## 场景

- 全屏 WebGL：星空、湖面 shader、相机前移与船摇
- 分层插画：老君、青凝、借火岩、火焰、船舷（程序生成占位，可替换 `public/scene/*.webp`）
- UI 叠层：毛玻璃面板上的导航与说明
- `prefers-reduced-motion` 降低动画；移动端减少粒子数

分阶段说明与调参入口见 **[docs/specs/](./docs/specs/README.md)**（四个 phase spec 文件）。

## 本地预览（Docker）

仓库根目录：

```bash
docker compose up
```

浏览器打开 **http://localhost:5173/**（Compose 中 `VITE_BASE=/`，根路径即可；与线上子路径 `/cy-98/` 不同，仅方便本地开发）。

## 本地开发（已安装 Node）

```bash
cd web
npm ci
npm run dev
```

生产构建与线上路径一致时：

```bash
npm run build
npm run preview
```

默认 `base` 为 `/cy-98/`（见 `vite.config.ts` 中的 `VITE_BASE`）。

## 部署到 GitHub Pages

1. 仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。
2. 将 `main` 分支推送到 GitHub；`web/**` 变更会触发 [`.github/workflows/pages.yml`](../.github/workflows/pages.yml) 构建并发布。

Snk 贡献蛇动画仍由 [`.github/workflows/main.yml`](../.github/workflows/main.yml) 写入 `output` 分支，与 Pages 互不冲突。
