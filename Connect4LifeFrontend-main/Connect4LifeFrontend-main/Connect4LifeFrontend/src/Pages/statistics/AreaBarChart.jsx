import React from "react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Cell,
} from "recharts";

const AreaBarChart = ({ tasks, onBarClick, selectedStatus }) => {
	const allUserTaskDataByArea = tasks.reduce((acc, task) => {
		const area = task.taskArea || "Unknown Area";
		if (!acc[area]) acc[area] = 0;
		acc[area]++;
		return acc;
	}, {});

	const allUserTaskDataArrayByArea = Object.keys(allUserTaskDataByArea).map(
		(area) => ({
			name: area,
			value: allUserTaskDataByArea[area],
			type: "area",
		})
	);

	const handleClick = (data) => {
		if (data && data.activeLabel) {
			onBarClick({ type: "area", value: data.activeLabel });
		}
	};

	return (
		<div className='graph-container'>
			<h4>
				Tasks By Area{" "}
				{selectedStatus ? `(Status: ${selectedStatus})` : "(All Tasks)"}
			</h4>
			<ResponsiveContainer width='100%' height={400}>
				<BarChart
					data={allUserTaskDataArrayByArea}
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
						{allUserTaskDataArrayByArea.map((entry, index) => (
							<Cell key={`cell-${index}`} fill='#82ca9d' />
						))}
					</Bar>
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
};

export default AreaBarChart;
