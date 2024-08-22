'use strict';
const {
  Model
} = require('sequelize');
const { hash } = require('../helpers/bcrypt')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Product, { foreignKey: "authorId"})
    }
  }
  User.init({
    username: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: "Email already taken"
      },
      validate: {
        notNull: {
          msg: "Email required"
        },
        notEmpty: {
          msg: "Email required"
        }
      }

    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Password required"
        },
        notEmpty: {
          msg: "Password required"
        },
        len: {
          args: 5,
          msg: "Password minimum 5 characters"
        }
      }
    },
    role: {
      type:DataTypes.STRING,
      allowNull: false,
      defaultValue: "Staff",
      validate: {
        notNull: {
          msg: "Role required"
        },
        notEmpty: {
          msg: "Role required"
        }
      }
    },
    phoneNumber: DataTypes.STRING,
    address: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  User.beforeCreate((user) => {
    user.password = hash(user.password)
  })
  return User;
};