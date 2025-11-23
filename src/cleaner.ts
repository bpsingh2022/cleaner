#!/usr/bin/env node

/**
 * Cleaner CLI
 * ----------------------------------------------
 * Moves files/folders matching prefix patterns
 * into cleanerArchive/YYYY-MM-DD, preserving structure.
 *
 * Rules:
 * - Only today's archive folder stays unpacked.
 * - Older dated folders automatically get zipped and deleted.
 * - Supports dry-run, verbose logging, user-defined patterns.
 * - Prevents infinite recursion by skipping archive folder.
 */

import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import archiver from "archiver";
import { printBanner } from "./banner";

/* -------------------- CLI ARG PARSING -------------------- */

const rawArgs = process.argv.slice(2);

let opts = {
  source: process.cwd(),
  dryRun: false,
  verbose: false,
  patterns: ["bk-*", "bk_*"],
  archiveName: "cleanerArchive",
  showBanner: true
};

function consumeFlag(name: string): boolean {
  const idx = rawArgs.indexOf(name);
  if (idx >= 0) {
    rawArgs.splice(idx, 1);
    return true;
  }
  return false;
};//endConsumeFlag

function consumeOption(name: string): string | null {
  const idx = rawArgs.indexOf(name);
  if (idx >= 0 && idx + 1 < rawArgs.length) {
    const v = rawArgs[idx + 1];
    rawArgs.splice(idx, 2);
    return v;
  }
  return null;
};//endConsumeOption

// Source path
if (rawArgs.length > 0 && !rawArgs[0].startsWith("-")) {
  opts.source = path.resolve(rawArgs.shift()!);
};//endIf

// Flags
opts.dryRun = consumeFlag("--dry-run") || consumeFlag("-n");
opts.verbose = consumeFlag("--verbose") || consumeFlag("-v");
opts.showBanner = !(consumeFlag("--silent") || consumeFlag("-s"));

// Patterns
let p;
while ((p = consumeOption("--pattern")) !== null) {
  opts.patterns.push(...p.split(",").map(s => s.trim()).filter(Boolean));
};//endWhile
const pList = consumeOption("--patterns");
if (pList) {
  opts.patterns.push(...pList.split(",").map(s => s.trim()).filter(Boolean));
};//endIf

// Custom archive name
const customArchive = consumeOption("--archive");
if (customArchive) opts.archiveName = customArchive;

opts.patterns = [...new Set(opts.patterns)];

/* -------------------- CONSTANTS -------------------- */

const today = new Date().toISOString().slice(0, 10);
const ARCHIVE_BASE = path.join(opts.source, opts.archiveName);
const ARCHIVE_DIR = path.join(ARCHIVE_BASE, today);
const LOG_FILE = path.join(opts.source, `cleaner-log-${today}.txt`);

/* -------------------- LOGGING -------------------- */

function log(msg: string) {
  console.log(msg);
  if (!opts.dryRun) fs.appendFileSync(LOG_FILE, msg + os.EOL);
};//endLog

function verbose(msg: string) {
  if (opts.verbose) log(msg);
};//endVerbose

function err(msg: string) {
  log(`❌ ${msg}`);
};//endErr

/* -------------------- MATCH LOGIC -------------------- */

function makeMatcher(patterns: string[]) {
  const rules = patterns.map(p => {
    const star = p.indexOf("*");
    if (star === -1) return (n: string) => n === p;
    if (star === p.length - 1) return (n: string) => n.startsWith(p.slice(0, -1));
    return (n: string) => n.includes(p.replace("*", ""));
  });

  return (name: string) =>
    name !== opts.archiveName && rules.some(fn => fn(name));
};//endMakeMatcher

const matches = makeMatcher(opts.patterns);

/* -------------------- FILE OPERATIONS -------------------- */

function ensureDir(d: string) {
  if (!opts.dryRun && !fs.existsSync(d)) {
    fs.mkdirSync(d, { recursive: true });
  }
};//endEnsureDir

function safeMove(src: string, dest: string) {
  if (opts.dryRun) return log(`[DRY] Move → ${src} → ${dest}`);

  ensureDir(path.dirname(dest));
  try {
    fs.renameSync(src, dest);
  } catch {
    try {
      copyRecursive(src, dest);
      removeRecursive(src);
    } catch (e: any) {
      return err(`Failed: ${src} → ${dest} (${e.message})`);
    }
  }

  log(`✔ Moved: ${src} → ${dest}`);
};//endSafeMove

function copyRecursive(src: string, dest: string) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    ensureDir(dest);
    for (const f of fs.readdirSync(src)) {
      copyRecursive(path.join(src, f), path.join(dest, f));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
};//endCopyRecursive

function removeRecursive(target: string) {
  if (!fs.existsSync(target)) return;
  const stat = fs.statSync(target);
  if (stat.isDirectory()) {
    for (const f of fs.readdirSync(target)) {
      removeRecursive(path.join(target, f));
    }
    fs.rmdirSync(target);
  } else {
    fs.unlinkSync(target);
  }
};//endRemoveRecursive

/* -------------------- SCAN FOR MATCHES -------------------- */

function scan(start: string) {
  const files: string[] = [];
  const dirs: string[] = [];

  function walk(dir: string) {
    const full = path.resolve(dir);
    if (full.startsWith(path.resolve(ARCHIVE_BASE))) return;

    for (const item of fs.readdirSync(dir)) {
      if (item === opts.archiveName) continue;

      const fullItem = path.join(dir, item);
      const stat = fs.statSync(fullItem);

      if (stat.isDirectory()) {
        if (matches(item)) dirs.push(fullItem);
        else walk(fullItem);
      } else if (stat.isFile() && matches(item)) {
        files.push(fullItem);
      }
    }
  }

  walk(start);
  return { files, dirs };
};//endScan

/* -------------------- ZIP OLD FOLDERS -------------------- */

function zipOldArchives() {
  if (!fs.existsSync(ARCHIVE_BASE)) return;

  const items = fs.readdirSync(ARCHIVE_BASE);

  for (const item of items) {
    const full = path.join(ARCHIVE_BASE, item);
    if (!fs.statSync(full).isDirectory() || item === today) continue;

    const zipPath = `${full}.zip`;
    if (fs.existsSync(zipPath)) continue;

    if (opts.dryRun) {
      log(`[DRY] Would zip: ${item}`);
      continue;
    }

    log(`📦 Zipping old archive: ${item}`);

    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    archive.pipe(output);
    archive.directory(full, item);
    archive.finalize();

    output.on("close", () => {
      removeRecursive(full);
      log(`✔ Archived and cleaned: ${item}`);
    });
  }
};//endZipOldArchives

/* -------------------- MAIN -------------------- */

function run() {
  ensureDir(ARCHIVE_DIR);

  const { files, dirs } = scan(opts.source);

  log(`🔍 Found: ${files.length} files + ${dirs.length} folders matching patterns`);
  log("");

  files.forEach(f => {
    const rel = path.relative(opts.source, f);
    safeMove(f, path.join(ARCHIVE_DIR, rel));
  });

  dirs.sort((a, b) => b.length - a.length).forEach(d => {
    const rel = path.relative(opts.source, d);
    safeMove(d, path.join(ARCHIVE_DIR, rel));
  });

  log("");
  zipOldArchives();
  log("✨ Done.");
};//endRun

  /**showBanner */
if (opts.showBanner) printBanner();

run();
