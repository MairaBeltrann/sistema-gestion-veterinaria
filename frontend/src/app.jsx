import React, { useState } from 'react'
import EstadoServidor from './components/EstadoServidor'
import Login from './components/Login'
import Pacientes from './components/Pacientes'
import Turnos from './components/Turnos'

function App() {
  const [usuario, setUsuario] = useState(null)
  const [vistaActiva, setVistaActiva] = useState('turnos')

  const handleLogout = () => {
    setUsuario(null)
    setVistaActiva('turnos')
  }

  const handleLoginSuccess = (userData) => {
    setUsuario(userData)
    // Si es admin arranca en pacientes, si es cliente arranca directamente en turnos
    setVistaActiva(userData.rol === 'admin' ? 'pacientes' : 'turnos')
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6 space-y-6">
      <header className="max-w-5xl mx-auto flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3">
          <span className="bg-indigo-50 p-2 rounded-xl text-xl">🐾</span>
          <div>
            <h1 className="text-lg font-bold text-slate-800">Sistema Veterinario</h1>
            {usuario && (
              <p className="text-xs text-indigo-600 font-medium">
                Rol: <span className="uppercase font-bold">{usuario.rol}</span> ({usuario.nombre})
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <EstadoServidor />
          {usuario && (
            <button
              onClick={handleLogout}
              className="bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 text-xs font-semibold px-3 py-2 rounded-lg transition border border-slate-200"
            >
              Cerrar Sesión
            </button>
          )}
        </div>
      </header>

      <main>
        {!usuario ? (
          <Login onLoginSuccess={handleLoginSuccess} />
        ) : (
          <div className="space-y-6">
            <div className="max-w-5xl mx-auto bg-indigo-50 border border-indigo-100 p-4 rounded-2xl text-indigo-800 text-sm flex justify-between items-center">
              <span>🎉 ¡Sesión iniciada con éxito! Panel adaptado a tu nivel de permisos.</span>
              <div className="flex gap-2">
                {/* El botón de Pacientes solo se muestra si el rol es admin */}
                {usuario.rol === 'admin' && (
                  <button
                    onClick={() => setVistaActiva('pacientes')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${vistaActiva === 'pacientes' ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 border border-indigo-200'}`}
                  >
                    Gestión de Pacientes
                  </button>
                )}
                <button
                  onClick={() => setVistaActiva('turnos')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${vistaActiva === 'turnos' ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 border border-indigo-200'}`}
                >
                  {usuario.rol === 'admin' ? 'Agenda y Turnos' : 'Mis Turnos y Reservas'}
                </button>
              </div>
            </div>
            {/* Renderizado condicional estricto por rol */}
            {usuario.rol === 'admin' && vistaActiva === 'pacientes' ? (
              <Pacientes />
              ) : (
              <Turnos usuario={usuario} />
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default App