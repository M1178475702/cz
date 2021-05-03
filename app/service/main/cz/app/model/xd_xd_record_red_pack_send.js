/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('xd_xd_record_red_pack_send', {
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
    red_pack_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    mch_billno: {
      type: DataTypes.STRING(28),
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    create_time: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: DataTypes.literal('CURRENT_TIMESTAMP')
    },
    status: {
      type: DataTypes.INTEGER(4),
      allowNull: false
    }

  }, {
    tableName: 'xd_xd_record_red_pack_send'
  });

  Model.associate = function() {

  }

  return Model;
};
