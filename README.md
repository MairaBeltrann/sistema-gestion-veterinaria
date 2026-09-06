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
