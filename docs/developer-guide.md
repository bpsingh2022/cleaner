
# Developer Guide for Cleaner CLI

## Project Structure

- `bin/cleaner.js`: CLI entry point (with shebang for global usage)
- `src/cleaner.ts`: Main CLI logic (TypeScript)
- `test/cli.test.js`: Automated CLI test
- `temp/`: Test files and folders

## Development Workflow

1. Clone the repository and run `npm install`.
2. For local testing, use `node bin/cleaner.js [args]`.
3. For global CLI, use `npm install -g .` and run `cleaner [args]`.
4. Add new features in `src/cleaner.ts`.
5. Write tests in `test/cli.test.js`.
6. Use verbose and dry-run flags for safe debugging and testing.

## Adding Features
- Add new CLI flags in `src/cleaner.ts`.
- Use robust error handling and logging.
- Keep code DRY, well-commented, and enterprise-ready.
- Document all public APIs and CLI options.

## Testing
- Place test files in `temp/`.
- Run `node test/cli.test.js` to verify CLI behavior.
- Use dry-run and verbose flags for safe testing.

## Publishing
- Ensure the shebang is present in `bin/index.js` for global installs.
- Update `package.json` metadata as needed.
- Freeze all dependencies to stable versions for reproducibility.

## Enterprise Considerations

For more details, see [README.md](../README.md) and [User Guide](user-guide.md).
## Support
For questions or support, see [CONTRIBUTING.md](../CONTRIBUTING.md).
