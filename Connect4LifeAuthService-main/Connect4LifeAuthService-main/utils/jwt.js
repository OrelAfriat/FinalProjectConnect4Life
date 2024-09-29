import jwt from "jsonwebtoken";
import {
	unauthenticatedError,
	unauthorizedError,
	NotFoundError,
	BadRequestError,
	internalError,
	CustomAPIError,
} from "../errors/index.js";

export function isTokenValid(token) {
	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET);
		return payload;
	} catch (error) {
		if (
			error.name === "JsonWebTokenError" &&
			error.message === "invalid token"
		) {
			throw new unauthenticatedError("Token is invalid");
		} else {
			console.error("Error:", error.message);
			throw new CustomAPIError(error.message);
		}
	}
}

export const createJWT = (payload) => {
	const token = jwt.sign(payload, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_LIFETIME,
	});
	return token;
};

export const attachCookiesToResponse = (res, payload) => {
	const token = createJWT(payload);

	const oneHour = 1000 * 60 * 60;

	res.cookie("token", token, {
		expires: new Date(Date.now() + oneHour),
		httpOnly: false,
		secure: true,
		domain: ".connect4life.live",
		sameSite: "None",
		path: "/",
	});

	return token;
};
