// db.js — Capa de persistencia simple basada en archivo JSON.
// Sin dependencias nativas: el repo se levanta en cualquier máquina con Node >= 18.
// En tests se usa una ruta alternativa vía la variable de entorno DB_FILE.

const fs = require('fs');
const path = require('path');

const DB_FILE = process.env.DB_FILE || path.join(__dirname, 'clientes.json');

function load() {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return { seq: 0, clientes: [] };
  }
}

function save(state) {
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
  fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), 'utf-8');
}

function reset() {
  save({ seq: 0, clientes: [] });
}

module.exports = { load, save, reset, DB_FILE };
