---
name: ask
description: "所有任务的统一入口（一键开始包）。用户输入 /ask 开始：先问清要做什么，给出路线，然后一步一步编排本技能包完成整个任务；/ask 后面可以直接跟需求或问题。User-invoked：type /ask，可后跟一句任务描述。中文触发：ask、开始、帮我做。"
disable-model-invocation: true
user-invocable: true
---

# Ask：一键任务入口

用户在任何项目里输入 `/ask` 开始。**`/ask` 后面可以直接跟具体需求或问题**（如 `/ask 给交易记录加一个导出 CSV 的功能`、`/ask 这个对账偶发丢单，帮我查`）——带描述时跳过提问、直接进入路由表；什么都不带时你主动提问。

你接管整个过程：

1. 搞清楚他要对这个项目做什么
2. 给出清晰的路线和计划
3. 一步一步编排执行，直到任务完成

分工原则：**模型可自动调用的技能由你用 skill 工具直接加载执行；只能用户触发的技能，你给出精确的 `/命令` 让用户敲，敲完后该技能正文注入当轮，你按其执行并在旁边维持整体进度。** 用户随时可以跳过 /ask 直接敲其它命令——其它技能照常独立可用。

## 开场

1. **快速侦察**（不超过 3 个工具调用）：cwd 是否有 `.git`、`README`、`AGENTS.md`/`CONTEXT.md`、`docs/`、`.scratch/`，判断项目是否已跑过 `/setup-matt-pocock-skills`；再查 mnemon 记忆里有没有这个项目的旧档案。
2. **定意图**：
   - `/ask` 后带了描述 → 跳过提问，直接进路由表。
   - 没带 → 用 ask_user_question 问「你想对这个项目做什么？」，选项取路由表大类（推荐项放首位标 `(Recommended)`），另加「其他，我来描述」；或渲染一个 dsh-ui 表单（radio 大类 + textarea 补充 + submit）。
3. 开场只求「做什么 + 走哪条路」，细节留给路线上的技能去问。

## 路由表（按意图选路线）

| 意图（典型说法） | 路线 | 执行方式 |
|---|---|---|
| 新功能 / 改功能 / 新需求 | ① 打磨 → ② 规格 → ③ 拆票 → ④ 逐票实现 | ①让用户敲 `/grill-with-docs`（无仓库则 `/grill-me`）；②③让用户敲 `/to-spec`、`/to-tickets`；④每张票提醒用户**开新会话**敲 `/implement`（内含 tdd + code-review） |
| 修 bug / 坏了 / 慢 / 偶发 / 复现 | `diagnosing-bugs` | 你用 skill 工具直接加载，全程自动执行 |
| issue / 外部 PR 堆积 | `/triage` | 让用户敲 `/triage`，说明处理范围 |
| 大而模糊的目标（一次会话装不下） | `/wayfinder` | 让用户敲 `/wayfinder` + 目标描述 |
| 只想打磨方案 / 拷问想法 | `/grill-me`（无仓库）或 `/grill-with-docs` | 让用户敲对应命令 |
| 架构体检 / 想重构 | `/improve-codebase-architecture` | 让用户敲；报告出来你接手后续讨论 |
| 审查改动（review 分支 / 自 X 以来） | `code-review` | 你用 skill 工具加载，先问清 fixed point |
| 调研 / 查官方文档 / 查资料 | `research` | 你用 skill 工具加载，派后台 subagent，边等边继续 |
| 验证一个逻辑 / UI 想法 | `prototype` | 你用 skill 工具加载 |
| 学一个主题（跨多次会话） | `/teach` | 让用户敲 `/teach` + 主题 |
| 决策只有别人能回答 | `/to-questionnaire` | 让用户敲 |
| 只有人能做的步骤（凭证 / 第三方控制台 / 迁移） | `wizard` | 你用 skill 工具加载，生成向导脚本 |
| 会话太长要交接 | `/handoff` | 让用户敲 `/handoff` + 下一步重点 |
| 正在合并 / 变基冲突 | `resolving-merge-conflicts` | 你用 skill 工具直接加载 |
| 上一句没听懂 | `/wait-what` | 让用户敲 |

## 编排规则

1. 定下路线后立即用 todo_write 建任务清单（一步一条），每完成一步更新状态；用 dsh-ui 的 `steps` 组件把进度展示给用户（`current` 随推进更新）。
2. **模型技能直接跑**：用 skill 工具加载后立即执行，不要要求用户敲命令。
3. **用户技能给命令**：告诉用户「输入 `/xxx`」，并说明敲完会发生什么；用户敲完后按被注入技能的正文执行，执行完回到本编排：更新 todo、展示进度、给出下一步。
4. **一次只推进一步**：做完一步汇报并确认后再走下一步；分叉决策（方案取舍、范围变化）用 ask_user_question 让用户选，不替他做决定。
5. 路线执行中若发现项目没跑过 `/setup-matt-pocock-skills` 而后续要用工单系统（/to-spec、/to-tickets、/triage、/wayfinder），先提醒用户敲它。

## 长任务

预计超过一轮的任务：用 create_goal 包裹（objective 写任务目标），靠自动 continuation 逐轮推进；每轮开始先 get_goal 对齐进度。跨会话的进度用 mnemon_runtime_memory 记 2-3 条（做到哪、下一步、关键约束）。

## 项目记忆

侦察得到的项目关键事实（技术栈、目录结构、用户偏好、已配置的工单系统）写 2-3 条 mnemon_runtime_memory，下次 /ask 直接复用，不问重复问题。

## 收尾

任务完成时：验证结果、用 present 交付产出文件，然后输出一段简短总结（做了什么 + 交付物路径 + 下一步建议）。可复用结论写入记忆。阶段边界的上下文管理（继续 / 新会话 / /handoff / subagent / 压缩）参考 [PHASE-BOUNDARIES.md](PHASE-BOUNDARIES.md)。
