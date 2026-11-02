import React, { useState, useEffect } from 'react'
import { getPacientes, createPaciente } from '../services/pacientesService'

function Pacientes() {
  const [pacientes, setPacientes] = useState([])
  const [formData, setFormData] = useState({
    nombre: '',
    especie: 'Perro',
    raza: '',
    edad: '',
    dueno: '',
    telefono: ''
  })

  useEffect(() => {
    cargarPacientes()
  }, [])

  const cargarPacientes = async () => {
    try {
      const data = await getPacientes()
      setPacientes(data)
    } catch (error) {
      console.error('Error al cargar pacientes:', error)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createPaciente({ ...formData, edad: parseInt(formData.edad) })
      setFormData({ nombre: '', especie: 'Perro', raza: '', edad: '', dueno: '', telefono: '' })
      cargarPacientes()
    } catch (error) {
      console.error('Error al guardar paciente:', error)
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          🐾 Registrar Nuevo Paciente
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre de la mascota"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
          />
          <select
            name="especie"
            value={formData.especie}
            onChange={handleChange}
            className="p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
          >
            <option value="Perro">Perro</option>
            <option value="Gato">Gato</option>
            <option value="Ave">Ave</option>
            <option value="Otro">Otro</option>
          </select>
          <input
            type="text"
            name="raza"
            placeholder="Raza"
            value={formData.raza}
            onChange={handleChange}
            required
            className="p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
          />
          <input
            type="number"
            name="edad"
            placeholder="Edad (años)"
            value={formData.edad}
            onChange={handleChange}
            required
            className="p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
          />
          <input
            type="text"
            name="dueno"
            placeholder="Nombre del dueño"
            value={formData.dueno}
            onChange={handleChange}
            required
            className="p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
          />
          <input
            type="text"
            name="telefono"
            placeholder="Teléfono de contacto"
            value={formData.telefono}
            onChange={handleChange}
            required
            className="p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
          />
          <button
            type="submit"
            className="md:col-span-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition"
          >
            Guardar Paciente
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-4">📋 Listado de Pacientes</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
                <th className="py-3 px-4">Mascota</th>
                <th className="py-3 px-4">Especie / Raza</th>
                <th className="py-3 px-4">Edad</th>
                <th className="py-3 px-4">Dueño</th>
                <th className="py-3 px-4">Contacto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {pacientes.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-semibold text-slate-800">{p.nombre}</td>
                  <td className="py-3 px-4">{p.especie} - {p.raza}</td>
                  <td className="py-3 px-4">{p.edad} años</td>
                  <td className="py-3 px-4">{p.dueno}</td>
                  <td className="py-3 px-4">{p.telefono}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Pacientes