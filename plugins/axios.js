import axios from 'axios'

const instance = axios.create({
  baseURL: process.env.API_URL,
  headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}
})

export default instance