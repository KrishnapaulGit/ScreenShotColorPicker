#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

const clientPath = path.join(__dirname, 'client');
const serverPath = path.join(__dirname, 'server');

// Start server
const server = spawn('node', [path.join(serverPath, 'index.js')], {
  stdio: 'inherit',
  shell: true
});

// Start client
setTimeout(() => {
  const client = spawn('npm', ['start'], {
    cwd: clientPath,
    stdio: 'inherit',
    shell: true
  });
}, 2000);

process.on('SIGINT', () => {
  server.kill();
  process.exit();
});
