module.exports = db => {
    return {
      create: (req, res) => {
        db.models.Persoane.create(req.body).then(() => {
          res.send({ success: true });
        }).catch(() => res.status(401));
      },
  
      update: (req, res) => {
        db.models.Persoane.update(req.body, { where: { id: req.body.id } }).then(() => {
          res.send({ success: true })
        }).catch(() => res.status(401));
      },
  
      findAll: (req, res) => {
        db.query(`SELECT p.id, j.id_person, j.id_car, p.nume, p.prenume, p.cnp, p.varsta, m.marca, m.model, m.an_fabricatie, m.cap_cilindrica, m.tx_imp 
        FROM "Persoane" p 
        LEFT JOIN "Junction" j ON j.id_person = p.id
        LEFT JOIN "Masini" m ON m.id = j.id_car
        ORDER BY p.id`, { type: db.QueryTypes.SELECT }).then(resp => {
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
  