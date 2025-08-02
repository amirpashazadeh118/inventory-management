const express = require("express");
const router = express.Router();
const { queryDb, sql } = require("./db.js");
const { authorizeRoles, authenticateJWT } = require("./userRoutes.js");

module.exports = router;

// controller part
router.post(
  "/part",
  authenticateJWT,
  authorizeRoles("admin", "user"),
  async (req, res) => {
    createPart(req, res);
  }
);

// service part
async function GetCurrentCourses(req, res) {
  const { Name,	CategorizationRef, Cost } = req.body;

  try {
    let parts = await queryDb(
      `Select 1 FROM Part t
      where Name = @name`,
      [{ name: "name", type: sql.NVarChar, value: Name }]
    );
    if(parts.length > 0)
      res.status(400).send("This name is already choosed for a part. enter another name!");
  } catch (err) {
    res.status(500).send(err.message);
  }

  try {
    const result = await queryDb(
      `INSERT INTO Part (Name, CategorizationRef, Remaining, Cost)
      VALUES (@name, @categoryRef, 0, @cost)`,
      [
        { name: "name", type: sql.NVarChar, value: Name },
        { name: "categoryRef", type: sql.BigInt, value: CategorizationRef },
        { name: "cost", type: sql.BigInt, value: Cost }
      ]
    );
    const insertedId = result.recordset[0].PartID;
    res.status(200).send({ id: insertedId }); 
  } catch (err) {
    res.status(500).send(err.message);
  }
}
