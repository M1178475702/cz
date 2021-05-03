/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('xd_xd_user', {
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    openid: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true
    },
    user_number: {
      type: DataTypes.STRING(16),
      allowNull: false,
      defaultValue: '0'
    },
    mobile: {
      type: DataTypes.CHAR(11),
      allowNull: false,
      defaultValue: ''
    },
    name: {
      type: DataTypes.STRING(50),
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
    user_role: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '20'
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
    language_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    level_id: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '1'
    },
    exp: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    bonus_points: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    coll_count: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    comment_count: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    view_count: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    status: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '1'
    },
    register_time: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: DataTypes.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'xd_xd_user'
  });

  Model.associate = function() {

  }

  return Model;
};
