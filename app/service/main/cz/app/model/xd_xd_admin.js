/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;
  const sequelize = app.Sequelize;

  const Model = app.model.define('xd_xd_admin', {
    admin_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    account: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    pwd: {
      type: DataTypes.CHAR(48),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(16),
      allowNull: false,
      defaultValue: ''
    },
    create_by: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    create_time: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    modify_time: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'xd_xd_admin'
  });

  Model.associate = function() {

  }

  return Model;
};
