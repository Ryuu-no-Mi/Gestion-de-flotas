import axios from 'axios'
import router from '../router'

const instance = axios.create({
  baseURL: 'https://localhost:7077/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Agregar el token a cada petición (si existe)
instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Verificar errores de autenticación
instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      console.warn('Token inválido o expirado')
      localStorage.removeItem('token')

      if (router.currentRoute.path !== '/login') {
        router.push({ name: 'login' })
      }
      
    }
    return Promise.reject(error)
  }
)

export default instance
