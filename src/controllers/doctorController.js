import Patient from "../models/patient";
import Doctor from "../models/doctor";
import Appointment from "../models/appointment";

const loginDoctor = async (req, res) => {
  try {
    const { _id } = req.body;

    const user = await Doctor.findById(_id);

    if (!user) return res.send({ new: true, message: "Register Doctor" });

    res.send({ new: false, user });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Internal Server Error. Please try again later.",
      details: err.message,
    });
  }
};

const registerDoctor = async (req, res) => {
  try {
    const doctor = new Doctor({ ...req.body });

    doctor.save((err, dr) => {
      if (err) {
        return res.status(500).send({
          message: "Internal Server Error. Please try again later.",
          details: err.message,
        });
      }
      res.send(dr);
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Internal Server Error. Please try again later.",
      details: err.message,
    });
  }
};

const updateDoctor = async (req, res) => {
  try {
    const { id, appointments } = req.body;

    const doctor = await Doctor.findOneAndUpdate(
      { _id: id },
      { $set: { appointments } }
    );

    if (!doctor)
      return res.status(400).send({
        message: "Doctor not found. Please check the doctor ID.",
        details: null,
      });

    res.send(doctor);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Internal Server Error. Please try again later.",
      details: err.message,
    });
  }
};

const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.query;

    const doctor = await Doctor.findOneAndDelete({ _id: id });

    if (!doctor)
      return res.status(400).send({
        message: "Doctor not found. Please check the doctor ID.",
        details: null,
      });

    res.send(doctor);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Internal Server Error. Please try again later.",
      details: err.message,
    });
  }
};

const fetchDoctor = async (req, res) => {
  try {
    const { count } = req.query;
    if (count === 1) {
      const { id } = req.query;

      const doctor = await Doctor.findOne({ _id: id });

      if (!doctor)
        return res.status(400).send({
          message: "Doctor not found. Please check the doctor ID.",
          details: null,
        });

      res.send(doctor);
    } else {
      const { department } = req.query;

      const doctors = await Doctor.find({
        department,
      });

      if (!doctors)
        return res
          .status(400)
          .send({ message: "No doctors found", details: null });

      res.send(doctors);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Internal Server Error. Please try again later.",
      details: err.message,
    });
  }
};

const loadDoctorData = async (req, res) => {
  try {
    const { _id } = req.params;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const patients = await Patient.find();

    const appointments = await Appointment.find({
      doctorID: _id,
      date: { $gte: today },
    })
      .select("date time status symptoms patientID")
      .exec();

    const toSend = appointments.map(({ patientID, _doc: { ...app } }) => {
      const d = patients.find((pat) => pat._id === patientID);

      return {
        ...app,
        patientData: {
          _id: d._id,
          name: d.name,
          age: d.age,
          gender: d.gender,
          profilePic: d.profilePic,
        },
      };
    });

    res.send({ appointments: toSend });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Internal Server Error. Please try again later",
      details: err.message,
    });
  }
};

export {
  loginDoctor,
  registerDoctor,
  updateDoctor,
  deleteDoctor,
  fetchDoctor,
  loadDoctorData,
};
