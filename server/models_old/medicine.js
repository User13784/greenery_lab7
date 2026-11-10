'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Medicine extends Model {
    static associate(models) {
      Medicine.hasMany(models.Purchase, { foreignKey: 'medicineId', as: 'purchases' });
    }
  }
  Medicine.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Название лекарства обязательно' },
        len: { args: [2, 200], msg: 'Название: от 2 до 200 символов' }
      }
    },
    manufacturer: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: 'Производитель обязателен' } }
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: { args: [0], msg: 'Цена не может быть отрицательной' },
        isDecimal: { msg: 'Цена должна быть числом' }
      }
    },
    photoUrl: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Medicine',
  });
  return Medicine;
};