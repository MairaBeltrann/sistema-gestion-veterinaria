import time, sqlite3  

class DatabaseFacade:
    """
    Patrón Facade: Coordina la ejecución de consultas SQL, el manejo
    de pool de conexiones, tiempos de espera y reconexión resiliente.
    """
    def __init__(self, db_uri: str, min_pool: int = 5, max_pool: int = 20, timeout: int = 10):
        self.db_uri = db_uri
        self.min_pool = min_pool
        self.max_pool = max_pool
        self.timeout = timeout
        self.pool = None
        
        # Inicializamos el pool al arrancar la fachada
        self._inicializar_pool()

    def _inicializar_pool(self):
        """Crea o reinicia el pool de conexiones."""
        print(f"[DatabaseFacade] Inicializando pool de conexiones (Min: {self.min_pool}, Max: {self.max_pool})...")
        # Inicialización de pool
        self.pool = {"activo": True, "uri": self.db_uri}

    def _recuperar_conexion_limpia(self):
        """Si el pool está corrupto o caído, lo reinicia por completo."""
        print("[DatabaseFacade] ALERTA: Error de red/base de datos. Destruyendo y recreando el pool de conexiones...")
        self._inicializar_pool()

    def ejecutar_consulta_segura(self, query: str, params: tuple = (), max_reintentos: int = 3):
        """
        Reintenta un número FINITO de veces (max_reintentos). Si detecta error de conexión, reinicia el pool completo.
        """
        intentos = 0
        tiempo_espera = 1  

        while intentos < max_reintentos:
            try:
                # Simulación de extracción de conexión del pool con timeout
                conexion = sqlite3.connect(self.db_uri, timeout=self.timeout)
                cursor = conexion.cursor()
                
                cursor.execute(query, params)
                conexion.commit()
                resultado = cursor.fetchall()
                conexion.close()
                
                return resultado

            except (sqlite3.OperationalError, sqlite3.DatabaseError, Exception) as error:
                intentos += 1
                print(f"[DatabaseFacade] Error en intento {intentos}/{max_reintentos}: {error}")

                # 1. Reiniciamos el pool para desacoplar conexiones muertas
                self._recuperar_conexion_limpia()

                # 2. Si llegamos al límite de intentos, CORTAMOS para evitar bucles infinitos
                if intentos >= max_reintentos:
                    print("[DatabaseFacade] ERROR CRÍTICO: Se alcanzó el máximo de reintentos. Cancelando operación.")
                    raise Exception(
                        f"No se pudo completar la operación tras {max_reintentos} intentos. "
                        "El sistema protegió el hilo de ejecución para evitar un bucle infinito."
                    )

                # 3. Espera progresiva antes de reintentar
                time.sleep(tiempo_espera)
                tiempo_espera *= 2  