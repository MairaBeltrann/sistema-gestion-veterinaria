import React, { useState } from 'react'
import { loginUser } from '../services/authService'

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const data = await loginUser(email, password)
      onLoginSuccess(data) // Pasamos los datos del usuario logueado al componente principal
    } catch (err) {
      setError('Correo o contraseña inválidos. Intenta nuevamente.')
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 w-full max-w-md">
        <div className="text-center mb-6">
          <span className="bg-indigo-50 p-3 rounded-2xl text-2xl inline-block mb-2">🔐</span>
          <h2 className="text-2xl font-bold text-slate-800">Iniciar Sesión</h2>
          <p className="text-sm text-slate-500">Sistema de Gestión Veterinaria</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Correo electrónico</label>
            <input
              type="email"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition"
          >
            Ingresar al Sistema
          </button>
        </form>

        <div className="mt-6 text-xs text-slate-400 bg-slate-50 p-3 rounded-lg space-y-1">
          <p className="font-semibold text-slate-500">Credenciales de prueba:</p>
          <p>👨‍⚕️ Admin: <code>admin@veterinaria.com</code> / <code>123</code></p>
          <p>👤 Cliente: <code>cliente@gmail.com</code> / <code>123</code></p>
        </div>
      </div>
    </div>
  )
}

export default Login