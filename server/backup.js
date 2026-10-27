const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
require('dotenv').config();

const backupPath = path.join(__dirname, 'backup.sql');

(async () => {
  // Подключение к PostgreSQL
  const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'mainpasswordpostgre',
    database: process.env.DB_NAME || 'pharmacy_db',
    logging: false
  });

  let output = '';
  output += `-- Backup базы данных «Аптечный склад» (lab7 + lab8)\n`;
  output += `-- Дата: ${new Date().toISOString()}\n`;
  output += `-- СУБД: PostgreSQL\n\n`;
  output += `SET client_encoding = 'UTF8';\n`;
  output += `BEGIN;\n\n`;

  // Порядок: сначала «родители», потом «дети»
  const tables = ['Pharmacies', 'Medicines', 'Orders', 'Purchases', 'Users'];

  for (const table of tables) {
    // Проверяем, существует ли таблица
    const [exists] = await sequelize.query(
      `SELECT to_regclass('public."${table}"') AS t;`
    );

    if (!exists[0].t) {
      output += `-- Таблица "${table}" не найдена, пропускаем.\n\n`;
      continue;
    }

    output += `-- ═══════════════════════════════════════\n`;
    output += `-- Таблица: ${table}\n`;
    output += `-- ═══════════════════════════════════════\n`;
    output += `DROP TABLE IF EXISTS "${table}" CASCADE;\n\n`;

    // ────────────────────────────────────
    // 1. Схема таблицы (CREATE TABLE)
    // ────────────────────────────────────
    const [columns] = await sequelize.query(`
      SELECT 
        column_name, 
        data_type, 
        character_maximum_length, 
        numeric_precision,
        numeric_scale,
        is_nullable, 
        column_default
      FROM information_schema.columns
      WHERE table_name = '${table}'
        AND table_schema = 'public'
      ORDER BY ordinal_position;
    `);

    if (columns.length > 0) {
      const colDefs = columns.map(c => {
        let type = c.data_type;
        // Уточняем тип
        if (type === 'character varying' && c.character_maximum_length) {
          type = `varchar(${c.character_maximum_length})`;
        } else if (type === 'numeric' && c.numeric_precision) {
          type = `numeric(${c.numeric_precision},${c.numeric_scale || 0})`;
        } else if (type === 'timestamp with time zone') {
          type = 'timestamptz';
        } else if (type === 'timestamp without time zone') {
          type = 'timestamp';
        } else if (type === 'integer') {
          type = 'integer';
        } else if (type === 'character varying') {
          type = 'varchar(255)';
        }

        let def = `"${c.column_name}" ${type}`;

        // NOT NULL
        if (c.is_nullable === 'NO') def += ' NOT NULL';

        // DEFAULT
        if (c.column_default) {
          const defVal = c.column_default;
          // Для SERIAL и sequence
          if (defVal.includes('nextval')) {
            def = `"${c.column_name}" SERIAL`;
            if (c.is_nullable === 'NO') def += ' NOT NULL';
          } else {
            def += ` DEFAULT ${defVal}`;
          }
        }

        return def;
      }).join(',\n  ');

      // Получаем первичный ключ
      const [pk] = await sequelize.query(`
        SELECT a.attname AS column_name
        FROM pg_index i
        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
        WHERE i.indrelid = 'public."${table}"'::regclass AND i.indisprimary;
      `);

      let tableDef = `CREATE TABLE "${table}" (\n  ${colDefs}`;

      if (pk.length > 0) {
        const pkCols = pk.map(p => `"${p.column_name}"`).join(', ');
        tableDef += `,\n  PRIMARY KEY (${pkCols})`;
      }

      tableDef += `\n);\n\n`;
      output += tableDef;
    }

    // ────────────────────────────────────
    // 2. Данные (INSERT)
    // ────────────────────────────────────
    const [rows] = await sequelize.query(`SELECT * FROM "${table}";`);

    if (rows.length > 0) {
      const cols = Object.keys(rows[0]);
      const colList = cols.map(c => `"${c}"`).join(', ');

      for (const row of rows) {
        const values = cols.map(c => {
          const v = row[c];
          if (v === null || v === undefined) return 'NULL';
          if (typeof v === 'number') return v;
          if (typeof v === 'boolean') return v ? 'TRUE' : 'FALSE';
          if (v instanceof Date) {
            return `'${v.toISOString().replace('T', ' ').replace('Z', '+00')}'`;
          }
          // Экранируем одинарные кавычки
          return `'${String(v).replace(/'/g, "''")}'`;
        }).join(', ');

        output += `INSERT INTO "${table}" (${colList}) VALUES (${values});\n`;
      }
      output += `\n`;
    } else {
      output += `-- Таблица "${table}" пуста\n\n`;
    }

    // ────────────────────────────────────
    // 3. Обновляем счётчик SERIAL
    // ────────────────────────────────────
    output += `-- Обновляем счётчик SERIAL для "${table}"\n`;
    output += `SELECT setval(pg_get_serial_sequence('"${table}"', 'id'), `;
    output += `COALESCE((SELECT MAX(id) FROM "${table}"), 0) + 1, false);\n\n`;
  }

  output += `COMMIT;\n`;

  // Пишем в файл
  fs.writeFileSync(backupPath, output, 'utf8');

  // Сводка
  const size = (fs.statSync(backupPath).size / 1024).toFixed(1);
  const totalRows = output.split('\n').filter(l => l.startsWith('INSERT')).length;

  console.log(`✅ Backup сохранён: ${backupPath} (${size} КБ)`);
  console.log(`   СУБД: PostgreSQL`);
  console.log(`   Таблиц: ${tables.length}`);
  console.log(`   Строк всего: ${totalRows}`);

  await sequelize.close();
})().catch(err => {
  console.error('❌ Ошибка backup:', err.message);
  process.exit(1);
});