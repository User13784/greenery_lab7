const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const backupPath = path.join(__dirname, 'backup.sql');

if (!fs.existsSync(dbPath)) {
  console.error('❌ Файл database.sqlite не найден');
  process.exit(1);
}

fs.copyFileSync(dbPath, backupPath);
console.log(`✅ Backup сохранён: ${backupPath}`);