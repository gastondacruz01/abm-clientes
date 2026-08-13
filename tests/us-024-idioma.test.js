// US-024 — Cambiar a idioma Chino (Jira SCRUM-7)
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

describe('US-024 — Cambiar a idioma Chino', () => {
  test('Given la UI, Then el menú de idioma incluye la opción Chino', () => {
    expect(html).toMatch(/id="btn-idioma"/);
    expect(html).toMatch(/id="lang-switcher"/);
    expect(html).toMatch(/data-lang="zh"/);
    expect(html).toMatch(/data-lang="es"/);
    expect(html).toMatch(/Chino/);
    expect(html).toMatch(/Español/);
  });

  test('Escenario 1: Given la UI, When elijo Chino, Then las etiquetas están en chino y lang=zh', () => {
    const { TRADUCCIONES, t, aplicarIdioma } = cargarI18n();

    expect(TRADUCCIONES.zh).toBeDefined();
    for (const clave of CLAVES_UI) {
      expect(TRADUCCIONES.zh[clave]).toBeTruthy();
      if (clave !== 'colId') {
        expect(TRADUCCIONES.zh[clave]).toMatch(/[\u4e00-\u9fff]/);
      }
    }

    expect(t('zh', 'titulo')).toBe(TRADUCCIONES.zh.titulo);
    expect(t('zh', 'guardar')).toBe('保存');
    expect(t('zh', 'nuevoCliente')).toMatch(/[\u4e00-\u9fff]/);
    expect(t('zh', 'titulo')).not.toBe(t('ja', 'titulo'));
    expect(typeof aplicarIdioma).toBe('function');
  });

  test('Escenario 2: Given la UI en chino, When elijo Español, Then las etiquetas están en español y lang=es', () => {
    const { TRADUCCIONES, t } = cargarI18n();

    expect(TRADUCCIONES.es).toBeDefined();
    for (const clave of CLAVES_UI) {
      expect(TRADUCCIONES.es[clave]).toBeTruthy();
    }

    expect(t('es', 'titulo')).toBe('ABM de Clientes');
    expect(t('es', 'guardar')).toBe('Guardar');
    expect(t('es', 'nuevoCliente')).toBe('Nuevo cliente');
    expect(t('es', 'titulo')).not.toBe(t('zh', 'titulo'));
  });

  test('Caso borde: Given un idioma no soportado, When se traduce, Then se usa español', () => {
    const { t } = cargarI18n();
    expect(t('xx', 'guardar')).toBe('Guardar');
    expect(t('xx', 'titulo')).toBe('ABM de Clientes');
  });
});
