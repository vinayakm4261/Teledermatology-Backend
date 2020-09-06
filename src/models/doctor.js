import mongoose, { Schema } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const doctorSchema = new Schema({
  _id: String,
  name: String,
  dob: String,
  phoneNumber: String,
  gender: String,
  email: String,
  profilePic: {
    type: String,
    default: function () {
      if (this.gender === "female") {
        return process.env.DOCTOR_AVATAR_F;
      }

      return process.env.DOCTOR_AVATAR_M;
    },
  },
  department: String,
  hospital: String,
  appointments: Array,
});

export default mongoose.model("doctors", doctorSchema);
