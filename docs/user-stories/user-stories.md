# User Stories — ABM de Clientes

> Insumo oficial del proyecto. Versión Markdown para consumo del agente Cursor.
> **Versión 1.1** — agrega US-007 a US-012 (Sprint 2/3). Las US-001 a US-006 corresponden a la versión 1.0 del documento .docx.

Formato de criterios de aceptación: **Gherkin** (Given / When / Then).
Modelo de datos: `{ id, nombre, apellido, documento, email, creadoEn, actualizadoEn }`.

---

## US-001 — Alta de cliente
**Prioridad:** Alta · **Estimación:** 3 pts · **Endpoint:** `POST /api/clientes`

**Como** operador del sistema
**Quiero** dar de alta un cliente con nombre, apellido, documento y email
**Para** incorporarlo a la cartera y poder gestionarlo.

### Criterios de aceptación
**Escenario 1 — Alta exitosa**
- **Given** que no existe un cliente con documento "30123456"
- **When** envío `POST /api/clientes` con nombre, apellido, documento y email válidos
- **Then** recibo status 201 con el cliente creado, incluyendo `id` autoincremental y `creadoEn`
- **And** el cliente aparece en `GET /api/clientes`

**Escenario 2 — Campos obligatorios faltantes**
- **Given** el formulario de alta
- **When** envío `POST /api/clientes` sin alguno de: nombre, apellido, documento, email
- **Then** recibo status 400 con `{ error }` indicando el campo faltante
- **And** no se crea ningún cliente

**Escenario 3 — Documento duplicado**
- **Given** que ya existe un cliente con documento "30123456"
- **When** envío `POST /api/clientes` con el mismo documento
- **Then** recibo status 409 con `{ error: "Ya existe un cliente con ese documento" }`

**Escenario 4 — Alta desde la UI**
- **Given** la pantalla principal con el formulario "Nuevo cliente"
- **When** completo los campos y presiono "Guardar"
- **Then** el cliente aparece en la tabla sin recargar la página y el formulario se limpia

---

## US-002 — Detalle de cliente
**Prioridad:** Media · **Estimación:** 1 pt · **Endpoint:** `GET /api/clientes/:id`

**Como** operador del sistema
**Quiero** consultar el detalle de un cliente por su ID
**Para** verificar sus datos antes de una modificación o baja.

### Criterios de aceptación
**Escenario 1 — Cliente existente**
- **Given** un cliente con id 1
- **When** consulto `GET /api/clientes/1`
- **Then** recibo status 200 con todos los campos del cliente

**Escenario 2 — Cliente inexistente**
- **Given** que no existe un cliente con id 999
- **When** consulto `GET /api/clientes/999`
- **Then** recibo status 404 con `{ error: "Cliente no encontrado" }`

---

## US-003 — Modificación de cliente
**Prioridad:** Alta · **Estimación:** 3 pts · **Endpoint:** `PUT /api/clientes/:id`

**Como** operador del sistema
**Quiero** modificar los datos de un cliente existente
**Para** mantener la información actualizada.

### Criterios de aceptación
**Escenario 1 — Modificación exitosa**
- **Given** un cliente existente con id 1
- **When** envío `PUT /api/clientes/1` con nuevos valores válidos
- **Then** recibo status 200 con el cliente actualizado y `actualizadoEn` refrescado
- **And** `creadoEn` no cambia

**Escenario 2 — Cliente inexistente**
- **Given** que no existe un cliente con id 999
- **When** envío `PUT /api/clientes/999`
- **Then** recibo status 404

**Escenario 3 — Documento duplicado contra otro cliente**
- **Given** dos clientes con documentos "111" y "222"
- **When** intento cambiar el documento del segundo a "111"
- **Then** recibo status 409

**Escenario 4 — Edición desde la UI**
- **Given** la tabla de clientes con al menos una fila
- **When** presiono "Editar" en una fila
- **Then** el formulario se carga con los datos del cliente, el título cambia a "Editar cliente" y aparece el botón "Cancelar"
- **When** presiono "Guardar"
- **Then** la fila se actualiza en la tabla y el formulario vuelve al modo alta

---

## US-004 — Baja de cliente
**Prioridad:** Alta · **Estimación:** 2 pts · **Endpoint:** `DELETE /api/clientes/:id`

**Como** operador del sistema
**Quiero** eliminar un cliente
**Para** depurar la cartera de registros que ya no corresponden.

### Criterios de aceptación
**Escenario 1 — Baja exitosa**
- **Given** un cliente existente con id 1
- **When** envío `DELETE /api/clientes/1`
- **Then** recibo status 204
- **And** el cliente ya no aparece en `GET /api/clientes`

**Escenario 2 — Cliente inexistente**
- **Given** que no existe un cliente con id 999
- **When** envío `DELETE /api/clientes/999`
- **Then** recibo status 404

**Escenario 3 — Baja desde la UI con confirmación**
- **Given** la tabla de clientes con al menos una fila
- **When** presiono "Eliminar" en una fila
- **Then** se muestra una confirmación ("¿Eliminar al cliente X?")
- **When** confirmo
- **Then** la fila desaparece de la tabla
- **When** cancelo
- **Then** el cliente permanece sin cambios

---

## US-005 — Búsqueda y filtrado
**Prioridad:** Media · **Estimación:** 2 pts · **Endpoint:** `GET /api/clientes?q=`

**Como** operador del sistema
**Quiero** buscar clientes por nombre, apellido o documento
**Para** encontrarlos rápido cuando la lista crece.

### Criterios de aceptación
**Escenario 1 — Búsqueda por texto parcial**
- **Given** clientes "Juan Pérez" y "Ana García" cargados
- **When** consulto `GET /api/clientes?q=per`
- **Then** recibo solo los clientes cuyo nombre, apellido o documento contengan "per" (sin distinguir mayúsculas ni tildes básicas)

**Escenario 2 — Sin resultados**
- **Given** clientes cargados
- **When** consulto con un término que no coincide con ninguno
- **Then** recibo status 200 con lista vacía

**Escenario 3 — Filtrado en vivo desde la UI**
- **Given** la tabla con varios clientes
- **When** tipeo en el buscador
- **Then** la tabla se filtra en vivo y muestra "No hay clientes" si no hay coincidencias
- **When** borro el término
- **Then** vuelve la lista completa

---

## US-006 — Validaciones de negocio
**Prioridad:** Media · **Estimación:** 2 pts · **Alcance:** transversal (alta y modificación)

**Como** responsable de calidad de datos
**Quiero** que el sistema valide formato de email y documento
**Para** evitar registros inconsistentes en la cartera.

### Criterios de aceptación
**Escenario 1 — Email inválido**
- **Given** el alta o edición de un cliente
- **When** envío un email sin formato válido (sin "@" o sin dominio)
- **Then** recibo status 400 con `{ error: "Email inválido" }`

**Escenario 2 — Documento no numérico o fuera de rango**
- **Given** el alta o edición de un cliente
- **When** envío un documento que no es numérico o tiene menos de 6 o más de 11 dígitos
- **Then** recibo status 400 con `{ error: "Documento inválido" }`

**Escenario 3 — Normalización de espacios**
- **Given** el alta de un cliente
- **When** envío nombre o apellido con espacios al inicio/fin
- **Then** el cliente se guarda con los valores sin espacios sobrantes (trim)

**Escenario 4 — Errores visibles en la UI**
- **Given** el formulario de alta o edición
- **When** el backend responde 400 o 409
- **Then** el mensaje de error se muestra en `#form-error` sin perder lo tipeado

---

## US-007 — Ordenamiento del listado
**Prioridad:** Media · **Estimación:** 2 pts · **Endpoint:** `GET /api/clientes?sort=&dir=` + cabeceras clickeables

**Como** operador del sistema
**Quiero** ordenar el listado de clientes por cualquier columna, en forma ascendente o descendente
**Para** analizar la cartera según el criterio que necesite en cada momento.

### Criterios de aceptación
**Escenario 1 — Ordenamiento por apellido ascendente**
- **Given** clientes "Zárate", "Acosta" y "Medina" cargados
- **When** consulto `GET /api/clientes?sort=apellido&dir=asc`
- **Then** recibo la lista ordenada: Acosta, Medina, Zárate (sin distinguir mayúsculas ni tildes)

**Escenario 2 — Ordenamiento descendente**
- **Given** los mismos clientes
- **When** consulto `GET /api/clientes?sort=apellido&dir=desc`
- **Then** recibo la lista en orden inverso

**Escenario 3 — Campo de orden inválido**
- **Given** clientes cargados
- **When** consulto `GET /api/clientes?sort=campoInexistente`
- **Then** recibo status 400 con `{ error: "Campo de ordenamiento inválido" }`

**Escenario 4 — Orden por defecto**
- **Given** clientes cargados
- **When** consulto `GET /api/clientes` sin parámetros de orden
- **Then** recibo la lista ordenada por `id` ascendente (comportamiento actual, sin regresión)

**Escenario 5 — Ordenamiento desde la UI**
- **Given** la tabla con varios clientes
- **When** hago clic en la cabecera "Apellido"
- **Then** la tabla se reordena ascendente y la cabecera muestra un indicador (▲)
- **When** vuelvo a hacer clic en la misma cabecera
- **Then** el orden se invierte y el indicador cambia (▼)

**Notas técnicas:** el ordenamiento debe componerse con la búsqueda de US-005 (`?q=` y `?sort=` combinables).

---

## US-008 — Paginación del listado
**Prioridad:** Media · **Estimación:** 3 pts · **Endpoint:** `GET /api/clientes?page=&limit=` + controles de paginado

**Como** operador del sistema
**Quiero** ver el listado de clientes paginado
**Para** que la pantalla siga siendo usable cuando la cartera crezca a cientos de registros.

### Criterios de aceptación
**Escenario 1 — Primera página**
- **Given** 25 clientes cargados
- **When** consulto `GET /api/clientes?page=1&limit=10`
- **Then** recibo un objeto `{ data: [...10 clientes], page: 1, limit: 10, total: 25, totalPages: 3 }`

**Escenario 2 — Última página incompleta**
- **Given** 25 clientes cargados
- **When** consulto `GET /api/clientes?page=3&limit=10`
- **Then** recibo `data` con 5 clientes y `page: 3`

**Escenario 3 — Página fuera de rango**
- **Given** 25 clientes cargados
- **When** consulto `GET /api/clientes?page=99&limit=10`
- **Then** recibo status 200 con `data: []` y el `total` correcto

**Escenario 4 — Parámetros inválidos**
- **Given** clientes cargados
- **When** consulto con `page=0`, `page=abc` o `limit=-5`
- **Then** recibo status 400 con `{ error }` descriptivo

**Escenario 5 — Retrocompatibilidad**
- **Given** clientes cargados
- **When** consulto `GET /api/clientes` sin parámetros de paginación
- **Then** recibo el array plano completo como hasta ahora (los tests de US anteriores no deben romperse)

**Escenario 6 — Navegación desde la UI**
- **Given** más de 10 clientes en la tabla
- **When** presiono "Siguiente"
- **Then** veo la página 2 y el indicador "Página 2 de N"
- **And** los botones "Anterior"/"Siguiente" se deshabilitan en los extremos

**Notas técnicas:** debe componerse con búsqueda (US-005) y ordenamiento (US-007): primero filtrar, luego ordenar, luego paginar.

---

## US-009 — Estado del cliente (activo / inactivo)
**Prioridad:** Alta · **Estimación:** 3 pts · **Endpoint:** `PATCH /api/clientes/:id/estado` + toggle en la UI

**Como** operador del sistema
**Quiero** poder inactivar y reactivar clientes sin eliminarlos
**Para** conservar el historial de clientes que dejaron de operar, dejando la baja física (US-004) solo para registros erróneos.

### Criterios de aceptación
**Escenario 1 — Alta con estado por defecto**
- **Given** el alta de un cliente nuevo (US-001)
- **When** se crea correctamente
- **Then** el cliente incluye `activo: true`

**Escenario 2 — Inactivar cliente**
- **Given** un cliente activo con id 1
- **When** envío `PATCH /api/clientes/1/estado` con `{ "activo": false }`
- **Then** recibo status 200 con el cliente actualizado (`activo: false`, `actualizadoEn` refrescado)

**Escenario 3 — Reactivar cliente**
- **Given** un cliente inactivo con id 1
- **When** envío `PATCH /api/clientes/1/estado` con `{ "activo": true }`
- **Then** recibo status 200 y el cliente vuelve a estar activo

**Escenario 4 — Cliente inexistente o payload inválido**
- **Given** que no existe cliente con id 999
- **When** envío `PATCH /api/clientes/999/estado`
- **Then** recibo status 404
- **When** envío el PATCH sin el campo `activo` o con un valor no booleano
- **Then** recibo status 400

**Escenario 5 — Filtro por estado**
- **Given** clientes activos e inactivos
- **When** consulto `GET /api/clientes?estado=activos` (o `inactivos` / `todos`)
- **Then** recibo solo los clientes del estado solicitado; sin el parámetro, el comportamiento actual no cambia

**Escenario 6 — Visualización y toggle en la UI**
- **Given** la tabla con clientes activos e inactivos
- **Then** las filas inactivas se muestran atenuadas con un badge "Inactivo"
- **When** presiono el botón "Inactivar"/"Reactivar" de una fila
- **Then** el estado cambia sin recargar la página
- **And** existe un selector de filtro Activos / Inactivos / Todos sobre la tabla

**Notas técnicas:** migración suave: los clientes existentes sin campo `activo` se consideran activos al leerlos.

---

## US-010 — Exportación de clientes a CSV
**Prioridad:** Baja · **Estimación:** 2 pts · **Endpoint:** `GET /api/clientes/export` + botón "Exportar CSV"

**Como** operador del sistema
**Quiero** descargar el listado de clientes en un archivo CSV
**Para** compartirlo o analizarlo en Excel sin acceso al sistema.

### Criterios de aceptación
**Escenario 1 — Exportación completa**
- **Given** clientes cargados
- **When** consulto `GET /api/clientes/export`
- **Then** recibo status 200 con `Content-Type: text/csv` y cabecera `Content-Disposition` con nombre `clientes-AAAA-MM-DD.csv`
- **And** el archivo incluye fila de encabezados (`id,nombre,apellido,documento,email,activo,creadoEn`) y una fila por cliente

**Escenario 2 — Exportación respetando filtros**
- **Given** clientes cargados
- **When** consulto `GET /api/clientes/export?q=per&estado=activos`
- **Then** el CSV contiene solo los registros que cumplen esos filtros (reutiliza la lógica de US-005 y US-009)

**Escenario 3 — Lista vacía**
- **Given** ningún cliente cargado (o filtros sin coincidencias)
- **When** consulto el export
- **Then** recibo un CSV válido con solo la fila de encabezados

**Escenario 4 — Escapado de caracteres**
- **Given** un cliente con coma o comillas en el nombre (ej.: `O'Brien, José`)
- **When** exporto
- **Then** el campo queda correctamente entrecomillado y el CSV abre bien en Excel

**Escenario 5 — Exportación desde la UI**
- **Given** la pantalla principal
- **When** presiono el botón "Exportar CSV"
- **Then** el navegador descarga el archivo aplicando el filtro de búsqueda vigente

---

## US-011 — Auditoría de cambios
**Prioridad:** Media · **Estimación:** 3 pts · **Endpoint:** `GET /api/clientes/:id/historial`

**Como** responsable de calidad de datos
**Quiero** consultar el historial de cambios de cada cliente
**Para** tener trazabilidad de qué se modificó y cuándo.

### Criterios de aceptación
**Escenario 1 — Registro de alta**
- **Given** el alta de un cliente (US-001)
- **When** consulto `GET /api/clientes/:id/historial`
- **Then** recibo una lista con un evento `{ tipo: "ALTA", fecha, datos }`

**Escenario 2 — Registro de modificación con diff**
- **Given** un cliente al que le cambio el email (US-003)
- **When** consulto su historial
- **Then** el evento `MODIFICACION` incluye `cambios: { email: { antes, despues } }` solo con los campos modificados

**Escenario 3 — Registro de cambio de estado**
- **Given** un cliente inactivado (US-009)
- **When** consulto su historial
- **Then** aparece un evento `CAMBIO_ESTADO` con el valor anterior y el nuevo

**Escenario 4 — Orden y cliente inexistente**
- **Given** un cliente con varios eventos
- **When** consulto su historial
- **Then** los eventos vienen ordenados del más reciente al más antiguo
- **Given** un id inexistente
- **Then** recibo status 404

**Escenario 5 — Historial desde la UI**
- **Given** la tabla de clientes
- **When** presiono "Historial" en una fila
- **Then** se muestra la lista de eventos legible (fecha, tipo y detalle de cambios) sin salir de la pantalla

**Notas técnicas:** persistir eventos en la misma estructura de `db.js` (colección `historial` por cliente o global con `clienteId`). La baja física (US-004) puede registrar el evento en un historial global para no perderlo.

---

## US-012 — Datos de contacto ampliados
**Prioridad:** Baja · **Estimación:** 2 pts · **Alcance:** modelo de datos + alta/edición + tabla

**Como** operador del sistema
**Quiero** registrar teléfono y fecha de nacimiento del cliente
**Para** contar con más canales de contacto y datos para gestión comercial.

### Criterios de aceptación
**Escenario 1 — Alta con nuevos campos opcionales**
- **Given** el formulario de alta
- **When** envío `POST /api/clientes` con `telefono` y `fechaNacimiento` además de los campos actuales
- **Then** el cliente se crea con ambos campos persistidos
- **When** envío el alta sin estos campos
- **Then** el cliente se crea igual (son opcionales) — sin regresión sobre US-001

**Escenario 2 — Validación de teléfono**
- **Given** el alta o edición
- **When** envío un teléfono con menos de 8 o más de 15 caracteres, o con caracteres que no sean dígitos, espacios, "+" o "-"
- **Then** recibo status 400 con `{ error: "Teléfono inválido" }`

**Escenario 3 — Validación de fecha de nacimiento**
- **Given** el alta o edición
- **When** envío una fecha con formato distinto a `AAAA-MM-DD`, futura, o que implique más de 120 años de edad
- **Then** recibo status 400 con `{ error: "Fecha de nacimiento inválida" }`

**Escenario 4 — UI actualizada**
- **Given** el formulario y la tabla
- **Then** el formulario incluye los campos "Teléfono" y "Fecha de nacimiento"
- **And** la tabla muestra la columna "Teléfono"
- **And** la edición (US-003) precarga y permite modificar ambos campos

**Notas técnicas:** actualizar el modelo documentado en `20-coding-standards.mdc` y el CSV de US-010 para incluir los nuevos campos. La búsqueda de US-005 no incluye estos campos (si se pidiera, sería una US nueva).
