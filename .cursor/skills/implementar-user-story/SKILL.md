---
name: implementar-user-story
description: Implementa una User Story del documento docs/user-stories/ siguiendo el ciclo SDLC del proyecto (rama, tests Gherkin, código, verificación, commit). Usar cuando el usuario diga "implementá la US-XXX", "arrancá con la próxima user story" o similar.
---

# Skill: Implementar User Story

## Cuándo usar
Cuando el usuario pida implementar una US específica (por ID) o "la siguiente" según prioridad.

## Pasos

1. **Localizar la US**
   - Buscar la US en `docs/user-stories/` (si solo está el .docx y no podés leerlo, pedile al usuario que pegue el texto de la US o usá `docs/user-stories/user-stories.md` si existe).
   - Confirmar con el usuario: ID, narrativa y escenarios Gherkin que se van a implementar.

2. **Plan corto**
   - Listar en 3-6 bullets qué se toca: endpoints, frontend, tests. Esperar OK del usuario si el alcance es ambiguo.

3. **Rama**
   ```bash
   git checkout main && git pull
   git checkout -b feature/US-XXX-descripcion-corta
   ```

4. **Tests primero (Gherkin → Jest)**
   - Agregar `describe('US-XXX — <nombre>')` en `tests/clientes.test.js` (o archivo nuevo `tests/us-xxx.test.js` si supera ~5 escenarios).
   - Un `test()` por escenario, nombrado con el Given/When/Then.
   - Correr `npm test` y verificar que los nuevos fallan (rojo esperado).

5. **Implementar**
   - Backend: `src/routes/clientes.js` + `src/data/db.js` si hace falta.
   - Frontend: `public/app.js` + `public/index.html` según lo pida la US.
   - Respetar `20-coding-standards.mdc`.

6. **Verificar**
   - `npm test` completo en verde.
   - Describir la prueba manual: `npm start` → pasos en el navegador.

7. **Cerrar**
   - Commit: `US-XXX: <resumen>`.
   - Preguntar al usuario si hacer push y abrir PR con la plantilla de `10-git-workflow.mdc`.

## Anti-patrones (no hacer)
- Implementar más de una US en la misma rama/commit.
- Saltear el paso de tests o escribirlos después "para cumplir".
- Inventar criterios que no están en el documento: ante duda, preguntar.
