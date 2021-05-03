/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('xd_acm_user', {
    acm_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    sex: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    user_number: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    birth_date: {
      type: DataTypes.TIME,
      allowNull: true
    },
    academy: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    class_room: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    phone_trombone: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    phone_cornet: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    hobby: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    speciality: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    synopsis: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    remark: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    update_time: {
      type: DataTypes.TIME,
      allowNull: true
    }
  }, {
    tableName: 'xd_acm_user'
  });

  Model.associate = function() {

  }

  return Model;
};
