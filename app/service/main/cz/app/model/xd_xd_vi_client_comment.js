/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;
  const sequelize = app.Sequelize;
  const Model = app.model.define('xd_xd_vi_client_comment', {
    commentId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: '0',
      primaryKey:true
    },
    articleId: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ''
    },
    userAvatar: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ''
    },
    content: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    likesCount: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    ctime: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: '0000-00-00 00:00:00'
    }
  }, {
    tableName: 'xd_xd_vi_client_comment'
  });

  Model.associate = function() {

  }

  return Model;
};
