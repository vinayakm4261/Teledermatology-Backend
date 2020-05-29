import Patient from "../models/patient";

const testReq = async (req, res) => {
  try {
    const { uid, phone } = req.body;

    if (!uid || !phone) return res.status(400).send("Bad Request");

    const user = await Patient.findById(uid);

    if (!user) return res.send({ new: true, message: "Create Account" });

    return res.send({ new: false, ...user });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Error");
  }
};

const patientInsertReq = async (req, res) => {
  try {
    const NewPatient = new Patient({ ...req.body });

    NewPatient.save((err, patient) => {
      if (err) {
        return res.status(500).send("Server Error");
      } else {
        console.log(patient);
        return res.send(patient);
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Error");
  }
};

const updatePatientReq = async (req, res) => {
  try {
    const { id, appointments } = req.body;

    const UpdatePatient = await Patient.findOneAndUpdate(
      { _id: id },
      { $set: { appointments: appointments } }
    );

    if (!UpdatePatient) return res.status(500).send("Could not be updated");

    res.send(UpdatePatient);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Error");
  }
};

const deletePatientReq = async (req, res) => {
  try {
    const id = req.query.id;
    const DeletePatient = await Patient.findOneAndDelete({ _id: id });
    if (!DeletePatient) return res.status(500).send("Could not be deleted");

    res.send(DeletePatient);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Error");
  }
};

const fetchPatientReq = async (req, res) => {
  try {
    const count = req.query.count;
    if (count == 1) {
      const id = req.query.id;
      const FetchPatient = await Patient.findOne({ _id: id });

      if (!FetchPatient) return res.status(500).send("Could not be fetched");

      res.send(FetchPatient);
    } else {
      const date = req.query.date;
      const FetchPatient = await Patient.find({
        appointments: { $elemMatch: { date: date } },
      });

      if (!FetchPatient)
        return res.send({
          type: "error",
          heading: "Error",
          _error: "Could not fetch",
        });

      res.send(FetchPatient);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Error");
  }
};

export {
  testReq,
  patientInsertReq,
  updatePatientReq,
  deletePatientReq,
  fetchPatientReq,
};
