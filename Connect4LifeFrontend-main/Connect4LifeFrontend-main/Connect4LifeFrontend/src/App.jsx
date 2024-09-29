// src/App.js
import { RouterProvider, createHashRouter } from 'react-router-dom'
import Overview from './Pages/Overview/Overview'
import Us from './Pages/Us'
import UnderConstruction from './Pages/UnderConstruction'
import About from './Components/About'
import './index.css'
import SignUp from './Pages/Signup'
import SignIn from './Pages/Signin'
import Intro from './Pages/intro'
import AddNewTask from './Pages/NewTask/AddNewTask'
import ProtectedRoute from './Components/ProtectedRoute'
import { UserProvider } from './Components/UserContext'
import Statistics from './Pages/statistics/statistics'

import MyTasks from './Pages/MyTasks/MyTasks'

const router = createHashRouter([
  {
    path: '/',
    element: <Intro />,
  },
  {
    path: '/signup',
    element: <SignUp />,
  },
  {
    path: '/home',
    element: <ProtectedRoute element={About} />,
    children: [
      {
        path: 'overview',
        element: <ProtectedRoute element={Overview} />,
      },
      {
        path: 'about',
        element: <ProtectedRoute element={Statistics} />,
      },
      {
        path: 'myTasks',
        element: <ProtectedRoute element={MyTasks} />,
      },
    ],
  },
])

const App = () => {
  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  )
}

export default App
