import React, { useState, useEffect, useContext } from "react";
import {
	Box,
	Typography,
	Button,
	Paper,
	Divider,
	IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { TASK_URL } from "../../assets/paths";
import { REQUEST_TIMEOUT } from "../Signup";
import { UserContext } from "../../Components/UserContext";
import CustomModal from "../../Components/CustomModal";
axios.defaults.withCredentials = true;

export const TaskDetails = ({ task, onClose, triggerReload }) => {
	console.log(task);

	useEffect(() => {}, [triggerReload]);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalMessage, setModalMessage] = useState(null);

	const { user } = useContext(UserContext);
	const isTaskAssignedToUser =
		user &&
		task.collectorName == user.username &&
		task.taskStatus == "Assigned (In Progress)"
			? true
			: false;
	const isTaskUnassigned = task.taskStatus == "Unassigned" ? true : false;
	const isUserAdmin = user && user.username == "admin" ? true : false;

	const handleOpenModal = () => {
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		triggerReload();
		setIsModalOpen(false);
	};

	const detailStyle = {
		display: "block",
		marginBottom: "12px", // Reduced margin for less unused space
	};

	const claimTask = async () => {
		try {
			const taskResponse = await axios.patch(
				`${TASK_URL}/tasks/claimTask/${task._id}`,
				{},
				{ timeout: REQUEST_TIMEOUT }
			);
			setIsModalOpen(true);
			setModalMessage(taskResponse.data?.message);
			handleOpenModal();

			// Handle the response if needed
		} catch (err) {
			setModalMessage(
				err.response?.data?.msg || "An Error Ocurred. Please try again"
			);
			setIsModalOpen(true);
			// Handle the error
			console.error(err);
		}
	};

	const releaseTask = async () => {
		try {
			const taskResponse = await axios.patch(
				`${TASK_URL}/tasks/releaseTask/${task._id}`,
				{},
				{ timeout: REQUEST_TIMEOUT }
			);
			console.log(taskResponse);

			setIsModalOpen(true);
			setModalMessage(taskResponse.data?.message);
			handleOpenModal();

			// Handle the response if needed
		} catch (err) {
			setModalMessage(
				err.response?.data?.message || "An Error Ocurred. Please try again"
			);
			setIsModalOpen(true);
			// Handle the error
			console.error(err);
		}
	};

	return (
		<Paper
			sx={{
				position: "relative",
				padding: "16px", // Reduced padding
				border: "1px solid #ddd",
				borderRadius: "8px", // Smaller border radius
				backgroundColor: "#f5f5f5",
				boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
				maxWidth: "400px", // Limit the width of the card
				margin: "0 auto", // Center the card horizontally
			}}
		>
			<IconButton
				onClick={onClose}
				sx={{
					position: "absolute",
					top: "8px",
					right: "8px",
					color: "#333",
				}}
			>
				<CloseIcon />
			</IconButton>
			<Box
				sx={{
					backgroundColor: "#0073e6",
					padding: "8px", // Reduced padding
					borderRadius: "8px 8px 0 0",
					marginBottom: "16px", // Reduced margin
				}}
			>
				<Typography
					variant='h6'
					gutterBottom
					align='center'
					sx={{ textAlign: "center", color: "#fff", fontSize: "1.2rem" }} // Reduced font size
				>
					Task Status
				</Typography>
			</Box>
			<Typography
				variant='subtitle1'
				gutterBottom
				sx={{ ...detailStyle, fontSize: "0.875rem" }}
			>
				Status: {task.taskStatus}
			</Typography>
			<Typography
				variant='subtitle1'
				gutterBottom
				sx={{ ...detailStyle, fontSize: "0.875rem" }}
			>
				Collector Name: {task.collectorName ? task.collectorName : "Unclaimed"}
			</Typography>
			<Typography
				variant='subtitle1'
				gutterBottom
				sx={{ ...detailStyle, fontSize: "0.875rem" }}
			>
				Address: {task.taskAddress}
			</Typography>
			<Typography
				variant='subtitle1'
				gutterBottom
				sx={{ ...detailStyle, fontSize: "0.875rem" }}
			>
				Area: {task.taskArea}
			</Typography>
			<Typography
				variant='subtitle1'
				gutterBottom
				sx={{ ...detailStyle, fontSize: "0.875rem" }}
			>
				Last update: {task.lastUpdatedAt}
			</Typography>
			<Typography
				variant='subtitle1'
				sx={{ ...detailStyle, fontSize: "0.875rem" }}
			>
				Closed at: {task.closedAt ? task.closedAt : "Open"}
			</Typography>
			<Typography
				variant='subtitle1'
				sx={{ ...detailStyle, fontSize: "0.875rem" }}
			>
				Phone Number: {task.taskPhoneNumber}
			</Typography>
			<Typography
				variant='subtitle1'
				sx={{ ...detailStyle, fontSize: "0.875rem" }}
			>
				Already has equipment: {task.haveEquipment == true ? "Yes" : "No"}
			</Typography>
			<Divider sx={{ marginY: 1.5 }} />
			{isTaskUnassigned && !isUserAdmin && (
				<Button
					onClick={claimTask}
					variant='contained'
					color='primary'
					fullWidth
					sx={{
						marginTop: 1.5,
						backgroundColor: "#28a745",
						"&:hover": {
							backgroundColor: "#218838",
						},
						fontSize: "0.875rem", // Reduced font size
						padding: "8px 0", // Reduced padding
					}}
				>
					Claim Task
				</Button>
			)}
			{isTaskAssignedToUser && !isUserAdmin && (
				<Button
					onClick={releaseTask}
					variant='contained'
					color='primary'
					fullWidth
					sx={{
						marginTop: 1.5,
						backgroundColor: "#d32f2f",
						"&:hover": {
							backgroundColor: "#b71c1c",
						},
						fontSize: "0.875rem", // Reduced font size
						padding: "8px 0", // Reduced padding
					}}
				>
					Release Task
				</Button>
			)}

			{isModalOpen && modalMessage && (
				<CustomModal message={modalMessage} onClose={handleCloseModal} />
			)}
		</Paper>
	);
};

export default TaskDetails;
