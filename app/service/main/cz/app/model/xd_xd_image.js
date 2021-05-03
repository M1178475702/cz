/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;
  const sequelize = app.Sequelize;
  const Model = app.model.define('xd_xd_image', {
    image_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    image_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    create_time: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'xd_xd_image'
  });

  Model.associate = function() {

  }

  return Model;
};
