/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('xd_xd_record_rank_bonus_points', {
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
    bonus_points: {
      type: DataTypes.INTEGER(11),
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
    tableName: 'xd_xd_record_rank_bonus_points'
  });

  Model.associate = function() {

  }

  return Model;
};
