/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('xd_xd_red_pack', {
    red_pack_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    send_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    act_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    wishing: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    amount: {
      type: DataTypes.STRING(21),
      allowNull: false
    },
    max_count: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    remain_count: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    remark: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '红包'
    },
    type: {
      type: DataTypes.INTEGER(4),
      allowNull: false
    },
    amount_strategy: {
      type: DataTypes.INTEGER(4),
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER(4),
      allowNull: false
    },
    begin_time: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: '0000-00-00 00:00:00'
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: '0000-00-00 00:00:00'
    },
    create_time: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: DataTypes.literal('CURRENT_TIMESTAMP')
    },
    modify_time: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: DataTypes.literal('CURRENT_TIMESTAMP')
    },
    created_by: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    total_amount: {
      type: DataTypes.FLOAT(11),
      allowNull: false
    },
    remain_amount: {
      type: DataTypes.FLOAT(11),
      allowNull: false
    }
  }, {
    tableName: 'xd_xd_red_pack'
  });

  Model.associate = function() {

  }

  return Model;
};
