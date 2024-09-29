import express from "express";
import { exampleController,notifyUsersNewTask } from "../controllers/notificationsController.js";
import authenticateUser from "../middleware/authentication.js";

const notificationsRouter = express.Router();

notificationsRouter.get("/example-route", exampleController);
notificationsRouter.post("/notifyNewTask",authenticateUser,notifyUsersNewTask)
// authRouter.get('/user',authenticateUser, getUser);
export default notificationsRouter;
