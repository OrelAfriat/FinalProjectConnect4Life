import {
	unauthenticatedError,
	unauthorizedError,
	NotFoundError,
	BadRequestError,
	CustomAPIError,
} from "../errors/index.js";

import { StatusCodes } from "http-status-codes";
import { Task, Status } from "../models/Task.js";
import axios from "axios";
import { BOT_URL, AUTH_URL } from "../assets/paths.js";

// utils functions
const handleValidationErrors = (err, res) => {
	const validationErrors = [];
	if (err.errors) {
		Object.values(err.errors).forEach((error) => {
			validationErrors.push(error.message);
		});
	}
	res
		.status(StatusCodes.BAD_REQUEST)
		.json({ message: "Validation failed", errors: validationErrors });
	throw new BadRequestError(
		`Validation failed. ValidationErrors: ${validationErrors}`
	);
};

export const getUsersByTaskArea = async (task, token) => {
	const taskArea = task.taskArea;
	console.log(taskArea);

	try {
		const response = await axios.get(`${AUTH_URL}/users`, {
			params: { areaOfIntrest: taskArea },
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		return response.data;
	} catch (error) {
		throw new CustomAPIError(error.message);
	}
};

export const createTask = async (req, res) => {
	if (!req.user.permissions.includes("PostTask")) {
		throw new unauthorizedError("Unauthorize to perfrom this action!");
	}

	const {
		donorName,
		taskAddress,
		taskArea,
		taskCoordinates,
		taskPhoneNumber,
		haveEquipment,
	} = req.body;

	if (
		!donorName ||
		!taskAddress ||
		!taskArea ||
		!taskCoordinates ||
		!taskPhoneNumber
	) {
		throw new BadRequestError("All fields are mandatory");
	}
	const task = await Task.create({
		donorName,
		taskAddress,
		taskArea,
		taskCoordinates,
		taskPhoneNumber,
		haveEquipment,
	});

	const token = req.headers["authorization"].split(" ")[1]; // Extract the token from the Authorization header
	console.log(token);
	try {
		await reDistributeTask(task, token);
	} catch (error) {
		throw new CustomAPIError(error.message);
	}
	res.status(StatusCodes.CREATED).send();
};

export const reDistributeTask = async (task, token) => {
	try {
		const users = await getUsersByTaskArea(task, token); // Fetch users to notify
		console.log(users);

		await axios.post(
			`${BOT_URL}/notifyNewTask`,
			{
				task,
				users,
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
	} catch (error) {
		throw new CustomAPIError(error.message);
	}
};

export const getTask = async (req, res) => {
	if (!req.user.permissions.includes("GetTasks")) {
		throw new unauthorizedError("Unauthorize to perfrom this action!");
	}
	const {
		id,
		taskStatus,
		taskArea,
		issuedAfter,
		issuedBefore,
		closedAfter,
		closedBefore,
		collectorUsername,
		haveEquipment,
	} = req.query;
	const queryObject = {};
	if (id) {
		queryObject.id = id;
	}
	if (taskStatus) {
		queryObject.taskStatus = taskStatus;
	}
	if (taskArea) {
		queryObject.taskArea = taskArea;
	}
	if (haveEquipment !== undefined) {
		queryObject.haveEquipment = haveEquipment === "true";
	}

	// in the post manhttp://localhost:7000/api/v1/tasks?taskStatus=Unassigned&issuedAfter=2024-07-15
	if (issuedAfter || issuedBefore) {
		queryObject.issuedAt = {};
		if (issuedAfter) {
			queryObject.issuedAt.$gte = new Date(issuedAfter);
		}
		if (issuedBefore) {
			queryObject.issuedAt.$lte = new Date(issuedBefore);
		}
	}

	if (closedAfter || closedBefore) {
		queryObject.closedAt = {};
		if (closedAfter) {
			queryObject.closedAt.$gte = new Date(closedAfter);
		}
		if (closedBefore) {
			queryObject.closedAt.$lte = new Date(closedBefore);
		}
	}
	if (collectorUsername) {
		queryObject.collectorUsername = collectorUsername;
	}
	console.log(queryObject);
	try {
		const tasks = await Task.find(queryObject);
		if (!tasks) {
			throw new NotFoundError("Task not found");
		}
		res.status(StatusCodes.OK).json(tasks);
	} catch (err) {
		throw new CustomAPIError(err.message);
	}
};

export const getMyTasks = async (req, res) => {
	// for a user gets all his tasks, an admin will use get task above
	if (!req.user.permissions.includes("GetMyTasks")) {
		throw new unauthorizedError("Unauthorize to perfrom this action!");
	}
	console.log("me ha 1");

	const {
		taskStatus,
		taskArea,
		issuedAfter,
		issuedBefore,
		closedAfter,
		closedBefore,
		haveEquipment,
	} = req.query;
	const id = req.user.id; // get the login user id
	const queryObject = {};
	console.log(taskArea);
	if (taskStatus) {
		queryObject.taskStatus = taskStatus;
	}
	if (taskArea) {
		if (Array.isArray(taskArea)) {
			queryObject.taskArea = { $in: taskArea };
		} else {
			queryObject.taskArea = { $in: taskArea.split(",") };
		}
	}
	console.log(queryObject);

	if (haveEquipment !== undefined) {
		queryObject.haveEquipment = haveEquipment === "true";
	}
	if (issuedAfter || issuedBefore) {
		queryObject.issuedAt = {};
		if (issuedAfter) {
			queryObject.issuedAt.$gte = new Date(issuedAfter);
		}
		if (issuedBefore) {
			queryObject.issuedAt.$lte = new Date(issuedBefore);
		}
	}
	if (closedAfter || closedBefore) {
		queryObject.closedAt = {};
		if (closedAfter) {
			queryObject.closedAt.$gte = new Date(closedAfter);
		}
		if (closedBefore) {
			queryObject.closedAt.$lte = new Date(closedBefore);
		}
	}
	queryObject.collectorId = id;
	console.log(queryObject);

	try {
		const tasks = await Task.find(queryObject);
		if (!tasks) {
			throw new NotFoundError("Task not found");
		}
		res.status(StatusCodes.OK).json(tasks);
	} catch (err) {
		throw new CustomAPIError(err.message);
	}
};

export const deleteTask = async (req, res) => {
	if (!req.user.permissions.includes("DeleteTask")) {
		throw new unauthorizedError("Unauthorize to perfrom this action!");
	}
	const { taskId } = req.params;
	const task = await Task.findByIdAndRemove(taskId);
	if (!task) {
		throw new NotFoundError("Task not found");
	}
	res.status(StatusCodes.OK).json({ message: "Task deleted successfully" });
};

export const patchTaskDetails = async (req, res) => {
	if (!req.user.permissions.includes("PatchTaskDetails")) {
		throw new unauthorizedError("Unauthorize to perfrom this action!");
	}

	const { taskId } = req.params;

	if (!taskId) {
		throw new BadRequestError("must provied task id to change");
	}
	const updateData = req.body;
	console.log(updateData);

	const allowedFields = [
		"taskAddress",
		"taskArea",
		"collectorName",
		"taskCoordinates",
		"taskPhoneNumber",
		"haveEquipment",
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

	if (Object.keys(updateData).length === 0) {
		throw new BadRequestError("No valid fields to update");
	}
	const task = await Task.findById(taskId);
	if (!task) {
		throw new NotFoundError("Task not found");
	}
	// Update the task's fields locally
	Object.keys(updateData).forEach((key) => {
		task[key] = updateData[key];
	});
	// runValidators = true means that it will use the schema validators
	// new = true return the new object (the updated one)
	try {
		const task = await Task.findByIdAndUpdate(taskId, updateData, {
			new: true,
			runValidators: true,
		});
		if (!task) {
			throw new NotFoundError("Task not found");
		}
		res
			.status(StatusCodes.OK)
			.json({ message: "Task updated successfully", task });
	} catch (err) {
		// Handle validation errors that comes from the schmea thingy
		handleValidationErrors(err, res);
	}
};

// TODO: use the imported status
// TODO:

export const claimTask = async (req, res) => {
	console.log("me ha");
	if (!req.user.permissions.includes("PatchTaskState")) {
		throw new unauthorizedError("Unauthorize to perfrom this action!");
	}
	console.log("me ha 2");

	const { taskId } = req.params;
	if (!taskId) {
		throw new BadRequestError("must provied task id to claim");
	}

	const task = await Task.findById(taskId);
	if (!task) {
		throw new NotFoundError("Task not found");
	}

	const id = req.user.id; // get the login user id WHAT DO YOU WANO TO DO WITH ADMIN?
	console.log(req);
	// check that the task is unclaimed
	if (task.taskStatus != Status.UA) {
		throw new BadRequestError("task must be unassigned to be claimed");
	}

	// change the status, the lastUpdatedAt, collectorId, collectorName and sent to the validators
	try {
		const updateData = {
			taskStatus: Status.AIP,
			lastUpdatedAt: new Date(),
			collectorId: id,
			collectorName: req.user.username,
		};
		const task = await Task.findByIdAndUpdate(taskId, updateData, {
			new: true,
			runValidators: true,
		});
		res
			.status(StatusCodes.OK)
			.json({ message: "Task claimed successfully", task });
	} catch (err) {
		// Handle validation errors that comes from the schmea thingy
		handleValidationErrors(err, res);
	}
};

export const releaseTask = async (req, res) => {
	if (!req.user.permissions.includes("PatchTaskState")) {
		throw new unauthorizedError("Unauthorize to perfrom this action!");
	}

	const { taskId } = req.params;
	if (!taskId) {
		throw new BadRequestError("must provied task id to claim");
	}

	const task = await Task.findById(taskId);
	if (!task) {
		throw new NotFoundError("Task not found");
	}
	//check that the task is assigned to me
	const id = req.user.id;
	if (task.collectorId != id) {
		throw new BadRequestError("cant change a task that is not yours");
	}

	// check that the task is claimed
	if (task.taskStatus != Status.AIP) {
		throw new BadRequestError("task must be assigned to be realeased");
	}
	// change the status, the lastUpdatedAt, collectorId, collectorName
	try {
		const updateData = {
			taskStatus: Status.UA,
			lastUpdatedAt: Date.now(),
			collectorId: null,
			collectorName: null,
		};
		const task = await Task.findByIdAndUpdate(taskId, updateData, {
			new: true,
			runValidators: true,
		});
		res
			.status(StatusCodes.OK)
			.json({ message: "Task released successfully", task });
	} catch (err) {
		// Handle validation errors that comes from the schmea thingy
		handleValidationErrors(err, res);
	}
};

export const finishTask = async (req, res) => {
	if (!req.user.permissions.includes("PatchTaskState")) {
		throw new unauthorizedError("Unauthorize to perfrom this action!");
	}

	const { taskId } = req.params;
	if (!taskId) {
		throw new BadRequestError("must provied task id to finish");
	}

	const task = await Task.findById(taskId);
	if (!task) {
		throw new NotFoundError("Task not found");
	}

	const id = req.user.id; // get the login user id
	if (task.collectorId != id) {
		throw new BadRequestError("cant change a task that is not yours");
	}
	// check that the task is clamied
	if (task.taskStatus != Status.AIP) {
		throw new BadRequestError("task must be assigned to be finish");
	}
	// change the status, the lastUpdatedAt

	try {
		const updateData = {
			taskStatus: Status.C,
			lastUpdatedAt: Date.now(),
			closedAt: Date.now(),
		};
		const task = await Task.findByIdAndUpdate(taskId, updateData, {
			new: true,
			runValidators: true,
		});
		res
			.status(StatusCodes.OK)
			.json({ message: "Task finished successfully", task });
	} catch (err) {
		// Handle validation errors that comes from the schmea thingy
		handleValidationErrors(err, res);
	}
};
