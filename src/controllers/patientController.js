import Patient from "../models/patient";

const loginPatient = async (req, res) => {
  try {
    const { uid, phone } = req.body;

    if (!uid || !phone) return res.status(400).send("Bad Request");

    const user = await Patient.findById(uid);

    if (!user) return res.send({ new: true, message: "Register Patient" });

    res.send({ new: false, user });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

const registerPatient = async (req, res) => {
  try {
    const patient = new Patient({ ...req.body });

    patient.save((err, pt) => {
      if (err) {
        return res.status(500).send("Internal Server Error");
      }

      res.send(pt);
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

const updatePatient = async (req, res) => {
  try {
    const { id, appointments } = req.body;

    const patient = await Patient.findOneAndUpdate(
      { _id: id },
      { $set: { appointments } }
    );

    if (!patient) return res.status(500).send("Patient not found");

    res.send(patient);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

const deletePatient = async (req, res) => {
  try {
    const { id } = req.query;

    const patient = await Patient.findOneAndDelete({ _id: id });

    if (!patient) return res.status(500).send("Patient not found");

    res.send(patient);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

const fetchPatients = async (req, res) => {
  try {
    const { count } = req.query;
    if (count === 1) {
      const { id } = req.query;

      const patients = await Patient.findOne({ _id: id });

      if (!patients) return res.status(500).send("Patient not found");

      res.send(patients);
    } else {
      const { date } = req.query;

      const patients = await Patient.find({
        appointments: { $elemMatch: { date } },
      });

      if (!patients) return res.status(500).send("Patients not found");

      res.send(patients);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

export {
  loginPatient,
  registerPatient,
  updatePatient,
  deletePatient,
  fetchPatients,
};
