const User = require("../models/User");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/keys");
const crypto = require("crypto");
const emailService = require("../services/email.service");
const twoFactorService = require("../services/twoFactor.service");


const authController = {
  googleCallback(req, res) {
    const token = jwt.sign({ id: req.user._id }, jwtSecret, {
      expiresIn: "24h",
    });

    res.json({ message: "Logged in successfully with Google", token });
  },

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(404)
          .json({ message: "No user found with this email" });
      }

      const resetToken = crypto.randomBytes(32).toString("hex");
      user.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
      user.resetPasswordExpires = Date.now() + 3600000;

      await user.save();

      try {
        await emailService.sendPasswordResetEmail(user.email, resetToken);

        // this line is for development only
        if (process.env.NODE_ENV === "development") {
          return res.json({
            message: "Password reset email sent",
            resetToken: resetToken,
            resetUrl: `${process.env.FRONTEND_URL}/reset-password/${resetToken}`,
          });
        }

        res.json({ message: "Password reset email sent" });
      } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        return res.status(500).json({
          message: "Error sending reset email",
          error: error.message,
        });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  async resetPassword(req, res) {
    try {
      const { token } = req.params;
      const { password } = req.body;

      const resetPasswordToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (!user) {
        return res
          .status(400)
          .json({ message: "Invalid or expired reset token" });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      await user.save();

      res.json({ message: "Password reset successful" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  async register(req, res) {
    try {
      const { firstname, lastname, email, password, role } = req.body;

      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: "User already exists" });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = new User({
        firstname,
        lastname,
        email,
        password: hashedPassword,
        role: role || "client",
      });
      await user.save();
      ``;
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  login(req, res, next) {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(400).json({ message: info.message });
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }

        if (user.twoFactorEnabled) {
          return res.json({ 
            message: "2FA required",
            requiresTwoFactor: true,
            email: user.email
          });
        }

        const token = jwt.sign({ id: user._id }, jwtSecret, {
          expiresIn: "24h",
        });

        return res.json({ message: "Logged in successfully", token });
      });
    })(req, res, next);
  },

  logout(req, res) {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Error logging out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  },

  async enable2FA(req, res) {
    try {
      const user = await User.findById(req.user.id);
      const { otpauthUrl, base32 } = twoFactorService.generateSecret(
        user.email
      );

      user.twoFactorSecret = base32;
      await user.save();

      const qrCodeUrl = await twoFactorService.generateQRCode(otpauthUrl);

      res.json({
        message: "Two-factor authentication setup initiated",
        qrCodeUrl,
        secret: base32,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error setting up 2FA", error: error.message });
    }
  },

  async verify2FA(req, res) {
    try {
      const { token } = req.body;
      const user = await User.findById(req.user.id);

      if (!user.twoFactorSecret) {
        return res.status(400).json({ message: "2FA setup not initiated" });
      }

      const isValid = twoFactorService.verifyToken(token, user.twoFactorSecret);

      if (isValid) {
        user.twoFactorEnabled = true;
        await user.save();
        res.json({ message: "2FA enabled successfully" });
      } else {
        res.status(400).json({ message: "Invalid verification code" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error verifying 2FA", error: error.message });
    }
  },

  async disable2FA(req, res) {
    try {
      const user = await User.findById(req.user.id);
      user.twoFactorSecret = undefined;
      user.twoFactorEnabled = false;
      await user.save();

      res.json({ message: "2FA disabled successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error disabling 2FA", error: error.message });
    }
  },

  async validate2FA(req, res) {
    try {
      const { email, token } = req.body;
      const user = await User.findOne({ email });

      if (!user || !user.twoFactorEnabled) {
        return res.status(400).json({ message: "Invalid request" });
      }

      const isValid = twoFactorService.verifyToken(token, user.twoFactorSecret);

      if (isValid) {
        const jwtToken = jwt.sign({ id: user._id }, jwtSecret, {
          expiresIn: "24h",
        });
        res.json({ message: "2FA validation successful", token: jwtToken });
      } else {
        res.status(400).json({ message: "Invalid 2FA code" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error validating 2FA", error: error.message });
    }
  },
};

module.exports = authController;