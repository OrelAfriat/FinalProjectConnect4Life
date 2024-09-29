import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { ImCheckboxChecked } from "react-icons/im";
import { AiFillCloseCircle } from "react-icons/ai";
import jsonp from "jsonp";
import ClipLoader from "react-spinners/ClipLoader";

const GeocodeComponent = ({
	address,
	setAddress,
	setCoordinates,
	coordinates,
}) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [isAddressValid, setIsAddressValid] = useState("");

	const handleInputChange = (e) => {
		setAddress(e.target.value);
	};

	const handleGeocode = () => {
		setError("");
		setCoordinates(null);
		setLoading(true);
		setIsAddressValid("");

		const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
			address
		)}&key=cd9f328ac51e416ea4c985c1792c3cc3&jsonp=callback`;

		jsonp(url, { timeout: 10000 }, (err, data) => {
			setLoading(false);
			if (err) {
				console.error("Error geocoding address:", err);
				setError("Error geocoding address");
				setIsAddressValid(false);
			} else {
				if (data.results.length > 0) {
					const { lat, lng } = data.results[0].geometry;
					setCoordinates({ lat: parseFloat(lat), lon: parseFloat(lng) });
					console.log(data.results[0].geometry);
					setIsAddressValid(true);
				} else {
					setError("Address not found");
					setIsAddressValid(false);
				}
			}
		});
	};

	return (
		<div className="flex mt-3">
			<input
				type="text"
				value={address}
				onChange={handleInputChange}
				placeholder="Enter Task Address"
				className="text-1.5xl p-3 border border-gray-300 rounded-xl w-3/6 h-14 hover:border-black"
			/>
			{loading ? (
				<div className="spinner-border text-primary mt-2 ml-2">
					<ClipLoader
						color={"#009933"}
						size={40}
						aria-label="Loading Spinner"
						data-testid="loader"
					/>
				</div>
			) : (
				<>
					<button
						className="ml-2 h-14 w-16 rounded-xl hover:border-black"
						onClick={handleGeocode}
					>
						Check
					</button>
					{isAddressValid === true && (
						<ImCheckboxChecked className="ml-2 h-8 w-16 text-green-600 mt-3" />
					)}
					{isAddressValid === false && (
						<AiFillCloseCircle className="ml-2 h-8 w-16 text-red-600 mt-3" />
					)}
				</>
			)}
		</div>
	);
};

export default GeocodeComponent;
