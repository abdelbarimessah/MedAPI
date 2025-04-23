const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    googleId: {
      type: String,
      sparse: true,
    },    
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    role: { 
        type: String, 
        enum: ['client', 'admin'], 
        default:'client',
        required: true,
    },
    adresse: { 
        type: String,
        required:true 
      },

    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["client", "admin"],
    },
    phone: {
      type: String,
    },
    dateInscription: {
      type: Date,
      default: Date.now,
    },    
    status: { 
        type: Boolean, 
        default: true 
  },
    isBanned:{
        type:Boolean,
        default:false
    },
    chnaces_left:{
        type:Number,
        default:3,
    },

    twoFactorSecret: {
      type: String,
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false
    },
  },
  {
    collection: "utilisateurs",
  }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
