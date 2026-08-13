# Casos de prueba — US-022 Cambiar a idioma Japonés

**US:** US-022 — Cambiar a idioma Japonés
**Origen:** AzDO #1665465
**Spec:** `tests/e2e/us-022.spec.js`
**Datos:** no se cargan clientes; el cambio de idioma opera sobre etiquetas estáticas de la UI.

**Escenarios Gherkin de origen:**
- Escenario 1: Given la UI, When elijo Japonés, Then las etiquetas se muestran en japonés y `lang="ja"`
- Escenario 2: Given la UI en japonés, When elijo Español, Then las etiquetas se muestran en español y `lang="es"`

| ID | Escenario origen | Precondiciones | Pasos | Datos de prueba | Resultado esperado | Resultado |
| --- | --- | --- | --- | --- | --- | --- |
| TC-022-01 | Escenario 1 — Cambiar idioma a Japonés | App levantada; pantalla principal en español | 1. Abrir `/` 2. Verificar título "ABM de Clientes" 3. Hover sobre `#btn-idioma` 4. Clic en **Japonés** | No aplica | `html[lang=ja]`; título **顧客管理**; botón Guardar **保存**; formulario **新規顧客** | OK 2026-08-13 |
| TC-022-02 | Escenario 2 — Cambiar idioma a Español | UI en japonés (serial: continúa de TC-022-01) | 1. Hover sobre `#btn-idioma` 2. Clic en **Español** | No aplica | `html[lang=es]`; título **ABM de Clientes**; botón **Guardar**; formulario **Nuevo cliente** | OK 2026-08-13 |
| TC-022-03 | Caso borde — idioma ya seleccionado | Pantalla principal en español | 1. Abrir `/` 2. Hover sobre el ícono 3. Clic en **Español** | No aplica | La UI permanece en español (`lang=es`, título "ABM de Clientes") | OK 2026-08-13 |

## Notas de diseño

- El menú se abre con hover (criterio: "me posiciono sobre el ícono").
- Las opciones del menú se identifican por el texto **Japonés** / **Español** (como en la US).
- No hay persistencia: recargar la página vuelve a español.
