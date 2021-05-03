/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('xd_xd_reply', {
    reply_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    origin_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    type: {
      type: DataTypes.INTEGER(4),
      allowNull: false
    },
    content: {
      type: DataTypes.STRING(10000),
      allowNull: false
    },
    parent_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    root_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    reply_count: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    like_count: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
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
    tableName: 'xd_xd_reply'
  });

  Model.associate = function() {

  }

  return Model;
};
