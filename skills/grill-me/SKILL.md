---
name: grill-me
description: A relentless interview to sharpen a plan or design. User-invoked：type /grill-me when you want the agent to interrogate your plan before it is built.
disable-model-invocation: true
user-invocable: true
---

Treat the text the user typed after /grill-me as the topic. If no topic was given, ask for one with ask_user_question first.

Load the `grilling` skill with the skill tool and follow it for this session.
