# 🧹 Cleaner CLI

[![npm version](https://img.shields.io/npm/v/cleaner-cli.svg)](https://www.npmjs.com/package/cleaner-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Cleaner is a simple yet powerful CLI tool for organizing and archiving files based on patterns.
It preserves folder structure, supports dry-run mode, verbose logs, and optional ZIP compression — making it useful for cleaning backups, outdated builds, logs, or messy project directories.

---

## ⚠️ Disclaimer

> **This tool is under active development. Use carefully.**
> Always test in a safe environment before running it on important data.
> The author assumes **no responsibility for unintended modifications or data loss.**

---

## 📚 Documentation

* 📘 **User Guide** → [docs/user-guide.md](docs/user-guide.md)
* 🛠 **Developer Guide** → [docs/developer-guide.md](docs/developer-guide.md)

---

## ✨ Features

* Archive files and folders matching one or multiple patterns
* Preserves directory structure inside `bk-archive/YYYY-MM-DD/`
* Supports:

  * `--dry-run` (simulation mode)
  * `--verbose` (detailed logs)
  * `--zip` (optional archive compression)
* Logs all actions to:
  `bk-backup-log-YYYY-MM-DD.txt`
* Safe move strategy with fallback copy-delete
* Automatically ignores its own archive folder

---

## 📦 Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/bpsingh2022/cleaner.git
cd cleaner
npm install
```

### Optional: Install globally

```bash
npm install -g .
cleaner --help
```

---

## 🛠 Usage

```bash
cleaner [sourceFolder] 
        [--dry-run] 
        [--verbose] 
        [--zip] 
        [--pattern "bk-*"] 
        [--patterns "bk-*,logs*,dist"]
        [--archive "my-archive"]
```

---

### 💡 Examples

Preview actions without making changes:

```bash
cleaner --dry-run --verbose
```

Archive multiple pattern groups with zipping:

```bash
cleaner /projects/myapp --patterns "bk-*,logs*,dist" --zip
```

Use repeated `--pattern` flags:

```bash
cleaner . --pattern "backup-*" --pattern "old_*" --verbose
```

---

## 🧠 Design Notes

* **Never enters:** `bk-archive`
* **Error-safe:** all operations wrapped in try/catch
* **ZIP mode:** enabled only when `--zip` is supplied
* **Pattern support:** prefix, suffix, contains, exact names

---

## 📄 License

This project is licensed under the **MIT License**.
See: [LICENSE](LICENSE)
