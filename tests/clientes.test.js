// tests/clientes.test.js — Pruebas funcionales de la API (Jest + Supertest).
// Convención: cada User Story implementada agrega su describe() con el ID de la US.
// Los criterios Gherkin del .docx se traducen 1 a 1 a casos de test (Given/When/Then).

const path = require('path');
const fs = require('fs');

process.env.DB_FILE = path.join(__dirname, 'tmp-clientes.json');

const { createApp } = require('../src/app');
const db = require('../src/data/db');
const request = require('supertest');

const app = createApp();

beforeEach(() => db.reset());
afterAll(() => { try { fs.unlinkSync(process.env.DB_FILE); } catch {} });

describe('Baseline', () => {
  test('GET /api/health responde ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('GET /api/clientes devuelve lista vacía al inicio', async () => {
    const res = await request(app).get('/api/clientes');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

/*
 * ─── Plantilla para las próximas US (la completa el agente Cursor) ───
 *
 * describe('US-001 — Alta de cliente', () => {
 *   test('Given datos válidos, When POST /api/clientes, Then 201 y cliente con id', async () => { ... });
 *   test('Given documento duplicado, When POST, Then 409', async () => { ... });
 * });
 */
