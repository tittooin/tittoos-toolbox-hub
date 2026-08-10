const { execSync } = require('child_process');

try {
  const result = execSync('npx wrangler d1 execute axevora-community --command "PRAGMA table_info(community_users);" --remote --json', { encoding: 'utf-8' });
  console.log(result);
} catch (e) {
  console.error(e.stdout);
  console.error(e.stderr);
}
