
const Appointment = require("../models/Appointment");

exports.createAppointment = async (req, res) => {
  try {
    const { clientName, clientEmail, clientPhone, service, date, time, provider, price } = req.body;
    const appointment = await Appointment.create({
      clientName,
      clientEmail,
      clientPhone,
      service,
      date,
      time,
      provider,
      price,
    });
    res.status(201).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: "Appointment not found",
      });
    }
    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const { clientName, clientEmail, clientPhone, service, date, time, provider, price } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        clientName,
        clientEmail,
        clientPhone,
        service,
        date,
        time,
        provider,
        price,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: "Appointment not found",
      });
    }
    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: "Appointment not found",
      });
    }
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};