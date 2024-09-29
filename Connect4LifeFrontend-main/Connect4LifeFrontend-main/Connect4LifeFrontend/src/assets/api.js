// src/assets/api.js
import axios from 'axios'
import { TASK_URL } from './paths'

export const fetchTasks = async () => {
  try {
    const response = await axios.get(`${TASK_URL}/tasks`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you store your token in localStorage
      },
    })
    return response.data
  } catch (error) {
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error('Error response:', error.response.data)
      console.error('Error status:', error.response.status)
      console.error('Error headers:', error.response.headers)
    } else if (error.request) {
      // Request was made but no response was received
      console.error('Error request:', error.request)
    } else {
      // Something happened in setting up the request
      console.error('Error message:', error.message)
    }
    throw error
  }
}
