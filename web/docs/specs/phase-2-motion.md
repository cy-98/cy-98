# Phase 2 — 动画与氛围

**状态**：已完成（基线）；可按本 spec 微调手感  
**目标**：场景「会呼吸」——坐船、湖动、火与烟，滚轮略加速；移动端与无障碍降级。

## 交付标准

- [x] 相机 bobbing（`bobAmplitude` / `bobFrequency`）
- [x] 湖面波纹 + UV 滚动（`lake.ts` shader + `uScroll`）
- [x] 火焰粒子（`effects.ts` → `createFlameParticles`）
- [x] 老君侧轻烟粒子（`createSmoke`）
- [x] 分层 idle：火焰缩放、人物轻微上下、岩石 opacity 脉动（`layers.ts` → `animateLayers`）
- [x] 滚轮加速行舟（`index.ts` → `onWheel` / `scrollBoost`）
- [x] `prefers-reduced-motion`：停止前移、bob、粒子更新、shader 时变
- [x] 移动端：粒子数减半、`antialias: false`、`low-power`

## 可调参数

```ts
// config.ts
bobAmplitude: 0.08
bobFrequency: 0.45
forwardSpeed: 0.35

// index.ts — 滚轮
scrollBoost 上限约 1.5，衰减见 onWheel timeout
```

```glsl
// lake.ts — 湖面节奏
sin(uv.x * 40.0 + uTime * 1.2)  // ripple 频率
uv.y += uTime * 0.03            // 前进感 UV 漂移
```

```ts
// effects.ts — 粒子数量
starCountMobile / starCountDesktop
flame: mobile 40 / desktop 120
smoke: mobile 25 / desktop 60
```

## 优化任务（建议逐项试）

| 任务 | 文件 | 说明 |
|------|------|------|
| 行舟太快/太慢 | `config.ts` | 降 `forwardSpeed` 或减小滚轮 `deltaY` 系数 |
| 晕船感太强 | `config.ts` | 降 `bobAmplitude` |
| 烟太浓/太淡 | `effects.ts` | `opacity`、`size`、重生高度 |
| 火焰太跳 | `layers.ts` | 减小 `flame` 的 `scale` 正弦幅度 |
| 滚轮干扰阅读 | `index.ts` | 仅在按住某键时加速，或缩小 `scrollBoost` |

## 验收清单

- [ ] 默认自动缓慢前进，无需操作即有动效
- [ ] 滚轮向下略加快，松手后恢复
- [ ] 系统「减少动态效果」开启后，画面基本静止
- [ ] 手机宽度 &lt; 768px 仍可流畅（允许略降帧）
- [ ] 切到后台标签页再回来，动画继续（`visibilitychange`）

## 勿做（避免抢内容）

- 不要用滚轮绑定相机大幅旋转
- 不要全屏闪烁高光
