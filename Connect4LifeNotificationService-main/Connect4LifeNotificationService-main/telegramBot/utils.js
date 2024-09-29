import axios from 'axios';
import jwt from 'jsonwebtoken';
import { AUTH_URL, TASK_URL } from "../assets/paths.js";

export const askForPhoneNumber = (bot, chatId) => {
	bot.sendMessage(chatId, "שלום! שתף בבקשה את מספר הטלפון שלך", {
		reply_markup: {
			one_time_keyboard: true,
			keyboard: [
				[
					{
						text: "Share phone number",
						request_contact: true,
					},
				],
			],
		},
	});
	console.log(`Sent request for phone number to chat ID: ${chatId}`);
};

export const receiveContact = async(bot, msg) => {
	const chatId = msg.chat.id;
	let phoneNumber = msg.contact.phone_number;
	// need to think about the 972 again 
	if (phoneNumber.startsWith('972')) {
        phoneNumber = '0' + phoneNumber.slice(3);
    }
	console.log(`Received phone number ${phoneNumber} from chat ID: ${chatId}`);
	try {
		// Find the user by phone number
		const { data: token } = await axios.post(`${AUTH_URL}/phoneLogin`, {
            phoneNumber
        });
		if (!token) {
			throw new Error('token not found');
		}
        console.log('Token received:', token.token);

		const decoded = jwt.decode(token.token);
		console.log(decoded)
        const userId = decoded.id;

        if (!userId) {
            throw new Error('User ID not found in token');
        }

        console.log('User ID:', userId);
		console.log(`${AUTH_URL}/userchat/${userId}`)
		// Update the user's chat ID

		const response = await axios.patch(`${AUTH_URL}/userchat/${userId}`, { chatId: chatId }, {
            headers: {
                Authorization: `Bearer ${token.token}`
            }
        });
		console.log(response.status)
		// if (response.statusCode == 200){
		bot.sendMessage(chatId, `תודה, מספר הטלפון שלך במערכת הוא: ${phoneNumber} והנתונים עודכנו אצלנו.`)
		.then(() => {
			console.log(`Sent confirmation message to chat ID: ${chatId}`);
		})
		.catch((error) => {
			console.error(`Error sending confirmation message to chat ID: ${chatId}`, error);
		});
		// }
	// TODO: check that it didnt break
	} catch (error) {
		console.error(`Error processing contact: ${error.message}`);
		// check the return status code
		// notify the user on what happend
		// 
		bot.sendMessage(chatId, `הייתה בעיה בהוספת הטלפון שלך, אנא נסה שנית.`);
	}
};
