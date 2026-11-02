from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Turno(Base):
    __tablename__ = "turnos"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    fecha_hora = Column(DateTime, default=datetime.utcnow, nullable=False)
    servicio = Column(String, nullable=False)  # Ej: Peluquería, Vacunación, Cirugía
    mascota_nombre = Column(String, nullable=False)
    estado = Column(String, default="Pendiente", nullable=False)  # Pendiente, Confirmado, Cancelado
    deposito_pagado = Column(Boolean, default=False, nullable=False)  # Para la seña del 10% vía Mercado Pago
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)