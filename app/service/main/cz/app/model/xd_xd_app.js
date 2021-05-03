/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;
  const sequelize = app.Sequelize;
  const Model = app.model.define('xd_xd_app', {
    app_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    app_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    app_wx_id: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    app_wx_secret: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    app_wx_url: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    create_time: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'xd_xd_app'
  });

  Model.associate = function() {

  }

  return Model;
};
