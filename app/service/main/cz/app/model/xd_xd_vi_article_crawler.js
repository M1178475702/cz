/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;
  const sequelize = app.Sequelize;
  const Model = app.model.define('xd_xd_vi_article_crawler', {
    article_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0',
      primaryKey:true
    },
    author: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    src_type: {
      type: DataTypes.INTEGER(4),
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    summary: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ''
    },
    cover: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ''
    },
    sectionId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    sectionName: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    auditorOne: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '-1'
    },
    auditorTwo: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '-1'
    },
    articleStatus: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '1'
    },
    ctime:{
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: DataTypes.literal('CURRENT_TIMESTAMP')
    },
    mtime:{
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: DataTypes.literal('CURRENT_TIMESTAMP')
    },
    srcUrl: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ''
    },
    srcLikesCount: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    srcViewsCount: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    srcTagList: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ''
    },
    srcPublishTime: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: '0000-00-00 00:00:00'
    },
    viewsCount: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    likesCount: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    collCount: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    shareCount: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    srcCommentsCount: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    srcSite: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ''
    }
  }, {
    tableName: 'xd_xd_vi_article_crawler'
  });

  Model.associate = function() {

  }

  return Model;
};
