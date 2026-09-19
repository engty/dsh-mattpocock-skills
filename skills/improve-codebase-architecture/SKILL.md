---
name: improve-codebase-architecture
description: Scan a codebase for deepening opportunities, present them as an interactive report, then grill through whichever one you pick. User-invoked：type /improve-codebase-architecture to survey your codebase. 中文触发：架构体检、代码结构优化。
disable-model-invocation: true
user-invocable: true
---

# Improve Codebase Architecture

Surface architectural friction and propose **deepening opportunities**: refactors that turn shallow modules into deep ones. The aim is testability and AI-navigability.

This command is _informed_ by the project's domain model and built on a shared design vocabulary:

- Load the `codebase-design` skill with the skill tool for the architecture vocabulary (**module**, **interface**, **depth**, **seam**, **adapter**, **leverage**, **locality**) and its principles (the deletion test, "the interface is the test surface", "one adapter = hypothetical seam, two = real"). Use these terms exactly in every suggestion, and don't drift into "component," "service," "API," or "boundary."
- The domain language in `CONTEXT.md` gives names to good seams; ADRs in `docs/adr/` record decisions this command should not re-litigate.

## Process

### 1. Explore

**Scope before you scan: YAGNI.** Deepening a module pays off by making future changes to it easier, so put extra weight on the parts of the codebase that have recently changed. Decide *where* to look before you look:

- If the user named a direction (a module, a subsystem, a pain point), take it, and skip the inference below.
- Otherwise, walk back a good stretch of the commit history (`git log --oneline`) to find the codebase's hot spots, the files and areas that keep coming up, and let those paths pull your attention first. If the changes are scattered with no clear hot spot, widen the net.

Read the project's domain glossary (`CONTEXT.md`) and any ADRs in the area you're touching first.

Then spawn a `subagent` to walk the codebase (or several in parallel, one per hot spot). Independent context: the prompt must carry the full codebase-design glossary, the friction questions below, and the relevant CONTEXT.md terms. Don't follow rigid heuristics; explore organically and note where you experience friction:

- Where does understanding one concept require bouncing between many small modules?
- Where are modules **shallow**, with an interface nearly as complex as the implementation?
- Where have pure functions been extracted just for testability, but the real bugs hide in how they're called (no **locality**)?
- Where do tightly-coupled modules leak across their seams?
- Which parts of the codebase are untested, or hard to test through their current interface?

Apply the **deletion test** to anything you suspect is shallow: would deleting it concentrate complexity, or just move it? A "yes, concentrates" is the signal you want.

### 2. Present candidates as an interactive report

Present the candidates **inline in chat** with a dsh-ui fence (or render_ui): one `card` per candidate with:

- **Files**: which files/modules are involved
- **Problem**: why the current architecture is causing friction
- **Solution**: plain English description of what would change
- **Benefits**: explained in terms of locality and leverage, and how tests would improve
- **Before / After diagram**: a `mermaid` or `diagram` component illustrating the shallowness and the deepening
- **Recommendation strength**: one of `Strong`, `Worth exploring`, `Speculative`, rendered as a badge
- **A button per card** ("探索这个") carrying an action, so the user picks in one click and the pick returns to you as a [genui-action] event

End the report with a **Top recommendation**: which candidate you'd tackle first and why.

Optionally, also write the self-contained HTML per [HTML-REPORT.md](HTML-REPORT.md) to `$TMPDIR/architecture-review-<timestamp>.html` as a portable artifact: deliver it with the `present` tool and open it (`open <path>` on macOS). Delete previous reports rather than accumulating copies.

**Use CONTEXT.md vocabulary for the domain, and the codebase-design vocabulary for the architecture.** If `CONTEXT.md` defines "Order," talk about "the Order intake module," not "the FooBarHandler," and not "the Order service."

**ADR conflicts**: if a candidate contradicts an existing ADR, only surface it when the friction is real enough to warrant revisiting the ADR. Mark it clearly in the card (e.g. a warning callout: _"contradicts ADR-0007, but worth reopening because…"_). Don't list every theoretical refactor an ADR forbids.

Do NOT propose interfaces yet. After the report is shown, ask the user: "Which of these would you like to explore?" - via the card buttons, or ask_user_question with the candidate names as options.

### 3. Grilling loop

Once the user picks a candidate, load the `grilling` skill with the skill tool to walk the decision tree with them: constraints, dependencies, the shape of the deepened module, what sits behind the seam, what tests survive.

Side effects happen inline as decisions crystallize; load the `domain-modeling` skill with the skill tool to keep the domain model current as you go:

- **Naming a deepened module after a concept not in `CONTEXT.md`?** Add the term to `CONTEXT.md`. Create the file lazily if it doesn't exist.
- **Sharpening a fuzzy term during the conversation?** Update `CONTEXT.md` right there.
- **User rejects the candidate with a load-bearing reason?** Offer an ADR, framed as: _"Want me to record this as an ADR so future architecture reviews don't re-suggest it?"_ Only offer when the reason would actually be needed by a future explorer to avoid re-suggesting the same thing; skip ephemeral reasons ("not worth it right now") and self-evident ones.
- **Want to explore alternative interfaces for the deepened module?** Load the `codebase-design` skill with the skill tool and use its design-it-twice parallel subagent pattern.

When a candidate is chosen or rejected with a durable reason, record the outcome to a Mnemon document (mnemon_document_create) so future scans don't re-propose the same change.
