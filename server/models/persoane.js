module.exports = (sequelize, DataType) => {
    let model = sequelize.define('Persoane', {
      Nume: {
          type: DataType.TEXT
      },
      Prenume: {
          type: DataType.TEXT
      },
      CNP: {
          type: DataType.TEXT
      },
      Varsta: {
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