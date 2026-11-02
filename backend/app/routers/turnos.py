from fastapi import APIRouter, HTTPException
from app.schemas.turno import TurnoCreate, TurnoResponse
from app.database.database_facade import DatabaseFacade

router = APIRouter(prefix="/turnos", tags=["Turnos"])

db_facade = DatabaseFacade(db_uri="veterinaria.db")

@router.post("/", response_model=TurnoResponse)
def crear_turno(turno: TurnoCreate):
    try:
        query = """
        INSERT INTO turnos (fecha_hora, servicio, mascota_nombre, estado, deposito_pagado, usuario_id) 
        VALUES (?, ?, ?, 'Pendiente', 0, ?)
        """
        params = (turno.fecha_hora, turno.servicio, turno.mascota_nombre, turno.usuario_id)
        
        nuevo_id = db_facade.ejecutar_consulta_segura(query, params)
        
        return {
            "id": nuevo_id,
            "fecha_hora": turno.fecha_hora,
            "servicio": turno.servicio,
            "mascota_nombre": turno.mascota_nombre,
            "estado": "Pendiente",
            "deposito_pagado": False,
            "usuario_id": turno.usuario_id
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al registrar el turno: {str(e)}")

@router.get("/", response_model=list[TurnoResponse])
def listar_turnos():
    try:
        query = "SELECT id, fecha_hora, servicio, mascota_nombre, estado, deposito_pagado, usuario_id FROM turnos"
        filas = db_facade.ejecutar_consulta_segura(query)
        
        turnos = []
        for fila in filas:
            turnos.append({
                "id": fila[0],
                "fecha_hora": fila[1],
                "servicio": fila[2],
                "mascota_nombre": fila[3],
                "estado": fila[4],
                "deposito_pagado": bool(fila[5]),
                "usuario_id": fila[6]
            })
        return turnos
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener los turnos: {str(e)}")

@router.patch("/{turno_id}/pagar", response_model=TurnoResponse)
def simular_pago_deposito(turno_id: int):
    try:
        # Actualizamos el estado de la seña y el turno
        query_update = """
        UPDATE turnos 
        SET deposito_pagado = 1, estado = 'Confirmado' 
        WHERE id = ?
        """
        db_facade.ejecutar_consulta_segura(query_update, (turno_id,))
        
        # Consultamos el turno actualizado para devolverlo en la respuesta
        query_select = "SELECT id, fecha_hora, servicio, mascota_nombre, estado, deposito_pagado, usuario_id FROM turnos WHERE id = ?"
        filas = db_facade.ejecutar_consulta_segura(query_select, (turno_id,))
        
        if not filas:
            raise HTTPException(status_code=404, detail="Turno no encontrado")
            
        fila = filas[0]
        return {
            "id": fila[0],
            "fecha_hora": fila[1],
            "servicio": fila[2],
            "mascota_nombre": fila[3],
            "estado": fila[4],
            "deposito_pagado": bool(fila[5]),
            "usuario_id": fila[6]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al procesar el pago de la seña: {str(e)}")