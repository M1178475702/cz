/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('xd_xd_record_user_login', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    ip: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    login_src: {
      type: DataTypes.INTEGER(4),
      allowNull: false
    },
    create_time: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: DataTypes.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'xd_xd_record_user_login'
  });

  Model.associate = function() {

  };

  return Model;
};
