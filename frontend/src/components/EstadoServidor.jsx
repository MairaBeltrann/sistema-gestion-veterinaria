import React, { useState, useEffect } from 'react'
import api from '../services/api'

function EstadoServidor() {
  const [mensajeBackend, setMensajeBackend] = useState('Conectando con FastAPI...')
  const [estadoConexion, setEstadoConexion] = useState('text-amber-600 bg-amber-50')

  useEffect(() => {
    // Aquí hacemos la llamada a una ruta de prueba de FastAPI (puedes ajustarla según tu main.py del backend)
    api.get('/')
      .then((response) => {
        setMensajeBackend(response.data.message || '¡Conexión exitosa con el backend!')
        setEstadoConexion('text-emerald-700 bg-emerald-50 border-emerald-200')
      })
      .catch((error) => {
        console.error('Error al conectar con el backend:', error)
        setMensajeBackend('No se pudo conectar con el servidor de Python (¿Está apagado?)')
        setEstadoConexion('text-rose-700 bg-rose-50 border-rose-200')
      })
  }, [])

  return (
    <div className="mt-4 p-4 rounded-xl border border-slate-200 bg-slate-50 text-left">
      <h3 className="text-sm font-semibold text-slate-700 mb-1">Estado de la Base de Datos y Backend:</h3>
      <p className={`text-xs p-2 rounded-lg border font-medium ${estadoConexion}`}>
        {mensajeBackend}
      </p>
    </div>
  )
}

export default EstadoServidor