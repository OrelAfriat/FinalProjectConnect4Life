import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IoMdClose } from "react-icons/io";
import "../customStyle.css";
import { locations } from "../../assets/locations";
import PhoneInput from "react-phone-input-2";
import GeocodeComponent from "./GoogleSearch";
import { TASK_URL } from "../../assets/paths";
import { getCookie } from "../../assets/utils";
import "react-phone-input-2/lib/style.css";

axios.defaults.withCredentials = true;

export const REQUEST_TIMEOUT = 50000;

const NewTaskModal = ({ onClose }) => {
	const [isAlert, setIsAlert] = useState(false);
	const [alertType, setAlertType] = useState("error");
	const [alertMessage, setAlertMessage] = useState("");
	const [donorName, setDonorName] = useState(null);
	const [selectedLocation, setSelectedLocation] = useState("");
	const [phone, setPhone] = useState("");
	const [address, setAddress] = useState("");
	const [coordinates, setCoordinates] = useState("");
	const [haveEquipment, setHaveEquipment] = useState(false);

	const handleChange = (event) => {
		setSelectedLocation(event.target.value);
	};

	const validateData = (data) => {
		setAlertMessage("");
		const {
			donorName,
			taskArea,
			taskPhoneNumber,
			taskAddress,
			taskCoordinates,
		} = data;
		console.log(data);

		if (!donorName || !taskArea || !taskPhoneNumber || !taskAddress) {
			setAlertMessage("All fields are mandatory!");
			setIsAlert(true);
			return false;
		} else if (taskAddress && !taskCoordinates) {
			setIsAlert(true);
			setAlertMessage("Task Address must be checked!");
			return false;
		}
		return true;
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		const data = {
			donorName: donorName,
			taskArea: selectedLocation,
			taskPhoneNumber: phone,
			taskAddress: address,
			taskCoordinates: coordinates,
			haveEquipment,
		};
		const isDataValid = validateData(data);
		if (!isDataValid) return;

		const token = getCookie("token");

		try {
			const authResponse = await axios.post(`${TASK_URL}/tasks`, data, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
				timeout: REQUEST_TIMEOUT,
			});

			setIsAlert(true);
			setAlertType("success");
			setAlertMessage("Created new task");
			setTimeout(onClose, 2000);
		} catch (error) {
			console.log(error.response.data);
			console.error("An unexpected error occurred:", error);
			setIsAlert(true);
			setAlertMessage(error.response?.data?.msg || "An error occurred ");
			setAlertType("error");
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
						Task Details
					</h2>
					<IoMdClose
						onClick={onClose}
						className='text-3xl hover:cursor-pointer'
					>
						Close
					</IoMdClose>
				</div>
				<div className='flex flex-col'>
					<input
						type='text'
						placeholder='Donor Name*'
						onChange={(e) => setDonorName(e.target.value)}
						className='text-1.5xl p-3 border border-gray-300 rounded-xl w-3/6 h-14 mt-4 hover:border-black'
					/>
					<select
						id='location'
						value={selectedLocation}
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
							value={phone}
							onChange={setPhone}
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
						address={address}
						setAddress={setAddress}
						setCoordinates={setCoordinates}
						coordinates={coordinates}
					/>
					<div className='mt-4'>
						<label className='flex items-center'>
							<input
								type='checkbox'
								checked={haveEquipment}
								onChange={() => setHaveEquipment((prev) => !prev)}
								className='mr-2'
							/>
							Already have equipment
						</label>
					</div>
					<button
						className=' bg-gray-500 absolute bottom-2 right-2 text-1.5xl p-3 border border-gray-300 rounded-xl w-2/6 h-14 hover:border-black'
						onClick={handleSubmit}
					>
						Create Task
					</button>
				</div>
				{isAlert && alertType === "error" && (
					<p className='mt-5 text-m text-red-600 font-bold'>{alertMessage}</p>
				)}
				{isAlert && alertType === "success" && (
					<p className='mt-5 text-m text-green-600 font-bold'>{alertMessage}</p>
				)}
			</div>
		</div>
	);
};

export default NewTaskModal;
