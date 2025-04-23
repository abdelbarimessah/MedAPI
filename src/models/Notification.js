const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'recipientModel', // Dynamically choose the model
  },
  recipientModel: {
    type: String,
    required: true,
    enum: ['User', 'Prestataire','admin'], // Allowed models
  },
  type: { 
    type: String, 
    enum: ['reservation', 'cancellation', 'message','acceptation','rejetation'], 
    required: true 
    },
  message: {
     type: String, 
     required: true 
    },
  isRead: { 
    type: Boolean, 
    default: false
    },
  createdAt: { 
    type: Date, 
    default: Date.now 
    },
  reservationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Appointement'
    }, // Reference to the related reservation
},{collection:"notifications"});

module.exports = mongoose.model('Notification', notificationSchema);
