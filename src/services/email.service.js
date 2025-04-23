const nodemailer = require('nodemailer');

const emailService = {
  async sendPasswordResetEmail(email, resetToken) {
    // For development/testing with Postman
    if (process.env.NODE_ENV === 'development') {
      console.log('==== Password Reset Information ====');
      console.log('Email:', email);
      console.log('Reset Token:', resetToken);
      console.log('Reset URL would be:', `${process.env.FRONTEND_URL}/reset-password/${resetToken}`);
      console.log('================================');
      
      // In development, just return without sending email
      return;
    }

    // Regular email sending logic for production
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <h1>You requested a password reset</h1>
        <p>Please click on the following link to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Email error:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
};

module.exports = emailService;