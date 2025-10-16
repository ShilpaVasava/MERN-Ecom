"use strict";
const { Model } = require("sequelize");
// models/cart.js
module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define("Cart", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "products",
        key: "id",
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  });

  Cart.associate = function (models) {
    Cart.hasMany(models.products, {
      foreignKey: "productId",
      as: "product",
    });
  };

  return Cart;
};
