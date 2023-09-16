import axios, { AxiosRequestConfig } from 'axios'
import { User } from '../types'
import config from '../../config'

const apiClient = () => {
  const instance = axios.create({ baseURL: config.apiURL })

  return instance
}

export default apiClient()
