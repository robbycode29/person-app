module.exports = (sequelize, DataType) => {
    let model = sequelize.define('Persoane', {
      nume: {
          type: DataType.TEXT
      },
      prenume: {
          type: DataType.TEXT
      },
      cnp: {
          type: DataType.TEXT
      },
      varsta: {
          type: DataType.INTEGER
      }
    }, {
      timestamps: true
    });
    /*
      Aceasta linie este comentata pentru a demonstra legatura dintre tabelul Information si tabelul Post prin id
    */
    // model.belongsTo(sequelize.models.Post, {foreignKey: 'id_post', onDelete: 'set null'});
    return model;
  };