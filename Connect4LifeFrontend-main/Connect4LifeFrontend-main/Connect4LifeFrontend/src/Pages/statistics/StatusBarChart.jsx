import React from "react";
import {
	Cell,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";

const StatusBarChart = ({ tasks, onBarClick }) => {
	const taskStatusData = tasks.reduce((acc, task) => {
		const status = task.taskStatus || "Unknown Status";
		if (!acc[status]) acc[status] = 0;
		acc[status]++;
		return acc;
	}, {});

	const taskStatusDataArray = Object.keys(taskStatusData).map((status) => ({
		name: status,
		value: taskStatusData[status],
		type: "status",
	}));

	const handleClick = (data) => {
		if (data && data.activeLabel) {
			onBarClick({ type: "status", value: data.activeLabel });
		}
	};

	const colorMapping = {
		"Assigned (In Progress)": "lightskyblue",
		Unassigned: "indianred",
		Completed: "mediumseagreen",
	};

	return (
		<div className='graph-container'>
			<h4>Tasks Distribution by Status</h4>
			<ResponsiveContainer width='100%' height={400}>
				<BarChart
					data={taskStatusDataArray}
					margin={{
						top: 5,
						right: 30,
						left: 20,
						bottom: 5,
					}}
					onClick={handleClick}
				>
					<CartesianGrid strokeDasharray='3 3' />
					<XAxis dataKey='name' />
					<YAxis />
					<Tooltip />
					<Bar dataKey='value'>
						{taskStatusDataArray.map((entry, index) => (
							<Cell key={`cell-${index}`} fill={colorMapping[entry.name]} />
						))}
					</Bar>
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
};

export default StatusBarChart;
