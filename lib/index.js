// dsh-mattpocock-skills: bundle mattpocock's skills as a dsh plugin.
// Registers a bundled skill provider scanning this package's skills/ dir
// (rank 600, after project/user roots) via the first-party
// @deepseek-ai/dsh-skill-filesystem provider.
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { FileSystemSkillProvider } from "@deepseek-ai/dsh-skill-filesystem";

export const name = "dsh-mattpocock-skills";

export function apply(ctx) {
  ctx.inject(["skills"], (skillCtx) => {
    let provider;
    skillCtx.skills.registerProvider((control) => {
      provider = new FileSystemSkillProvider(ctx, control, {
        providerName: "mattpocock-bundled",
        includeDefaultRoots: false,
        bundledSkillDir: join(dirname(fileURLToPath(import.meta.url)), "..", "skills"),
        watch: false,
      });
      return provider;
    });
    ctx.effect(function* () {
      yield async () => { provider?.dispose?.(); };
    }, "mattpocock-skills cleanup");
  });
}
