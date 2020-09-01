import mongoose, { Schema } from "mongoose";

const appointmentSchema = new Schema({
  doctorID: String,
  patientID: String,
  date: String,
  symptoms: Array,
  additionalInfo: String,
  photos: Array,
  videos: Array,
  audio: Array,
});

export default mongoose.model("appointments", appointmentSchema);
