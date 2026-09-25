#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const [pkg, bump = "prerelease"] = process.argv.slice(2);

if (!pkg) {
  console.error("Usage: release.mts <workspace-name> [npm-version-arg]");
  process.exit(1);
}

const run = (command: string, args: string[]) =>
  execFileSync(command, args, { stdio: "inherit" });

const output = (command: string, args: string[]) =>
  execFileSync(command, args, { encoding: "utf8" }).trim();

run("git", ["checkout", "canary"]);
run("git", ["pull"]);

run("npm", ["run", "lint:types", "-w", pkg]);

run("npm", [
  "version",
  bump,
  "--no-git-tag-version",
  "--preid=canary",
  "-w",
  pkg,
]);

const workspaces = JSON.parse(
  output("npm", ["query", ".workspace", "--json"]),
) as Array<{ name: string; location: string }>;

const workspace = workspaces.find(({ name }) => name === pkg);

if (!workspace) {
  throw new Error(`Workspace not found: ${pkg}`);
}

const repoRoot = output("git", ["rev-parse", "--show-toplevel"]);
const packageJson = JSON.parse(
  readFileSync(resolve(repoRoot, workspace.location, "package.json"), "utf8"),
) as { name: string; version: string };

const { name, version } = packageJson;

console.log(`${name}@${version}`);

run("git", ["add", "-A"]);
run("git", ["commit", "-m", `chore(release): ${name}@${version}`]);

run("git", ["checkout", "main"]);
run("git", ["pull"]);
run("git", ["merge", "--no-ff", "canary", "-m", "Merge branch 'canary'"]);
run("git", ["push"]);

run("git", ["checkout", "canary"]);
run("git", ["merge", "main"]);
run("git", ["push"]);