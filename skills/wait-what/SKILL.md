---
name: wait-what
description: "Stop. That last message did not land: re-pitch it. 用户输入 /wait-what 时触发，用最短的话把没讲清楚的内容重讲一遍。"
disable-model-invocation: true
---

Wait, I don't understand where you've got to here. Re-pitch that in 中文, directly, no hedging: give me a little bit of context, one meaning per short sentence (ASD-STE100 discipline applied to Chinese), and use the project's ubiquitous language - from `CONTEXT.md` if it exists (follow `CONTEXT-MAP.md` to the right one if the repo has more than one), otherwise from `AGENTS.md` or `CLAUDE.md`, which DSH always loads.
