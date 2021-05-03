/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;
  const sequelize = app.Sequelize;
  const Model = app.model.define('xd_xd_article_crawler', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    article_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      unique: true
    },
    src_site: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ''
    },
    src_url: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ''
    },
    src_likes_count: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    src_views_count: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    src_comments_count: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    src_tag_list: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ''
    },
    src_publish_time: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: '0000-00-00 00:00:00'
    }
  }, {
    tableName: 'xd_xd_article_crawler'
  });

  Model.associate = function() {

  }

  return Model;
};
