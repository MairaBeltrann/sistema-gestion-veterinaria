from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    nombre: str
    email: str
    telefono: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True