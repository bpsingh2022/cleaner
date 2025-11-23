import * as os from 'os';

export function printBanner() {
  const banner = `
====================================
           CLEANER CLI
   Keep your workspace clean.
    Automate your backups.
====================================
`;

  // Try aligning the banner center if terminal width is available
  const width = process.stdout.columns || 0;

  if (width > banner.length) {
    const lines = banner.trim().split(os.EOL);
    for (const line of lines) {
      const pad = Math.floor((width - line.length) / 2);
      console.log(' '.repeat(pad) + line);
    }
  } else {
    console.log(banner);
  }

  console.log(); // blank line after banner
}
