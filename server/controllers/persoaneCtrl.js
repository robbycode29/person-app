module.exports = db => {
    return {
      create: (req, res) => {
        db.models.Persoane.create(req.body.person).then(resp => {
          if(req.body.cars){
            let junctions = []
            req.body.cars.forEach(car => {
              junctions.push({
                id_person: resp.id,
                id_car: car.id
              })
            });
            junctions.forEach(junction => {
              db.models.Junction.create(junction).catch(() => res.status(401));
            })
          }
          res.send({ success: true });
        }).catch(() => res.status(401));
      },
  
      update: (req, res) => {
        db.models.Persoane.update(req.body.person, { where: { id: req.body.person.id } }).then(() => {
          if(req.body.cars) {
            db.query(`DELETE FROM "Junction" WHERE id_person = ${req.body.person.id}`, { type: db.QueryTypes.DELETE })
            let junctions = []
            req.body.cars.forEach(car => {
              junctions.push({
                id_person: req.body.person.id,
                id_car: car.id
              })
            });
            junctions.forEach(junction => {
              db.models.Junction.create(junction).catch(() => res.status(401));
            })
          }
          res.send({ success: true })
        }).catch(() => res.status(401));
      },
  
      findAll: (req, res) => {
        db.query(`SELECT id, nume, prenume, cnp, varsta
        FROM "Persoane" 
        ORDER BY id`, { type: db.QueryTypes.SELECT }).then(resp => {
          res.send(resp);
        }).catch(() => res.status(401));
      },

      findAllCars: (req, res) => {
        db.query(`SELECT j.id_person, j.id_car, m.id, m.marca, m.model, m.an_fabricatie, m.cap_cilindrica, m.tx_imp 
        FROM "Masini" m 
        LEFT JOIN "Junction" j ON j.id_car = m.id
        ORDER BY m.id`, { type: db.QueryTypes.SELECT }).then(resp => {
          res.send(resp);
        }).catch(() => res.status(401));
      },
  
      find: (req, res) => {
        db.query(`SELECT id, nume, prenume, cnp, varsta
        FROM "Persoane" WHERE id = ${req.params.id}`, { type: db.QueryTypes.SELECT }).then(resp => {
          res.send(resp[0]);
        }).catch(() => res.status(401));
      },
  
      destroy: (req, res) => {
        db.query(`DELETE FROM "Persoane" WHERE id = ${req.params.id}`, { type: db.QueryTypes.DELETE }).then(() => {
          res.send({ success: true });
        }).catch(() => res.status(401));
      }
    };
  };
  