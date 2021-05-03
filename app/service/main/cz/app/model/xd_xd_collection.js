/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;
  const sequelize = app.Sequelize;
  const Model = app.model.define('xd_xd_collection', {
    coll_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    coll_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    belong_to: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    item_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    coll_type: {
      type: DataTypes.INTEGER(4),
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER(4),
      allowNull: false
    },
    create_time: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    modify_time: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'xd_xd_collection'
  });

  Model.associate = function() {

  }

  return Model;
};
