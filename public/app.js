// app.js (frontend) — BASELINE: solo renderiza el listado.
// Cada User Story agrega su comportamiento (ver docs/user-stories/):
//   US-001 → handler de "Guardar" (alta)
//   US-003 → botón "Editar" por fila + modo edición del formulario
//   US-004 → botón "Eliminar" por fila con confirmación
//   US-005 → filtrado en vivo con el input #buscador

const API = '/api/clientes';

// US-003: Estado del formulario (modo alta o edición)
let modoEdicion = false;
let clienteEditandoId = null;

async function cargarClientes() {
  const res = await fetch(API);
  const clientes = await res.json();
  renderTabla(clientes);
}

function renderTabla(clientes) {
  const tbody = document.querySelector('#tabla-clientes tbody');
  const empty = document.getElementById('empty-state');
  tbody.innerHTML = '';

  if (!clientes.length) {
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');

  for (const c of clientes) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${c.id}</td>
      <td>${escapeHtml(c.nombre)}</td>
      <td>${escapeHtml(c.apellido)}</td>
      <td>${escapeHtml(c.documento)}</td>
      <td>${escapeHtml(c.email)}</td>
      <td class="acciones">
        <button class="btn-editar" data-id="${c.id}" data-nombre="${escapeHtml(c.nombre)}" data-apellido="${escapeHtml(c.apellido)}" data-documento="${escapeHtml(c.documento)}" data-email="${escapeHtml(c.email)}">Editar</button>
        <!-- US-004: botón Eliminar -->
      </td>`;
    tbody.appendChild(tr);
  }

  document.querySelectorAll('.btn-editar').forEach(btn => {
    btn.addEventListener('click', () => editarCliente(btn.dataset));
  });
}

function escapeHtml(str = '') {
  return String(str).replace(/[&<>"']/g, (m) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[m]));
}

// US-003: Función para entrar en modo edición
function editarCliente(dataset) {
  modoEdicion = true;
  clienteEditandoId = dataset.id;

  document.getElementById('nombre').value = dataset.nombre;
  document.getElementById('apellido').value = dataset.apellido;
  document.getElementById('documento').value = dataset.documento;
  document.getElementById('email').value = dataset.email;

  document.getElementById('form-title').textContent = 'Editar cliente';
  document.getElementById('btn-cancelar').classList.remove('hidden');
  document.getElementById('form-error').classList.add('hidden');
}

// US-003: Función para volver al modo alta
function volverModoAlta() {
  modoEdicion = false;
  clienteEditandoId = null;
  document.getElementById('form-title').textContent = 'Nuevo cliente';
  document.getElementById('btn-cancelar').classList.add('hidden');
  limpiarFormulario();
}

// US-003: Handler del botón Cancelar
document.getElementById('btn-cancelar').addEventListener('click', volverModoAlta);

// US-001 + US-003: Alta y edición de cliente
document.getElementById('btn-guardar').addEventListener('click', async () => {
  const nombre = document.getElementById('nombre').value.trim();
  const apellido = document.getElementById('apellido').value.trim();
  const documento = document.getElementById('documento').value.trim();
  const email = document.getElementById('email').value.trim();
  const formError = document.getElementById('form-error');

  formError.classList.add('hidden');

  try {
    const url = modoEdicion ? `${API}/${clienteEditandoId}` : API;
    const method = modoEdicion ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, apellido, documento, email })
    });

    if (!res.ok) {
      const data = await res.json();
      formError.textContent = data.error || 'Error al guardar el cliente';
      formError.classList.remove('hidden');
      return;
    }

    if (modoEdicion) {
      volverModoAlta();
    } else {
      limpiarFormulario();
    }
    cargarClientes();
  } catch (err) {
    formError.textContent = 'Error de conexión';
    formError.classList.remove('hidden');
  }
});

function limpiarFormulario() {
  document.getElementById('nombre').value = '';
  document.getElementById('apellido').value = '';
  document.getElementById('documento').value = '';
  document.getElementById('email').value = '';
  document.getElementById('form-error').classList.add('hidden');
}

cargarClientes();
