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

// Baseline: el botón Guardar avisa que la US-001 todavía no está implementada
document.getElementById('btn-guardar').addEventListener('click', () => {
  const err = document.getElementById('form-error');
  err.textContent = 'Funcionalidad pendiente: implementar US-001 (Alta de cliente).';
  err.classList.remove('hidden');
});

cargarClientes();
