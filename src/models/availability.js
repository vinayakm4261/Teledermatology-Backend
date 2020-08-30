import mongoose, { Schema } from "mongoose";

const availabilitySchema = new Schema({
  startDate: String,
  endDate: String,
  startTime: String,
  endTime: String,
});

export default mongoose.model("availability", availabilitySchema);
