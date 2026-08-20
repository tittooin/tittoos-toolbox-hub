const { spawn } = require('child_process');
const fs = require('fs');

const host = 'ubuntu@13.233.13.190';
const remoteCmd = process.argv.slice(2).join(' ') || 'uptime';

let keyPath = 'C:\\Users\\tittoos\\.ssh\\axevora_key';
if (process.env.USE_RSA === '1') {
  keyPath = 'C:\\Users\\tittoos\\.ssh\\axevora_rsa';
}

console.log('[EC2 EXEC] Using Key:', keyPath);
console.log('[EC2 EXEC] Host:', host);
console.log('[EC2 EXEC] Command:', remoteCmd);

const child = spawn('C:\\Windows\\System32\\OpenSSH\\ssh.exe', [
  '-i', keyPath,
  '-o', 'StrictHostKeyChecking=no',
  '-o', 'ConnectTimeout=10',
  '-o', 'BatchMode=yes',
  host,
  remoteCmd
], {
  stdio: 'inherit'
});

child.on('exit', (code) => {
  console.log('[EC2 EXEC] Exit code:', code);
  process.exit(code || 0);
});


