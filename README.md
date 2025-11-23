# Cleaner CLI tool 
...existing code...
[![npm version](https://img.shields.io/npm/v/cleaner-cli.svg)](https://www.npmjs.com/package/cleaner-cli)
Cleaner is a CLI tool to move files and folders matching patterns into an archive folder (`bk-archive/YYYY-MM-DD`), preserving structure. It supports dry-run, verbose logging, and optional zipping of the archive. The CLI is robust, safe, and logs all actions.

## Documentation


## Features


## Installation

Clone the repo and install dependencies:


Optionally, install globally to use `cleaner` anywhere:

# Now you can run `cleaner` globally for testing
```

## Usage

```bash
cleaner [sourceFolder] [--dry-run] [--verbose] [--zip] [--pattern "bk-*"] [--patterns "bk-*,bk_*"]
```

### Examples

	```bash
# Cleaner CLI

[![npm version](https://img.shields.io/npm/v/cleaner-cli.svg)](https://www.npmjs.com/package/cleaner-cli)
[![Build Status](https://github.com/bpsingh2022/cleaner/actions/workflows/ci.yml/badge.svg)](https://github.com/bpsingh2022/cleaner/actions)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

Cleaner is an enterprise-grade CLI tool for safely archiving files and folders matching user-defined patterns. It is designed for ongoing development and is not a finished product. Use at your own risk; the author is not responsible for any damages or data loss.

## Disclaimer

**This project is under active development. Use this script at your own risk. The author and contributors are not responsible for any damages, data loss, or other issues resulting from its use. Always test in a safe environment before deploying in production.**

## Documentation


## Features


## Installation
Clone the repo and install dependencies:

```bash
```

Optionally, install globally to use `cleaner` anywhere:
```bash
npm install -g .
# Now you can run `cleaner` from any folder
```

Or use for development:
## Usage

```bash
cleaner [sourceFolder] [--dry-run] [--verbose] [--pattern "bk-*"] [--patterns "bk-*,bk_*"] [--archive "customArchive"]
```

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

## Notes on design & safety


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for release history.

## License

MIT

---
[![npm version](https://img.shields.io/npm/v/cleaner-cli.svg)](https://www.npmjs.com/package/cleaner-cli)


# cleaner

Cleaner is a CLI tool to move files and folders matching patterns into an archive folder (`bk-archive/YYYY-MM-DD`), preserving structure. It supports dry-run, verbose logging, and optional zipping of the archive. The CLI is robust, safe, and logs all actions.

## Documentation

- [User Guide](docs/user-guid.md)
- [Developer Guide](docs/developer-guid.md)

## Features

- Moves files first, then folders (deepest-first)
- Safe move: falls back to copy+delete if needed
- Logs to `bk-backup-log-YYYY-MM-DD.txt` (unless dry-run)

Optionally, install globally to use `cleaner` anywhere:

```bash
npm install -g .
# Now you can run `cleaner` from any folder
```

## Usage

```bash
cleaner [sourceFolder] [--dry-run] [--verbose] [--zip] [--pattern "bk-*"] [--patterns "bk-*,bk_*"]
```

### Examples

- Run in current directory, preview only:
	```bash
	cleaner --dry-run --verbose
	```
- Run on a specific folder, with zipping and custom patterns:
	```bash
	cleaner /projects/myapp --patterns "bk-*,bk_*" --zip
	```
	```bash
	cleaner . --pattern "backups-*" --pattern "old_*" --verbose
	```
## Notes on design & safety

- Never descends into `bk-archive` (skips it entirely)
- All file operations are wrapped in try/catch; falls back to copy+delete if needed
- Logging goes to a file `bk-backup-log-YYYY-MM-DD.txt` (unless dry-run)
- The zip feature uses `archiver` and is only invoked when `--zip` is provided
- Pattern matcher supports `prefix*`, `*suffix`, exact names, and simple contains patterns

## License

Optionally, install globally to use `cleaner` anywhere:
