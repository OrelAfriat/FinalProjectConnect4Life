// src/components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { isTokenValid, getCookie, getAllCookies } from "../assets/utils";

const ProtectedRoute = ({ element: Element }) => {
	const token = getCookie("token");
	console.log("cookies", getAllCookies());
	const payload = isTokenValid(token);
	if (!token || !payload) {
		return <Navigate to='/' replace />;
	}

	return <Element />;
};

export default ProtectedRoute;
