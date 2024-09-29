import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import PhoneInput from "react-phone-input-2";
import GeocodeComponent from "./GoogleSearchForTask";
import "react-phone-input-2/lib/style.css";
import axios from "axios";

// Define the locations array
const locations = [
	"Northern Israel",
	"Haifa and Surroundings",
	"Central Israel",
	"Tel Aviv and Gush Dan",
	"Jerusalem",
	"Southern Israel",
];

const EditTask = ({ task, onClose, onSave }) => {
	const [taskDetails, setTaskDetails] = useState({ ...task });
	const [isSaving, setIsSaving] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setTaskDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
	};

	const handlePhoneChange = (value) => {
		setTaskDetails((prevDetails) => ({
			...prevDetails,
			taskPhoneNumber: value,
		}));
	};

	const getUpdatedFields = () => {
		const updatedFields = {};
		Object.keys(taskDetails).forEach((key) => {
			if (taskDetails[key] !== task[key]) {
				updatedFields[key] = taskDetails[key];
			}
		});
		return updatedFields;
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setIsSaving(true); // Disable the button and show loading state

		try {
			const updatedFields = getUpdatedFields();

			if (Object.keys(updatedFields).length === 0) {
				console.log("No changes detected.");
				setIsSaving(false);
				return;
			}

			const updatedTask = {
				...updatedFields,
			};

			// Uncomment below line to send a PATCH request when integrated with your backend
			// const response = await axios.patch(`/api/v1/task`, updatedTask);

			console.log("Task updated successfully with changes:", updatedTask); // Debug log
			onSave(updatedTask); // Notify parent component about the update
			onClose(); // Close the edit form
		} catch (error) {
			console.error("Error updating task:", error);
		} finally {
			setIsSaving(false); // Re-enable the button after the process is complete
		}
	};

	return (
		<div className='fixed inset-0 flex items-center justify-center z-50'>
			<div
				className='absolute inset-0 bg-gray-800 opacity-50'
				onClick={onClose}
			></div>
			<div className='bg-white p-6 rounded-lg shadow-2xl z-10 h-3/6 w-2/6 mt-4 relative'>
				<div className='flex justify-between items-start p-4'>
					<h2 className='text-3xl mb-4 font-mono text-green-700 font-bold'>
						Edit Task
					</h2>
					<IoMdClose
						onClick={onClose}
						className='text-3xl hover:cursor-pointer'
					/>
				</div>
				<div className='flex flex-col'>
					<input
						type='text'
						name='collectorName'
						value={taskDetails.collectorName || ""}
						onChange={handleChange}
						placeholder='Collector Name*'
						className='text-1.5xl p-3 border border-gray-300 rounded-xl w-3/6 h-14 mt-4 hover:border-black'
					/>
					<select
						id='location'
						name='taskArea'
						value={taskDetails.taskArea || ""}
						onChange={handleChange}
						className='text-1.5xl p-3 border border-gray-300 rounded-xl w-3/6 h-14 mt-4 hover:border-black'
					>
						<option value='' disabled>
							Select a location*
						</option>
						{locations.map((location) => (
							<option key={location} value={location}>
								{location}
							</option>
						))}
					</select>
					<div className='mt-4'>
						<PhoneInput
							country={"il"}
							value={taskDetails.taskPhoneNumber || ""}
							onChange={handlePhoneChange}
							placeholder='Enter phone number'
							containerClass='w-full'
							inputClass='w-full h-14 text-2xl pl-16 pr-4 border border-gray-300 rounded-lg hover:border-black'
							buttonClass='h-14'
							inputStyle={{
								height: "56px",
								paddingLeft: "4rem",
								boxSizing: "border-box",
								lineHeight: "1.5",
							}}
							buttonStyle={{
								height: "56px",
								width: "56px",
								borderRadius: "0.5rem 0 0 0.5rem",
								boxSizing: "border-box",
							}}
						/>
					</div>
					<GeocodeComponent
						address={taskDetails.taskAddress || ""}
						setAddress={(address) =>
							setTaskDetails((prevDetails) => ({
								...prevDetails,
								taskAddress: address,
							}))
						}
						setCoordinates={(coordinates) =>
							setTaskDetails((prevDetails) => ({
								...prevDetails,
								taskCoordinates: coordinates,
							}))
						}
						coordinates={taskDetails.taskCoordinates || ""}
					/>
					<button
						className='bg-gray-500 absolute bottom-2 right-2 text-1.5xl p-3 border border-gray-300 rounded-xl w-2/6 h-14 hover:border-black'
						onClick={handleSubmit}
						disabled={isSaving}
					>
						{isSaving ? "Saving..." : "Save Task"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default EditTask;
