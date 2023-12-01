import axios from 'axios'
import config from '../../config'

const apiClient = () => {
  const instance = axios.create({ baseURL: config.apiURL })

  return instance
}

export default apiClient()
