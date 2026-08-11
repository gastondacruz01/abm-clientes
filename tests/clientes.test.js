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

describe('US-001 — Alta de cliente', () => {
  test('Escenario 1: Given datos válidos, When POST /api/clientes, Then 201 con id y creadoEn, And aparece en GET', async () => {
    const cliente = {
      nombre: 'Juan',
      apellido: 'Pérez',
      documento: '30123456',
      email: 'juan@mail.com'
    };

    const res = await request(app).post('/api/clientes').send(cliente);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(cliente);
    expect(res.body.id).toBe(1);
    expect(res.body.creadoEn).toBeDefined();

    const listado = await request(app).get('/api/clientes');
    expect(listado.body).toHaveLength(1);
    expect(listado.body[0].documento).toBe('30123456');
  });

  test('Escenario 2: Given formulario, When POST sin campo obligatorio, Then 400 con error', async () => {
    const sinNombre = { apellido: 'Pérez', documento: '30123456', email: 'j@mail.com' };
    const sinApellido = { nombre: 'Juan', documento: '30123456', email: 'j@mail.com' };
    const sinDocumento = { nombre: 'Juan', apellido: 'Pérez', email: 'j@mail.com' };
    const sinEmail = { nombre: 'Juan', apellido: 'Pérez', documento: '30123456' };

    const r1 = await request(app).post('/api/clientes').send(sinNombre);
    expect(r1.status).toBe(400);
    expect(r1.body.error).toMatch(/nombre/i);

    const r2 = await request(app).post('/api/clientes').send(sinApellido);
    expect(r2.status).toBe(400);
    expect(r2.body.error).toMatch(/apellido/i);

    const r3 = await request(app).post('/api/clientes').send(sinDocumento);
    expect(r3.status).toBe(400);
    expect(r3.body.error).toMatch(/documento/i);

    const r4 = await request(app).post('/api/clientes').send(sinEmail);
    expect(r4.status).toBe(400);
    expect(r4.body.error).toMatch(/email/i);

    const listado = await request(app).get('/api/clientes');
    expect(listado.body).toHaveLength(0);
  });

  test('Escenario 3: Given cliente existente con documento X, When POST con mismo documento, Then 409', async () => {
    const cliente = { nombre: 'Juan', apellido: 'Pérez', documento: '30123456', email: 'juan@mail.com' };
    await request(app).post('/api/clientes').send(cliente);

    const duplicado = { nombre: 'Pedro', apellido: 'Gómez', documento: '30123456', email: 'pedro@mail.com' };
    const res = await request(app).post('/api/clientes').send(duplicado);

    expect(res.status).toBe(409);
    expect(res.body.error).toBe('Ya existe un cliente con ese documento');
  });
});
