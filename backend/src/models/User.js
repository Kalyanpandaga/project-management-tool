const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const sequelize = require("../config/database");
const { JWT_PRIVATE_KEY, BCRYPT_ROUNDS } = require("../config/constants");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("Admin", "Manager", "Developer"),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    hooks: {
      beforeCreate: async (user, options) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, BCRYPT_ROUNDS);
        }
      },
      beforeUpdate: async (user, options) => {
        if (user.changed("password")) {
          user.password = await bcrypt.hash(user.password, BCRYPT_ROUNDS);
        }
      },
    },
  }
);

User.prototype.getJwt = function () {
  return jwt.sign({ userId: this.id }, JWT_PRIVATE_KEY, {
    expiresIn: "1d",
  });
};

User.prototype.validatePassword = async function (inputPassword) {
  const user = this;
  const hashedPassword = user.password;
  return await bcrypt.compare(inputPassword, hashedPassword);
};

module.exports = User;
