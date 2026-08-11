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

// --- Los siguientes endpoints se agregan al implementar cada US ---

module.exports = router;
