import React, { useState, useEffect } from 'react'
import { getTurnos, createTurno } from '../services/turnosService'
import { getPacientes } from '../services/pacientesService'

const SERVICIOS_DISPONIBLES = [
  { nombre: 'Vacunación', costo: 10000.0 },
  { nombre: 'Peluquería', costo: 12000.0 },
  { nombre: 'Cirugía', costo: 35000.0 }
]

const HORARIOS_BASE = [
  '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'
]

function Turnos({ usuario }) {
  const [turnos, setTurnos] = useState([])
  const [pacientes, setPacientes] = useState([])
  const [errorMsg, setErrorMsg] = useState('')
  const [infoMsg, setInfoMsg] = useState('')
  const [form, setForm] = useState({
    paciente: '',
    dueno: usuario && usuario.rol === 'cliente' ? usuario.nombre : '',
    fecha: '',
    hora: '',
    motivo: '',
    costo_total: ''
  })

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      const dataTurnos = await getTurnos()
      setTurnos(dataTurnos)
      const dataPacientes = await getPacientes()
      setPacientes(dataPacientes)
    } catch (error) {
      console.error('Error al cargar datos:', error)
    }
  }

  const pacientesDisponibles = usuario && usuario.rol === 'cliente'
    ? pacientes.filter(p => p.dueno.toLowerCase() === usuario.nombre.toLowerCase())
    : pacientes

  const handlePacienteChange = (e) => {
    const nombreMascota = e.target.value
    setForm(prev => ({ ...prev, paciente: nombreMascota }))

    if (usuario && usuario.rol === 'admin') {
      const pacienteEncontrado = pacientes.find(p => p.nombre === nombreMascota)
      if (pacienteEncontrado) {
        setForm(prev => ({ ...prev, paciente: nombreMascota, dueno: pacienteEncontrado.dueno }))
      }
    }
  }

  const handleServicioChange = (e) => {
    const servicioNombre = e.target.value
    const servicioEncontrado = SERVICIOS_DISPONIBLES.find(s => s.nombre === servicioNombre)

    if (servicioEncontrado) {
      setForm(prev => ({
        ...prev,
        motivo: servicioEncontrado.nombre,
        costo_total: servicioEncontrado.costo,
        hora: '' // Reseteamos la hora al cambiar de servicio/motivo
      }))
    } else {
      setForm(prev => ({ ...prev, motivo: '', costo_total: '', hora: '' }))
    }
  }

  const handleFechaChange = (e) => {
    const nuevaFecha = e.target.value
    setErrorMsg('')
    setInfoMsg('')

    if (nuevaFecha) {
      const fechaObj = new Date(nuevaFecha + 'T00:00:00')
      const diaSemana = fechaObj.getDay() // 0 = Domingo, 6 = Sábado

      if (diaSemana === 0) {
        setErrorMsg('⚠️ La veterinaria permanece cerrada los domingos. Por favor, seleccione otro día.')
        setForm(prev => ({ ...prev, fecha: '', hora: '' }))
        return
      } else if (diaSemana === 6) {
        setInfoMsg('ℹ️ Atención: Los sábados trabajamos con horario reducido (solo turno mañana).')
      }
    }

    setForm(prev => ({ ...prev, fecha: nuevaFecha, hora: '' }))
  }

  // Filtrar horarios ya ocupados para la fecha seleccionada
  const horariosOcupados = turnos
    .filter(t => t.fecha === form.fecha)
    .map(t => t.hora)

  const horariosDisponibles = HORARIOS_BASE.filter(h => !horariosOcupados.includes(h))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    try {
      await createTurno({
        ...form,
        costo_total: parseFloat(form.costo_total)
      })
      setForm({ 
        paciente: '', 
        dueno: usuario && usuario.rol === 'cliente' ? usuario.nombre : '', 
        fecha: '', 
        hora: '', 
        motivo: '', 
        costo_total: '' 
      })
      cargarDatos()
    } catch (error) {
      if (error.response && error.response.data && error.response.data.detail) {
        setErrorMsg(error.response.data.detail)
      } else {
        setErrorMsg('Error al registrar el turno.')
      }
    }
  }

  const turnosVisibles = usuario && usuario.rol === 'cliente'
    ? turnos.filter(t => t.dueno.toLowerCase().includes(usuario.nombre.toLowerCase()))
    : turnos

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Formulario de Reserva */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span>📅</span> Solicitar Turno y Calcular Seña (10%)
        </h3>

        {errorMsg && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
            {errorMsg}
          </div>
        )}

        {infoMsg && (
          <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-xl text-sm font-medium">
            {infoMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Selector de Mascota */}
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-500 mb-1">Mascota / Paciente</label>
            <select
              value={form.paciente}
              onChange={handlePacienteChange}
              required
              className="p-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="">Seleccione una mascota...</option>
              {pacientesDisponibles.map((p) => (
                <option key={p.id} value={p.nombre}>
                  {p.nombre} ({p.especie})
                </option>
              ))}
            </select>
          </div>

          {/* Dueño Responsable */}
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-500 mb-1">Dueño Responsable</label>
            <input
              type="text"
              placeholder="Nombre del dueño"
              value={form.dueno}
              disabled={usuario && usuario.rol === 'cliente'}
              onChange={(e) => setForm({ ...form, dueno: e.target.value })}
              required
              className="p-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
            />
          </div>

          {/* Servicio / Motivo (Paso lógico previo) */}
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-500 mb-1">Servicio / Motivo</label>
            <select
              value={form.motivo}
              onChange={handleServicioChange}
              required
              className="p-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="">Seleccione un servicio...</option>
              {SERVICIOS_DISPONIBLES.map((s, idx) => (
                <option key={idx} value={s.nombre}>
                  {s.nombre} (${s.costo.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          {/* Fecha de la Cita */}
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-500 mb-1">Fecha de la Cita</label>
            <input
              type="date"
              value={form.fecha}
              onChange={handleFechaChange}
              required
              className="p-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Horario Disponible (Dinámico según fecha y turnos existentes) */}
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-500 mb-1">Horario Disponible</label>
            <select
              value={form.hora}
              onChange={(e) => setForm({ ...form, hora: e.target.value })}
              required
              disabled={!form.fecha || !form.motivo}
              className="p-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white disabled:bg-slate-100 disabled:cursor-not-allowed"
            >
              <option value="">
                {!form.fecha ? 'Seleccione fecha primero...' : 'Seleccione un horario libre...'}
              </option>
              {horariosDisponibles.map((h, idx) => (
                <option key={idx} value={h}>{h} hs</option>
              ))}
            </select>
          </div>

          {/* Costo Total ($ Automático) */}
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-500 mb-1">Costo Total ($ Automático)</label>
            <input
              type="number"
              placeholder="0.00"
              value={form.costo_total}
              readOnly
              required
              className="p-2.5 border rounded-lg text-sm outline-none bg-slate-100 text-slate-700 font-semibold cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            className="md:col-span-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition text-sm shadow-md"
          >
            Reservar Turno (Generar seña del 10%)
          </button>
        </form>
      </div>

      {/* Listado de Turnos */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span>📋</span> {usuario && usuario.rol === 'cliente' ? 'Mis Turnos y Reservas' : 'Agenda General de Turnos'}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b text-slate-400 font-semibold text-xs uppercase">
                <th className="pb-3">Paciente / Dueño</th>
                <th className="pb-3">Fecha y Hora</th>
                <th className="pb-3">Servicio</th>
                <th className="pb-3">Costo Total</th>
                <th className="pb-3">Seña (10%)</th>
                <th className="pb-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {turnosVisibles.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-slate-400 text-sm">
                    No hay turnos registrados para mostrar.
                  </td>
                </tr>
              ) : (
                turnosVisibles.map((t, index) => (
                  <tr key={index} className="hover:bg-slate-50 transition">
                    <td className="py-3">
                      <p className="font-medium text-slate-800">{t.paciente}</p>
                      <p className="text-xs text-slate-500">{t.dueno}</p>
                    </td>
                    <td className="py-3 text-slate-600">
                      {t.fecha} - {t.hora} hs
                    </td>
                    <td className="py-3 text-slate-600">{t.motivo}</td>
                    <td className="py-3 font-semibold text-slate-800">${t.costo_total}</td>
                    <td className="py-3 font-semibold text-indigo-600">${t.senia}</td>
                    <td className="py-3">
                      <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full text-xs font-semibold">
                        {t.estado_pago}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Turnos