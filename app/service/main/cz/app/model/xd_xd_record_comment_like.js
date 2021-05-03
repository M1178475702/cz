/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('xd_xd_record_comment_like', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    comment_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER(4),
      allowNull: false
    },
    create_time: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: DataTypes.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'xd_xd_record_comment_like'
  });

  Model.associate = function() {

  }

  return Model;
};
