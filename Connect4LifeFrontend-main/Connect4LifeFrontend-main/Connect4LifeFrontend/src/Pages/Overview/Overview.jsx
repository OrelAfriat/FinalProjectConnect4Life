import { Outlet } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import LeafletMap from "./Map";
import Wrapper from "../../assets/wrappers/Map";
import { TasksStatus } from "./TasksStatus";
import TaskDetails from "./TaskDetails";
import { Box, Typography } from "@mui/material";
import { useContext } from "react";
import { UserContext } from "../../Components/UserContext";
import { getTasksFromDB } from "../../assets/getTasks";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { TASK_URL } from "../../assets/paths";
import { REQUEST_TIMEOUT } from "../Signin";
axios.defaults.withCredentials = true;

const Overview = () => {
	const [data, setData] = useState(null);
	const [task, setTask] = useState(null);
	const [reloadKey, setReloadKey] = useState(0);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const taskResponse = await axios.get(`${TASK_URL}/tasks`, {
					timeout: REQUEST_TIMEOUT,
				});
				console.log(taskResponse.data.length);
				const newData = taskResponse.data;
				setData([...taskResponse.data]);

				if (task) {
					const updatedTask = newData.find((t) => t._id === task._id); // Adjust the task identification based on your data structure
					if (updatedTask) {
						setTask(updatedTask);
					} else {
						setTask(null); // If the task no longer exists, clear the selection
					}
				}
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, [reloadKey]);

	const handleTaskClose = () => {
		setTask(null);
	};

	const triggerReload = () => {
		setReloadKey((prevKey) => prevKey + 1);
	};
	const { user } = useContext(UserContext);

	console.log(user);

	return (
		<Wrapper>
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					height: "100vh", // Full viewport height
					overflow: "hidden", // Prevent scrolling
				}}
			>
				<Box sx={{ flex: "0 0 auto", marginBottom: 2 }}>
					{data ? (
						<TasksStatus data={data} />
					) : (
						<Typography>Loading...</Typography>
					)}
				</Box>
				<Box
					sx={{
						flex: "1 1 auto", // Take the remaining space
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
						overflow: "hidden",
					}}
				>
					<Box sx={{ width: "100%", height: "100%", position: "relative" }}>
						{data ? (
							<LeafletMap setTask={setTask} tasks={data} />
						) : (
							<Typography>Loading...</Typography>
						)}
						{task && (
							<Box
								className='task-details-overlay'
								sx={{
									position: "absolute",
									top: 0,
									alignContent: "center",
									right: 0,

									transform: "translateX(-50%)",
									zIndex: 1000,
									background: "rgba(255, 255, 255, 0.9)",
									//   borderRadius: '16px',
									//   padding: '20px',
									boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
									zIndex: 1000,
									overflowY: "auto",
								}}
							>
								<TaskDetails
									task={task}
									onClose={handleTaskClose}
									triggerReload={triggerReload}
								/>
							</Box>
						)}
					</Box>
				</Box>
			</Box>
		</Wrapper>
	);
};

export default Overview;
