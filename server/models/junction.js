module.exports = (sequelize, DataType) => {
    let model = sequelize.define('Junction', {
      id_person: {
          type: DataType.INTEGER
      },
      id_car: {
          type: DataType.INTEGER
      }
    }, {
      timestamps: true
    });
    model.belongsTo(sequelize.models.Persoane, {foreignKey: 'id_person', onDelete: 'cascade'});
    model.belongsTo(sequelize.models.Masini, {foreignKey: 'id_car', onDelete: 'cascade'});
    return model;
  };