# 借火岩星夜湖 — 分阶段 Spec

本目录四个文件对应实现计划的四个阶段，用于指导后续优化（不修改根目录 plan 文件）。

| Spec | 阶段 | 状态 |
|------|------|------|
| [phase-0-spike.md](./phase-0-spike.md) | 技术验证：Canvas / 星空 / 湖面 / 相机 | 已完成 |
| [phase-1-mvp-layers.md](./phase-1-mvp-layers.md) | 2.5D 分层 + WebP 替换 + UI 叠层 | 占位完成，待美术 |
| [phase-2-motion.md](./phase-2-motion.md) | 动画、滚轮、无障碍、移动端 | 已完成基线 |
| [phase-3-polish.md](./phase-3-polish.md) | 终稿素材、性能、音效、fallback | 进行中 |

## 本地预览

```bash
# 在仓库根目录 cy-98-github-profile/
docker compose up
```

浏览器打开 **http://localhost:5173/**（Docker 内 `VITE_BASE=/`）。

若已安装 Node：

```bash
cd web
npm ci
npm run dev
# 生产路径预览：npm run build && npm run preview
# 访问 http://localhost:5173/cy-98/
```

## 相关代码入口

- 场景：`web/src/scene/`
- UI：`web/src/ui/overlay.ts`
- 资产目录：`web/public/scene/`
