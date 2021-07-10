import { RtcTokenBuilder, RtcRole } from "agora-access-token";

import dotenv from "dotenv";

import Patient from "../models/patient";
import Doctor from "../models/doctor";

dotenv.config();

const loginUser = async (req, res) => {
  try {
    const { _id } = req.body;

    const patientUser = await Patient.findById(_id);

    if (!patientUser) {
      const doctorUser = await Doctor.findById(_id);

      if (!doctorUser)
        return res.send({ new: true, message: "Register Patient" });

      return res.send({ new: false, user: doctorUser, isDoctor: true });
    }

    return res.send({ new: false, user: patientUser, isDoctor: false });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Internal Server Error. Please try again later",
      details: err.message,
    });
  }
};

const agoraToken = async (req, res) => {
  try {
    const { channelName, uid } = req.body;

    const expirationTimeInSeconds = 1800;

    const currentTimestamp = Math.floor(Date.now() / 1000);

    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    const token = RtcTokenBuilder.buildTokenWithUid(
      process.env.AGORA_APP_ID,
      process.env.AGORA_APP_CERTIFICATE,
      channelName,
      uid,
      RtcRole.PUBLISHER,
      privilegeExpiredTs
    );

    return res.send({ token });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Internal Server Error. Please try again later",
      details: err.message,
    });
  }
};

export { loginUser, agoraToken };
