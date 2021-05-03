/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;
  const sequelize = app.Sequelize;
  const Model = app.model.define('xd_xd_record_article_op', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    op_by: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    article_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    op_type: {
      type: DataTypes.INTEGER(4),
      allowNull: false
    },
    create_time: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'xd_xd_record_article_op'
  });

  Model.associate = function() {

  }

  return Model;
};
