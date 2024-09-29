import axios from "axios";
import { TASK_URL } from "./paths";
import { REQUEST_TIMEOUT } from "../Pages/Signin";
import { getCookie } from "./utils";

axios.defaults.withCredentials = true;

export const getTasksFromDB = async () => {
	try {
		// const token = getCookie("token"); // Replace with the actual name of your token cookie
		// console.log("token");
		// console.log(token);
		const taskResponse = await axios.get(
			`${TASK_URL}/tasks`,
			{
				timeout: REQUEST_TIMEOUT,
			}
		);
		return taskResponse.data;
	} catch (error) {
		console.log(error);
	}
};
