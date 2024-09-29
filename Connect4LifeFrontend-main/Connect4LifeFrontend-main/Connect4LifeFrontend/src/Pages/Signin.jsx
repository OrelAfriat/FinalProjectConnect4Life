import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import axios from "axios";
import loginImage from "../assets/images/loginimage.png";
import { AUTH_URL } from "../assets/paths";
import { useContext } from "react";
import { UserContext } from "../Components/UserContext";
axios.defaults.withCredentials = true;

export const REQUEST_TIMEOUT = 50000;
const SignIn = () => {
	const navigate = useNavigate();
	const [isAlert, setIsAlert] = useState(false);
	const [alertType, setAlertType] = useState("error");
	const [alertMessage, setAlertMessage] = useState("");
	const [loggedInUser, setLoggedInUser] = useState(null);

	const { login } = useContext(UserContext);

	const handleSubmit = async (event) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		const username = data.get("username");
		const password = data.get("password");

		try {
			const authResponse = await axios.post(
				`${AUTH_URL}/login`,
				{ username, password },
				{ timeout: REQUEST_TIMEOUT }
			);
			console.log("auth", authResponse);
			setIsAlert(true);
			setAlertType("success");
			setAlertMessage("Successfully logged in!");
			const token = authResponse.data.token;

			//   setLoggedInUser({
			//   id: authResponse.data.userId, // Assuming your response contains the user ID
			//   name: authResponse.data.userName, // Assuming your response contains the user name
			// })
			login();
			setTimeout(() => {
				navigate("/home/overview");
			}, 2000);
		} catch (error) {
			console.log(error.response?.data?.msg);
			console.error("An unexpected error occurred:", error);
			setIsAlert(true);
			setAlertMessage(
				error.response?.data?.msg || "An error occurred during login."
			);
			setAlertType("error");
		}
	};

	return (
		<Container component='main' maxWidth='xs'>
			<CssBaseline />
			<Box
				sx={{
					marginTop: 20,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<Avatar
					sx={{ m: 1, bgcolor: "secondary.main", width: 170, height: 170 }}
				>
					<img
						src={loginImage}
						alt='Custom Icon'
						style={{ width: "100%", height: "100%" }}
					/>
				</Avatar>
				<Typography component='h1' variant='h5'>
					Welcome
				</Typography>
				<Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
					<TextField
						margin='normal'
						required
						fullWidth
						id='username'
						label='Username'
						name='username'
						autoComplete='username'
						autoFocus
					/>
					<TextField
						margin='normal'
						required
						fullWidth
						name='password'
						label='Password'
						type='password'
						id='password'
						autoComplete='current-password'
					/>
					{isAlert && <Alert severity={alertType}>{alertMessage}</Alert>}
					<Button
						type='submit'
						fullWidth
						variant='contained'
						sx={{ mt: 3, mb: 2 }}
					>
						Sign In
					</Button>
					<Grid container justifyContent='center' alignItems='center'>
						<Grid item></Grid>
					</Grid>
				</Box>
			</Box>
		</Container>
	);
};

export default SignIn;
