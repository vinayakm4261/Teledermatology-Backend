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

export { testReq };
