import { isTokenValid } from "../utils/jwt.js";
import { unauthenticatedError } from "../errors/index.js";

const authenticateUser = async (req, res, next) => {
	let token;

	const authHeader = req.headers.authorization;
	if (authHeader && authHeader.startsWith("Bearer")) {
		token = authHeader.split(" ")[1];
	} else if (req.cookies.token) {
		console.log(req.cookies);
		token = req.cookies.token;
	}

	if (!token) {
		console.log("23");
		throw new unauthenticatedError("Authentication invalid");
	}

	const payload = isTokenValid(token);
	req.user = {
		username: payload.username,
		permissions: payload.permissions,
		id: payload.id,
	};

	next();
};

export default authenticateUser;
