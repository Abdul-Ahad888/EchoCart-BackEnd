const User = require("../model/user.model");

const updateLastActive = async (req, res, next) => {
  try {
    if (req.user && req.user.id) {
      await User.update(
        { lastActive: new Date() },
        { where: { id: req.user.id } }
      );
    }
  } catch (err) {
    console.error("Error updating lastActive:", err.message);
  }
  next();
};

module.exports = updateLastActive;
