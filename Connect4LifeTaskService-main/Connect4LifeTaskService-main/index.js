import dotenv from "dotenv";
import "express-async-errors";
import taskRouter from "./routes/taskRouter.js";
import notFoundMiddleware from "./middleware/notFound.js";
import errorHandlerMiddleware from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import { connectDB } from "./db/connect.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(
	cors({
		origin: [
			"http://localhost:5173",
			"http://localhost:5174",
			"https://oferlev-technion.github.io",
			"https://authapi.connect4life.live",
			"https://taskapi.connect4life.live",
			"https://connect4life.live",
		],
		methods: ["GET", "PUT", "POST", "DELETE", "PATCH"],
		allowedHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	})
);

app.use("/api/v1", taskRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// Running the server
const port = process.env.PORT || 5001;
const start = async () => {
	try {
		await connectDB(process.env.MONGO_URL);
		app.listen(port, () =>
			console.log(`Server is listening on port ${port}...`)
		);
	} catch (error) {
		console.log(error);
	}
};

start();
