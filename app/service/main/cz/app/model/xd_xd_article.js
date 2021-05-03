/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;
  const sequelize = app.Sequelize;
  const Model = app.model.define('xd_xd_article', {
    article_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
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
    cover_url: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ''
    },
    article_section_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    is_choiceness: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '0'
    },
    auditor_one: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '-1'
    },
    auditor_two: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '-1'
    },
    status: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '1'
    },
    publish_time: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: '0000-00-00 00:00:00'
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
    tableName: 'xd_xd_article'
  });

  Model.associate = function() {

  }

  return Model;
};
