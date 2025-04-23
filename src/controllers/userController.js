const User = require("../models/User");

const userController = {
  async getAllUsers(req, res, next) {
    try {
      const users = await User.find({}, '-password');
      res.json(users);
    } catch (error) {
      next(error);
    }
  },

  async getUserById(req, res, next) {
    try {
      const user = await User.findById(req.params.id, '-password');
      if (!user) {
        const error = new Error("User not found");
        error.status = 404;
        throw error;
      }
      res.json(user);
    } catch (error) {
      next(error);
    }
  },

  async updateUser(req, res, next) {
    try {
      const { firstname, lastname, email, address, phone } = req.body;
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          firstname,
          lastname,
          email,
          address,
          phone
        },
        { new: true, select: '-password' }
      );
      if (!updatedUser) {
        const error = new Error("User not found");
        error.status = 404;
        throw error;
      }
      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  },

  async deleteUser(req, res, next) {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      if (!deletedUser) {
        const error = new Error("User not found");
        error.status = 404;
        throw error;
      }
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      next(error);
    }
  },

  async searchUsers(req, res, next) {
    try {
      const { query } = req.query;
      const users = await User.find({
        $or: [
          { firstname: { $regex: query, $options: 'i' } },
          { lastname: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } }
        ]
      }, '-password');
      res.json(users);
    } catch (error) {
      next(error);
    }
  },

  async updateUserRole(req, res, next) {
    try {
      const { role } = req.body;
      if (!['client', 'admin'].includes(role)) {
        const error = new Error("Invalid role");
        error.status = 400;
        throw error;
      }
      
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true, select: '-password' }
      );
      if (!updatedUser) {
        const error = new Error("User not found");
        error.status = 404;
        throw error;
      }
      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = userController;