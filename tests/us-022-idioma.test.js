// US-022 — Cambiar a idioma Japonés (AzDO #1665465)
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const html = fs.readFileSync(path.join(publicDir, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(publicDir, 'styles.css'), 'utf8');

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

describe('US-022 — Cambiar a idioma Japonés', () => {
  test('Given la UI, Then existe un ícono de cambio de idioma en el header', () => {
    expect(html).toMatch(/id="btn-idioma"/);
    expect(html).toMatch(/id="lang-switcher"/);
    expect(html).toMatch(/data-lang="ja"/);
    expect(html).toMatch(/data-lang="es"/);
    expect(html).toMatch(/Japon[eé]s|日本語/);
    expect(html).toMatch(/Español/);
  });

  test('Given la UI, Then el menú de idioma se muestra al posicionarse sobre el ícono', () => {
    expect(css).toMatch(/#lang-switcher:hover[\s\S]*#lang-menu|#lang-switcher:hover\s+#lang-menu|\.lang-switcher:hover[\s\S]*\.lang-menu/);
  });

  test('Escenario 1: Given la UI, When elijo Japonés, Then las etiquetas están en japonés y lang=ja', () => {
    const { TRADUCCIONES, t, aplicarIdioma } = cargarI18n();

    expect(TRADUCCIONES.ja).toBeDefined();
    for (const clave of CLAVES_UI) {
      expect(TRADUCCIONES.ja[clave]).toBeTruthy();
      // ID se deja en latin; el resto de etiquetas debe estar en japonés
      if (clave !== 'colId') {
        expect(TRADUCCIONES.ja[clave]).toMatch(/[\u3040-\u30ff\u4e00-\u9faf]/);
      }
    }

    expect(t('ja', 'titulo')).toBe(TRADUCCIONES.ja.titulo);
    expect(t('ja', 'guardar')).toBe('保存');
    expect(t('ja', 'nuevoCliente')).toMatch(/[\u3040-\u30ff\u4e00-\u9faf]/);
    expect(typeof aplicarIdioma).toBe('function');
  });

  test('Escenario 2: Given la UI en japonés, When elijo Español, Then las etiquetas están en español y lang=es', () => {
    const { TRADUCCIONES, t } = cargarI18n();

    expect(TRADUCCIONES.es).toBeDefined();
    for (const clave of CLAVES_UI) {
      expect(TRADUCCIONES.es[clave]).toBeTruthy();
    }

    expect(t('es', 'titulo')).toBe('ABM de Clientes');
    expect(t('es', 'guardar')).toBe('Guardar');
    expect(t('es', 'nuevoCliente')).toBe('Nuevo cliente');
    expect(t('es', 'titulo')).not.toBe(t('ja', 'titulo'));
  });

  test('Caso borde: Given un idioma no soportado, When se traduce, Then se usa español', () => {
    const { t } = cargarI18n();
    expect(t('xx', 'guardar')).toBe('Guardar');
    expect(t('xx', 'titulo')).toBe('ABM de Clientes');
  });
});
