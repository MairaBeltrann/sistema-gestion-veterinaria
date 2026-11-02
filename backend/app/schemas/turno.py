#Los schemas sirven para validar los datos que entran y salen de la API desde el Frontend.
from pydantic import BaseModel

class TurnoCreate(BaseModel):
    fecha_hora: str  # Formato sugerido: "2026-11-01 10:00"
    servicio: str    # Ej: "Peluquería", "Vacunación", "Cirugía"
    mascota_nombre: str
    usuario_id: int  # ID del dueño registrado

class TurnoResponse(BaseModel):
    id: int
    fecha_hora: str
    servicio: str
    mascota_nombre: str
    estado: str
    deposito_pagado: bool
    usuario_id: int

    class Config:
        from_attributes = True