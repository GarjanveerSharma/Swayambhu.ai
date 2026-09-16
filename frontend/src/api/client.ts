import axios from 'axios'
import { API_URL } from '../constants/config'

export const api = axios.create({ baseURL: API_URL, timeout: 30000 })

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.detail ?? (err.request ? 'Backend se connect nahi ho paya. Check karo server chal raha hai.' : err.message)
    return Promise.reject(new Error(message))
  },
)
