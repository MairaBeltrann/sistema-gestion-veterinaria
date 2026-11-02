import api from './api'

export const getPacientes = async () => {
  const response = await api.get('/pacientes')
  return response.data
}

export const createPaciente = async (pacienteData) => {
  const response = await api.post('/pacientes', pacienteData)
  return response.data
}
