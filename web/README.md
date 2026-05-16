# Personal site (`web/`)

Vite + TypeScript + Three.js 个人站（**星夜湖** — 程序化夜空与湖面），部署到 GitHub Pages：**https://cy-98.github.io/cy-98/**

## 场景

- 全屏 WebGL：星空粒子 + 湖面 shader，镜头缓慢前移（可 Shift+滚轮加速）
- 无外链插画；视觉由 `stars.ts`、`lake.ts` 实时绘制
- UI 叠层：毛玻璃面板上的导航与说明
- `prefers-reduced-motion` 与「简洁模式」降级为静态深蓝渐变

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
