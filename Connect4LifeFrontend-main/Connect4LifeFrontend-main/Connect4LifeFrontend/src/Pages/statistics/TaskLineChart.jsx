import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../Components/UserContext";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";

const TaskLineChart = ({ tasks }) => {
	const { user } = useContext(UserContext);
	const formatDate = (dateString) => {
		const options = { month: "short", day: "numeric" };
		return new Date(dateString).toLocaleDateString(undefined, options);
	};

	const allUserTaskData = tasks.reduce((acc, task) => {
		const date = formatDate(task.issuedAt);
		if (!acc[date]) acc[date] = 0;
		acc[date]++;
		return acc;
	}, {});

	const allUserTaskDataArray = Object.keys(allUserTaskData).map((date) => ({
		date,
		tasks: allUserTaskData[date],
	}));

	return (
		<div className='graph-container'>
			{user && user.username !== "admin" ? (
				<h4>Tasks Over Time for {user.username}</h4>
			) : (
				<h4>Tasks Over Time For all Users</h4>
			)}
			<ResponsiveContainer width='100%' height={400}>
				<LineChart
					data={allUserTaskDataArray}
					margin={{
						top: 5,
						right: 30,
						left: 20,
						bottom: 5,
					}}
				>
					<CartesianGrid strokeDasharray='3 3' />
					<XAxis dataKey='date' />
					<YAxis />
					<Tooltip />
					<Legend />
					<Line
						type='monotone'
						dataKey='tasks'
						stroke='#82ca9d'
						activeDot={{ r: 8 }}
					/>
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
};

export default TaskLineChart;
