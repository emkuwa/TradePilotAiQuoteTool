#!/usr/bin/env node
/**
 * Watch project files; after each change (debounced), run: git add . && git commit && git push origin main
 * Run: node scripts/auto-push-on-edit.js
 * Stop: Ctrl+C
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const DEBOUNCE_MS = 4000;
const COMMIT_MSG = "Auto: save from Cursor";

let timeout = null;

function run(cmd) {
  try {
    execSync(cmd, { cwd: root, stdio: "pipe" });
    return true;
  } catch (e) {
    return false;
  }
}

function push() {
  run("git add .");
  try {
    execSync("git diff --staged --quiet", { cwd: root, stdio: "pipe" });
    return;
  } catch (_) {}
  try {
    execSync(`git commit -m "${COMMIT_MSG}"`, { cwd: root, stdio: "pipe" });
    execSync("git push origin main", { cwd: root, stdio: "inherit" });
    console.log("[auto-push] Pushed to GitHub at", new Date().toLocaleTimeString());
  } catch (_) {}
}

function schedule() {
  if (timeout) clearTimeout(timeout);
  timeout = setTimeout(push, DEBOUNCE_MS);
}

try {
  fs.watch(root, { recursive: true }, (e, filename) => {
    if (!filename || filename.includes(".git") || filename.includes("node_modules")) return;
    schedule();
  });
} catch (err) {
  console.error("Watch failed:", err.message);
  process.exit(1);
}

console.log("Watching for edits. Every save will auto commit + push after", DEBOUNCE_MS / 1000, "s. Stop with Ctrl+C.");
