import express from "express";
import {
	getUser,
	login,
	promoteUser,
	refreshToken,
	signup,
	getUserByParams,
	patchUser,
	deleteUser,
	getUsersByIntrestLivingArea,
	whatsappLogin,
	patchUserChatID,
	getUsersByPhoneNumber,
	getMyUser,
} from "../controllers/authController.js";
import authenticateUser from "../middleware/authentication.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/phoneLogin", whatsappLogin);
authRouter.post("/refreshToken", authenticateUser, refreshToken);

authRouter.get("/user", authenticateUser, getUserByParams); // get user by user name or id
authRouter.get("/users",authenticateUser, getUsersByIntrestLivingArea); // get user by user name or id
authRouter.get("/userchat", authenticateUser, getUsersByPhoneNumber); // get user by phone number
authRouter.get("/profile", authenticateUser, getMyUser); 
authRouter.post("/user", authenticateUser, promoteUser);
authRouter.patch("/user/:id", authenticateUser, patchUser);
authRouter.patch("/userchat/:id", authenticateUser,patchUserChatID);
authRouter.delete("/user/:id", authenticateUser, deleteUser);
//authRouter.get('/userparm',authenticateUser, getUserByParams);

export default authRouter;
