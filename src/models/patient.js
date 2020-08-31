import mongoose, { Schema } from "mongoose";

const patientSchema = new Schema({
  _id: String,
  name: String,
  displayPhoto: String,
  dob: String,
  phoneNumber: Number,
  gender: String,
  email: String,
  diseases: Array,
  appointments: {
    type: Array,
    default: [],
  },
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
