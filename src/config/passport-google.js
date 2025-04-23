const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const dotenv = require("dotenv");
const crypto = require("crypto");

dotenv.config();

module.exports = function(passport) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async function(accessToken, refreshToken, profile, done) {
    try {
      const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;

      if (!email) {
        return done(new Error("No email found in Google profile"), null);
      }

      let user = await User.findOne({ email });

      if (user) {
        return done(null, user);
      }

      const randomPassword = crypto.randomBytes(16).toString('hex');

      user = new User({
        firstname: profile.name && profile.name.givenName ? profile.name.givenName : 'Unknown',
        lastname: profile.name && profile.name.familyName ? profile.name.familyName : 'Unknown',
        email: email,
        password: randomPassword,
        role: 'client',
        googleId: profile.id
      });

      await user.save();
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));
};