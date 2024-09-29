// src/Components/Navigation.js
import React from 'react'
import { Link } from 'react-router-dom'

const Navigation = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/home/overview">Overview</Link>
        </li>
        <li>
          <Link to="/home/statistics">Statistics</Link>
        </li>
        <li>
          <Link to="/home/myTasks">My Tasks</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navigation
