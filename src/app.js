// app.js — Aplicación Express (separada del server para poder testear con Supertest)
const express = require('express');
const path = require('path');
const clientesRouter = require('./routes/clientes');

function createApp() {
  const app = express();
  app.use(express.json());
  app.use(express.static(path.join(__dirname, '..', 'public')));

  // Health check — baseline del proyecto
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', app: 'abm-clientes', version: '0.1.0' });
  });

  // API de clientes — las User Stories (docs/user-stories) van completando estos endpoints
  app.use('/api/clientes', clientesRouter);

  return app;
}

module.exports = { createApp };
