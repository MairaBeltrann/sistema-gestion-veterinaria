import sqlite3

def inicializar_base_de_datos():
    conexion = sqlite3.connect("veterinaria.db")
    cursor = conexion.cursor()
    
    # Habilitar modo WAL y claves foráneas
    cursor.execute("PRAGMA journal_mode=WAL;")
    cursor.execute("PRAGMA foreign_keys = ON;")

    # Tabla de usuarios
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            telefono TEXT NOT NULL
        )
    """)

    # Tabla de turnos
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS turnos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fecha_hora TEXT NOT NULL,
            servicio TEXT NOT NULL,
            mascota_nombre TEXT NOT NULL,
            estado TEXT NOT NULL,
            deposito_pagado BOOLEAN NOT NULL,
            usuario_id INTEGER,
            FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
        )
    """)

    # Nueva tabla para el Historial Médico
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS historial_medico (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            mascota_nombre TEXT NOT NULL,
            diagnostico TEXT NOT NULL,
            tratamiento TEXT NOT NULL,
            fecha TEXT NOT NULL,
            usuario_id INTEGER,
            FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
        )
    """)

    conexion.commit()
    conexion.close()
    print("[Base de Datos] Tablas inicializadas correctamente, incluyendo Historial Médico.")

if __name__ == "__main__":
    inicializar_base_de_datos()