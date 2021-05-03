/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('xd_xd_user_level', {
    level_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    required_exp: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
  }, {
    tableName: 'xd_xd_user_level'
  });

  Model.associate = function() {

  }

  return Model;
};
