// src/Components/ProtectedRoute.js
import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { UserContext } from './UserContext'

const ProtectedRoute = ({ element: Element, ...rest }) => {
  const { isAuthenticated } = useContext(UserContext)
  return isAuthenticated ? <Element {...rest} /> : <Navigate to="/signin" />
}

export default ProtectedRoute
