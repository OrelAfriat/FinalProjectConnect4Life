import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { data } from "../../data";
import { getIcon } from "./icons";
import { getTasksFromDB } from "../../assets/getTasks";
import { useEffect } from "react";
const LeafletMap = ({ setTask, tasks }) => {
	const position = [32.085350528397406, 34.781552731867656];
	return (
		<MapContainer
			center={position}
			zoom={7.5}
			style={{
				height: "100%",
				width: "100%",
				borderRadius: "40px",
				zIndex: 1,
			}}
		>
			<TileLayer
				url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap Contributors</a>'
			/>
			{tasks.map((task) => {
				return (
					<Marker
						position={task.taskCoordinates}
						key={task._id}
						icon={getIcon(task.taskStatus)}
						eventHandlers={{
							click: () => setTask(task),
						}}
					></Marker>
				);
			})}
		</MapContainer>
	);
};

export default LeafletMap;
