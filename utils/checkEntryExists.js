const db = require("../db/client");

const checkEntryExists = (req, res, next) => {
  const { id } = req.params;

  db.query("SELECT * FROM locations WHERE id=$1", [id])
    .then((data) => {
      if (!data.rows.length) {
        return res.status(404).send("Entry not found");
      }
      req.entry = data.rows[0];
      next();
    })
    .catch((e) => console.log(e));
};

module.exports = checkEntryExists;
