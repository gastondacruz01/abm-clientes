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

describe('US-002 — Detalle de cliente', () => {
  test('Escenario 1: Given cliente con id 1, When GET /api/clientes/1, Then 200 con todos los campos', async () => {
    const cliente = { nombre: 'Juan', apellido: 'Pérez', documento: '30123456', email: 'juan@mail.com' };
    await request(app).post('/api/clientes').send(cliente);

    const res = await request(app).get('/api/clientes/1');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: 1,
      nombre: 'Juan',
      apellido: 'Pérez',
      documento: '30123456',
      email: 'juan@mail.com'
    });
    expect(res.body.creadoEn).toBeDefined();
  });

  test('Escenario 2: Given cliente inexistente, When GET /api/clientes/999, Then 404 con error', async () => {
    const res = await request(app).get('/api/clientes/999');

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Cliente no encontrado');
  });
});

describe('US-003 — Modificación de cliente', () => {
  test('Escenario 1: Given cliente existente, When PUT con datos válidos, Then 200 con actualizadoEn refrescado y creadoEn sin cambios', async () => {
    const cliente = { nombre: 'Juan', apellido: 'Pérez', documento: '30123456', email: 'juan@mail.com' };
    const crear = await request(app).post('/api/clientes').send(cliente);
    const creadoEn = crear.body.creadoEn;

    const modificado = { nombre: 'Juan Carlos', apellido: 'Pérez', documento: '30123456', email: 'jc@mail.com' };
    const res = await request(app).put('/api/clientes/1').send(modificado);

    expect(res.status).toBe(200);
    expect(res.body.nombre).toBe('Juan Carlos');
    expect(res.body.email).toBe('jc@mail.com');
    expect(res.body.creadoEn).toBe(creadoEn);
    expect(res.body.actualizadoEn).toBeDefined();
    expect(new Date(res.body.actualizadoEn).getTime()).toBeGreaterThanOrEqual(new Date(creadoEn).getTime());
  });

  test('Escenario 2: Given cliente inexistente, When PUT /api/clientes/999, Then 404', async () => {
    const modificado = { nombre: 'Nadie', apellido: 'Existe', documento: '99999999', email: 'no@mail.com' };
    const res = await request(app).put('/api/clientes/999').send(modificado);

    expect(res.status).toBe(404);
  });

  test('Escenario 3: Given dos clientes con documentos distintos, When cambio documento del segundo al del primero, Then 409', async () => {
    const cliente1 = { nombre: 'Juan', apellido: 'Pérez', documento: '111', email: 'juan@mail.com' };
    const cliente2 = { nombre: 'Ana', apellido: 'García', documento: '222', email: 'ana@mail.com' };
    await request(app).post('/api/clientes').send(cliente1);
    await request(app).post('/api/clientes').send(cliente2);

    const modificado = { nombre: 'Ana', apellido: 'García', documento: '111', email: 'ana@mail.com' };
    const res = await request(app).put('/api/clientes/2').send(modificado);

    expect(res.status).toBe(409);
  });
});

describe('US-004 — Baja de cliente', () => {
  test('Escenario 1: Given cliente con id 1, When DELETE /api/clientes/1, Then 204 y ya no aparece en GET', async () => {
    const cliente = { nombre: 'Juan', apellido: 'Pérez', documento: '30123456', email: 'juan@mail.com' };
    await request(app).post('/api/clientes').send(cliente);

    const res = await request(app).delete('/api/clientes/1');

    expect(res.status).toBe(204);

    const listado = await request(app).get('/api/clientes');
    expect(listado.body).toHaveLength(0);
  });

  test('Escenario 2: Given cliente inexistente, When DELETE /api/clientes/999, Then 404', async () => {
    const res = await request(app).delete('/api/clientes/999');

    expect(res.status).toBe(404);
  });
});
