/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('xd_xd_vi_article_input_by', {
    articleId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    adminId: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    account: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    adminName: {
      type: DataTypes.STRING(16),
      allowNull: false,
      defaultValue: ''
    },
    createTime: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: '0000-00-00 00:00:00'
    }
  }, {
    tableName: 'xd_xd_vi_article_input_by'
  });

  Model.associate = function() {

  }

  return Model;
};
