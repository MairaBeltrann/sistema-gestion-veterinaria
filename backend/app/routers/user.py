from fastapi import APIRouter, HTTPException
from app.schemas.user import UserCreate, UserResponse
from app.database.database_facade import DatabaseFacade

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])

# Instanciamos la fachada apuntando a nuestra base de datos
db_facade = DatabaseFacade(db_uri="veterinaria.db")

@router.post("/", response_model=UserResponse)
def crear_usuario(user: UserCreate):
    try:
        query = "INSERT INTO usuarios (nombre, email, telefono) VALUES (?, ?, ?)"
        params = (user.nombre, user.email, user.telefono)
        
        # Ejecutamos la inserción segura mediante la fachada
        db_facade.ejecutar_consulta_segura(query, params)
        
        return {
            "id": 1, 
            "nombre": user.nombre,
            "email": user.email,
            "telefono": user.telefono
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al registrar usuario: {str(e)}")

@router.get("/", response_model=list[UserResponse])
def listar_usuarios():
    try:
        query = "SELECT id, nombre, email, telefono FROM usuarios"
        # Ejecutamos la consulta para traer todos los registros
        filas = db_facade.ejecutar_consulta_segura(query)
        
        usuarios = []
        for fila in filas:
            usuarios.append({
                "id": fila[0],
                "nombre": fila[1],
                "email": fila[2],
                "telefono": fila[3]
            })
        return usuarios
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener los usuarios: {str(e)}")