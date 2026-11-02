import axios from 'axios'

// Creamos una instancia de axios apuntando a nuestro backend de FastAPI
const api = axios.create({
  baseURL: 'http://localhost:8000', // URL estándar de FastAPI
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api