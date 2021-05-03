/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('xd_xd_record_user_op', {
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
    op_type: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    create_time: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: DataTypes.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'xd_xd_record_user_op'
  });

  Model.associate = function() {

  }

  return Model;
};
