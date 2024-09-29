import {
	unauthenticatedError,
	unauthorizedError,
	NotFoundError,
	BadRequestError,
	internalError,
} from "../errors/index.js";
import { StatusCodes } from "http-status-codes";
import { User } from "../models/User.js";
import { attachCookiesToResponse } from "../utils/jwt.js";
import validator from "email-validator";
import { sendEmail } from "../utils/sendMail.js";

const Permissions = {
	U: ["PatchUser", "GetMyTasks", "PatchTaskState", "GetTasks"],
	A: [
		"PostUser",
		"PatchUser",
		"GetUser",
		"PromoteUser",
		"DeleteUser",
		"PostTask",
		"PatchTaskDetails",
		"DeleteTask",
		"GetTasks",
		"PatchTaskState",
	],
};

const AdminUser = "admin";

export const signup = async (req, res) => {
	const {
		username,
		password,
		firstName,
		lastName,
		email,
		livingArea,
		areasOfInterest: areasOfIntrests,
		phoneNumber,
	} = req.body;
	console.log(areasOfIntrests);

	await User.create({
		username,
		password,
		firstName,
		lastName,
		email,
		livingArea,
		areasOfIntrests,
		phoneNumber,
		permission: "U",
	});
	try {
		sendEmail(email, username);
	} catch (error) {
		console.log("an error ocurred while trying to send an email");
	}
	res.status(StatusCodes.CREATED).send();
};

export const login = async (req, res) => {
	const { username, password } = req.body;
	if (!username || !password) {
		throw new BadRequestError("Username or password were not porovided");
	}
	const user = await User.findOne({ username });
	if (!user) {
		throw new NotFoundError("user is not registered to the website");
	}
	const isPasswordCorrect = await user.comparePassword(password);
	if (!isPasswordCorrect) {
		throw new unauthenticatedError("Invalid Credentials");
	}
	const permissionType = user.permission;
	const payload = {
		username,
		permissions: Permissions[permissionType],
		id: user._id,
	};
	const token = attachCookiesToResponse(res, payload);
	res.status(StatusCodes.OK).json({ token: token });
};

export const whatsappLogin = async (req, res) => {
	const { phoneNumber, chatId } = req.body;
	console.log(phoneNumber);
	console.log("im at auth service");
	if (!phoneNumber && !chatId) {
		throw BadRequestError("phone number was not provided");
	}
	const user = phoneNumber
		? await User.findOne({ phoneNumber })
		: await User.findOne({ chatId });

	if (!user) {
		throw new unauthenticatedError("Invalid Credentials");
	}
	const permissionType = user.permission;
	const payload = {
		username: user.username,
		permissions: Permissions[permissionType],
		id: user._id,
	};

	const token = attachCookiesToResponse(res, payload);
	console.log("im go out of auth service");

	res.status(StatusCodes.OK).json({ token: token });
};

export const refreshToken = async (req, res) => {
	const { username, permissions } = req.user;

	const newPayload = {
		username,
		permissions,
	};
	const token = attachCookiesToResponse(res, newPayload);
	res.status(StatusCodes.OK).json({ token: token });
};

export const promoteUser = async (req, res) => {
	const { permissions } = req.user;
	const { username: usernameToUpdate, userType } = req.body;
	const supportedTypes = ["U"];

	if (
		!usernameToUpdate ||
		!supportedTypes.includes(userType)
		//|| usernameToUpdate == AdminUser
	) {
		throw new BadRequestError("Invalid username or userType");
	}

	if (!permissions.includes("PutUser")) {
		throw new unauthorizedError("unauthorize to prefrom this action!");
	}
	const user = await User.findOneAndUpdate(
		{ username: usernameToUpdate },
		{ permission: userType }
	);
	if (!user) {
		throw new NotFoundError("username to update not found");
	}
	res.status(StatusCodes.OK).send();
};

export const getUser = async (req, res) => {
	const user = await User.findOne({ username: req.user.username });
	if (!user) {
		throw new NotFoundError("user not found");
	}
	res
		.status(StatusCodes.OK)
		.json({ username: user.username, permissions: user.permission });
};

export const getMyUser = async (req, res) => {
	if (!req.user.permissions.includes("PatchUser")) {
		throw new unauthorizedError("Unauthorize to perfrom this action!");
	}
	const { id } = req.user;
	if (!id) {
		throw new NotFoundError("user not found");
	}
	const user = await User.findOne({ _id: id });
	if (!user) {
		throw new NotFoundError("user not found");
	}
	res.status(StatusCodes.OK).json({ user: user });
};

export const getUserByParams = async (req, res) => {
	if (!req.user.permissions.includes("GetUser")) {
		throw new unauthorizedError("Unauthorize to perfrom this action!");
	}
	const { id, username } = req.query;
	if (!id && !username) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ message: "need username or user id" });
	}

	const queryObject = {};
	if (id) {
		queryObject._id = id;
	}

	if (username) {
		queryObject.username = username;
	}
	const user = await User.findOne(queryObject);
	if (!user) {
		throw new NotFoundError("user not found");
	}
	res.status(StatusCodes.OK).json({ username: user.username, id: user._id });
};
export const patchUser = async (req, res) => {
	//check permissions
	if (!req.user.permissions.includes("PatchUser")) {
		throw new unauthorizedError("Unauthorize to perfrom this action!");
	}

	// get the data
	const { id } = req.params;
	const updateData = req.body;

	// can change only the fileds: firstName, lastName, email, livingArea, areasOfIntrests, phoneNumber
	const allowedFields = [
		"firstName",
		"lastName",
		"email",
		"livingArea",
		"areasOfIntrests",
		"phoneNumber",
	];
	const updateFields = Object.keys(updateData);
	const disallowedFields = updateFields.filter(
		(field) => !allowedFields.includes(field)
	);
	if (disallowedFields.length > 0) {
		const message = `Some fields are not allowed to be updated like this: ${disallowedFields.join(
			", "
		)}`;
		throw new BadRequestError(message);
	}

	// if its an empty request
	if (Object.keys(updateData).length === 0) {
		throw new BadRequestError("No valid fields to update");
	}
	const user = await User.findById(id);
	if (!user) {
		throw new NotFoundError("User not found");
	}
	// Update the user's fields locally
	Object.keys(updateData).forEach((key) => {
		user[key] = updateData[key];
	});

	// runValidators = true means that it will use the schema validators
	// new = true return the new object (the updated one)
	try {
		const user = await User.findByIdAndUpdate(id, updateData, {
			new: true,
			runValidators: true,
		});
		if (!user) {
			throw new NotFoundError("User not found");
		}
		res
			.status(StatusCodes.OK)
			.json({ message: "User updated successfully", user });
	} catch (err) {
		// Handle validation errors that comes from the schmea thingy
		const validationErrors = [];
		if (err.errors) {
			Object.values(err.errors).forEach((error) => {
				validationErrors.push(error.message);
			});
		}
		res
			.status(StatusCodes.BAD_REQUEST)
			.json({ message: "Validation failed", errors: validationErrors });
	}
};
export const patchUserChatID = async (req, res) => {
	//check permissions not sure if to have because of bot
	// if (!req.user.permissions.includes("PatchUser")) {
	// 	throw new unauthorizedError("Unauthorize to perfrom this action!");
	// }

	// get the data
	console.log("im at the chat path auth");
	const { id } = req.params;
	const chatId = req.body.chatId;

	// if no chat id was provided
	if (!chatId) {
		throw new BadRequestError("no chat id was provided");
	}
	const user = await User.findById(id);
	if (!user) {
		throw new NotFoundError("User not found");
	}
	// change the chat id, no validators but leave the validators for the future maybe
	try {
		const user = await User.findByIdAndUpdate(
			id,
			{ chatId: chatId },
			{
				new: true,
				runValidators: true,
			}
		);
		res
			.status(StatusCodes.OK)
			.json({ message: "chat id updated successfully", user });
	} catch (err) {
		// Handle validation errors that comes from the schmea thingy
		const validationErrors = [];
		if (err.errors) {
			Object.values(err.errors).forEach((error) => {
				validationErrors.push(error.message);
			});
		}
		res
			.status(StatusCodes.BAD_REQUEST)
			.json({ message: "Validation failed", errors: validationErrors });
	}
};

export const deleteUser = async (req, res) => {
	// add permission things
	if (!req.user.permissions.includes("DeleteUser")) {
		throw new unauthorizedError("Unauthorize to perfrom this action!");
	}

	const { id } = req.params;

	// cant delete admin
	const userToDelete = await User.findById(id);
	if (!userToDelete) {
		throw new NotFoundError("User not found");
	}
	if (userToDelete.permission === "A") {
		throw new BadRequestError("Cannot delete admin user");
	}
	//delete for real
	const user = await User.findByIdAndRemove(id);
	res.status(StatusCodes.OK).json({ message: "User deleted successfully" });
};

export const getUsersByIntrestLivingArea = async (req, res) => {
	console.log("at the auth ");
	if (!req.user.permissions.includes("GetUser")) {
		throw new unauthorizedError("Unauthorize to perfrom this action!");
	}
	console.log("at the auth passed the auth things ");

	const { areaOfIntrest, livingArea } = req.query;

	const query = {};
	if (areaOfIntrest) {
		query.areasOfIntrests = areaOfIntrest;
	}
	if (livingArea) {
		query.livingArea = livingArea;
	}

	try {
		const users = await User.find(query);
		res.status(StatusCodes.OK).json(users);
	} catch (err) {
		throw new internalError(err.message);
	}
};

export const getUsersByPhoneNumber = async (req, res) => {
	// if (!req.user.permissions.includes("GetUser")) {
	// 	throw new unauthorizedError("Unauthorize to perfrom this action!");
	// }
	const { phoneNumber } = req.query;
	const query = {};
	if (phoneNumber) {
		query.phoneNumber = phoneNumber;
	}
	try {
		const users = await User.find(query);
		res.status(StatusCodes.OK).json(users);
	} catch (err) {
		throw new internalError(err.message);
	}
};
