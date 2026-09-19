---
name: research
description: Investigate a question against high-trust primary sources and capture the findings as a Markdown file in the repo. Use when the user wants a topic researched, docs or API facts gathered, or reading legwork delegated to a background subagent.
whenToUse: use when the user asks to research, look up, investigate, or verify a topic against primary sources.
---

Spin up a **background subagent** (run_in_background: true) to do the research, so you keep working while it reads.

Its job:

1. Investigate the question against **primary sources** (official docs, source code, specs, first-party APIs), not a secondary write-up of them. Use web_search and web_fetch. Follow every claim back to the source that owns it.
2. Write the findings to a single Markdown file, citing each claim's source.
3. Save it where the repo already keeps such notes; match the existing convention, and if there is none, put it somewhere sensible and say where.
4. If the findings are durable project knowledge worth reusing across sessions, archive them with mnemon_document_create and mention the document in the report.

The sub-agent has no access to this conversation - give it a fully self-contained prompt:

1. The question, and what "good" looks like for the answer.
2. Method: web_search to find candidates, web_fetch to read the primary sources; follow every claim to the source that owns it.
3. Check DSH memory first with mnemon_document_search so it doesn't re-derive known findings.
4. Output: one Markdown file (a path you specify) where every claim carries its source URL, plus a 3-5 line summary and the most trustworthy source per conclusion.
