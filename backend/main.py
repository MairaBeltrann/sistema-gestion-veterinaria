from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

# Inicialización de la aplicación FastAPI
app = FastAPI()

# Configuración de políticas CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Esquema Pydantic para Paciente
class Paciente(BaseModel):
    id: Optional[int] = None
    nombre: str
    especie: str
    raza: str
    edad: int
    dueno: str
    telefono: str

# Esquema Pydantic para Login
class LoginRequest(BaseModel):
    email: str
    password: str

# Base de datos en memoria (Pacientes)
pacientes_db = [
    {"id": 1, "nombre": "Firulais", "especie": "Perro", "raza": "Labrador", "edad": 4, "dueno": "Carlos Gómez", "telefono": "3811234567"},
    {"id": 2, "nombre": "Michi", "especie": "Gato", "raza": "Siamés", "edad": 2, "dueno": "Ana Martínez", "telefono": "3817654321"}
]

# Base de datos en memoria (Usuarios/Roles)
usuarios_db = [
    {"email": "admin@veterinaria.com", "password": "123", "nombre": "Dra. Laura Pérez", "rol": "admin"},
    {"email": "cliente@gmail.com", "password": "123", "nombre": "Carlos Gómez", "rol": "cliente"}
]

@app.get("/")
def read_root():
    return {"message": "¡Conexión exitosa con el backend de la Veterinaria! 🐾"}

@app.get("/pacientes", response_model=List[Paciente])
def obtener_pacientes():
    return pacientes_db

@app.post("/pacientes", response_model=Paciente)
def crear_paciente(paciente: Paciente):
    paciente.id = len(pacientes_db) + 1
    pacientes_db.append(paciente.dict())
    return paciente

@app.post("/login")
def login_usuario(credenciales: LoginRequest):
    for usuario in usuarios_db:
        if usuario["email"] == credenciales.email and usuario["password"] == credenciales.password:
            return {
                "mensaje": f"¡Bienvenido de nuevo, {usuario['nombre']}!",
                "nombre": usuario["nombre"],
                "rol": usuario["rol"]
            }
    raise HTTPException(status_code=401, detail="Credenciales incorrectas. Verifique email y contraseña.")

# Esquema Pydantic para Turnos y Reservas
class Turno(BaseModel):
    id: Optional[int] = None
    paciente: str
    dueno: str
    fecha: str
    hora: str
    motivo: str
    costo_total: float
    senia: Optional[float] = None
    estado_pago: str = "Pendiente de Seña"

# Base de datos en memoria para Turnos
turnos_db = [
    {
        "id": 1,
        "paciente": "Firulais",
        "dueno": "Carlos Gómez",
        "fecha": "2026-10-25",
        "hora": "10:00",
        "motivo": "Control general",
        "costo_total": 15000.0,
        "senia": 1500.0,
        "estado_pago": "Seña Abonada (10%)"
    }
]

@app.get("/turnos", response_model=List[Turno])
def obtener_turnos():
    return turnos_db

@app.post("/turnos", response_model=Turno)
def crear_turno(turno: Turno):
    # Validar si ya existe un turno en la misma fecha y hora
    for t in turnos_db:
        if t["fecha"] == turno.fecha and t["hora"] == turno.hora:
            raise HTTPException(
                status_code=400, 
                detail="¡Atención! Ya existe un turno reservado en esa misma fecha y horario."
            )

    # Calculamos automáticamente el 10% de seña basado en el costo total
    turno.senia = turno.costo_total * 0.10
    turno.estado_pago = "Pendiente de Seña"
    turno.id = len(turnos_db) + 1
    turnos_db.append(turno.dict())
    
    # Automatización: Verificamos si el paciente ya existe en pacientes_db; si no, lo guardamos
    paciente_existente = any(p["nombre"].lower() == turno.paciente.lower() for p in pacientes_db)
    if not paciente_existente:
        nuevo_paciente = {
            "id": len(pacientes_db) + 1,
            "nombre": turno.paciente,
            "especie": "Canino/Felino",
            "raza": "A definir",
            "edad": 1,
            "dueno": turno.dueno,
            "telefono": "Sin registrar"
        }
        pacientes_db.append(nuevo_paciente)
        
    return turno
   