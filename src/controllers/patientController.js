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
    const {
      _id,
      name,
      dob,
      phone,
      gender,
      email,
      diseases,
      appointments,
    } = req.body;
    const NewPatient = new Patient({
      _id: _id,
      name: name,
      dob: dob,
      phone: phone,
      gender: gender,
      email: email,
      diseases: diseases,
      appointments: appointments,
    });

    NewPatient.save((err, patient) => {
      if (err) {
        return res.send({
          type: "error",
          heading: "Server Error",
          _error: "Please try again later",
        });
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
    const { _id, appointments } = req.body;

    const UpdatePatient = await Patient.updateOne(
      { _id: _id },
      { $set: { appointments: appointments } }
    );

    if (!UpdatePatient)
      return res.send({
        type: "error",
        heading: "Error",
        _error: "Could not be updated",
      });

    res.send(UpdatePatient);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Error");
  }
};

const deletePatientReq = async (req, res) => {
  try {
    const _id = req.query._id;
    const DeletePatient = await Patient.deleteOne({ _id: _id });
    if (!DeletePatient)
      return res.send({
        type: "error",
        heading: "Error",
        _error: "Could not be updated",
      });

    res.send(DeletePatient);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Error");
  }
};

export { testReq, patientInsertReq, updatePatientReq, deletePatientReq };
