/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('xd_xd_vi_auditor_two_article_list', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0',
      primaryKey: true
    },
    author: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    summary: {
      type: DataTypes.STRING(255),
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
    srcType: {
      type: DataTypes.INTEGER(4),
      allowNull: false
    },
    isChoiceness: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '0'
    },
    status: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '1'
    },
    publishTime: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: '0000-00-00 00:00:00'
    },
    ctime: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: '0000-00-00 00:00:00'
    },
    mtime: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: '0000-00-00 00:00:00'
    },
    inputBy: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    views_count: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    }
  }, {
    tableName: 'xd_xd_vi_auditor_two_article_list'
  });

  Model.associate = function() {

  }

  return Model;
};
