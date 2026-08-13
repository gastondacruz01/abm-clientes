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

---

> **Versión 1.2** — agrega US-013 a US-018 en estado Borrador, generadas desde `docs/insumos/manual-abm-clientes.md`. No modifica US-001 a US-012.

---

## US-013 — Papelera y restauración de clientes
**Estado:** Aprobada
**Prioridad:** Alta · **Estimación:** 5 pts · **Endpoint:** `DELETE /api/clientes/:id` (envío a papelera) · `GET /api/papelera` · `POST /api/papelera/:id/restaurar`
**Origen:** docs/insumos/manual-abm-clientes.md (secciones 3.5 y 7)

**Como** supervisor del sistema
**Quiero** que la baja de un cliente lo envíe a una papelera recuperable durante 30 días
**Para** poder restaurarlo si la eliminación fue un error, sin perder su información ni su historial.

### Criterios de aceptación
**Escenario 1 — Envío a papelera**
- **Given** un cliente existente "Juan Pérez" con id 1
- **When** envío `DELETE /api/clientes/1`
- **Then** recibo status 200 con `{ mensaje: "El cliente fue enviado a la papelera" }`
- **And** el cliente no aparece en `GET /api/clientes`
- **And** el cliente aparece en `GET /api/papelera` con `eliminadoEn` (ISO 8601) y `eliminadoPor`

**Escenario 2 — Restauración**
- **Given** un cliente en la papelera con id 1
- **When** envío `POST /api/papelera/1/restaurar`
- **Then** recibo status 200 con `{ mensaje: "El cliente fue restaurado" }`
- **And** el cliente vuelve a aparecer en `GET /api/clientes` con los mismos datos e historial
- **And** deja de aparecer en `GET /api/papelera`

**Escenario 3 — Confirmación en la UI y cliente inexistente**
- **Given** la tabla de clientes con la fila "Juan Pérez"
- **When** presiono "Eliminar"
- **Then** se muestra la confirmación "¿Eliminar al cliente Juan Pérez?"
- **When** confirmo
- **Then** la fila desaparece, se muestra el mensaje "El cliente fue enviado a la papelera" y el cliente figura en la pantalla Papelera (menú del supervisor) con quién lo eliminó y cuándo
- **Given** que no existe un cliente con id 999
- **When** envío `DELETE /api/clientes/999` o `POST /api/papelera/999/restaurar`
- **Then** recibo status 404 con `{ error: "Cliente no encontrado" }`

**Escenario 4 — Purga a los 30 días**
- **Given** un cliente en papelera con `eliminadoEn` hace 31 días
- **When** consulto `GET /api/papelera` o `GET /api/clientes/:id`
- **Then** el registro ya no existe (status 404 en el detalle) y no es restaurable

**Notas técnicas:** el insumo reserva la baja al perfil supervisor. Esta US no cubre autenticación (queda para una corrida posterior); hasta que exista perfil, el endpoint se implementa sin chequeo de rol. **Conflicto con US-004:** esa US define baja física (status 204 y desaparición definitiva). Si se aprueba US-013, hay que redefinir US-004 para que `DELETE` envíe a papelera en lugar de borrar.

---

## US-014 — Importación masiva de clientes (CSV)
**Estado:** Borrador
**Prioridad:** Alta · **Estimación:** 5 pts · **Endpoint:** `GET /api/clientes/plantilla` · `POST /api/clientes/importar`
**Origen:** docs/insumos/manual-abm-clientes.md (secciones 4.1 y 7)

**Como** supervisor del sistema
**Quiero** importar clientes en lote desde un archivo CSV con la plantilla del sistema
**Para** incorporar una cartera existente sin cargar cada registro a mano.

### Criterios de aceptación
**Escenario 1 — Importación parcial con resumen**
- **Given** la plantilla descargable en `GET /api/clientes/plantilla` (CSV con encabezados `nombre,apellido,documento,email` y status 200, `Content-Type: text/csv`)
- **When** envío `POST /api/clientes/importar` con un CSV de 3 filas: 2 válidas y 1 con email inválido
- **Then** recibo status 200 con `{ mensaje: "Importación completa: 2 incorporados, 1 rechazados", incorporados: 2, rechazados: 1, detalleRechazos: [{ fila, motivo }] }`
- **And** solo las 2 filas válidas aparecen en `GET /api/clientes`
- **And** `detalleRechazos` incluye la fila del email inválido con motivo que contiene "Email inválido"

**Escenario 2 — Documento duplicado no se importa**
- **Given** un cliente existente con documento "30123456"
- **When** importo un CSV que incluye una fila con ese mismo documento
- **Then** esa fila no se incorpora
- **And** figura en `detalleRechazos` con motivo que indica duplicado (p. ej. "Ya existe un cliente con ese documento")

**Escenario 3 — Archivo inválido**
- **Given** el endpoint de importación
- **When** envío un archivo que no es CSV, o un CSV sin los encabezados de la plantilla
- **Then** recibo status 400 con `{ error }` descriptivo
- **And** no se crea ningún cliente

**Escenario 4 — UI de importación**
- **Given** la pantalla de importación (accesible para supervisor)
- **Then** puedo descargar la plantilla CSV
- **When** subo un CSV mixto y finaliza el proceso
- **Then** veo el mensaje "Importación completa: X incorporados, Y rechazados"
- **And** puedo descargar el detalle de rechazos fila por fila

**Notas técnicas:** cada fila se valida con las mismas reglas de US-001, US-006 y US-012. Las filas válidas se persisten aunque otras fallen (importación parcial). El insumo reserva esta acción al supervisor.

---

## US-015 — Detección de posibles duplicados
**Estado:** Borrador
**Prioridad:** Media · **Estimación:** 3 pts · **Endpoint:** `POST /api/clientes` (aviso previo) · `GET /api/clientes/duplicados`
**Origen:** docs/insumos/manual-abm-clientes.md (sección 4.3)

**Como** operador del sistema
**Quiero** que el alta me avise si ya existe un cliente muy similar
**Para** evitar cargar dos veces a la misma persona cuando el documento no coincide.

### Criterios de aceptación
**Escenario 1 — Advertencia por email coincidente**
- **Given** un cliente existente con email "ana@mail.com" y documento "11111111"
- **When** envío `POST /api/clientes` con el mismo email y documento distinto, sin confirmar el duplicado
- **Then** recibo status 409 con `{ error: "Posible duplicado", candidatos: [...] }` listando al cliente existente
- **And** no se crea el nuevo cliente

**Escenario 2 — Advertencia por mismo apellido y mismo nombre, y confirmación para continuar**
- **Given** un cliente "María López" con documento "22222222"
- **When** envío `POST /api/clientes` con nombre "María", apellido "López" y otro documento, sin confirmar
- **Then** recibo status 409 con `{ error: "Posible duplicado", candidatos: [...] }`
- **When** reenvío el mismo body con `{ confirmarDuplicado: true }`
- **Then** recibo status 201 y el cliente se crea (el documento no era el mismo)

**Escenario 3 — Documento exactamente igual sigue siendo rechazo duro**
- **Given** un cliente con documento "30123456"
- **When** envío `POST /api/clientes` con ese documento
- **Then** recibo status 409 con `{ error: "Ya existe un cliente con ese documento" }` (sin regresión de US-001)
- **And** no aplica el flujo de "continuar igual"

**Escenario 4 — Informe y UI**
- **Given** al menos un par de clientes con email coincidente o mismo nombre+apellido
- **When** consulto `GET /api/clientes/duplicados`
- **Then** recibo status 200 con grupos de posibles duplicados
- **Given** el formulario de alta
- **When** guardo un alta que dispara posible duplicado
- **Then** la UI muestra la advertencia con los registros parecidos y botones para continuar o cancelar
- **When** cancelo
- **Then** no se crea el cliente y el formulario conserva lo tipeado

**Notas técnicas:** el insumo habla de "nombre parecido"; para que el criterio sea verificable, esta US trata como similar la igualdad de nombre y apellido sin distinguir mayúsculas ni tildes (además del email coincidente con documento distinto). Si Producto quiere umbral de similitud (p. ej. Levenshtein), hay que precisarlo antes de implementar.

---

## US-016 — Etiquetas y segmentación
**Estado:** Borrador
**Prioridad:** Media · **Estimación:** 3 pts · **Endpoint:** `PUT /api/clientes/:id/etiquetas` · `GET /api/clientes?etiqueta=`
**Origen:** docs/insumos/manual-abm-clientes.md (sección 4.4)

**Como** operador del sistema
**Quiero** clasificar a los clientes con una o más etiquetas de libre definición
**Para** segmentar la cartera (Premium, Moroso, Prospecto, etc.) y filtrar o exportar por ese criterio.

### Criterios de aceptación
**Escenario 1 — Asignar varias etiquetas**
- **Given** un cliente con id 1
- **When** envío `PUT /api/clientes/1/etiquetas` con `{ "etiquetas": ["Premium", "Prospecto"] }`
- **Then** recibo status 200 con el cliente incluyendo `etiquetas: ["Premium", "Prospecto"]`
- **And** `GET /api/clientes/1` persiste ambas etiquetas

**Escenario 2 — Filtrar por etiqueta**
- **Given** un cliente con etiqueta "Moroso" y otro sin ella
- **When** consulto `GET /api/clientes?etiqueta=Moroso`
- **Then** recibo solo el cliente etiquetado como "Moroso" (status 200)

**Escenario 3 — Validación**
- **Given** un cliente con id 1
- **When** envío etiquetas que no son un array de strings no vacíos (p. ej. `""`, números o un string suelto)
- **Then** recibo status 400 con `{ error }` descriptivo
- **Given** que no existe el cliente 999
- **When** envío `PUT /api/clientes/999/etiquetas`
- **Then** recibo status 404

**Escenario 4 — UI y exportación**
- **Given** un cliente con etiquetas "Premium" y "Prospecto"
- **Then** su fila muestra ambas como chips de color
- **When** filtro el buscador por etiqueta "Premium"
- **Then** la tabla muestra solo esos clientes
- **When** exporto CSV (US-010) con ese filtro
- **Then** el archivo incluye una columna `etiquetas` con los valores asignados

**Notas técnicas:** etiquetas de libre definición (no hay catálogo cerrado en el insumo). Normalizar trim y evitar duplicados ignorando mayúsculas (`Premium` y `premium` cuentan como una). Extender el CSV de US-010.

---

## US-017 — Notas internas y adjuntos
**Estado:** Borrador
**Prioridad:** Media · **Estimación:** 5 pts · **Endpoint:** `POST/GET /api/clientes/:id/notas` · `POST/GET /api/clientes/:id/adjuntos`
**Origen:** docs/insumos/manual-abm-clientes.md (sección 4.5)

**Como** operador del sistema
**Quiero** dejar notas internas fechadas en el detalle del cliente y adjuntar documentos (PDF, JPG, PNG)
**Para** compartir contexto del equipo (no visible para el cliente) junto a la ficha.

### Criterios de aceptación
**Escenario 1 — Alta de nota**
- **Given** un cliente con id 1
- **When** envío `POST /api/clientes/1/notas` con `{ "texto": "Llamar la próxima semana" }`
- **Then** recibo status 201 con la nota incluyendo `id`, `texto`, `fecha` (ISO 8601) y `autor`
- **And** `GET /api/clientes/1/notas` la lista ordenada de la más reciente a la más antigua

**Escenario 2 — Adjunto válido**
- **Given** un cliente con id 1 y un archivo `dni.pdf` de menos de 5 MB
- **When** envío `POST /api/clientes/1/adjuntos` con ese archivo
- **Then** recibo status 201 con `{ id, nombreArchivo, tipo, tamanio, fecha }`
- **And** `GET /api/clientes/1/adjuntos` incluye el archivo y permite descargarlo

**Escenario 3 — Rechazo de adjunto inválido o nota vacía**
- **Given** un cliente con id 1
- **When** adjunto un archivo `.exe`, o un PDF de más de 5 MB, o un tipo distinto de PDF/JPG/PNG
- **Then** recibo status 400 con `{ error }` indicando formato o tamaño inválido
- **And** no se persiste el archivo
- **When** envío `POST /api/clientes/1/notas` con `texto` vacío o ausente
- **Then** recibo status 400
- **Given** un id de cliente inexistente
- **When** envío nota o adjunto
- **Then** recibo status 404

**Escenario 4 — UI en el detalle**
- **Given** el detalle de un cliente
- **Then** puedo ver y crear notas (texto, fecha y autor visibles)
- **And** puedo adjuntar un PDF/JPG/PNG de hasta 5 MB y verlo en la lista de documentos
- **When** intento adjuntar un tipo no permitido
- **Then** se muestra el error sin recargar la página

**Notas técnicas:** las notas son internas (no hay portal de cliente en este proyecto). `autor` requiere identidad de usuario; hasta la US de perfiles, persistir un valor de sesión o header de desarrollo. No versionar los archivos subidos en git (directorio ignorado, p. ej. `src/data/adjuntos/`).

---

## US-018 — Panel de indicadores de cartera
**Estado:** Borrador
**Prioridad:** Media · **Estimación:** 3 pts · **Endpoint:** `GET /api/indicadores`
**Origen:** docs/insumos/manual-abm-clientes.md (sección 5.2)

**Como** supervisor del sistema
**Quiero** ver un panel con totales de la cartera, altas del mes, evolución mensual y distribución por etiquetas
**Para** obtener una foto operativa al ingresar, sin armar el reporte a mano.

### Criterios de aceptación
**Escenario 1 — Totales y altas del mes**
- **Given** 10 clientes, de los cuales 7 activos y 3 inactivos, y 2 dados de alta en el mes calendario actual
- **When** consulto `GET /api/indicadores`
- **Then** recibo status 200 con `{ total: 10, activos: 7, inactivos: 3, altasDelMes: 2 }`
- **And** los clientes en papelera no suman al `total`

**Escenario 2 — Evolución mensual y distribución por etiquetas**
- **Given** altas y bajas (envíos a papelera) en al menos dos meses distintos, y clientes con etiquetas "Premium" y "Moroso"
- **When** consulto `GET /api/indicadores`
- **Then** `evolucionMensual` es un array de `{ mes: "AAAA-MM", altas, bajas }` con un elemento por mes que tenga movimiento
- **And** `distribucionEtiquetas` incluye `{ etiqueta: "Premium", cantidad }` y `{ etiqueta: "Moroso", cantidad }`

**Escenario 3 — Cartera vacía**
- **Given** ningún cliente cargado
- **When** consulto `GET /api/indicadores`
- **Then** recibo status 200 con `total: 0`, `activos: 0`, `inactivos: 0`, `altasDelMes: 0`, `evolucionMensual: []` y `distribucionEtiquetas: []`

**Escenario 4 — UI del panel**
- **Given** la pantalla "Indicadores"
- **Then** se muestran total, activos vs. inactivos, altas del mes, evolución mensual y distribución por etiquetas, calculados al ingresar (no cacheados de una visita anterior)
- **When** presiono exportar como imagen
- **Then** el navegador descarga un archivo de imagen del panel (p. ej. PNG)

**Notas técnicas:** el insumo reserva el panel a supervisor y administrador. "Bajas" del gráfico se interpretan como envíos a papelera (US-013), no como inactivaciones de US-009. La exportación a imagen es del lado cliente (captura del contenedor del panel).

---

## US-020 — Cambiar el color del fondo de los botones (hover)
**Estado:** Aprobada
**Prioridad:** Baja · **Estimación:** 1 pt · **Alcance:** frontend (`public/styles.css`)
**Origen:** Jira SCRUM-1

**Como** usuario de la aplicación
**Quiero** que cambie el color de los botones al posicionarme sobre alguno
**Para** que quede más estética la aplicación.

### Criterios de aceptación
**Escenario 1 — Cambio de color de los botones**
- **Given** estoy en la interfaz de ABM clientes
- **When** me posiciono sobre cualquier botón (hover)
- **Then** el color de fondo del botón cambia a verde

---

## US-022 — Cambiar a idioma Japonés
**Estado:** Aprobada
**Prioridad:** Media · **Estimación:** 2 pts · **Alcance:** frontend (`public/index.html`, `public/app.js`, `public/i18n.js`, `public/styles.css`)
**Origen:** AzDO #1665465

**Como** usuario de la aplicación
**Quiero** cambiar al idioma Japonés
**Para** ver cómo se muestran las etiquetas en ese idioma.

### Criterios de aceptación
**Escenario 1 — Cambiar idioma a Japonés**
- **Given** estoy en la interfaz de ABM clientes
- **When** me posiciono sobre el ícono de cambio de idioma y elijo "Japonés"
- **Then** las etiquetas visibles de la interfaz se muestran en japonés (título, formulario, botones, tabla)
- **And** el documento HTML tiene `lang="ja"`

**Escenario 2 — Cambiar idioma a Español**
- **Given** la interfaz está en japonés
- **When** me posiciono sobre el ícono de cambio de idioma y elijo "Español"
- **Then** las etiquetas visibles de la interfaz se muestran en español
- **And** el documento HTML tiene `lang="es"`

**Notas técnicas:** el idioma por defecto es español. El selector vive en el header; el menú se abre al posicionarse sobre el ícono. No se persiste la preferencia (fuera de alcance de esta US). No se agrega inglés.

---

## US-021 — Cambiar a idioma Portugués
**Estado:** Aprobada
**Prioridad:** Media · **Estimación:** 2 pts · **Alcance:** frontend (`public/index.html`, `public/i18n.js`)
**Origen:** Jira SCRUM-5

**Como** usuario de la aplicación
**Quiero** cambiar al idioma Portugués
**Para** ver cómo se muestran las etiquetas en ese idioma.

### Criterios de aceptación
**Escenario 1 — Cambiar idioma a Portugués**
- **Given** estoy en la interfaz de ABM clientes
- **When** me posiciono sobre el ícono de cambio de idioma y elijo "Portugués"
- **Then** las etiquetas visibles de la interfaz se muestran en portugués (título, formulario, botones, tabla)
- **And** el documento HTML tiene `lang="pt"`

**Escenario 2 — Cambiar idioma a Español**
- **Given** la interfaz está en portugués
- **When** me posiciono sobre el ícono de cambio de idioma y elijo "Español"
- **Then** las etiquetas visibles de la interfaz se muestran en español
- **And** el documento HTML tiene `lang="es"`

**Notas técnicas:** reutiliza el selector de idioma de US-022. El portugués usa `pt`. Japonés, Chino y Español siguen disponibles. El idioma por defecto sigue siendo español. No se persiste la preferencia.

---

## US-024 — Cambiar a idioma Chino
**Estado:** Aprobada
**Prioridad:** Media · **Estimación:** 2 pts · **Alcance:** frontend (`public/index.html`, `public/app.js`, `public/i18n.js`)
**Origen:** Jira SCRUM-7

**Como** usuario de la aplicación
**Quiero** cambiar al idioma Chino
**Para** ver cómo se muestran las etiquetas en ese idioma.

### Criterios de aceptación
**Escenario 1 — Cambiar idioma a Chino**
- **Given** estoy en la interfaz de ABM clientes
- **When** me posiciono sobre el ícono de cambio de idioma y elijo "Chino"
- **Then** las etiquetas visibles de la interfaz se muestran en chino simplificado (título, formulario, botones, tabla)
- **And** el documento HTML tiene `lang="zh"`

**Escenario 2 — Cambiar idioma a Español**
- **Given** la interfaz está en chino
- **When** me posiciono sobre el ícono de cambio de idioma y elijo "Español"
- **Then** las etiquetas visibles de la interfaz se muestran en español
- **And** el documento HTML tiene `lang="es"`

**Notas técnicas:** reutiliza el selector de idioma de US-022. El chino es simplificado (`zh`). Japonés y Español siguen disponibles. El idioma por defecto sigue siendo español. No se persiste la preferencia.

