# Phase 0 — 技术验证（Spike）

**状态**：已完成（基线）  
**目标**：证明 Vite + Three.js + 全屏 Canvas + HTML 叠层在 GitHub Pages 上可行。

## 交付标准

- [x] 全屏 `#scene-canvas` 固定底层渲染
- [x] `initScene(canvas)` 入口，含 `dispose()` 与 `resize`
- [x] 星空粒子（`src/scene/stars.ts`）
- [x] 湖面 Shader 平面（`src/scene/lake.ts`）
- [x] 相机沿 Z 轴缓慢前移（`src/scene/config.ts` → `forwardSpeed`）
- [x] HTML UI 叠层可读、可点击（`#ui-root` + `src/ui/overlay.ts`）

## 关键文件

| 文件 | 职责 |
|------|------|
| `src/scene/index.ts` | 场景组装、渲染循环、生命周期 |
| `src/scene/loop.ts` | `requestAnimationFrame` 封装 |
| `src/scene/config.ts` | 相机、速度、DPR、粒子数量常量 |
| `src/main.ts` | 挂载 UI + 启动场景 |
| `index.html` | `#scene-canvas` + `#ui-root` |

## 可调参数（优化入口）

```ts
// src/scene/config.ts
cameraFov: 52
cameraStartZ: 12
cameraMinZ: -28      // 前移终点；过小会穿模
forwardSpeed: 0.35   // 全局行舟速度
maxDpr: 2            // 视网膜屏性能上限
```

## 本地预览

```bash
# 仓库根目录
docker compose up
# 浏览器 http://localhost:5173/
```

## 验收清单

- [ ] Docker 启动无报错，Canvas 占满视口
- [ ] 星空与湖面可见，画面持续变化（非静态）
- [ ] UI 文字清晰，链接可点击
- [ ] `npm run build` 通过（`web/` 目录）

## 后续阶段依赖

Phase 1 在本阶段之上增加分层插画与视差，不改动 Pages/Docker 流程。
