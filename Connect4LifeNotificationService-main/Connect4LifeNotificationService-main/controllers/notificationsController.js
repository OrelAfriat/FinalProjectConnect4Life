import {
	unauthenticatedError,
	unauthorizedError,
	NotFoundError,
	BadRequestError,
} from "../errors/index.js";
import { StatusCodes } from "http-status-codes";
import axios from 'axios';
import { Notification, Status } from '../models/Notification.js';
import bot from '../telegramBot/telegramBot.js'; // Import the bot instance

export const exampleController = async (req, res) => {
	res.status(StatusCodes.OK).send({ status: "this is an exmaple route" });
};

export const notifyUsersNewTask = async (req, res) => {
    console.log("im at the bot service")
    const { task, users } = req.body;

    if (!task || !task.taskArea) {
        throw new BadRequestError('Task or TaskArea not provided');
    }
    if (!users || !Array.isArray(users)) {
        throw new BadRequestError('Users list not provided or invalid');
    }
    try {
        // Notify each user via the Telegram bot
        users.forEach(user => {
            if (user.chatId) { // Assuming each user has a chatId property
                const message = `משימת איסוף דם חדשה נוספה באזור שלך: ${task.taskArea}\n` +
                `הכתובת של המשימה: ${task.taskAddress}\n` +
                `שם התורם: ${task.donorName}\n` +
                `טלפון התורם: ${task.taskPhoneNumber}\n` +
                `יש ציוד אצל התורם: ${task.haveEquipment ? 'כן' : 'לא'}\n` +
                `לקבלת המשימה יש להשיב "קבל"`;

                bot.sendMessage(user.chatId, message)

                .then(async () => {
                    console.log(`Notification sent to ${user.chatId}`);
                    // Create a notification
                    const notification = new Notification({
                        telegramChatId: user.chatId,
                        userPhoneNumber: user.phoneNumber,
                        type: Status.D,
                        taskDetails: JSON.stringify(task),
                        taskId: task._id,
                    });
                    await notification.save();
                    console.log(`Notification: ${notification}`);
                })
                .catch(error => console.error(`Failed to send notification to ${user.chatId}: ${error.message}`));
        }       
        });

        res.status(StatusCodes.OK).send({ status: "Notifications sent successfully" });
    } catch (error) {
        console.error(`Error notifying users: ${error.message}`);
        throw new CustomAPIError(error.message);
    }

};