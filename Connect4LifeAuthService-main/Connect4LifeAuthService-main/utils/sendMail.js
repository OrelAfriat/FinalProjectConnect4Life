import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create a transporter
const transporter = nodemailer.createTransport({
	host: process.env.EMAIL_SERVICE, // SMTP server of your Namecheap domain email
	port: process.env.EMAIL_PORT, // Port, 465 for SSL or 587 for TLS
	secure: process.env.EMAIL_SECURE === "true", // true for SSL, false for TLS
	auth: {
		user: process.env.EMAIL_USER, // your Namecheap domain email address
		pass: process.env.EMAIL_PASS, // your email password
	},
});

// Send email function
export const sendEmail = (to, username) => {
	console.log("tried to send mail");

	const telegramBotLink = "https://t.me/Connect4LifeBot";

	const mailOptions = {
		from: process.env.EMAIL_USER, // the same email address as your user
		to,
		subject: "Welcome to Connect4Life!",
		html: `
        <div style="padding: 20px; border-radius: 10px; background-color: #e0ffe0; color: #006400; font-family: Arial, sans-serif; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); direction: ltr; text-align: left;">
            <div style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">Signup Successful, ${username}!</div>
            <p>
                Thank you for joining Connect4Life! We’re excited to have you onboard.
            </p>
            <p>
                To stay updated with open tasks and receive important notifications, connect with our Telegram bot. 
                <a href="${telegramBotLink}" style="color: #0066cc; text-decoration: none; font-weight: bold;">Click here to connect with our Telegram bot.</a>
            </p>
            <p>
                If you don't have Telegram installed yet, you can download it using the links below:
            </p>
            <p>
                <a href="https://play.google.com/store/apps/details?id=org.telegram.messenger" style="color: #0066cc; text-decoration: none; font-weight: bold;">Download Telegram for Android</a>
            </p>
            <p>
                <a href="https://apps.apple.com/us/app/telegram-messenger/id686449807" style="color: #0066cc; text-decoration: none; font-weight: bold;">Download Telegram for iPhone</a>
            </p>
            <p>
                If you have any questions or need assistance, feel free to reach out to our support team at any time.
            </p>
            <p>Best regards,<br/>The Connect4Life Team</p>
        </div>
    `,
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			return console.error(error);
		}
		console.log("Email sent: " + info.response);
	});
};
