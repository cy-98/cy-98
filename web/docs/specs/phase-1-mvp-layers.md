# Phase 1 — 混合 2.5D MVP（分层 + 整站背景）

**状态**：已完成（占位美术）；待你用真实插画替换  
**目标**：打开站点即见星夜湖、借火岩、老君与青凝，内容叠在毛玻璃 UI 上。

## 交付标准

- [x] 6 层视差平面：sky / rock / qingning / laojun / flame / boatRim
- [x] 各层 `z` + `parallax` 系数（`src/scene/config.ts` → `LAYERS`）
- [x] 程序生成占位纹理（`src/scene/textures.ts`）
- [x] 支持 `public/scene/*.webp` 热替换（加载成功则覆盖占位）
- [x] 整站 UI 改为 overlay（`src/ui/overlay.ts`）

## 资产规范（替换占位时遵循）

将透明背景 WebP 放入 `public/scene/`：

| 文件名 | 内容 | 建议尺寸（宽×高 px） |
|--------|------|----------------------|
| `rock.webp` | 借火岩 + 「借」「火」 | 800×1000 |
| `qingning.webp` | 青凝全身剪影 | 600×1100 |
| `laojun.webp` | 老君 + 烟杆 | 650×1200 |
| `flame.webp` | 火鸟/火焰 | 256×256 |
| `boatRim.webp` | 船舷前景（画面底部弧形） | 1600×500 |

可选 `sky.webp`（若不用程序星空底图）。

**注意**：文件名与 `textures.ts` 中 `loadSceneTexturesFromUrls` 的 id 一致；`boatRim` 不是 `boat-rim`。

## 视差与构图调参

```ts
// src/scene/config.ts — LAYERS 每项
{ id, z, parallax, width, height, x?, y? }
```

| 调参意图 | 改什么 |
|----------|--------|
| 借火岩显得更远/更近 | `rock.z`、`rock.y` |
| 人物分开或靠拢 | `qingning.x` / `laojun.x` |
| 前进时谁动得快 | `parallax`（大=近处感强） |
| 船舷遮挡范围 | `boatRim.width`、`boatRim.y` |

## 参考图对齐检查项

- [ ] 线稿色调：描边 `#6eb8e8` 量级，底 `#061428`（见 `textures.ts` 常量）
- [ ] 借火岩在画面中偏右/居中是否符合参考构图
- [ ] 青凝、老君左右关系与参考一致
- [ ] 火焰位于两人之间偏下

## 验收清单

- [ ] 桌面 Chrome 稳定 60fps（无持续掉帧）
- [ ] 放入一张 `rock.webp` 后刷新，岩体变为真实素材
- [ ] UI 链接（简历、随笔、GitHub）可点
- [ ] 线上 `https://cy-98.github.io/cy-98/` 与本地观感一致（注意 `base` 路径）

## 已知占位局限

- 人物为程序剪影，非最终线稿
- 无独立 `sky.webp` 层文件时仍用 Canvas 生成星空底
