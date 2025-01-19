'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Income,
        {
          foreignKey: 'userId',
          as: 'incomes'
        }
      );
      User.hasMany(models.Expense,
        {
          foreignKey: 'userId',
          as: 'expenses'
        }
      );
      User.hasMany(models.Balance,
        {
          foreignKey: 'userId',
          as: 'balance'
        }
      );
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
    paranoid: true,
    timestamps: true
  });
  return User;
};