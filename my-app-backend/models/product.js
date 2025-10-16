'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {

  const Product = sequelize.define(
    'products',
    {
      // Model attributes are defined here
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true
      },
      price: {
        type: DataTypes.STRING,
        allowNull: false
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true
      },
       categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'categories', 
          key: 'id'
        },
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }

    }, {
    sequelize,
    modelName: 'products',
    tableName: 'products',
  });

   Product.associate = function(models) {
    Product.belongsTo(models.categories, {
      foreignKey: 'categoryId',
      as: 'category'
    });
  };

  return Product;
};