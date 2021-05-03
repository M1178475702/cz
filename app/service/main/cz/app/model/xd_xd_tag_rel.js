/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('xd_xd_tag_rel', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    tag_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    rel_tag_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    relevancy: {
      type: DataTypes.INTEGER(4),
      allowNull: false
    },
    create_time: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: DataTypes.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'xd_xd_tag_rel'
  });

  Model.associate = function() {

  }

  return Model;
};
