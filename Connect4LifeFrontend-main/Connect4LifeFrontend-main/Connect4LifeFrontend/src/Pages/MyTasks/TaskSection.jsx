import React from "react";
import { Grid, Typography, Paper } from "@mui/material";
import CardTask from "./CardTask";

function TaskSection({ title, tasks, setReloadTasks }) {
	// Determine the background color based on the section title
	const getBackgroundColor = (title) => {
		switch (title) {
			case "Unassigned Tasks":
				return "#FFE4E1"; // Brighter red
			case "Assigned Tasks (In progress)":
				return "#E0FFFF"; // Brighter blue
			case "Completed Tasks":
			default:
				return "#E6FFE6"; // Light green (default)
		}
	};

	const getBorderColor = (title) => {
		switch (title) {
			case "Unassigned Tasks":
				return "#FFE4E1"; // Matching bright red for the border
			case "Assigned Tasks (In progress)":
				return "#E0FFFF"; // Matching bright blue for the border
			case "Completed Tasks":
			default:
				return "#98FB98"; // Light green border (default)
		}
	};

	return (
		<Grid item xs={12}>
			<Typography variant='h5' gutterBottom>
				{title}
			</Typography>
			<div className='task-section-container'>
				<div className='task-grid'>
					{tasks.map((task) => (
						<Paper
							elevation={6}
							sx={{
								height: "100%",
								borderRadius: "16px", // Rounded corners
								border: `2px solid ${getBorderColor(title)}`, // Set border color
								boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow
								padding: "16px", // Space inside the card
								backgroundColor: getBackgroundColor(title), // Set background color
							}}
							key={task._id}
						>
							<CardTask task={task} setReloadTasks={setReloadTasks} />
						</Paper>
					))}
				</div>
			</div>
		</Grid>
	);
}

export default TaskSection;
