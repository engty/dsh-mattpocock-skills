# dsh-mattpocock-skills

**Matt Pocock 的工程/生产力技能包（25 个），已本地化并增强为 DeepSeek Harness（dsh）专用版。**

来源：[mattpocock/skills](https://github.com/mattpocock/skills)（commit c55ee46，MIT），已按 dsh 的机制体系逐 skill 定制：所有 Claude Code 专有机制被替换为 dsh 原生能力，并接入 dsh 独有机制做了增强。

## 一键安装

```bash
# npm 发布后：
dsh plugin --profile web add dsh-mattpocock-skills

# 或直接从 GitHub 装（无需 npm）：
dsh plugin --profile web add github:<owner>/dsh-mattpocock-skills
```

安装后新开会话即生效（skill catalog 自动刷新，无需重启 dsh）。卸载：`dsh plugin --profile web remove dsh-mattpocock-skills`。

> 装了这个包之后，不要再把这 25 个 skill 手工放进 `$DSH_HOME/skills`，否则会出现同名重复（bundled rank 600 与 user-dsh rank 400 同名时，rank 400 胜出、bundled 副本被遮蔽，无害但冗余）。

## 包含的 25 个 skill

**模型可自动调用（11 个）**：`code-review`、`codebase-design`、`diagnosing-bugs`、`domain-modeling`、`grilling`、`prototype`、`research`、`resolving-merge-conflicts`、`tdd`、`wizard`、`writing-for-agents`

**用户输入 `/名字` 触发（14 个）**：`ask-matt`、`grill-me`、`grill-with-docs`、`handoff`、`implement`、`improve-codebase-architecture`、`setup-matt-pocock-skills`、`teach`、`to-questionnaire`、`to-spec`、`to-tickets`、`triage`、`wait-what`、`wayfinder`

## 与原版的差异（本地化定制）

| 原版（Claude Code 向） | 本包（dsh 向） |
|---|---|
| "Call the Skill tool with X" | `skill` 工具按名加载 |
| Task tool / sub-agents / background agent | `subagent` / `subagent_fork`（后台并行） |
| `/clear`、`/compact` 命令 | 新会话 ≈ /clear；`/handoff` + mnemon 记忆 ≈ /compact |
| HITL bash `read` 交互 | `ask_user_question`（带选项）/ GenUI 表单 |
| HTML 临时报告 | GenUI 内联交互报告（card/badge/diagram/button） |
| gh 硬绑的 secret 落点 | `SECRET_BACKEND` 可插拔（gh / keychain / none） |
| CLAUDE.md 优先 | AGENTS.md 优先（dsh 两文件都加载） |
| `agents/openai.yaml`（Codex 注册表） | 删除，语义由 frontmatter 承载 |

**dsh 独有能力接入**：mnemon 记忆（handoff 三层交接、research 归档、bug 档案）、goal 长任务（to-tickets/wayfinder 逐票推进）、GenUI（grilling 卷子判分、code-review 双轴报告、triage 表格审批、teach 随堂 quiz）。

frontmatter 全部合规：kebab-case `name` + `description`（含中文触发词），`disable-model-invocation`/`user-invocable`/`whenToUse` 为 dsh 原生字段。

## 打包原理

- `lib/index.js`：一个薄 cordis 插件，用第一方 `@deepseek-ai/dsh-skill-filesystem` 的 `FileSystemSkillProvider` 以 `includeDefaultRoots: false + bundledSkillDir: <包内 skills/>` 注册 provider（rank 600，最低优先级，不遮蔽用户/项目自带 skill）。
- `cordis.patch.yml`：把本插件行 insert 进 profile 组合层；`dsh plugin add` 检测到 `dsh.bundle.patch` 声明后自动 reconcile 进 `dsh.profile.bundles`。
- `skills/`：25 个 skill 的完整目录（SKILL.md + 辅助文件）。

## License

MIT。Portions derived from [mattpocock/skills](https://github.com/mattpocock/skills) © Matt Pocock, MIT.
