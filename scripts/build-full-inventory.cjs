const fs = require('fs');
const path = require('path');

const dir1 = path.join(__dirname, '../functions/api/commerce/data');
const dir2 = path.join(__dirname, '../src/data');

if (!fs.existsSync(dir1)) fs.mkdirSync(dir1, { recursive: true });
if (!fs.existsSync(dir2)) fs.mkdirSync(dir2, { recursive: true });

// Read the inventory definition
const inventoryPath = path.join(__dirname, '../functions/api/commerce/daily-catalog.ts');
// Let's create functions/api/commerce/data/catalogInventory.ts
fs.copyFileSync(path.join(__dirname, '../scripts/build-full-inventory.cjs'), path.join(dir1, 'temp.js'));
