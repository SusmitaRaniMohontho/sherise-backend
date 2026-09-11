import Appointment from "../models/Appointment.js";

export const createAppointment = async (req, res) => {
  try {
    const { providerId, providerName, date, timeSlot, note } = req.body;

    if (!providerId || !date || !timeSlot) {
      return res.status(400).json({ error: "Please fill in all required fields!" });
    }

    const newAppointment = new Appointment({
      userId: req.user.userId,    // কুকি টোকেন থেকে আসা আসল ইউজারের আইডি
      userEmail: req.user.email,  // কুকি টোকেন থেকে আসা ইউজারের ইমেইল
      providerId,
      providerName,
      date,
      timeSlot,
      note,
    });

    await newAppointment.save();

    res.status(201).json({
      message: "Appointment booked successfully!",
      appointment: newAppointment,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};