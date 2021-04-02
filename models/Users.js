const checkuser = (sequelize, Sequelize) => {
  const checkuser = sequelize.define("checkuser", {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    username: {
      type: Sequelize.STRING(64),
    },
    email: {
      type: Sequelize.STRING(64),
      unique: true,
    },
    password: {
      type: Sequelize.STRING(255),
    },
    url: {
      type: Sequelize.STRING(255),
    },
    details: {
      type: Sequelize.STRING(255),
    },
  });

  checkuser.associate = (models) => {
    checkuser.hasMany(models.product, {
      foreignKey: "userId",
      as: "userProducts",
      onDelete: "CASCADE",
    });
    checkuser.belongsToMany(models.profile, {
      through: "user_profiles",
      foreignKey: "userId",
      as: "profile",
    });
  };
  return checkuser;
};

module.exports = checkuser;
