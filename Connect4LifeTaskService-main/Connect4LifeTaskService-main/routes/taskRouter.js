import express from "express";
import {
	createTask,
	deleteTask,
	getMyTasks,
	getTask,
	patchTaskDetails,
	claimTask,
	releaseTask,
	finishTask,
	reDistributeTask,
} from "../controllers/taskController.js";
import authenticateUser from "../middleware/authentication.js";

const taskRouter = express.Router();

taskRouter.post("/tasks", authenticateUser, createTask);
taskRouter.post("/tasks/sendtask/:taskId", authenticateUser, reDistributeTask);
taskRouter.get("/tasks", authenticateUser, getTask);
taskRouter.delete("/tasks/:taskId", authenticateUser, deleteTask);
taskRouter.patch("/tasks/:taskId", authenticateUser, patchTaskDetails);
taskRouter.patch("/tasks/claimTask/:taskId", authenticateUser, claimTask);
taskRouter.patch("/tasks/releaseTask/:taskId", authenticateUser, releaseTask);
taskRouter.patch("/tasks/finishTask/:taskId", authenticateUser, finishTask);
taskRouter.get("/myTasks", authenticateUser, getMyTasks);

export default taskRouter;
