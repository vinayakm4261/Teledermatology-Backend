import Doctor from "../models/doctor";

const doctorInsertReq = async (req, res) => {
  try {
    const NewDoctor = new Doctor({ ...req.body });

    NewDoctor.save((err, doctor) => {
      if (err) {
        return res.status(500).send("Server Error");
      } else {
        console.log(doctor);
        return res.send(doctor);
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Error");
  }
};

const updateDoctorReq = async (req, res) => {
  try {
    const { id, appointments } = req.body;

    const UpdateDoctor = await Doctor.findOneAndUpdate(
      { _id: id },
      { $set: { appointments: appointments } }
    );

    if (!UpdateDoctor) return res.status(500).send("Could not be updated");

    res.send(UpdateDoctor);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Error");
  }
};

const deleteDoctorReq = async (req, res) => {
  try {
    const id = req.query.id;
    const DeleteDoctor = await Doctor.findOneAndDelete({ _id: id });
    if (!DeleteDoctor) return res.status(500).send("Could not be deleted");

    res.send(DeleteDoctor);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Error");
  }
};

const fetchDoctorReq = async (req, res) => {
  try {
    const count = req.query.count;
    if (count == 1) {
      const id = req.query.id;
      const FetchDoctor = await Doctor.findOne({ _id: id });

      if (!FetchDoctor) return res.status(500).send("Could not be fetched");

      res.send(FetchDoctor);
    } else {
      const department = req.query.department;
      const FetchDoctor = await Doctor.find({
        department: department,
      });

      if (!FetchDoctor)
        return res.send({
          type: "error",
          heading: "Error",
          _error: "Could not fetch",
        });

      res.send(FetchDoctor);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Error");
  }
};

export { doctorInsertReq, updateDoctorReq, deleteDoctorReq, fetchDoctorReq };
