import fs from "fs";
import moment from "moment";

import Patient from "../models/patient";
import Appointment from "../models/appointment";
import Doctor from "../models/doctor";

import fileUpload from "../helpers/fileUpload";

const loginPatient = async (req, res) => {
  try {
    const { _id } = req.body;

    const user = await Patient.findById(_id);

    if (!user) return res.send({ new: true, message: "Register Patient" });

    res.send({ new: false, user });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Internal Server Error. Please try again later",
      details: err.message,
    });
  }
};

const registerPatient = async (req, res) => {
  try {
    const patient = new Patient({ ...req.body });

    patient.save((err, pt) => {
      if (err) {
        return res.status(500).send({
          message: "Internal Server Error. Please try again later",
          details: err.message,
        });
      }

      res.send(pt);
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Internal Server Error. Please try again later",
      details: err.message,
    });
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
      return res.status(400).send({
        message: "Patient not found. Please check the patient ID.",
        details: null,
      });

    res.send(patient);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Internal Server Error. Please try again later",
      details: err.message,
    });
  }
};

const deletePatient = async (req, res) => {
  try {
    const { id } = req.query;

    const patient = await Patient.findOneAndDelete({ _id: id });

    if (!patient)
      return res.status(400).send({
        message: "Patient not found. Please check the patient ID.",
        details: null,
      });

    res.send(patient);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Internal Server Error. Please try again later",
      details: err.message,
    });
  }
};

const fetchPatients = async (req, res) => {
  try {
    const { count } = req.query;
    if (count === 1) {
      const { id } = req.query;

      const patients = await Patient.findOne({ _id: id });

      if (!patients)
        return res.status(400).send({
          message: "Patient not found. Please check the patient ID.",
          details: null,
        });

      res.send(patients);
    } else {
      const { date } = req.query;

      const patients = await Patient.find({
        appointments: { $elemMatch: { date } },
      });

      if (!patients)
        return res
          .status(500)
          .send({ message: "No patients found", details: null });

      res.send(patients);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Internal Server Error. Please try again later",
      details: err.message,
    });
  }
};

const getAppointments = async (req, res) => {
  try {
    const { _id } = req.params;

    const appointments = await Appointment.find({ patientID: _id });

    res.send(appointments);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Internal Server Error. Please try again later",
      details: err.message,
    });
  }
};

const loadPatientData = async (req, res) => {
  try {
    const { _id } = req.params;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const doctors = await Doctor.find();

    const appointments = await Appointment.find({
      patientID: _id,
      date: { $gte: today },
    })
      .select("date time status symptoms doctorID")
      .exec();

    const toSend = appointments.map(({ doctorID, _doc: { ...app } }) => {
      const d = doctors.find((doc) => doc._id === doctorID);

      return {
        ...app,
        doctorData: {
          _id: d._id,
          name: d.name,
          hospital: d.hospital,
          department: d.department,
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

const newAppointment = async (req, res) => {
  try {
    const {
      doctorID,
      patientID,
      date,
      time,
      symptoms,
      additionalInfo = "",
      photos,
      videos,
      audio,
    } = req.body;

    const patient = await Patient.findOne({ _id: patientID });
    const doctor = await Doctor.findOne({ _id: doctorID });

    if (!patient)
      return res.status(400).send({
        message: "Patient not found. Please check the patient ID.",
        details: null,
      });

    if (!doctor)
      return res.status(400).send({
        message: "Doctor not found. Please check the doctor ID.",
        details: null,
      });

    if (
      moment(date, "DD/MM/YYYY").isBetween(
        moment(doctor.availability.startDate, "DD/MM/YYYY"),
        moment(doctor.availability.endDate, "DD/MM/YYYY")
      )
    ) {
      const appointment = new Appointment({
        doctorID,
        patientID,
        date,
        time,
        symptoms,
        additionalInfo,
        photos,
        videos,
        audio,
      });

      const apptID = appointment._id;
      Object.values(req.files).forEach((field) => {
        field.forEach((file, index) => {
          fs.rename(
            file.path,
            `${__dirname}../../uploads/${file.fieldname}/${apptID}-${index}.${
              file.mimetype.split("/")[1]
            }`,
            () => {}
          );
        });
      });

      appointment.save((err, appt) => {
        if (err) {
          return res.status(500).send({
            message: "Internal Server Error. Please try again later",
            details: err.message,
          });
        }

        res.send(appt);
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Internal Server Error. Please try again later",
      details: err.message,
    });
  }
};

export {
  loginPatient,
  registerPatient,
  updatePatient,
  deletePatient,
  fetchPatients,
  getAppointments,
  newAppointment,
  loadPatientData,
};

// const url = await fileUpload(req.file, "test", req.file.filename);
