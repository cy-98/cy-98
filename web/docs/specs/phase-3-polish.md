# Phase 3 — 打磨与维护

**状态**：进行中（占位音效关闭；真实 WebP 待替换）  
**目标**：高完成度素材、体积与性能达标、可选音效、长期可维护。

## 交付标准

- [ ] 全部 `public/scene/*.webp` 替换为终稿插画（见 Phase 1 资产表）
- [ ] 场景纹理总体积 &lt; 3–5 MB（Pages 友好）
- [ ] Lighthouse 性能：移动端 LCP 可接受（WebGL 场景建议单独测）
- [ ] 弱机 fallback：可选静态海报图（未实现，见下方任务）
- [x] 音效 UI 占位，默认关闭（`overlay.ts` 中 disabled checkbox）
- [ ] 水声：实现后默认 `muted`，需用户勾选才播放

## 性能检查清单

| 项 | 当前实现 | 待优化 |
|----|----------|--------|
| DPR 上限 | `maxDpr: 2` | 低端机可降为 1 |
| 后台暂停 | `visibilitychange` | — |
| Bundle | three ~480KB gzip | 可考虑 CDN 或 manualChunks |
| 纹理 | Canvas 占位 | WebP + 分辨率分级 |
| Draco | 未用 | 若日后 glTF 再引入 |

## 静态 Fallback（建议实现）

当 `matchMedia('(prefers-reduced-motion)')` 或 `navigator.hardwareConcurrency <= 4` 时：

1. 跳过 WebGL，显示 `public/scene/poster.webp` 全屏背景
2. 保留 HTML UI 叠层

实现位置建议：`src/main.ts` 分支调用 `initScene` 前检测。

## 音效 spec（待开发）

```
public/audio/water-ambient.mp3  # 循环水声，&lt; 200KB
```

- `overlay.ts`：启用 checkbox，`new Audio()` 或 Howler
- 默认不自动播放；遵守浏览器自动播放策略
- 设置页持久化：`localStorage.setItem('sound', '1')`

## 体积预算（建议）

| 资产 | 预算 |
|------|------|
| rock.webp | &lt; 800 KB |
| laojun + qingning | 各 &lt; 500 KB |
| flame + boatRim | 各 &lt; 200 KB |
| JS bundle | 已构建约 122 KB gzip |

构建后检查：`ls -la web/dist/assets` 与 `web/dist/scene`。

## 路由折中（可选，性能吃紧时）

| 方案 | 说明 |
|------|------|
| A 维持现状 | 全站 WebGL（当前） |
| B 首页特效 | 仅 `/` 加载 scene，`/about` 静态 |
| C 用户开关 | 「简洁模式」关 WebGL |

## 版权与内容

- 借火岩/老君/青凝若属特定 IP 粉丝向，确认个人非商用范围
- 终稿插画需自有或授权

## 验收清单

- [ ] 替换 WebP 后线上与本地一致
- [ ] `npm run build` 后 `dist` 总体积符合预期
- [ ] 弱机或减动效下有合理降级
- [ ] 音效（若做）默认无声，勾选后才响

## 维护节奏建议

1. 先换 `rock` + 人物两层，验收构图
2. 再换 `flame`、`boatRim`
3. 最后调 Phase 2 动效参数
4. 每轮改完 `docker compose up` 本地看，再 `git push` 触发 Pages
