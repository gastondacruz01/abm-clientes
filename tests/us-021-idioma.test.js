// US-021 — Cambiar a idioma Portugués (Jira SCRUM-5)
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const html = fs.readFileSync(path.join(publicDir, 'index.html'), 'utf8');

function cargarI18n() {
  return require(path.join(publicDir, 'i18n.js'));
}

const CLAVES_UI = [
  'titulo',
  'subtitulo',
  'nuevoCliente',
  'editarCliente',
  'nombre',
  'apellido',
  'documento',
  'email',
  'guardar',
  'cancelar',
  'buscar',
  'clientes',
  'colId',
  'colAcciones',
  'sinClientes',
  'editar',
  'eliminar',
  'confirmarEliminar',
  'errorEliminar',
  'errorGuardar',
  'errorConexion',
];

describe('US-021 — Cambiar a idioma Portugués', () => {
  test('Given la UI, Then el menú de idioma incluye la opción Portugués', () => {
    expect(html).toMatch(/id="btn-idioma"/);
    expect(html).toMatch(/id="lang-switcher"/);
    expect(html).toMatch(/data-lang="pt"/);
    expect(html).toMatch(/data-lang="es"/);
    expect(html).toMatch(/Portugu[eé]s/);
    expect(html).toMatch(/Español/);
  });

  test('Escenario 1: Given la UI, When elijo Portugués, Then las etiquetas están en portugués y lang=pt', () => {
    const { TRADUCCIONES, t, aplicarIdioma } = cargarI18n();

    expect(TRADUCCIONES.pt).toBeDefined();
    for (const clave of CLAVES_UI) {
      expect(TRADUCCIONES.pt[clave]).toBeTruthy();
    }

    expect(t('pt', 'titulo')).toBe(TRADUCCIONES.pt.titulo);
    expect(t('pt', 'guardar')).toBe('Salvar');
    expect(t('pt', 'nuevoCliente')).toBe('Novo cliente');
    expect(t('pt', 'nombre')).toBe('Nome');
    expect(t('pt', 'guardar')).not.toBe(t('es', 'guardar'));
    expect(t('pt', 'titulo')).not.toBe(t('es', 'titulo'));
    expect(typeof aplicarIdioma).toBe('function');
  });

  test('Escenario 2: Given la UI en portugués, When elijo Español, Then las etiquetas están en español y lang=es', () => {
    const { TRADUCCIONES, t } = cargarI18n();

    expect(TRADUCCIONES.es).toBeDefined();
    for (const clave of CLAVES_UI) {
      expect(TRADUCCIONES.es[clave]).toBeTruthy();
    }

    expect(t('es', 'titulo')).toBe('ABM de Clientes');
    expect(t('es', 'guardar')).toBe('Guardar');
    expect(t('es', 'nuevoCliente')).toBe('Nuevo cliente');
    expect(t('es', 'titulo')).not.toBe(t('pt', 'titulo'));
  });

  test('Caso borde: Given un idioma no soportado, When se traduce, Then se usa español', () => {
    const { t } = cargarI18n();
    expect(t('xx', 'guardar')).toBe('Guardar');
    expect(t('xx', 'titulo')).toBe('ABM de Clientes');
  });
});
