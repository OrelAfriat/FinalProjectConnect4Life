import { Schema, model } from 'mongoose';
import bcrypt from "bcrypt"
import validator from 'email-validator';

export const Status = {
	D: "Distribution",
	AA: "Accept Approval",
	CA: "Cancellation Approval",
};

const notificationSchema = new Schema({
  date: { type: Date, default: Date.now },
  telegramChatId: { type: String, required: true },
  userPhoneNumber: { type: String, required: true },
  taskDetails: { type: String, required: true },
  type: {
		type: String,
		enum: {
			values: Object.values(Status),
			message: "Invalid Status",
		},
    required: true},
    taskId: { type: Schema.Types.ObjectId, required: true, ref: 'Task' }
});

export const Notification = model('Notification', notificationSchema);
