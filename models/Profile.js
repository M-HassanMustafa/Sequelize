const profile = (sequelize, Sequelize) => {
  const profile = sequelize.define("profile", {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    title: {
      type: Sequelize.STRING(64),
    },
    description: {
      type: Sequelize.STRING(255),
    },
  });
  profile.associate = (models) => {
    profile.belongsToMany(models.checkuser, {
      through: "user_profiles",
      foreignKey: "profileId",
      as: "users",
    });
  };
  return profile;
};

module.exports = profile;
