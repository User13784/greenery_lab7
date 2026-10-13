'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Purchase extends Model {
    static associate(models) {
      Purchase.belongsTo(models.Order, { foreignKey: 'orderId', as: 'order' });
      Purchase.belongsTo(models.Medicine, { foreignKey: 'medicineId', as: 'medicine' });
    }
  }
  Purchase.init({
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    medicineId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: { args: [1], msg: 'Количество должно быть ≥ 1' },
        isInt: { msg: 'Количество должно быть целым числом' }
      }
    }
  }, {
    sequelize,
    modelName: 'Purchase',
  });
  return Purchase;
};