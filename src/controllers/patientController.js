import moment from "moment";

import Patient from "../models/patient";
import Appointment from "../models/appointment";
import Doctor from "../models/doctor";

import fileUpload from "../helpers/fileUpload";
import getAge from "../helpers/getAge";

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
    const { dob } = req.body;

    const age = getAge(dob);

    const patient = new Patient({ ...req.body, age });

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

    const appointments = await Appointment.aggregate([
      {
        $match: { patientID: _id, date: { $gte: today } },
      },
      {
        $sort: {
          date: 1,
        },
      },
      {
        $limit: 8,
      },
      {
        $lookup: {
          from: "doctors",
          localField: "doctorID",
          foreignField: "_id",
          as: "doctorDataArray",
        },
      },
      {
        $addFields: {
          doctorData: {
            $arrayElemAt: ["$doctorDataArray", 0],
          },
        },
      },
      {
        $project: {
          date: 1,
          time: 1,
          status: 1,
          symptoms: 1,
          doctorData: {
            _id: 1,
            name: 1,
            hospital: 1,
            department: 1,
            profilePic: 1,
          },
        },
      },
    ]);

    res.send({ appointments });
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

    console.log(req.body);
    console.log("Normal", time);
    console.log("Moment", moment(time).format("DD/MM/YYYY hh:mm A"));
    console.log("Date object", new Date(time));

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
      moment(date).isBetween(
        moment(doctor.availability.startDate),
        moment(doctor.availability.endDate)
      )
    ) {
      const appointment = new Appointment({
        doctorID,
        patientID,
        date,
        time: moment(time).utcOffset("+05:30").format("hh:mm A"),
        symptoms,
        additionalInfo,
        photos,
        videos,
        audio,
      });

      if (Object.entries(req.files).length > 0) {
        const apptID = appointment._id;

        const promises = [];

        Object.entries(req.files).forEach(([key, field]) => {
          field.forEach((file, index) => {
            const uploadPromise = fileUpload(
              file,
              `appointment_media/${apptID}/${key}`,
              `${apptID}-${index}.${file.mimetype.split("/")[1]}`
            );

            promises.push(uploadPromise);
          });
        });

        const mediaUrls = await Promise.all(promises);

        appointment.photos = mediaUrls.filter((url) => url.includes("photos"));
        appointment.videos = mediaUrls.filter((url) => url.includes("videos"));
        appointment.audio = mediaUrls.filter((url) => url.includes("audio"));
      }

      appointment.save((err, appt) => {
        if (err) {
          return res.status(500).send({
            message: "Internal Server Error. Please try again later",
            details: err.message,
          });
        }

        res.send({
          success: true,
          appointment: {
            _id: appt._id,
            date: appt.date,
            time: appt.time,
            status: appt.status,
            symptoms: appt.symptoms,
            doctorData: {
              _id: doctor._id,
              name: doctor.name,
              hospital: doctor.hospital,
              department: doctor.department,
              profilePic: doctor.profilePic,
            },
          },
        });
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

const fetchDoctors = async (req, res) => {
  try {
    const { queryText } = req.body;

    if (queryText !== "") {
      const regex = new RegExp(`^${queryText}`, "i");

      const doctors = await Doctor.find(
        {
          $or: [{ name: regex }, { hospital: regex }, { department: regex }],
        },
        { name: 1, profilePic: 1, hospital: 1, department: 1, availability: 1 }
      );

      res.send(doctors);
    } else {
      res.send([]);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Internal Server Error. Please try again later",
      details: err.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { id, photoUpdated, updateData } = req.body;

    const updatedData = JSON.parse(updateData);

    if (photoUpdated === "true") {
      const url = await fileUpload(
        req.file,
        `patient_profiles/${id}`,
        `${id}.${req.file.mimetype.split("/")[1]}`
      );

      console.log(url);

      const patient = await Patient.findOneAndUpdate(
        { _id: id },
        {
          $set: { profilePic: url, ...updatedData },
        }
      );

      if (!patient)
        return res.status(400).send({
          message: "Patient not found. Please check the patient ID.",
          details: null,
        });

      res.send(patient);
    } else {
      const patient = await Patient.findOneAndUpdate(
        { _id: id },
        { $set: { ...updatedData } }
      );

      if (!patient)
        return res.status(400).send({
          message: "Patient not found. Please check the patient ID.",
          details: null,
        });

      res.send(patient);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Internal Server Error. Please try again later",
      details: err.message,
    });
  }
};

const uploadConsent = async (req, res) => {
  try {
    const { patientID, appointmentID } = req.body;

    const patient = await Patient.findOne({ _id: patientID });
    const appointment = await Appointment.findOne({ _id: appointmentID });

    if (!patient)
      return res.status(400).send({
        message: "Patient not found. Please check the patient ID.",
        details: null,
      });

    if (!appointment)
      return res.status(400).send({
        message: "Appointment not found. Please check the appointment ID.",
        details: null,
      });

    if (Object.values(req.files).length > 0) {
      const file = Object.values(req.files)[0][0];

      const url = await fileUpload(
        file,
        `appointment_media/${appointmentID}/consent`,
        `${appointmentID}-consent.${file.mimetype.split("/")[1]}`
      );

      appointment.consent = url;

      appointment.save((err, appt) => {
        if (err)
          return res.status(500).send({
            message: "Internal Server Error. Please try again later",
            details: err.message,
          });

        res.send({ appointment: appt });
      });
    } else {
      res.status(400).send({
        message: "No file received. Check request",
        details: null,
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
  fetchDoctors,
  updateProfile,
  uploadConsent,
};
