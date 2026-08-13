# Casos de prueba — US-024 Cambiar a idioma Chino

**US:** US-024 — Cambiar a idioma Chino
**Origen:** Jira SCRUM-7
**Spec:** `tests/e2e/us-024.spec.js`
**Datos:** no se cargan clientes; el cambio de idioma opera sobre etiquetas estáticas de la UI.

**Escenarios Gherkin de origen:**
- Escenario 1: Given la UI, When elijo Chino, Then las etiquetas se muestran en chino y `lang="zh"`
- Escenario 2: Given la UI en chino, When elijo Español, Then las etiquetas se muestran en español y `lang="es"`

| ID | Escenario origen | Precondiciones | Pasos | Datos de prueba | Resultado esperado | Resultado |
| --- | --- | --- | --- | --- | --- | --- |
| TC-024-01 | Escenario 1 — Cambiar idioma a Chino | App levantada; pantalla principal en español | 1. Abrir `/` 2. Verificar título "ABM de Clientes" 3. Hover sobre `#btn-idioma` 4. Clic en **Chino** | No aplica | `html[lang=zh]`; título **客户管理**; botón Guardar **保存**; formulario **新建客户** | OK 2026-08-13 |
| TC-024-02 | Escenario 2 — Cambiar idioma a Español | UI en chino | 1. Abrir `/` 2. Elegir **Chino** 3. Hover sobre `#btn-idioma` 4. Clic en **Español** | No aplica | `html[lang=es]`; título **ABM de Clientes**; botón **Guardar**; formulario **Nuevo cliente** | OK 2026-08-13 |
| TC-024-03 | Caso borde — idioma ya seleccionado | Pantalla principal en español | 1. Abrir `/` 2. Hover sobre el ícono 3. Clic en **Español** | No aplica | La UI permanece en español (`lang=es`, título "ABM de Clientes") | OK 2026-08-13 |

## Notas de diseño

- El menú se abre con hover (mismo selector de US-022).
- Las opciones del menú se identifican por el texto **Chino** / **Español**.
- Chino simplificado (`lang="zh"`). Japonés sigue disponible.
- No hay persistencia: recargar la página vuelve a español.
