import Patient from "../models/patient";
import Appointment from "../models/appointment";
import Doctor from "../models/doctor";

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

export { loginUser };
