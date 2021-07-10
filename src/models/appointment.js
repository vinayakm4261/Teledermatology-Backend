import mongoose, { Schema } from "mongoose";

const appointmentSchema = new Schema({
  doctorID: String,
  patientID: String,
  date: Date,
  time: String,
  status: {
    type: String,
    default: "pending",
  },
  symptoms: Array,
  additionalInfo: String,
  photos: Array,
  videos: Array,
  audio: Array,
  consent: String,
});

export default mongoose.model("appointments", appointmentSchema);
