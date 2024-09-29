import { Schema, model, Types } from "mongoose";
import bcrypt from "bcrypt";

export const Status = {
	UA: "Unassigned",
	AIP: "Assigned (In Progress)",
	C: "Completed",
};

const TaskArea = [
	"Northern Israel",
	"Haifa and Surroundings",
	"Central Israel",
	"Tel Aviv and Gush Dan",
	"Jerusalem",
	"Southern Israel",
];
 
const validateCoordinates = (value) => {
	return (
		value && typeof value.lat === "number" && typeof value.lon === "number"
	);
};

const phoneNumberRegex = new RegExp(
	/^\+?(\d{1,3})?[-. ]?\(?\d{1,4}?\)?[-. ]?\d{1,4}[-. ]?\d{1,4}[-. ]?\d{1,9}$/
);

const TaskSchema = new Schema({
	donorName: {
		type: String,
		required: [true, "Donor Name is required"],
	},
	taskStatus: {
		type: String,
		enum: {
			values: Object.values(Status),
			message: "Invalid Status",
		},
		default: Status.UA,
	},
	taskAddress: {
		type: String,
		required: [true, "Task Address Is Required"],
		// to add verification !
	},
	taskCoordinates: {
		type: Object,
		required: [true, "Task Address Is Required"],
		validate: {
			validator: validateCoordinates,
			message:
				"Task Coordinates must contain valid latitude and longitude properties",
		},
	},
	taskArea: {
		type: String,
		enum: {
			values: Object.values(TaskArea),
			message: "Invalid task area",
		},
	},
	taskPhoneNumber: {
		type: String,
		required: [true, "Potential Donor Phone Number Is Required"],
		unique: true,
		validate: {
			validator: function (v) {
				return phoneNumberRegex.test(v);
			},
			message: "Invalid Phone Number",
		},
	},
	issuedAt: {
		type: Date,
		required: true,
		default: Date.now,
	},
	lastUpdatedAt: {
		type: Date,
		required: true,
		default: Date.now,
	},
	closedAt: {
		type: Date,
		// required: [true, "Areas Of Intrests Are Required"]
	},
	collectorId: {
		type: Types.ObjectId,
	},
	collectorName: {
		type: String,
	},
	haveEquipment: {
		type: Boolean,
		default: false,
		required: true,
	  },
});

export const Task = model("Task", TaskSchema);
