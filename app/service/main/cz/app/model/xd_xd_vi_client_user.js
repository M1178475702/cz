/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('xd_xd_vi_client_user', {
    userId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0',
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ''
    },
    userNumber: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0',
    },
    userRole: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '0',
    },
    mobile: {
      type: DataTypes.CHAR(11),
      allowNull: false,
      defaultValue: ''
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ''
    },
    gender: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '0'
    },
    city: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: ''
    },
    province: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: ''
    },
    country: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: ''
    },
    exp: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    level: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '0'
    },
    bonusPoints: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    collCount: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    commentCount: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    viewCount: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    status: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '1'
    },
    levelName: {
      type: DataTypes.STRING(20),
      allowNull: false
    }
  }, {
    tableName: 'xd_xd_vi_client_user'
  });

  Model.associate = function() {

  }

  return Model;
};
