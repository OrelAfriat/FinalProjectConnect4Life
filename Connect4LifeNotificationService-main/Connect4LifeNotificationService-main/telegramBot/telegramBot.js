import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import axios from "axios";
import { askForPhoneNumber, receiveContact } from "./utils.js";
import { Notification,Status } from "../models/Notification.js"; // Import the Notification model
import jwt from 'jsonwebtoken';
import { AUTH_URL, TASK_URL } from "../assets/paths.js";
dotenv.config();

const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const conversations = new Map(); // A Map to store ongoing conversations

// utility functions:
// Function to handle user login and retrieve tasks

async function handleLoginAndRetrieveTasks(chatId, taskStatusString) {
    try {
        const { data: token } = await axios.post(`${AUTH_URL}/phoneLogin`, { chatId });
        if (!token) {
            bot.sendMessage(chatId, "אין לך מספר מעודכן במערכת");
            throw new Error('Token not found');
        }

        console.log('Token received:', token.token);
        const decoded = jwt.decode(token.token);
        const userId = decoded.id;
        if (!userId) {
            throw new Error('User ID not found in token');
        }

        console.log('User ID:', userId);

        const result = await axios.get(`${AUTH_URL}/profile`, {
            headers: { Authorization: `Bearer ${token.token}` }
        });
        const userTaskArea = result.data.user.areasOfIntrests;
        
       
        const url = taskStatusString === 'Assigned (In Progress)' ? `${TASK_URL}/myTasks` : `${TASK_URL}/tasks`;
        const { data: allTasks } = await axios.get(url, {
            headers: { Authorization: `Bearer ${token.token}` },
            params: { taskArea: userTaskArea, taskStatus: taskStatusString }
        });
        

        return { allTasks, token: token.token };

    } catch (error) {
        bot.sendMessage(chatId, `הייתה בעיה עם מספר הטלפון שלך במערכת`);
        console.error(error);
    }
}

// Function to handle task assignment
async function handleTaskAssignment(chatId, allTasks, token, taskState,message) {
    if (allTasks.length === 0) {
        bot.sendMessage(chatId, "לא נמצאה משימה שניתן לקבל");

    } else {
        allTasks.forEach((task, index) => {
            message += `${index + 1}. ${task.taskAddress}\n`; // Adjust this line based on what details you want to show
        });
        bot.sendMessage(chatId, message);

        // Set up conversation state
        conversations.set(chatId, {
            state: taskState,
            tasks: allTasks,
            token: token // Store the token to use later
        });
    }
}



// Function to handle task selection and commands
async function handleTaskSelection(chatId, text) {
    const ongoingConversation = conversations.get(chatId);
    const userSelection = parseInt(text, 10);

    if (text === '0') {
        bot.sendMessage(chatId, "לא נבחרה שום משימה.");
        conversations.delete(chatId); // End conversation
   
    } else if (isNaN(userSelection) || userSelection < 1 || userSelection > ongoingConversation.tasks.length) {
        bot.sendMessage(chatId, "מספר משימה לא תקין, אנא נסה שוב.");
    } else {
        const selectedTask = ongoingConversation.tasks[userSelection - 1];
        const taskId = selectedTask._id;
        try {
            await axios.patch(`${TASK_URL}/tasks/claimTask/${taskId}`, {}, {
                headers: { Authorization: `Bearer ${ongoingConversation.token}` }
            });
            bot.sendMessage(chatId, "'קיבלת את המשימה בהצלחה, לביטול המשימה יש להשיב 'בטל או לסיום המשימה 'סיימתי'");
            const notification = new Notification({
                telegramChatId: chatId,
                userPhoneNumber: "0",
                taskDetails: "0",
                type: Status.AA,
                taskId: taskId
            });
            await notification.save();
            console.log(`Notification: ${notification}`);
            conversations.delete(chatId); // End conversation
        } catch (error) {
            bot.sendMessage(chatId, `הייתה בעיה בקבלת המשימה`);
            console.error(error);
        }
    }
}

// Function to handle task cancellation
async function handleTaskCancellation(chatId, text) {
    const ongoingConversation = conversations.get(chatId);
    const userSelection = parseInt(text, 10);

    if (text === '0') {
        bot.sendMessage(chatId, "לא נבחרה שום משימה.");
        conversations.delete(chatId); // End conversation
    } else if (isNaN(userSelection) || userSelection < 1 || userSelection > ongoingConversation.tasks.length) {
        bot.sendMessage(chatId, "מספר משימה לא תקין, אנא נסה שוב.");
    } else {
        const selectedTask = ongoingConversation.tasks[userSelection - 1];
        const taskId = selectedTask._id;
        try {
            await axios.patch(`${TASK_URL}/tasks/releaseTask/${taskId}`, {}, {
                headers: { Authorization: `Bearer ${ongoingConversation.token}` }
            });
            bot.sendMessage(chatId, "בטלת את המשימה בהצלחה");
            const notification = new Notification({
                telegramChatId: chatId,
                userPhoneNumber: "0",
                taskDetails: "0",
                type: Status.AA,
                taskId: taskId
            });
            await notification.save();
            console.log(`Notification: ${notification}`);
            conversations.delete(chatId); // End conversation
        } catch (error) {
            bot.sendMessage(chatId, `הייתה בעיה בביטול המשימה`);
            console.error(error);
        }

    }
}


// Function to handle task completion
async function handleTaskCompletion(chatId, text) {
    const ongoingConversation = conversations.get(chatId);
    const userSelection = parseInt(text, 10);

    if (text === '0') {
        bot.sendMessage(chatId, "לא נבחרה שום משימה.");
        conversations.delete(chatId); // End conversation
   
    } else if (isNaN(userSelection) || userSelection < 1 || userSelection > ongoingConversation.tasks.length) {
        bot.sendMessage(chatId, "מספר משימה לא תקין, אנא נסה שוב.");
    } else {
        const selectedTask = ongoingConversation.tasks[userSelection - 1];
        const taskId = selectedTask._id;
        try {
            await axios.patch(`${TASK_URL}/tasks/finishTask/${taskId}`, {}, {
                headers: { Authorization: `Bearer ${ongoingConversation.token}` }
            });
            bot.sendMessage(chatId, "סיימת את המשימה בהצלחה, תודה רבה על תורמתך לעמותת רוק4ליף!");
            const notification = new Notification({
                telegramChatId: chatId,
                userPhoneNumber: "0",
                taskDetails: "0",
                type: Status.CA,
                taskId: taskId
            });
            await notification.save();
            console.log(`Notification: ${notification}`);
            conversations.delete(chatId); // End conversation
        } catch (error) {
            bot.sendMessage(chatId, `הייתה בעיה בסיום המשימה`);
            console.error(error);
        }
    }

}

// Handle the /start command
bot.onText(/\/start/, (msg) => {
	const chatId = msg.chat.id;
	askForPhoneNumber(bot, chatId);
	// TODO: Get the phone number, find user with relevant phone number (Axios call to AuthService) and update his telegram chat id
});

// Handle contact (phone number) sharing
bot.on("contact", (msg) => {
	receiveContact(bot, msg);
});

// Handle text messages

bot.on("message", async (msg) => {
	// Ignore messages that are not text or are the /start command
	if (!msg.text || msg.text.toLowerCase() === "/start") return;

	const chatId = msg.chat.id;
	const text = msg.text.toLowerCase();

	//examples for using the telegram chat bot. here should be the logic for user
	if (text === "hello") {
		bot.sendMessage(chatId, "Hello! How can I assist you today?");
	} else if (text === "קבל") {
		// TODO: 
		// ווצאפ לוגין עם הצאט אי די
		// get my user
		// get unassigned by task area
		// ask the user what task he ment
		// get the number -> wait for the message 
		// send to claim task 
		const { allTasks, token } = await handleLoginAndRetrieveTasks(chatId, "Unassigned");
        if (allTasks) {
            let message = "אלו הם המשימות באזור שלך, בחר את מספר המשימה שברצונך לקבל או הקלד '0' אם אינך רוצה לקבל שום משימה:\n";
            await handleTaskAssignment(chatId, allTasks, token,'awaitingTaskSelection',message);
        }
    
    } else if (text === "בטל") {
        const { allTasks, token } = await handleLoginAndRetrieveTasks(chatId, "Assigned (In Progress)");
        if (allTasks) {
			console.log(allTasks)
            let message = "יש לך מספר משימות שהוקצו לך, בחר את מספר המשימה שברצונך לבטל או הקלד '0' אם אינך רוצה לבטל שום משימה:\n";
            await handleTaskAssignment(chatId, allTasks, token,'awaitingTaskCancellation',message);
        }
        
    } else if (text === "סיימתי") {
        const { allTasks, token } = await handleLoginAndRetrieveTasks(chatId, "Assigned (In Progress)");
        if (allTasks) {
            let message = "יש לך מספר משימות שהוקצו לך, בחר את מספר המשימה שברצונך לסיים או הקלד '0' אם אינך רוצה לסיים שום משימה:\n";
            await handleTaskAssignment(chatId, allTasks, token,'awaitingTaskCompletion', message);
        }
	} else if (text === "עזרה") {
		bot.sendMessage(
			chatId,
			"כדי לראות את המשימות הפתוחות ולקבל משימה יש להשיב 'קבל'\nכדי לראות את המשימות שלך ולבטל משימה יש להשיב 'בטל'\nכדי לראות את המשימות שלךו לסיים משימה יש להשיב 'סיימתי'"
		);
    } else if (conversations.has(chatId)) {
        const ongoingConversation = conversations.get(chatId);
        console.log(ongoingConversation)
        if (ongoingConversation.state === 'awaitingTaskSelection') {
            await handleTaskSelection(chatId, text);
        } else if (ongoingConversation.state === 'awaitingTaskCancellation') {
            await handleTaskCancellation(chatId, text);
        } else if (ongoingConversation.state === 'awaitingTaskCompletion') {
            await handleTaskCompletion(chatId, text);
        }
	} else {
		bot.sendMessage(
			chatId,
			"סליחה לא הבנתי את הפקודה הזאת, תרשום 'עזרה' על מנת לראות מה אני יכול לעשות"
		);
	}
});

bot.on("polling_error", (error) => {
	console.error(`Polling error: ${error.message}`);
});

export default bot;
