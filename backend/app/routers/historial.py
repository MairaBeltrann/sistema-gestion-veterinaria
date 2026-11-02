from fastapi import APIRouter, HTTPException
from app.schemas.historial import HistorialCreate, HistorialResponse
from app.database.database_facade import DatabaseFacade

router = APIRouter(prefix="/historial", tags=["Historial Médico"])
db_facade = DatabaseFacade(db_uri="veterinaria.db")

@router.post("/", response_model=HistorialResponse)
def crear_historial(historial: HistorialCreate):
    try:
        query = """
        INSERT INTO historial_medico (mascota_nombre, diagnostico, tratamiento, fecha, usuario_id) 
        VALUES (?, ?, ?, ?, ?)
        """
        params = (
            historial.mascota_nombre, 
            historial.diagnostico, 
            historial.tratamiento, 
            historial.fecha, 
            historial.usuario_id
        )
        
        nuevo_id = db_facade.ejecutar_consulta_segura(query, params)
        
        return {
            "id": nuevo_id,
            "mascota_nombre": historial.mascota_nombre,
            "diagnostico": historial.diagnostico,
            "tratamiento": historial.tratamiento,
            "fecha": historial.fecha,
            "usuario_id": historial.usuario_id
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al registrar historial médico: {str(e)}")

@router.get("/{usuario_id}", response_model=list[HistorialResponse])
def listar_historial_por_usuario(usuario_id: int):
    try:
        query = "SELECT id, mascota_nombre, diagnostico, tratamiento, fecha, usuario_id FROM historial_medico WHERE usuario_id = ?"
        filas = db_facade.ejecutar_consulta_segura(query, (usuario_id,))
        
        registros = []
        for fila in filas:
            registros.append({
                "id": fila[0],
                "mascota_nombre": fila[1],
                "diagnostico": fila[2],
                "tratamiento": fila[3],
                "fecha": fila[4],
                "usuario_id": fila[5]
            })
        return registros
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener el historial médico: {str(e)}")