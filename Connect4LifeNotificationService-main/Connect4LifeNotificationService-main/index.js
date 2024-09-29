import dotenv from "dotenv";
import bodyParser from "body-parser";
import "express-async-errors";
import axios from "axios";
import notificationsRouter from "./routes/notificationsRouter.js";
import notFoundMiddleware from "./middleware/notFound.js";
import errorHandlerMiddleware from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import { connectDB } from "./db/connect.js";
import bot from "./telegramBot/telegramBot.js";
dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(
	cors({
		origin: [
			"http://localhost:5173",
			"http://localhost:5174",
			"https://oferlev-technion.github.io",
		],
		methods: ["GET", "PUT", "POST", "DELETE"],
		allowedHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	})
);

app.use("/api/v1", notificationsRouter);

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
