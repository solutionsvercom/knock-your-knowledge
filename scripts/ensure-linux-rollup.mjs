import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

const pkg = "@rollup/rollup-linux-x64-gnu";
const version = "4.60.0";

if (process.platform !== "linux" || process.arch !== "x64") {
  process.exit(0);
}

const require = createRequire(import.meta.url);
try {
  require(pkg);
  process.exit(0);
} catch {
  console.log(`[build] installing ${pkg}@${version} for Hostinger/Linux`);
  const result = spawnSync(
    "npm",
    ["install", `${pkg}@${version}`, "--no-save", "--no-package-lock"],
    { stdio: "inherit", shell: true }
  );
  process.exit(result.status ?? 1);
}
