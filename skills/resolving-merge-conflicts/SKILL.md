---
name: resolving-merge-conflicts
description: Resolve an in-progress git merge/rebase conflict hunk by hunk, by intent. Use when the user reports a merge or rebase conflict, or says "解决冲突" / "合并冲突".
---

1. **See the current state** of the merge/rebase. Check git history, and the conflicting files.

2. **Find the primary sources** for each conflict. Understand deeply why each change was made, and what the original intent was. Read the commit messages (`git log` / `git show` on each side) and any linked issue/PR context when it exists.

3. **Resolve each hunk.** Preserve both intents where possible. Where incompatible, pick the one matching the merge's stated goal and note the trade-off; if the right intent is genuinely ambiguous, ask the user with ask_user_question (the two intents as options, each with its consequence). Do **not** invent new behaviour. Always resolve; never `--abort`.

4. Discover the project's **automated checks** and run them, typically typecheck, then tests, then format. Fix anything the merge broke.

5. **Finish the merge/rebase.** Stage everything and commit. If rebasing, continue the rebase process until all commits are rebased.

## Regression gate

After resolving, always run the **full test suite including golden/regression tests**. In repos like OKX_DBEMA, conflicts in signal generation, K-line handling, or replay code can silently break 推演/实盘 consistency: a green unit suite without the golden suite is not a green merge.
