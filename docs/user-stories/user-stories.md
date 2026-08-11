# User Stories — ABM de Clientes

> Insumo oficial del proyecto. Versión Markdown del documento `User-Stories-ABM-Clientes.docx` para consumo del agente Cursor. Ante diferencia, prevalece el .docx.

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
