import { Schema, model } from 'mongoose';
import bcrypt from "bcrypt"
// import validator from 'email-validator';

const Permission =  {
    U: "U",
    A: "A"
}
const areas = [
	"Northern Israel",
	"Haifa and Surroundings",
	"Central Israel",
	"Tel Aviv and Gush Dan",
	"Jerusalem",
	"Southern Israel",
];
const phoneNumberRegex = new RegExp('^05[0-68-9]\[0-9]{7}$');
// const emailRegex = new RegExp('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$');
const emailRegex = new RegExp('^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z]+(\.[a-zA-Z]+)*$');

const UserSchema = new Schema({
    username: {
        type: String,
        required: [true, "User Name Is Required"],
        unique: [true, "This User Name Is Already Taken, Please Choose a Different One"],
        minlength: [2, "User Name Needs To Contain At Least Two Characters"]
    },
    password: {
        type: String,
        required: [true, "Password Is Required"],
        minlength: [5, "Password Needs To Contain At Least Five Characters"]
    },
    firstName: {
        type: String,
        required: [true, "First Name Is Required"],
        minlength: [2, "First Name Needs To Contain At Least Two Characters"]
    },
    lastName: {
        type: String,
        required: [true, "Last Name Is Required"],
        minlength: [2, "Last Name Needs To Contain At Least Two Characters"]
    },
    email: {
        type: String,
        required:[true, "Email Address Is Required"],
        validate: {
            validator: function(v) {
                return emailRegex.test(v);
            },
            message: 'Invalid Email Address',
        },
        unique: [true, "Email Address Already Exists In The System, Please Enter a Different One"]
    },
    livingArea: {
        type: String,
        required: [true, "Living Area Is Required"],
        enum: {
			values: Object.values(areas),
			message: "Invalid task area",
		},
    },
    areasOfIntrests: {
        type: [String],
        required: [true, "Areas Of Intrests Are Required"],
        enum: {
			values: Object.values(areas),
			message: "Invalid task area",
		},
    },
    phoneNumber: {
        type: String,
        required: [true, "Phone Number Is Required"],
        validate: {
            validator: function(v) {
                return phoneNumberRegex.test(v);
            },
            message: 'Invalid Phone Number',
        },
        unique: [true, "Phone Number Already Exists In The System, Please Enter a Different One"]
    },
    permission: {
        type: String,
        enum: {
            values: Object.values(Permission),
            message: "Invalid Permission"
        },
        default: Permission.U
    },
    chatId: {
        type: String,
    },
    
})

UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (canditatePassword) {
    const isMatch = await bcrypt.compare(canditatePassword, this.password);
    return isMatch;
};


export const User = model('User', UserSchema)
