import { BACKEND_URL } from '@/constants'
import axios from 'axios'


const axiosInstance = axios.create({
    baseURL: BACKEND_URL,
})

axiosInstance.interceptors.request.use(
    async (config) => {
        const token = sessionStorage.getItem('token')
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

export default axiosInstance
