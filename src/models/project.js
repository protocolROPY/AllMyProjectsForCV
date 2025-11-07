const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Project = sequelize.define('Project', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    tech: {
      type: DataTypes.STRING,
    },
    link: {
      type: DataTypes.STRING,
    }
  }, {
    timestamps: true,
  });

  return Project;
};
