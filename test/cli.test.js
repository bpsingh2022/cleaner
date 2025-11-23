const { spawn } = require('child_process');
const path = require('path');

const cliPath = path.join(__dirname, '../bin/index.js');
const tempDir = path.join(__dirname, '../temp');

console.log('Testing cleaner CLI on temp folder...');

const args = [tempDir, '--dry-run', '--verbose'];
const proc = spawn('node', [cliPath, ...args], { stdio: 'pipe' });

let stdout = '';
let stderr = '';

proc.stdout.on('data', data => {
  stdout += data.toString();
});
proc.stderr.on('data', data => {
  stderr += data.toString();
});

proc.on('close', code => {
  console.log('Exit code:', code);
  console.log('--- STDOUT ---');
  console.log(stdout);
  console.log('--- STDERR ---');
  console.log(stderr);
  if (code !== 0) {
    console.error('Test failed!');
  } else {
    console.log('Test passed!');
  }
});
