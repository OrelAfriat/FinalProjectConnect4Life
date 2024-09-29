import React, { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import EditTask from "./EditTask"; // Import the EditTask component
import axios from "axios"; // Import Axios
import { useContext } from "react";
import { UserContext } from "../../Components/UserContext";
import { TASK_URL } from "../../assets/paths";
const CardTask = ({ task, onTaskUpdate, setReloadTasks }) => {
	const [isEditing, setIsEditing] = useState(false);

	const { user } = useContext(UserContext);

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleSave = async (updatedTask) => {
		try {
			console.log("starting to handle save", updatedTask);

			// Send a PATCH request to the backend
			const response = await axios.patch(
				`${TASK_URL}/tasks/${task._id}`,
				{
					...updatedTask,
				},
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			if (response.status === 200) {
				// Update the task on the screen
				// onTaskUpdate(updatedTask);
				setReloadTasks((prev) => !prev);
				setIsEditing(false); // Close the edit form
			}
		} catch (error) {
			console.error("Failed to update task:", error);
			// Handle error (e.g., show an alert or message to the user)
		}
	};

	const handleClose = () => {
		setIsEditing(false); // Close the edit form without saving
	};

	const displayStatus =
		task.taskStatus === "Assigned (In Progress)" ? "Assigned" : task.taskStatus;

	const formatPhoneNumber = (phoneNumber) => {
		if (phoneNumber.startsWith("972")) {
			return phoneNumber.replace(/^972/, "0");
		}
		return phoneNumber;
	};

	return (
		<Box
			padding={1}
			sx={{ position: "relative", height: "100%", overflow: "hidden" }}
		>
			{user && user.username == "admin" && (
				<IconButton
					onClick={handleEdit}
					sx={{
						position: "absolute",
						top: 8,
						right: 8,
						color: "inherit",
					}}
				>
					<EditIcon />
				</IconButton>
			)}

			{isEditing ? (
				<EditTask task={task} onSave={handleSave} onClose={handleClose} />
			) : (
				<>
					<Typography
						variant='subtitle1'
						gutterBottom
						sx={{
							whiteSpace: "nowrap",
							overflow: "hidden",
							textOverflow: "ellipsis",
						}}
					>
						Status: {displayStatus}
					</Typography>
					<Typography
						sx={{
							whiteSpace: "nowrap",
							overflow: "hidden",
							textOverflow: "ellipsis",
						}}
					>
						<strong>Collector Name:</strong>{" "}
						{task.collectorName || "Unassigned"}
					</Typography>
					<Typography
						sx={{
							whiteSpace: "nowrap",
							overflow: "hidden",
							textOverflow: "ellipsis",
						}}
					>
						<strong>Address:</strong> {task.taskAddress}
					</Typography>
					<Typography
						sx={{
							whiteSpace: "nowrap",
							overflow: "hidden",
							textOverflow: "ellipsis",
						}}
					>
						<strong>Area:</strong> {task.taskArea}
					</Typography>
					<Typography
						sx={{
							whiteSpace: "nowrap",
							overflow: "hidden",
							textOverflow: "ellipsis",
						}}
					>
						<strong>Phone Number:</strong>{" "}
						{formatPhoneNumber(task.taskPhoneNumber)}
					</Typography>
				</>
			)}
		</Box>
	);
};

export default CardTask;
