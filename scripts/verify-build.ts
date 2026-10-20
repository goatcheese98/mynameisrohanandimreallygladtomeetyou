import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { spawnSync } from "node:child_process";
import assert from "node:assert/strict";

function build(): void {
  const result = spawnSync("npm", ["run", "build"], { stdio: "inherit" });
  if (result.error) throw result.error;
  assert.equal(result.status, 0, "Static build failed");
}
function manifest(directory = "dist"): Record<string, string> {
  const files: Record<string, string> = {};
  function walk(path: string): void {
    for (const entry of readdirSync(path, { withFileTypes: true }).sort(
      (a, b) => a.name.localeCompare(b.name),
    )) {
      const file = join(path, entry.name);
      assert(!entry.isSymbolicLink(), `Unexpected artifact symlink: ${file}`);
      if (entry.isDirectory()) walk(file);
      else
        files[relative(directory, file)] = createHash("sha256")
          .update(readFileSync(file))
          .digest("hex");
    }
  }
  walk(directory);
  for (const file of [
    "index.html",
    "404.html",
    "_headers",
    "headshot.jpeg",
    "rohan-jasani-resume.pdf",
  ])
    assert(files[file], `Missing deploy artifact: ${file}`);
  assert(
    !readFileSync("dist/404.html", "utf8").includes("<script"),
    "404 must not hydrate the introduction",
  );
  return files;
}
build();
const first = manifest();
build();
assert.deepEqual(
  manifest(),
  first,
  "Repeated builds produced different static artifacts",
);
console.log(
  "Deterministic artifact SHA-256:",
  createHash("sha256").update(JSON.stringify(first)).digest("hex"),
);
