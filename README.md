# Sistema de Gestión Veterinaria

Sistema web enfocado en la administración de prestaciones veterinarias, gestión de personal, control de turnos mediante señas digitales y seguimiento de historias clínicas.

---

## Servicios Brindados por la Clínica

1. **Peluquería y Baño:** Servicio de higiene, corte y estética para mascotas.
2. **Vacunación:** Aplicación de dosis y control del esquema sanitario.
3. **Cirugías:** Programación e intervenciones quirúrgicas.

---

## Roles de Usuario y Funcionalidades

### Cliente / Dueño de Mascota
- **Autenticación y Cuenta:** Registro, inicio de sesión, recuperación de contraseña por correo electrónico y opción de darse de baja del sistema por cuenta propia.
- **Gestión de Mascotas:** Registrar sus mascotas y visualizar los servicios contratados para cada una de ellas.
- **Flujo de Reserva de Turnos:**
  1. Selección de la mascota y del servicio predefinido (Peluquería, Vacunación o Cirugía).
  2. Elección de fecha (con validación automática de días hábiles) y franja horaria disponible.
  3. Cálculo y visualización obligatoria del **10% del total del servicio** como seña.
- **Comprobantes:** Opción de visualizar y gestionar los turnos confirmados.
- **Consulta de Historia Clínica:** Acceso de solo lectura al historial clínico y fichas de sus mascotas (sin posibilidad de modificación).

### Médico / Personal de Atención
- **Panel Diario:** Visualizar la lista de servicios y turnos asignados del día.
- **Atención e Historia Clínica:** Iniciar la atención del paciente y cargar las novedades, notas o diagnósticos directamente en la historia clínica del animal.

### Dueño / Administrador
- **Gestión Exclusiva de Empleados:** Autorizado para crear usuarios, asignar credenciales y administrar el personal del sistema.
- **Control General:** Administrar la disponibilidad de servicios, horarios y verificar las citas y señas recibidas a través de la agenda general.

---

## Modelo de Datos (Esquema DER)

El sistema se estructura en las siguientes entidades principales:

- **Usuarios:** `id`, `nombre`, `email`, `password_hash`, `rol` (Cliente, Médico, Administrador), `estado_activo`.
- **Mascotas:** `id`, `cliente_id` (FK), `nombre`, `especie`, `raza`, `edad`, `fecha_nacimiento`.
- **Servicios:** `id`, `nombre` (Peluquería, Vacunación, Cirugía), `precio_total`, `duracion_estimada`.
- **Turnos / Reservas:** `id`, `mascota_id` (FK), `servicio_id` (FK), `profesional_id` (FK), `fecha_hora`, `monto_sena` (10%), `estado_pago` (Pendiente/Aprobado), `estado_turno`.
- **Historias Clínicas:** `id`, `mascota_id` (FK), `medico_id` (FK), `fecha`, `diagnostico`, `observaciones`.

---

## Políticas y Reglas de Negocio

- **Política de Reserva del 10%:** El monto calculado por la plataforma equivale exactamente al 10% del valor total del servicio contratado. **Esta seña no es reembolsable** en caso de inasistencia o falta del cliente.
- **Privacidad e Historial:** La historia clínica es de edición exclusiva del personal médico; el cliente solo posee acceso de lectura.

---

## Tecnologías

- **Backend:** Python (FastAPI) + Base de Datos SQLite.
- **Frontend:** React + Vite + Tailwind CSS.
- **Integraciones:** Pasarela de pagos con Mercado Pago (cobro de seña del 10%) y servicio de correo electrónico para recuperación de cuenta.

---

## Bitácora de Desarrollo

Registro cronológico de actividades, decisiones de diseño y avances del proyecto durante el cuatrimestre.

### [06/09/2026] - Versionado y Flujo del Proyecto (TP N° 1)
- **Actividad:** Configuración inicial del repositorio en GitHub y estructuración de carpetas base (`backend` y `frontend`).
- **Flujo de Trabajo:** Creación de ramas independientes por funcionalidad y organización del flujo de trabajo personal.
- **Integración y Calidad:** Control de versiones, estructuración de commits limpios y mantenimiento de la rama `main`.

### [07/09/2026] - Definición de la Arquitectura de Software
- **Selección de Arquitectura:** Se optó por una **Arquitectura en Capas (3 Capas)** desacoplada, utilizando **React** en el Frontend y **Python (FastAPI)** en el Backend.
- **Mapeo de Capas en el Sistema:**
  * **Capa de Presentación (Frontend):** Vistas en React para Clientes, Médicos y Administrador.
  * **Capa de Lógica de Negocio (Backend):** Reglas de validación de disponibilidad de turnos, cálculo de la seña del 10% y control de permisos por roles.
  * **Capa de Datos (Base de Datos):** Modelado y persistencia para las entidades del sistema.

### [14/09/2026] - Selección e Implementación del Patrón de Diseño (TP N° 2)
- **Análisis del Problema:** Ante escenarios de alta concurrencia en la gestión de turnos, se diseñó un administrador eficiente de conexiones (`Connection Pool`) para garantizar resiliencia ante microcortes o fallos de servicio.
- **Decisión de Diseño:** Implementación de la clase `DatabaseFacade` en el backend aplicando el patrón **Facade**, centralizando la ejecución segura de consultas y protegiendo los hilos de ejecución de la aplicación mediante límites de reintentos (`max_reintentos = 3`).

### [28/09/2026] - Arquitectura de Persistencia y Fachada de Base de Datos
- **Refactorización de la Capa de Datos:** Consolidación del uso de `DatabaseFacade` para la ejecución segura de consultas SQL y gestión de parámetros.
- **Módulo de Usuarios y Turnos:** Construcción de esquemas Pydantic y endpoints (`POST` y `GET`) para altas y reservas.

### [05/10/2026] - Reglas de Negocio, Historial Clínico y Métricas
- **Flujo de Confirmación de Turnos:** Desarrollo de lógica para simular la confirmación de la seña del 10% y actualización de estados.
- **Módulo de Historial Médico Digital:** Creación de entidades y endpoints para registros clínicos y diagnósticos vinculados a cada paciente.

### [12/10/2026] - Configuración de Frontend y Estructuración Base
- **Entorno Frontend:** Inicialización del cliente web con React y Vite, integrando Tailwind CSS para un diseño modular, moderno y responsivo.

### [19/10/2026] - Comunicación Cliente-Servidor e Integración con FastAPI
- **Capa de Servicios y CORS:** Configuración de la instancia centralizada de Axios en el frontend y políticas de CORS en FastAPI para habilitar la comunicación bidireccional de puertos (`5173` y `8000`).

### [26/10/2026] - Desarrollo del Módulo de Pacientes y Fichas Clínicas
- **Esquema y Endpoints en Backend:** Diseño de modelos Pydantic y endpoints de gestión de pacientes.
- **Componente Visual:** Desarrollo del servicio frontend (`pacientesService.js`) y componentes con Tailwind CSS para listados e ingresos interactivos.

### [27/10/2026] - Módulo de Autenticación, Login y Control de Accesos por Roles
- **Control de Accesos:** Implementación de esquemas de credenciales, autenticación por roles (`admin` y `cliente`) y persistencia visual dinámica en la interfaz de usuario.

### [28/10/2026] - Optimización de Turnos, Servicios Fijos y Validación Inteligente de Agenda
- **Catálogo de Servicios y Costos Automáticos:** Restricción del motivo de consulta a opciones predefinidas (*Vacunación*, *Peluquería*, *Cirugía*) con asignación automática e imborrable de tarifas fijas.
- **Validación de Días No Laborables:** Incorporación de lógica frontend/backend para detectar automáticamente días no hábiles (domingos), bloqueando la reserva y emitiendo alertas preventivas.
- **Control de Franjas Horarias Dinámicas:** Automatización del selector de horarios para ocultar de manera inteligente aquellas franjas ya ocupadas en la misma fecha, eliminando solapamientos y errores de operador.