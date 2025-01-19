'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Trash extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Trash.init({
    tableName: DataTypes.STRING,
    recordId: DataTypes.INTEGER,
    data: DataTypes.JSON,
  }, {
    sequelize,
    modelName: 'Trash',
    paranoid: true,
    timestamps: true
  });
  return Trash;
};