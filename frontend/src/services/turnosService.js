import api from './api'

export const getTurnos = async () => {
  const response = await api.get('/turnos')
  return response.data
}

export const createTurno = async (turnoData) => {
  const response = await api.post('/turnos', turnoData)
  return response.data
}