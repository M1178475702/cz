/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;
  const sequelize = app.Sequelize;
  const Model = app.model.define('xd_xd_article_image', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    image_id: {
      type: DataTypes.CHAR(32),
      allowNull: false
    },
    article_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    create_time: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'xd_xd_article_image'
  });

  Model.associate = function() {

  }

  return Model;
};
