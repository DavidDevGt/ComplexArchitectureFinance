'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Balance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Balance.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }
  Balance.init({
    userId: DataTypes.INTEGER,
    totalIncome: DataTypes.DECIMAL,
    totalExpenses: DataTypes.DECIMAL,
    date: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Balance',
    paranoid: true,
    timestamps: true
  });
  return Balance;
};