// US-027 — Tema claro y oscuro
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const html = fs.readFileSync(path.join(publicDir, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(publicDir, 'styles.css'), 'utf8');

function cargarTema() {
  return require(path.join(publicDir, 'tema.js'));
}

function crearStorage(inicial = {}) {
  const data = { ...inicial };
  return {
    getItem: (k) => (Object.prototype.hasOwnProperty.call(data, k) ? data[k] : null),
    setItem: (k, v) => {
      data[k] = String(v);
    },
    _data: data,
  };
}

function crearDom() {
  const htmlEl = {
    attrs: {},
    setAttribute(k, v) {
      this.attrs[k] = v;
    },
    getAttribute(k) {
      return this.attrs[k];
    },
  };
  const selector = { value: '' };
  const opciones = [
    { dataset: { themeOption: 'light' }, classList: { active: false }, ariaPressed: 'false' },
    { dataset: { themeOption: 'dark' }, classList: { active: false }, ariaPressed: 'false' },
  ];
  opciones.forEach((btn) => {
    btn.classList.toggle = (cls, on) => {
      if (cls === 'active') btn.classList.active = !!on;
    };
    btn.setAttribute = (k, v) => {
      if (k === 'aria-pressed') btn.ariaPressed = String(v);
    };
  });
  return {
    documentElement: htmlEl,
    getElementById: (id) => (id === 'selector-tema' ? selector : null),
    querySelectorAll: (sel) => (sel.includes('data-theme-option') ? opciones : []),
    _selector: selector,
    _opciones: opciones,
  };
}

function extraerBgPage(contenido, tema) {
  const re = new RegExp(
    `\\[data-theme=["']${tema}["']\\][^{]*\\{[^}]*--bg-page\\s*:\\s*([^;]+);`,
    's'
  );
  const m = contenido.match(re);
  return m ? m[1].trim() : null;
}

describe('US-027 — Tema claro y oscuro', () => {
  test('Given la UI, Then existe un selector de tema con opciones Claro y Oscuro', () => {
    expect(html).toMatch(/id="selector-tema"/);
    expect(html).toMatch(/data-theme-option="light"|value="light"/);
    expect(html).toMatch(/data-theme-option="dark"|value="dark"/);
    expect(html).toMatch(/Claro/);
    expect(html).toMatch(/Oscuro/);
  });

  test('Escenario 1: Given modo claro, When elijo Oscuro, Then data-theme=dark y el fondo de body es distinto al claro', () => {
    const { aplicarTema, CLAVE_TEMA } = cargarTema();
    const doc = crearDom();
    const storage = crearStorage();

    aplicarTema('light', doc, storage);
    expect(doc.documentElement.getAttribute('data-theme')).toBe('light');

    const aplicado = aplicarTema('dark', doc, storage);

    expect(aplicado).toBe('dark');
    expect(doc.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(storage.getItem(CLAVE_TEMA)).toBe('dark');
    expect(doc._selector.value).toBe('dark');

    const bgClaro = extraerBgPage(css, 'light');
    const bgOscuro = extraerBgPage(css, 'dark');
    expect(bgClaro).toBeTruthy();
    expect(bgOscuro).toBeTruthy();
    expect(bgOscuro).not.toBe(bgClaro);
    expect(css).toMatch(/body\s*\{[^}]*background\s*:\s*var\(--bg-page\)/s);
  });

  test('Escenario 2: Given tema oscuro, When recargo, Then persiste; When elijo Claro y recargo, Then queda claro', () => {
    const { aplicarTema, leerTema, CLAVE_TEMA } = cargarTema();
    const storage = crearStorage();

    aplicarTema('dark', crearDom(), storage);
    expect(storage.getItem(CLAVE_TEMA)).toBe('dark');

    const docTrasReload = crearDom();
    aplicarTema(leerTema(storage), docTrasReload, storage);
    expect(docTrasReload.documentElement.getAttribute('data-theme')).toBe('dark');

    aplicarTema('light', docTrasReload, storage);
    expect(docTrasReload.documentElement.getAttribute('data-theme')).toBe('light');

    const docTrasSegundoReload = crearDom();
    aplicarTema(leerTema(storage), docTrasSegundoReload, storage);
    expect(docTrasSegundoReload.documentElement.getAttribute('data-theme')).toBe('light');
    expect(storage.getItem(CLAVE_TEMA)).toBe('light');
  });

  test('Escenario 3: Given preferencia ausente o inválida, When cargo la pantalla, Then modo claro y Claro activo', () => {
    const { aplicarTema, leerTema, CLAVE_TEMA } = cargarTema();

    const storageVacio = crearStorage();
    expect(leerTema(storageVacio)).toBe('light');

    const storageInvalido = crearStorage({ [CLAVE_TEMA]: 'foo' });
    expect(leerTema(storageInvalido)).toBe('light');

    const doc = crearDom();
    aplicarTema(leerTema(storageInvalido), doc, storageInvalido);

    expect(doc.documentElement.getAttribute('data-theme')).toBe('light');
    expect(doc._selector.value).toBe('light');
    const opcionClaro = doc._opciones.find((o) => o.dataset.themeOption === 'light');
    const opcionOscuro = doc._opciones.find((o) => o.dataset.themeOption === 'dark');
    expect(opcionClaro.classList.active).toBe(true);
    expect(opcionClaro.ariaPressed).toBe('true');
    expect(opcionOscuro.classList.active).toBe(false);
    expect(opcionOscuro.ariaPressed).toBe('false');
  });
});
