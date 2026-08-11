// routes/clientes.js — Endpoints del ABM de Clientes.
//
// BASELINE: solo está implementado el listado (GET /api/clientes).
// El resto de las operaciones se implementan a través de las User Stories
// definidas en docs/user-stories/ (formato Gherkin):
//
//   US-001  Alta de cliente            → POST   /api/clientes
//   US-002  Detalle de cliente         → GET    /api/clientes/:id
//   US-003  Modificación de cliente    → PUT    /api/clientes/:id
//   US-004  Baja de cliente            → DELETE /api/clientes/:id
//   US-005  Búsqueda y filtrado        → GET    /api/clientes?q=...
//   US-006  Validaciones de negocio    → transversal
//
// Regla del agente: NO implementar un endpoint sin una US aprobada como insumo.

const express = require('express');
const db = require('../data/db');

const router = express.Router();

// Listado de clientes (baseline)
router.get('/', (_req, res) => {
  const state = db.load();
  res.json(state.clientes);
});

// --- US-001: Alta de cliente ---
router.post('/', (req, res) => {
  const { nombre, apellido, documento, email } = req.body;

  const camposFaltantes = [];
  if (!nombre) camposFaltantes.push('nombre');
  if (!apellido) camposFaltantes.push('apellido');
  if (!documento) camposFaltantes.push('documento');
  if (!email) camposFaltantes.push('email');

  if (camposFaltantes.length > 0) {
    return res.status(400).json({ error: `Campo obligatorio faltante: ${camposFaltantes[0]}` });
  }

  const state = db.load();

  const existente = state.clientes.find(c => c.documento === documento);
  if (existente) {
    return res.status(409).json({ error: 'Ya existe un cliente con ese documento' });
  }

  state.seq += 1;
  const nuevoCliente = {
    id: state.seq,
    nombre,
    apellido,
    documento,
    email,
    creadoEn: new Date().toISOString()
  };

  state.clientes.push(nuevoCliente);
  db.save(state);

  res.status(201).json(nuevoCliente);
});

// --- US-003: Modificación de cliente ---
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { nombre, apellido, documento, email } = req.body;

  const state = db.load();
  const index = state.clientes.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Cliente no encontrado' });
  }

  const cliente = state.clientes[index];

  if (documento && documento !== cliente.documento) {
    const duplicado = state.clientes.find(c => c.documento === documento && c.id !== id);
    if (duplicado) {
      return res.status(409).json({ error: 'Ya existe un cliente con ese documento' });
    }
  }

  const clienteActualizado = {
    ...cliente,
    nombre: nombre ?? cliente.nombre,
    apellido: apellido ?? cliente.apellido,
    documento: documento ?? cliente.documento,
    email: email ?? cliente.email,
    actualizadoEn: new Date().toISOString()
  };

  state.clientes[index] = clienteActualizado;
  db.save(state);

  res.json(clienteActualizado);
});

module.exports = router;
