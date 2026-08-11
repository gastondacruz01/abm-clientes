---
name: pruebas-funcionales
description: Levanta el proyecto y guía una prueba funcional (manual + automatizada) de una US o de regresión completa. Usar cuando el usuario diga "quiero probar la US-XXX", "levantá el proyecto", "hagamos regresión" o similar.
---

# Skill: Pruebas funcionales

## Cuándo usar
Cuando el usuario quiere verificar el impacto de una US en el repositorio, antes o después del merge.

## Pasos

1. **Preparar entorno**
   ```bash
   npm install        # solo la primera vez o si cambió package.json
   npm test           # regresión automatizada completa
   ```
   Si hay tests rojos: reportarlos con el ID de US afectada antes de seguir.

2. **Levantar la app**
   ```bash
   npm start          # http://localhost:3000
   ```
   (o `npm run dev` para recarga automática durante la prueba).

3. **Guion de prueba manual**
   - Generar un guion paso a paso derivado de los escenarios Gherkin de la US bajo prueba:
     - Cada "Given" → estado inicial a preparar (ej.: "con la lista vacía…").
     - Cada "When" → acción en la UI o request (dar también el `curl` equivalente).
     - Cada "Then" → resultado observable a verificar.
   - Incluir al menos un caso negativo (validación / error esperado).

4. **Evidencia**
   - Pedir al usuario el resultado de cada paso (OK / falla).
   - Si algo falla: registrar el hallazgo con formato
     `[US-XXX][Escenario N] Esperado: ... / Obtenido: ...` y proponer el fix en una rama `fix/US-XXX-...`.

5. **Cierre**
   - Si todo OK: marcar la US como verificada y sugerir merge del PR.

## Ejemplos de curl útiles
```bash
curl -s http://localhost:3000/api/health
curl -s http://localhost:3000/api/clientes
curl -s -X POST http://localhost:3000/api/clientes -H "Content-Type: application/json" \
  -d '{"nombre":"Juan","apellido":"Pérez","documento":"30123456","email":"juan@mail.com"}'
```
