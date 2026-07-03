# Personal site (`web/`)

Vite + TypeScript 个人站，**Drift 源码**（`web/drift/` 子模块）作全屏背景，毛玻璃主页叠层在上，部署到 GitHub Pages：**https://cy-98.github.io/cy-98/**

## 场景

- 直接引用 [Drift](https://github.com/cy-98/drift) 子模块源码，经 Vite 打包为同源背景（无 iframe）
- 手机端面板外显示触控摇杆与环顾区；电脑端背景仅观赏。Drift 自带 HUD / loading 在嵌入模式下隐藏
- UI 叠层：毛玻璃面板；空闲时自动半透明
- 静态资源（`data/`、`public/`）发布到 `/cy-98/drift/`

### 子模块

```bash
git submodule update --init --recursive
```

更新 Drift：`cd web/drift && git pull origin master`，然后在仓库根目录提交子模块指针。

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
