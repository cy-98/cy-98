# Personal site (`web/`)

Vite + TypeScript 个人站，**Drift 星际漫游**作全屏背景（iframe），毛玻璃主页叠层在上，部署到 GitHub Pages：**https://cy-98.github.io/cy-98/**

## 场景

- 全屏 iframe 嵌入 [Drift](https://cy-98.github.io/drift/)（程序化星野 + 湖面）
- 面板外区域可与 Drift 交互（WASD、Enter、Esc 等）
- UI 叠层：毛玻璃面板上的导航与说明；空闲时自动半透明
- 不再使用本仓库内的星夜湖 Three.js 场景（代码仍保留在 `src/scene/`）

分阶段 Spec（HTML）：**[docs/specs/index.html](./docs/specs/index.html)**。项目 Skill：`.cursor/skills/canvas/`。

## 本地预览（Docker）

仓库根目录：

```bash
docker compose up
```

浏览器打开 **http://localhost:5173/**（Compose 中 `VITE_BASE=/`）。

## 本地开发（已安装 Node）

```bash
cd web
npm ci
npm run dev
```

生产构建：

```bash
npm run build
npm run preview
```

默认 `base` 为 `/cy-98/`（见 `vite.config.ts` 中的 `VITE_BASE`）。

## 部署到 GitHub Pages

1. 仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。
2. 将 `main` 分支推送到 GitHub；`web/**` 变更会触发 [`.github/workflows/pages.yml`](../.github/workflows/pages.yml)。
