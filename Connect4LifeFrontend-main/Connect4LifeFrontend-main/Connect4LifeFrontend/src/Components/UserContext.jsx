// src/context/UserContext.js
import React, { createContext, useState, useEffect } from "react";
import { getCookie, isTokenValid } from "../assets/utils";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
	const [user, setUser] = useState(null);

	const login = () => {
		const token = getCookie("token");
		const payload = isTokenValid(token);

		if (payload) {
			setUser({
				username: payload.username,
				permissions: payload.permissions,
			});
		}
	};

	const logout = () => {
		window.location.href = "/";
		setUser(null);
		document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
	};

	useEffect(() => {
		login();
	}, []);

	return (
		<UserContext.Provider value={{ user, login, logout }}>
			{children}
		</UserContext.Provider>
	);
};
