import Patient from "../models/patient";

const loginPatient = async (req, res) => {
  try {
    const { uid } = req.body;

    const user = await Patient.findById(uid);

    if (!user) return res.send({ new: true, message: "Register Patient" });

    res.send({ new: false, user });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ message: "Internal Server Error", details: err.message });
  }
};

const registerPatient = async (req, res) => {
  try {
    const patient = new Patient({ ...req.body });

    patient.save((err, pt) => {
      if (err) {
        return res
          .status(500)
          .send({ message: "Internal Server Error", details: err.message });
      }

      res.send(pt);
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ message: "Internal Server Error", details: err.message });
  }
};

const updatePatient = async (req, res) => {
  try {
    const { id, appointments } = req.body;

    const patient = await Patient.findOneAndUpdate(
      { _id: id },
      { $set: { appointments } }
    );

    if (!patient)
      return res
        .status(500)
        .send({ message: "Patient not found", details: null });

    res.send(patient);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ message: "Internal Server Error", details: err.message });
  }
};

const deletePatient = async (req, res) => {
  try {
    const { id } = req.query;

    const patient = await Patient.findOneAndDelete({ _id: id });

    if (!patient)
      return res
        .status(500)
        .send({ message: "Patient not found", details: null });

    res.send(patient);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ message: "Internal Server Error", details: err.message });
  }
};

const fetchPatients = async (req, res) => {
  try {
    const { count } = req.query;
    if (count === 1) {
      const { id } = req.query;

      const patients = await Patient.findOne({ _id: id });

      if (!patients)
        return res
          .status(500)
          .send({ message: "Patient not found", details: null });

      res.send(patients);
    } else {
      const { date } = req.query;

      const patients = await Patient.find({
        appointments: { $elemMatch: { date } },
      });

      if (!patients)
        return res
          .status(500)
          .send({ message: "Patients not found", details: null });

      res.send(patients);
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ message: "Internal Server Error", details: err.message });
  }
};

export {
  loginPatient,
  registerPatient,
  updatePatient,
  deletePatient,
  fetchPatients,
};
