'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.Pharmacy, { foreignKey: 'pharmacyId', as: 'pharmacy' });
      Order.hasMany(models.Purchase, { foreignKey: 'orderId', as: 'purchases' });
    }
  }
  Order.init({
    pharmacyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { notNull: { msg: 'Аптека обязательна' } }
    },
    createdDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};