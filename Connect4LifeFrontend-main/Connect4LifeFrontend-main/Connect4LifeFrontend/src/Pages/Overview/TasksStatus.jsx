import Typography from "@mui/material/Typography"; // Import Typography for text display
import redIconImage from "../../assets/images/marker-icon-red.png";
import blueIconImage from "../../assets/images/marker-icon-blue.png";
import greenIconImage from "../../assets/images/marker-icon-green.png";
import "../../data";
import { data } from "../../data";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";

export const TasksStatus = ({ data }) => {
	const taskStatuses = [
		{
			status: "Unassigned",
			num: data.filter((task) => task.taskStatus === "Unassigned").length,
			icon: redIconImage,
		},
		{
			status: "Assigned (In Progress)",
			num: data.filter((task) => task.taskStatus === "Assigned (In Progress)")
				.length,
			icon: blueIconImage,
		},
		{
			status: "Completed",
			num: data.filter((task) => task.taskStatus === "Completed").length,
			icon: greenIconImage,
		},
	];
	return (
		<Box
			component='section'
			sx={{
				p: 4,
				bgcolor: "#f5f5f5",
				borderRadius: "16px",
				width: "80vh",
				margin: "auto",
				display: "flex",
				justifyContent: "space-around",
				flexWrap: "wrap",
				gap: 2, // Added gap for better spacing between cards
			}}
		>
			{taskStatuses.map((status) => (
				<Card
					key={status.status}
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						width: "calc(100% / 3 - 80px)", // Ensures cards fit nicely in the container
						boxShadow: 3,
					}}
				>
					<CardMedia
						component='img'
						src={status.icon}
						alt={`${status.status} icon`}
						sx={{ width: "auto", height: 50, objectFit: "contain", mb: 1 }}
					/>
					<CardContent sx={{ textAlign: "center", p: 0 }}>
						<Typography
							variant='subtitle1'
							sx={{
								fontSize: "1rem",
								mb: 1,
								fontWeight: "bold",
								color: "#555",
							}}
						>
							{status.status}
						</Typography>
						<Typography
							variant='h5'
							sx={{ fontSize: "1.5rem", fontWeight: "bold", color: "#363" }}
						>
							{status.num}
						</Typography>
					</CardContent>
				</Card>
			))}
		</Box>
	);
};
