/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;
  const sequelize = app.Sequelize;
  const Model = app.model.define('xd_xd_language', {
    language_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    language_name: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: ''
    },
    create_time: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'xd_xd_language'
  });

  Model.associate = function() {

  }

  return Model;
};
