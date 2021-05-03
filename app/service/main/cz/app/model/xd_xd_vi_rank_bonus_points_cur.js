/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('xd_xd_vi_rank_bonus_points_cur', {
    userId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0',
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ''
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ''
    },
    rank: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    bp: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    userStatus:{
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '1'
    },
    mtime: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: '0000-00-00 00:00:00'
    }
  }, {
    tableName: 'xd_xd_vi_rank_bonus_points_cur'
  });

  Model.associate = function() {

  }

  return Model;
};
