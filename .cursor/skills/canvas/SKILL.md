---
name: canvas
description: >-
  星夜湖个人站（cy-98/cy-98）专用 Canvas 与 Spec 同步。在展示阶段进度、任务清单、
  实现对照表时使用 Canvas；修改 web/src/scene 或交付项后同步更新
  web/docs/specs/*.html 中的已完成/未完成细项。通用 Canvas 写法见
  ~/.cursor/skills-cursor/canvas/SKILL.md。
---

# 星夜湖项目 · Canvas Skill

## 何时用 Canvas

- 总进度、四阶段任务清单、实现对照表 → 打开 `canvases/xingyehu-spec-progress.canvas.tsx`（若存在）
- 勿用 Markdown 表格堆长清单；HTML spec 保留静态备份

## Canvas 位置

- 工作区 Canvas：`canvases/xingyehu-spec-progress.canvas.tsx`（Cursor 托管目录）
- 若 Canvas 未显示，确认文件在 `~/.cursor/projects/<workspace>/canvases/` 下

## HTML Spec（细粒度清单）

| 文件 | 路径 |
|------|------|
| 索引 | `web/docs/specs/index.html` |
| Phase 0–3 | `web/docs/specs/phase-*.html` |
| 样式 | `web/docs/specs/css/specs.css` |

**无 Markdown spec**；只维护 HTML。重新生成：`node web/scripts/fix-spec-encoding.mjs`。

## 改代码后必须同步 Spec

1. 在对应 `phase-*.html` 将条目标为 `check-done` / `check-todo` / `check-wip`
2. 更新页头进度百分比与 `index.html` 总表
3. 可选：同步 Canvas 中 `TodoItem` 的 `status`

## 场景代码入口

- `web/src/scene/` — Three.js：星空 `stars.ts`、湖面 `lake.ts`
- `web/src/ui/overlay.ts` — 毛玻璃 UI
