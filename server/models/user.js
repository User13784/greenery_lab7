'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Пока не связываем — на будущее
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: 'Некорректный email' },
        notEmpty: { msg: 'Email обязателен' }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Пароль обязателен' },
        len: { args: [60, 255], msg: 'Пароль хранится как хеш' }
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'user',
      validate: {
        isIn: { args: [['user', 'admin']], msg: 'Роль: user или admin' }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};