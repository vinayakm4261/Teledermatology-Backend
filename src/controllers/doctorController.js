import Doctor from "../models/doctor";

const loginDoctor = async (req, res) => {
  try {
    const { uid, phone } = req.body;

    if (!uid || !phone) return res.status(400).send("Bad Request");

    const user = await Doctor.findById(uid);

    if (!user) return res.send({ new: true, message: "Register Doctor" });

    res.send({ new: false, user });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Error");
  }
};

const registerDoctor = async (req, res) => {
  try {
    const doctor = new Doctor({ ...req.body });

    doctor.save((err, dr) => {
      if (err) {
        return res.status(500).send("Internal Error");
      }
      res.send(dr);
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Error");
  }
};

const updateDoctor = async (req, res) => {
  try {
    const { id, appointments } = req.body;

    const doctor = await Doctor.findOneAndUpdate(
      { _id: id },
      { $set: { appointments } }
    );

    if (!doctor) return res.status(500).send("Could not be updated");

    res.send(doctor);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Error");
  }
};

const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.query;

    const doctor = await Doctor.findOneAndDelete({ _id: id });

    if (!doctor) return res.status(500).send("Could not be deleted");

    res.send(doctor);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Error");
  }
};

const fetchDoctor = async (req, res) => {
  try {
    const { count } = req.query;
    if (count === 1) {
      const { id } = req.query;

      const doctor = await Doctor.findOne({ _id: id });

      if (!doctor) return res.status(500).send("Could not be fetched");

      res.send(doctor);
    } else {
      const { department } = req.query;

      const doctors = await Doctor.find({
        department,
      });

      if (!doctors)
        return res.send({
          type: "error",
          heading: "Error",
          _error: "Could not fetch",
        });

      res.send(doctors);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Error");
  }
};

export { loginDoctor, registerDoctor, updateDoctor, deleteDoctor, fetchDoctor };
