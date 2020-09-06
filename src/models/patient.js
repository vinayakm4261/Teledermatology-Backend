import mongoose, { Schema } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const patientSchema = new Schema({
  _id: String,
  name: String,
  dob: String,
  phoneNumber: Number,
  gender: String,
  email: String,
  diseases: Array,
  profilePic: {
    type: String,
    default: process.env.PATIENT_AVATAR,
  },
  appointments: Array,
});

export default mongoose.model("patients", patientSchema);

/* appointments: [{
	date: String,
	doctorID: String,
	symptoms: Array,
	additionalInfo: String,
	photos: Array, // decide on how will this work
	videos: Array, // decide on how this will work
	chats: String // Firebase or socket.io or agora.io
}] */
