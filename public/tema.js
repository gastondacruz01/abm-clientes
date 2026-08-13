// US-027: tema claro/oscuro persistido en localStorage.
const CLAVE_TEMA = 'abm-tema';
const TEMAS_VALIDOS = ['light', 'dark'];
const TEMA_DEFAULT = 'light';

function normalizarTema(valor) {
  return TEMAS_VALIDOS.includes(valor) ? valor : TEMA_DEFAULT;
}

function leerTema(storage) {
  const store = storage || (typeof localStorage !== 'undefined' ? localStorage : null);
  if (!store || typeof store.getItem !== 'function') return TEMA_DEFAULT;
  try {
    return normalizarTema(store.getItem(CLAVE_TEMA));
  } catch {
    return TEMA_DEFAULT;
  }
}

function marcarOpcionActiva(doc, tema) {
  const selector = doc.getElementById && doc.getElementById('selector-tema');
  if (selector) selector.value = tema;

  const opciones = doc.querySelectorAll
    ? doc.querySelectorAll('[data-theme-option]')
    : [];
  opciones.forEach((btn) => {
    const activa = btn.dataset.themeOption === tema;
    if (btn.classList && typeof btn.classList.toggle === 'function') {
      btn.classList.toggle('active', activa);
    }
    if (typeof btn.setAttribute === 'function') {
      btn.setAttribute('aria-pressed', String(activa));
    }
  });
}

function aplicarTema(tema, doc, storage) {
  const valor = normalizarTema(tema);
  const documentRef = doc || (typeof document !== 'undefined' ? document : null);
  const store = storage || (typeof localStorage !== 'undefined' ? localStorage : null);

  if (documentRef && documentRef.documentElement) {
    documentRef.documentElement.setAttribute('data-theme', valor);
  }
  if (store && typeof store.setItem === 'function') {
    try {
      store.setItem(CLAVE_TEMA, valor);
    } catch {
      // localStorage puede fallar en modo privado; el tema en DOM igual aplica.
    }
  }
  if (documentRef) marcarOpcionActiva(documentRef, valor);

  return valor;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CLAVE_TEMA, TEMAS_VALIDOS, TEMA_DEFAULT, leerTema, aplicarTema, normalizarTema };
}
