// src/assets/utils.js
export const getCookie = (name) => {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) {
		return parts.pop().split(";").shift();
	}
	return null;
};

export const getAllCookies = () => {
	const cookies = document.cookie.split(";");
	const cookieObject = {};

	cookies.forEach((cookie) => {
		const [name, value] = cookie.split("=");
		cookieObject[name.trim()] = value ? decodeURIComponent(value.trim()) : "";
	});

	return cookieObject;
};
export const isTokenValid = (token) => {
	if (!token) return false;

	try {
		const base64Url = token.split(".")[1];
		const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
		const jsonPayload = decodeURIComponent(
			atob(base64)
				.split("")
				.map((c) => {
					return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
				})
				.join("")
		);

		const payload = JSON.parse(jsonPayload);

		// Check if the token has an expiration date
		if (!payload.exp) {
			return false;
		}

		// Check if the token is expired
		const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
		if (payload.exp < currentTime) {
			return false; // Token is expired
		}

		return payload; // Token is valid
	} catch (e) {
		console.error("Invalid token", e);
		return false;
	}
};
