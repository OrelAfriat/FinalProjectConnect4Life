// src/Pages/statistics/statistics.jsx
import { TASK_URL } from "../../assets/paths";
import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Typography,
} from "@mui/material";
import TaskGraphs from "./TaskGraphs";
import { REQUEST_TIMEOUT } from "../Signin";
import { UserContext } from "../../Components/UserContext";
axios.defaults.withCredentials = true;

function Statistics() {
	const [tasks, setTasks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const { user } = useContext(UserContext); // Access user from context
	console.log("good");

	useEffect(() => {
		const getTasks = async () => {
			try {
				let tasksData;
				console.log(user.username);
				if (user && user.username === "admin") {
					// Admin can view all tasks
					const response = await axios.get(`${TASK_URL}/tasks`, {
						timeout: REQUEST_TIMEOUT,
					});
					tasksData = response.data;
				} else if (user) {
					// Non-admin can only view their own tasks
					const response = await axios.get(`${TASK_URL}/mytasks`, {
						timeout: REQUEST_TIMEOUT,
					});
					console.log(response.data);

					tasksData = response.data;
				} else {
					setLoading(true);
				}

				setTasks(tasksData);
			} catch (error) {
				console.error("Error fetching tasks:", error);
				setError(error.message);
			} finally {
				setLoading(false);
			}
		};
		if (user) {
			getTasks();
		}
	}, [user]);

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<div>
			{user && user.username !== "admin" && (
				<div className='user-stats-headline'> {user.username}'s Statistics</div>
			)}
			<TaskGraphs tasks={tasks} />
		</div>
	);
}

export default Statistics;
