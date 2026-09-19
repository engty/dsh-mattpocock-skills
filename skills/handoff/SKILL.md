---
name: handoff
description: Compact the current conversation into a handoff so a fresh session or subagent can continue the work. User-invoked：type /handoff when the session gets long, when switching context, or before starting a new session for the same work.
disable-model-invocation: true
---

Write a handoff summarising the current conversation so a fresh DSH session (or a subagent_fork child) can continue the work. Produce three layered outputs:

1. **Hot memory** - write 2-4 mnemon_runtime_memory entries: where the work is, the single next action, and any must-know constraint. These are injected into every future turn.
2. **Handoff file** - write one fixed file, `$DSH_HOME/handoff.md`, overwriting any previous version. Never timestamp or accumulate copies: one file, latest state only. Reference long artifacts (specs, plans, ADRs, commits, Mnemon documents) by path or URL; do not duplicate them.
3. **Active goal** - run get_goal; if a goal exists, record its objective and revision in the file so a resumed session can call update_goal resume.

Include a "suggested skills" section, split in two: skills without `disable-model-invocation` can be loaded by the next agent with the skill tool; skills with `disable-model-invocation: true` can only be typed by the human (/name) - list those for the user, not the agent.

Redact any sensitive information, such as API keys, passwords, or personally identifiable information.

If the user passed arguments after /handoff, treat them as a description of what the next session will focus on and tailor the document accordingly. If no argument arrived, ask one question first via ask_user_question about what the next session is for.
