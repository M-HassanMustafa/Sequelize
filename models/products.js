const product = (sequelize, Sequelize) => {
  const product = sequelize.define("product", {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    title: {
      type: Sequelize.STRING(64),
      unique: true,
    },
    description: {
      type: Sequelize.STRING(255),
    },
  });
  product.associate = (models) => {
    product.belongsTo(models.checkuser, { foreignKey: "userId" });
  };
  return product;
};

module.exports = product;
