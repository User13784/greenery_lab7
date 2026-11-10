'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Pharmacy extends Model {
    static associate(models) {
      Pharmacy.hasMany(models.Order, { foreignKey: 'pharmacyId', as: 'orders' });
    }
  }
  Pharmacy.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Название аптеки обязательно' },
        len: { args: [2, 200], msg: 'Название: от 2 до 200 символов' }
      }
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: 'Адрес обязателен' } }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Телефон обязателен' },
        is: {
          args: /^[\d\s\+\-\(\)]+$/i,
          msg: 'Телефон: только цифры и символы + - ( )'
        }
      }
    },
    photoUrl: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Pharmacy',
  });
  return Pharmacy;
};