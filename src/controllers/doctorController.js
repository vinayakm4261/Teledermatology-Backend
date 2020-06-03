import Doctor from "../models/doctor";

const loginDoctor = async (req, res) => {
  try {
    const { uid } = req.body;

    const user = await Doctor.findById(uid);

    if (!user) return res.send({ new: true, message: "Register Doctor" });

    res.send({ new: false, user });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Internal Error", details: err.message });
  }
};

const registerDoctor = async (req, res) => {
  try {
    const doctor = new Doctor({ ...req.body });

    doctor.save((err, dr) => {
      if (err) {
        return res
          .status(500)
          .send({ message: "Internal Error", details: err.message });
      }
      res.send(dr);
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Internal Error", details: err.message });
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
      return res
        .status(500)
        .send({ message: "Could not be updated", details: null });

    res.send(doctor);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Internal Error", details: err.message });
  }
};

const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.query;

    const doctor = await Doctor.findOneAndDelete({ _id: id });

    if (!doctor)
      return res
        .status(500)
        .send({ message: "Could not be deleted", details: null });

    res.send(doctor);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Internal Error", details: err.message });
  }
};

const fetchDoctor = async (req, res) => {
  try {
    const { count } = req.query;
    if (count === 1) {
      const { id } = req.query;

      const doctor = await Doctor.findOne({ _id: id });

      if (!doctor)
        return res
          .status(500)
          .send({ message: "No doctor found", details: null });

      res.send(doctor);
    } else {
      const { department } = req.query;

      const doctors = await Doctor.find({
        department,
      });

      if (!doctors)
        return res
          .status(500)
          .send({ message: "No doctors found", details: null });

      res.send(doctors);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Internal Error", details: err.message });
  }
};

export { loginDoctor, registerDoctor, updateDoctor, deleteDoctor, fetchDoctor };
