/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('xd_xd_vi_record_article_view', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: '0',
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    article_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    cover: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ''
    },
    summary: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ''
    },
    create_time: {
      type: DataTypes.TIME,
      allowNull: true
    }
  }, {
    tableName: 'xd_xd_vi_record_article_view'
  });

  Model.associate = function() {

  }

  return Model;
};
