# Casos de prueba — US-021 Cambiar a idioma Portugués

**US:** US-021 — Cambiar a idioma Portugués
**Origen:** Jira SCRUM-5
**Spec:** `tests/e2e/us-021.spec.js`
**Datos:** no se cargan clientes; el cambio de idioma opera sobre etiquetas estáticas de la UI.

**Escenarios Gherkin de origen:**
- Escenario 1: Given la UI, When elijo Portugués, Then las etiquetas se muestran en portugués y `lang="pt"`
- Escenario 2: Given la UI en portugués, When elijo Español, Then las etiquetas se muestran en español y `lang="es"`

| ID | Escenario origen | Precondiciones | Pasos | Datos de prueba | Resultado esperado | Resultado |
| --- | --- | --- | --- | --- | --- | --- |
| TC-021-01 | Escenario 1 — Cambiar idioma a Portugués | App levantada; pantalla principal en español | 1. Abrir `/` 2. Verificar título "ABM de Clientes" 3. Hover sobre `#btn-idioma` 4. Clic en **Portugués** | No aplica | `html[lang=pt]`; título **Cadastro de Clientes**; botón Guardar **Salvar**; formulario **Novo cliente** | OK 2026-08-13 |
| TC-021-02 | Escenario 2 — Cambiar idioma a Español | UI en portugués | 1. Abrir `/` 2. Elegir **Portugués** 3. Hover sobre `#btn-idioma` 4. Clic en **Español** | No aplica | `html[lang=es]`; título **ABM de Clientes**; botón **Guardar**; formulario **Nuevo cliente** | OK 2026-08-13 |
| TC-021-03 | Caso borde — idioma ya seleccionado | Pantalla principal en español | 1. Abrir `/` 2. Hover sobre el ícono 3. Clic en **Español** | No aplica | La UI permanece en español (`lang=es`, título "ABM de Clientes") | OK 2026-08-13 |

## Notas de diseño

- El menú se abre con hover (mismo selector de US-022).
- Las opciones del menú se identifican por el texto **Portugués** / **Español**.
- Portugués (`lang="pt"`). Japonés y Chino siguen disponibles.
- No hay persistencia: recargar la página vuelve a español.
