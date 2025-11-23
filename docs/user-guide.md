## What is Cleaner?
Cleaner is a command-line tool to move files and folders matching patterns into an archive folder (`cleanerArchive/YYYY-MM-DD`). It supports dry-run, verbose logging, and optional zipping.

## Installation

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. (Optional) Install globally:
   ```bash
   npm install -g .
   # Now you can run `cleaner` from any folder
   ```

## Usage

```bash
cleaner [sourceFolder] [--dry-run] [--verbose] [--zip] [--pattern "bk-*"] [--patterns "bk-*,bk_*"]
```

### Flags

### Examples
  ```bash
  cleaner --dry-run --verbose
  ```
  ```bash
  cleaner /projects/myapp --patterns "bk-*,bk_*" --zip
  ```
  ```bash
  cleaner . --pattern "backups-*" --pattern "old_*" --verbose
  ```

## Notes

For developer details, see [Developer Guide](developer-guide.md).

---
## Support
For questions or support, see [CONTRIBUTING.md](../CONTRIBUTING.md).

# User Guide for Cleaner CLI

## What is Cleaner?
Cleaner is a command-line tool to move files and folders matching patterns into an archive folder (`cleanerArchive/YYYY-MM-DD`). It supports dry-run, verbose logging, and automatic zipping of old archive folders. The tool is robust, safe, and logs all actions.

## Disclaimer

**This project is under active development. Use this script at your own risk. The author and contributors are not responsible for any damages, data loss, or other issues resulting from its use. Always test in a safe environment before deploying in production.**

## Installation

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. (Optional) Install globally:
   ```bash
   npm install -g .
   # Now you can run `cleaner` from any folder
   ```

## Usage

```bash
cleaner [sourceFolder] [--dry-run] [--verbose] [--pattern "bk-*"] [--patterns "bk-*,bk_*"] [--archive "customArchive"]
```

### Flags
- `--dry-run`: Preview actions without making changes
- `--verbose`: Detailed logging
- `--pattern`: Add a pattern (repeatable)
- `--patterns`: Add multiple patterns (comma-separated)
- `--archive`: Specify a custom archive folder name

### Examples
- Run in current directory, preview only:
  ```bash
  cleaner --dry-run --verbose
  ```
- Run on a specific folder, with custom patterns:
  ```bash
  cleaner /projects/myapp --patterns "bk-*,bk_*"
  ```
- Use multiple `--pattern` options:
  ```bash
  cleaner . --pattern "backups-*" --pattern "old_*" --verbose
  ```

## Notes
- Never descends into the archive folder (skips it entirely)
- Files are moved first, then folders in deepest-first order
- All file operations are wrapped in try/catch; falls back to copy+delete if needed
- Logging goes to a file `cleaner-log-YYYY-MM-DD.txt` (unless dry-run)
- Old archive folders are zipped automatically
- Pattern matcher supports `prefix*`, `*suffix`, exact names, and simple contains patterns

---
For developer details, see [Developer Guide](developer-guide.md).
