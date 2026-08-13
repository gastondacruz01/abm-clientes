// US-020 — Hover de botones en verde (Jira SCRUM-1)
const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'public', 'styles.css');
const css = fs.readFileSync(cssPath, 'utf8');

function reglasHoverDeBotones(contenido) {
  const bloques = [];
  const re = /(button(?:\.[a-zA-Z0-9_-]+)?):hover\s*\{([^}]*)\}/g;
  let m;
  while ((m = re.exec(contenido)) !== null) {
    bloques.push({ selector: m[1], body: m[2] });
  }
  return bloques;
}

function backgroundEsVerde(body) {
  // Acepta hex verdes (#16a34a, #22c55e, etc.), rgb/rgba verdes o nombre "green"
  const bg = body.match(/background(?:-color)?\s*:\s*([^;]+)/i);
  if (!bg) return false;
  const valor = bg[1].trim().toLowerCase();
  if (valor === 'green' || valor.includes('green')) return true;
  if (/#0[0-9a-f]{2}[8-9a-f][0-9a-f]{2}/i.test(valor)) return true; // verdes oscuros tipo #0f766e / #16a34a
  if (/#(16|22|10|15803d|166534|15803|4ade80|22c55e|16a34a|15803d)[0-9a-f]*/i.test(valor)) return true;
  if (/rgba?\(\s*\d+\s*,\s*(1[2-9]\d|2[0-5]\d)\s*,\s*\d+/i.test(valor)) return true;
  // Gradientes con al menos un stop verde reconocible
  if (/linear-gradient/i.test(valor) && /#(16a34a|22c55e|15803d|4ade80|166534)/i.test(valor)) return true;
  return false;
}

describe('US-020 — Cambiar el color del fondo de los botones (hover)', () => {
  test('Escenario 1: Given la UI, When hover sobre cualquier botón, Then el fondo cambia a verde', () => {
    const hovers = reglasHoverDeBotones(css);
    expect(hovers.length).toBeGreaterThan(0);

    const selectores = hovers.map((h) => h.selector);
    expect(selectores).toEqual(expect.arrayContaining(['button']));

    for (const h of hovers) {
      expect(backgroundEsVerde(h.body)).toBe(true);
    }
  });
});
