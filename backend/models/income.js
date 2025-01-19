'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Income extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Income.belongsTo(models.User,
        {
          foreignKey: 'userId',
          as: 'user'
        }
      )
    }
  }
  Income.init({
    userId: DataTypes.INTEGER,
    amount: DataTypes.DECIMAL,
    type: DataTypes.ENUM('fixed', 'variable'),
    date: DataTypes.DATE,
    category: DataTypes.STRING,
    description: DataTypes.STRING,
  },
    {
      sequelize,
      modelName: 'Income',
      paranoid: true,
      timestamps: true
    });
  return Income;
};