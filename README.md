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
* **Autenticación y Cuenta:** Registro, inicio de sesión, recuperación de contraseña por correo electrónico y opción de darse de baja del sistema por cuenta propia.
* **Gestión de Mascotas:** Registrar sus mascotas y visualizar los servicios contratados para cada una de ellas.
* **Flujo de Reserva de Turnos:**
  1. Selección de la mascota y del servicio (Peluquería/Baño, Vacunación o Cirugía).
  2. Elección de fecha, hora disponible y profesional de preferencia.
  3. Pago obligatorio del **10% del total del servicio** como seña a través de **Mercado Pago**.
* **Comprobantes:** Opción de **imprimir la reserva/comprobante** del turno confirmado.
* **Consulta de Historia Clínica:** Acceso de solo lectura al historial clínico y fichas de sus mascotas (sin posibilidad de modificación).

### Médico / Personal de Atención
* **Panel Diario:** Visualizar la lista de servicios y turnos asignados del día, con la opción de **imprimir la planilla de trabajo**.
* **Atención e Historia Clínica:** Iniciar la atención del paciente y cargar las novedades, notas o diagnósticos directamente en la historia clínica del animal.

### Dueño / Administrador
* **Gestión Exclusiva de Empleados:** Es el único autorizado para crear usuarios, asignar contraseñas iniciales y dar de baja al personal/empleados del sistema.
* **Control General:** Administrar la disponibilidad de servicios, horarios y verificar las señas recibidas.

---

## Modelo de Datos (Esquema DER)

El sistema se estructura en las siguientes entidades principales:

* **Usuarios:** `id`, `nombre`, `email`, `password_hash`, `rol` (Cliente, Médico, Administrador), `estado_activo`.
* **Mascotas:** `id`, `cliente_id` (FK), `nombre`, `especie`, `raza`, `edad`, `fecha_nacimiento`.
* **Servicios:** `id`, `nombre` (Peluquería, Vacunación, Cirugía), `precio_total`, `duracion_estimada`.
* **Turnos / Reservas:** `id`, `mascota_id` (FK), `servicio_id` (FK), `profesional_id` (FK), `fecha_hora`, `monto_sena` (10%), `estado_pago` (Pendiente/Aprobado), `estado_turno`.
* **Historias Clínicas:** `id`, `mascota_id` (FK), `medico_id` (FK), `fecha`, `diagnostico`, `observaciones`.

---

## Políticas y Reglas de Negocio

* **Política de Reserva del 10%:** El pago realizado por la plataforma equivale exactamente al 10% del valor total del servicio contratado. **Esta seña no es reembolsable** en caso de inasistencia o falta del cliente.
* **Privacidad e Historial:** La historia clínica es de edición exclusiva del personal médico; el cliente solo posee acceso de lectura.

---

## Tecnologías

* **Backend:** Python (FastAPI / Flask) + Base de Datos MySQL / SQLite.
* **Frontend:** React + Vite + Tailwind CSS.
* **Integraciones:** Pasarela de pagos con Mercado Pago (cobro de seña del 10%) y servicio de correo electrónico para recuperación de cuenta.
---


## Bitácora de Desarrollo

Registro cronológico de actividades, decisiones de diseño y avances del proyecto durante el cuatrimestre.

### [06/09/2026] - Versionado y Flujo Colaborativo (TP N° 1)
* **Actividad:** Configuración inicial del repositorio en GitHub y estructuración de carpetas base (`backend` y `frontend`).
* **Flujo de Trabajo:** Creación de ramas independientes por funcionalidad (`feature/auth-models` y `feature/turnos-pagos`).
* **Resolución de Conflictos:** Provocación y resolución manual de un conflicto de fusión (*Merge Conflict*) en el archivo `README.md`, unificando las reglas de negocio con la estructura general del proyecto.
* **Integración y Calidad:** Apertura, revisión y aprobación de Pull Requests (`#1` y `#2`), finalizando con un *soft reset* para mantener un historial de commits limpio y profesional en la rama `main`.

### [07/09/2026] - Definición de la Arquitectura de Software
* **Selección de Arquitectura:** Se optó por una **Arquitectura en Capas (3 Capas)** desacoplada, utilizando **React** en el Frontend y **Python (FastAPI/Flask)** en el Backend.
* **Mapeo de Capas en el Sistema:**
  * **Capa de Presentación (Frontend):** Vistas en React para Clientes (reserva de turnos y consulta de fichas), Médicos (agenda diaria y carga de diagnósticos) y Administrador (gestión de personal).
  * **Capa de Lógica de Negocio (Backend):** Reglas de validación de disponibilidad de turnos, cálculo de la seña del 10% no reembolsable, integración con la API de Mercado Pago y control de permisos por roles.
  * **Capa de Datos (Base de Datos):** Modelado y persistencia en MySQL/SQLite mediante ORM (SQLAlchemy) para las entidades `Usuarios`, `Mascotas`, `Servicios`, `Turnos` e `HistoriasClinicas`.
* **Justificación:** Esta arquitectura independiente permite aislar la experiencia de usuario de la lógica crítica y facilita futuras expansiones (como una aplicación móvil).
