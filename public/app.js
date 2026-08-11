// app.js (frontend) — BASELINE: solo renderiza el listado.
// Cada User Story agrega su comportamiento (ver docs/user-stories/):
//   US-001 → handler de "Guardar" (alta)
//   US-003 → botón "Editar" por fila + modo edición del formulario
//   US-004 → botón "Eliminar" por fila con confirmación
//   US-005 → filtrado en vivo con el input #buscador

const API = '/api/clientes';

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
        <!-- US-003: botón Editar / US-004: botón Eliminar -->
      </td>`;
    tbody.appendChild(tr);
  }
}

function escapeHtml(str = '') {
  return String(str).replace(/[&<>"']/g, (m) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[m]));
}

// US-001: Alta de cliente
document.getElementById('btn-guardar').addEventListener('click', async () => {
  const nombre = document.getElementById('nombre').value.trim();
  const apellido = document.getElementById('apellido').value.trim();
  const documento = document.getElementById('documento').value.trim();
  const email = document.getElementById('email').value.trim();
  const formError = document.getElementById('form-error');

  formError.classList.add('hidden');

  try {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, apellido, documento, email })
    });

    if (!res.ok) {
      const data = await res.json();
      formError.textContent = data.error || 'Error al guardar el cliente';
      formError.classList.remove('hidden');
      return;
    }

    limpiarFormulario();
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
