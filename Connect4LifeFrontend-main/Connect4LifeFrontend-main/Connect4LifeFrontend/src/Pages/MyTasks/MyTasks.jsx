import { data } from "./Data";
import "./MyTasks.css";

import { Container, Grid, Typography } from "@mui/material";

import React from "react";
import TaskSection from "./TaskSection";
import { getTasksFromDB } from "../../assets/getTasks";
import { useState, useEffect } from "react";
import axios from "axios";
import { TASK_URL } from "../../assets/paths";
import { useContext } from "react";
import { UserContext } from "../../Components/UserContext";
import { REQUEST_TIMEOUT } from "../Signin";

axios.defaults.withCredentials = true;

function MyTasks() {
	const { user } = useContext(UserContext);
	const [tasks, setTasks] = useState([]);
	const [reloadTasks, setReloadTasks] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			console.log("1");

			try {
				let path;
				if (user && user.username === "admin") {
					path = `${TASK_URL}/tasks`;
				} else if (user) {
					path = `${TASK_URL}/myTasks`;
				} else {
					return;
				}

				const taskResponse = await axios.get(path, {
					timeout: REQUEST_TIMEOUT,
				});
				setTasks(taskResponse.data);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, [user, reloadTasks]);

	// Sort tasks: unclaimed first, then claimed, then completed
	const sortedTasks = {
		unassigned: tasks.filter((task) => task.taskStatus === "Unassigned"),
		assigned: tasks.filter(
			(task) => task.taskStatus === "Assigned (In Progress)"
		),
		completed: tasks.filter((task) => task.taskStatus === "Completed"),
	};

	return (
		<Container sx={{ paddingTop: "40px" }}>
			<Grid container spacing={4}>
				{tasks ? (
					<>
						{/* Conditionally render Unassigned Tasks section only for admin */}
						{user && user.username === "admin" && (
							<TaskSection
								title='Unassigned Tasks'
								tasks={sortedTasks.unassigned}
								setReloadTasks={setReloadTasks}
							/>
						)}
						<TaskSection
							title='Assigned Tasks (In progress)'
							tasks={sortedTasks.assigned}
							setReloadTasks={setReloadTasks}
						/>
						<TaskSection
							title='Completed Tasks'
							tasks={sortedTasks.completed}
							setReloadTasks={setReloadTasks}
						/>
					</>
				) : (
					<Typography>Loading...</Typography>
				)}
			</Grid>
		</Container>
	);
}

export default MyTasks;
