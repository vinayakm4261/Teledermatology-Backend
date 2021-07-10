import mongoose, { Schema } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const patientSchema = new Schema({
  _id: String,
  name: String,
  dob: String,
  age: Number,
  phoneNumber: Number,
  gender: String,
  email: String,
  profilePic: {
    type: String,
    default: process.env.PATIENT_AVATAR,
  },
  diseases: Array,
});

export default mongoose.model("patients", patientSchema);
