'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
 const Categories = sequelize.define(
    'categories',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    },{
    sequelize,
    modelName: 'categories',
    tableName: 'categories',
  });

   Categories.associate = function(models) {
    Categories.hasMany(models.products, {
      foreignKey: 'categoryId',
      as: 'products'
    });
  };
  return Categories;
};