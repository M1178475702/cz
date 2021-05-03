/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('xd_xd_record_rank_view_duration', {
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
    view_duration: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    rank: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    snapshot_time: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: '0000-00-00 00:00:00'
    }
  }, {
    tableName: 'xd_xd_record_rank_view_duration'
  });

  Model.associate = function() {

  }

  return Model;
};
