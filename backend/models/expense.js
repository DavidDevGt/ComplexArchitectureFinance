'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Expense extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Expense.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });

    }
  }
  Expense.init({
    userId: DataTypes.INTEGER,
    amount: DataTypes.DECIMAL,
    type: DataTypes.ENUM('fixed', 'variable'),
    date: DataTypes.DATE,
    category: DataTypes.STRING,
    description: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Expense',
    paranoid: true,
    timestamps: true
  });
  return Expense;
};