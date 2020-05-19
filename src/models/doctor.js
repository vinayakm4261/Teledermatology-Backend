import mongoose, { Schema } from "mongoose";

const doctorSchema = new Schema({
  _id: String,
  name: String,
  dob: String,
  gender: String,
  email: String,
  type: String,
  hospital: String,
  appointments: Object,
});

export default mongoose.model("doctors", doctorSchema);
