const { execSync } = require('child_process');
const output = execSync('npx wrangler d1 execute axevora-community --remote --command="PRAGMA table_info(community_profiles)"', { encoding: 'utf-8', shell: 'cmd.exe' });
console.log(output);
