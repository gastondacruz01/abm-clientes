# ABM de Clientes — Proyecto base SDLC

Proyecto de referencia para desarrollar funcionalidad de cero a través de **User Stories con criterios Gherkin**, usando un **agente en Cursor** configurado con Rules y Skills, e impactando los cambios en GitHub con CI (Jenkins o GitHub Actions).

## Stack

- Backend: Node.js 18+ / Express (persistencia en JSON, sin dependencias nativas)
- Frontend: HTML + CSS + JS vanilla servido por Express
- Tests funcionales: Jest + Supertest
- CI: `Jenkinsfile` y `.github/workflows/ci.yml`

## Levantar el proyecto

```bash
npm install
npm start          # http://localhost:3000
```

- App: http://localhost:3000
- Health check: http://localhost:3000/api/health
- Desarrollo con recarga: `npm run dev`
- Tests: `npm test`

## Estado inicial (baseline)

Solo está implementado el **listado** (`GET /api/clientes`) y la estructura de UI. El resto del ABM se construye implementando las User Stories, en este orden sugerido:

| US | Nombre | Endpoint |
|----|--------|----------|
| US-001 | Alta de cliente | `POST /api/clientes` |
| US-002 | Detalle de cliente | `GET /api/clientes/:id` |
| US-003 | Modificación de cliente | `PUT /api/clientes/:id` |
| US-004 | Baja de cliente | `DELETE /api/clientes/:id` |
| US-005 | Búsqueda y filtrado | `GET /api/clientes?q=` |
| US-006 | Validaciones de negocio | transversal |

El insumo es el documento **`docs/user-stories/User-Stories-ABM-Clientes.docx`** (también hay una copia en Markdown para que el agente la pueda leer directo: `docs/user-stories/user-stories.md`).

## Crear el repo en GitHub e impactar cambios

```bash
cd abm-clientes
git init -b main
git add .
git commit -m "chore: baseline del proyecto ABM Clientes (SDLC + Cursor agent)"

# Opción A: con GitHub CLI
gh repo create abm-clientes --private --source=. --push

# Opción B: manual — crear el repo vacío en github.com y luego:
git remote add origin git@github.com:TU_USUARIO/abm-clientes.git
git push -u origin main
```

Cada US se trabaja en su rama y llega a `main` por Pull Request (ver `.cursor/rules/10-git-workflow.mdc`).

## Agente en Cursor

Al abrir la carpeta en Cursor, el agente queda configurado automáticamente:

- **Rules** (`.cursor/rules/*.mdc`): proceso SDLC, git workflow, estándares de código y testing. Las reglas `alwaysApply: true` se cargan siempre; las de estándares se activan por glob.
- **Skills** (`.cursor/skills/*/SKILL.md`):
  - `implementar-user-story` → ciclo completo: rama → tests Gherkin → código → verificación → commit/PR.
  - `pruebas-funcionales` → levanta la app y genera el guion de prueba manual desde los escenarios Gherkin.

### Cómo usarlo

En el chat del agente de Cursor:

```
Implementá la US-001 del documento de user stories.
```

El agente va a: crear la rama, escribir los tests de los escenarios Gherkin, implementar backend + frontend, correr `npm test` y proponer el commit/PR.

Para probar el impacto:

```
Quiero hacer la prueba funcional de la US-001.
```

## Flujo SDLC completo por US

1. **Requerimiento**: US en el .docx (insumo del proyecto)
2. **Desarrollo**: agente Cursor implementa en rama `feature/US-XXX-*`
3. **Verificación**: `npm test` + prueba funcional manual con `npm start`
4. **Integración**: PR a `main` → CI (Jenkins / Actions) en verde → merge
5. **Regresión**: los tests de US anteriores nunca se tocan; siempre corren todos
