import mongoose, { Schema } from "mongoose";

const doctorSchema = new Schema({
  _id: String,
  name: String,
  dob: String,
  phoneNumber: String,
  gender: String,
  email: String,
  department: String,
  hospital: String,
  appointments: Array,
});

export default mongoose.model("doctors", doctorSchema);
