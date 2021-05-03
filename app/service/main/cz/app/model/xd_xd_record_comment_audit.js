/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;
  const sequelize = app.Sequelize;
  const Model = app.model.define('xd_xd_record_comment_audit', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    audited_by: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    comment_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    op_type: {
      type: DataTypes.INTEGER(255),
      allowNull: false
    },
    create_time: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'xd_xd_record_comment_audit'
  });

  Model.associate = function() {

  }

  return Model;
};
