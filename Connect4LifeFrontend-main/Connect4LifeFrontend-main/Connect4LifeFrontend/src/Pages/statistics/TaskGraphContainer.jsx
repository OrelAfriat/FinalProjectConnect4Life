import React, { useState, useContext } from "react";
import AreaBarChart from "./AreaBarChart";
import StatusBarChart from "./StatusBarChart";
import TaskLineChart from "./TaskLineChart";
import "./TaskGraphs.css";
import { UserContext } from "../../Components/UserContext";

const TaskGraphContainer = ({ tasks }) => {
	const { user } = useContext(UserContext); // Access user from context

	const [selectedStatus, setSelectedStatus] = useState(null);
	const [selectedArea, setSelectedArea] = useState(null);

	const handleBarClick = ({ type, value }) => {
		if (type === "status") {
			setSelectedStatus(value);
		} else if (type === "area") {
			setSelectedArea(value);
		}
	};

	const handleResetClick = () => {
		setSelectedStatus(null);
		setSelectedArea(null);
	};

	const filteredTasks = tasks.filter((task) => {
		const statusMatches = selectedStatus
			? task.taskStatus === selectedStatus
			: true;
		const areaMatches = selectedArea ? task.taskArea === selectedArea : true;
		return statusMatches && areaMatches;
	});

	const calculateAverageTimeToClose = (tasks) => {
		if (tasks.length === 0) return { days: 0, hours: 0, minutes: 0 };

		const totalTime = tasks.reduce((acc, task) => {
			if (task.issuedAt && task.lastUpdatedAt) {
				const issuedDate = new Date(task.issuedAt);
				const closedDate = new Date(task.lastUpdatedAt);
				const timeDiff = closedDate - issuedDate;
				acc += timeDiff;
			}
			return acc;
		}, 0);

		const averageTime = totalTime / tasks.length;
		const days = Math.floor(averageTime / (1000 * 60 * 60 * 24));
		const hours = Math.floor(
			(averageTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
		);
		const minutes = Math.floor((averageTime % (1000 * 60 * 60)) / (1000 * 60));

		return { days, hours, minutes };
	};

	const { days, hours, minutes } = calculateAverageTimeToClose(filteredTasks);
	const completionRate =
		(tasks.filter((task) => task.taskStatus === "Completed").length /
			tasks.length) *
		100;

	return (
		<div className='task-graphs-container'>
			<div className='status-filter-container'>
				<div className='filter-info'>
					<div className='filter-item'>
						<strong>Status:</strong> {selectedStatus || "All"}
					</div>
					<div className='filter-item'>
						<strong>Area:</strong> {selectedArea || "All"}
					</div>
				</div>
				<button onClick={handleResetClick} className='reset-button'>
					Reset Filters
				</button>
			</div>
			{user && user.username === "admin" ? (
				<div className='admin-stats-container'>
					<div className='user-stats-completion-rate'>
						<h3>Completion Rate</h3>
						<p>{completionRate.toFixed(2)}%</p>
					</div>

					<div className='user-stats-headline'>
						<h3>Average Time to Close a Task</h3>
						<p>
							{days} days {hours} hours {minutes} minutes
						</p>
					</div>
				</div>
			) : (
				<div className='user-stats-completion-rate'>
					<h3>Completion Rate</h3>
					<p>{completionRate.toFixed(2)}%</p>
				</div>
			)}

			<StatusBarChart tasks={tasks} onBarClick={handleBarClick} />
			<AreaBarChart
				tasks={filteredTasks}
				onBarClick={handleBarClick}
				selectedStatus={selectedStatus}
			/>
			<TaskLineChart tasks={filteredTasks} selectedStatus={selectedStatus} />
		</div>
	);
};

export default TaskGraphContainer;
