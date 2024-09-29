import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import { Box } from '@mui/material'

const About = () => {
  return (
    <>
      <nav>
        <Box sx={{ flex: '0 0 auto' }}>
          <Navbar />
        </Box>
      </nav>
      <Outlet />
    </>
  )
}
export default About
