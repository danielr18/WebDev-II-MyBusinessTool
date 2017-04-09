import axios from 'axios'

const devConfig = {
  baseURL: 'http://localhost:8080/MyBusinessTool/',
  withCredentials: true
}

const productionConfig = {
  baseURL: '/MyBusinessTool/'
}

const instance = axios.create(__DEV__ ? devConfig : productionConfig)

export default instance
