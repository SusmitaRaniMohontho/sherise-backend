import Appointment from "../models/Appointment.js";
import User from "../models/User.js";

// ======================================================
// USER - CREATE APPOINTMENT
// ======================================================

export const createAppointment = async (req, res) => {
  try {
    const {
      providerId,
      providerName,
      date,
      timeSlot,
      note,
    } = req.body;

    if (!providerId || !date || !timeSlot) {
      return res.status(400).json({
        error: "Please fill in all required fields!",
      });
    }

    // Check logged-in user
    const user = await User.findById(req.user.userId).select(
      "systemRole"
    );

    if (!user) {
      return res.status(401).json({
        error: "User not found.",
      });
    }

    // Admin cannot book appointments
    if (user.systemRole === "admin") {
      return res.status(403).json({
        error: "Admin cannot book appointments.",
      });
    }

    const newAppointment = new Appointment({
      userId: req.user.userId,
      userEmail: req.user.email,
      providerId,
      providerName,
      date,
      timeSlot,
      note,
      status: "Pending",
    });

    await newAppointment.save();

    return res.status(201).json({
      message: "Appointment request submitted successfully!",
      appointment: newAppointment,
    });
  } catch (err) {
    console.error("Create appointment error:", err);

    return res.status(500).json({
      error: err.message,
    });
  }
};


// ======================================================
// USER - GET MY APPOINTMENTS
// Only Confirmed and Rejected will be shown
// Pending will NOT be shown
// ======================================================

export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      userId: req.user.userId,
      status: {
        $in: ["Confirmed", "Rejected"],
      },
    })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json(appointments);
  } catch (err) {
    console.error("Get my appointments error:", err);

    return res.status(500).json({
      error: err.message,
    });
  }
};


// ======================================================
// ADMIN - GET ALL APPOINTMENTS
// ======================================================

export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json(appointments);
  } catch (err) {
    console.error("Get all appointments error:", err);

    return res.status(500).json({
      error: err.message,
    });
  }
};


// ======================================================
// ADMIN - ACCEPT / REJECT APPOINTMENT
// ======================================================

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Confirmed", "Rejected"].includes(status)) {
      return res.status(400).json({
        error: "Invalid appointment status.",
      });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        status,
      },
      {
        new: true,
      }
    ).populate("userId", "name email");

    if (!appointment) {
      return res.status(404).json({
        error: "Appointment not found.",
      });
    }

    return res.status(200).json({
      message: `Appointment ${
        status === "Confirmed" ? "accepted" : "rejected"
      } successfully.`,
      appointment,
    });
  } catch (err) {
    console.error("Update appointment status error:", err);

    return res.status(500).json({
      error: err.message,
    });
  }
};