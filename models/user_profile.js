"use strict";

const user_profile = (sequelize, Sequelize) => {
  const user_profile = sequelize.define("user_profiles", {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    userId: Sequelize.INTEGER,
    profileId: Sequelize.INTEGER,
  });
  user_profile.associate = (models) => {
    user_profile.belongsTo(models.checkuser, {
      foreignKey: "userId",
      as: "user",
    });
    user_profile.belongsTo(models.profile, {
      foreignKey: "profileId",
      as: "profile",
    });
  };
  return user_profile;
};

module.exports = user_profile;
