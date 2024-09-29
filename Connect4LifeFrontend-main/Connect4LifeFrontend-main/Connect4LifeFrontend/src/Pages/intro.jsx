import React, { useState } from 'react'
import {
  Button,
  Container,
  Typography,
  Box,
  Drawer,
  IconButton,
  useTheme,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import Signin from './Signin' // Adjust the import according to your project structure
import SignUp from './Signup'

const Introduction = ({ isLoggedIn }) => {
  return (
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        px: 2,
        py: 4,
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography component="h1" variant="h4" gutterBottom>
        Welcome to Connect4Life
      </Typography>
      <Typography variant="body1">
        Our system aims to facilitate organized and efficient coordination
        between bone marrow donors and recipients. The bone marrow donation
        process involves several essential steps, including collecting blood
        from the donor until a match is found. We developed a web app to
        consolidate and monitor all details related to blood donors and the
        individuals who physically collect the blood samples. The system has two
        types of users: the admin and the blood collector. The application
        allows them to create new tasks, find nearby blood collection tasks,
        update personal details saved in the system, and view statistics on
        previously completed tasks. A task is defined as the collection of blood
        from a potential donor at their home by a blood collector who visits
        them for this purpose.
      </Typography>
    </Box>
  )
}

const App = () => {
  const theme = useTheme()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [drawerState, setDrawerState] = useState({
    login: false,
    signup: false,
  })

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  const toggleDrawer = (open, drawer) => () => {
    setDrawerState((prevState) => ({
      ...prevState,
      [drawer]: open ? !prevState[drawer] : false,
    }))
  }

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 4,
          position: 'relative',
          alignItems: 'center',
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={toggleDrawer(true, 'login')}
          sx={{
            zIndex: 1300, // Ensure the button is on top
            borderRadius: 3,
            px: 3,
            backgroundColor: '#007bff',
            '&:hover': {
              backgroundColor: '#0056b3',
            },
          }}
        >
          Log In
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={toggleDrawer(true, 'signup')}
          sx={{
            zIndex: 1300, // Ensure the button is on top
            borderRadius: 3,
            px: 3,
            backgroundColor: '#28a745',
            '&:hover': {
              backgroundColor: '#218838',
            },
          }}
        >
          Sign Up
        </Button>
      </Box>
      <Introduction isLoggedIn={isLoggedIn} />
      <Drawer
        anchor="left"
        open={drawerState.login}
        onClose={toggleDrawer(false, 'login')}
      >
        <Box
          sx={{
            width: 450,
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: theme.palette.background.default,
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="close"
            onClick={toggleDrawer(false, 'login')}
          >
            <CloseIcon />
          </IconButton>
          <Signin />
        </Box>
      </Drawer>
      <Drawer
        anchor="right"
        open={drawerState.signup}
        onClose={toggleDrawer(false, 'signup')}
      >
        <Box
          sx={{
            width: 450,
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: theme.palette.background.default,
          }}
        >
          <IconButton
            edge="end"
            color="inherit"
            aria-label="close"
            onClick={toggleDrawer(false, 'signup')}
          >
            <CloseIcon />
          </IconButton>
          <SignUp />
        </Box>
      </Drawer>
    </Container>
  )
}

export default App
