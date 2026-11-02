from pydantic import BaseModel

class HistorialCreate(BaseModel):
    mascota_nombre: str
    diagnostico: str
    tratamiento: str
    fecha: str          # Formato sugerido: "2026-10-26"
    usuario_id: int     # Dueño de la mascota

class HistorialResponse(BaseModel):
    id: int
    mascota_nombre: str
    diagnostico: str
    tratamiento: str
    fecha: str
    usuario_id: int

    class Config:
        from_attributes = True