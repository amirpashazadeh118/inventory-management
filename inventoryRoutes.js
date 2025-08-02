const express = require("express");
const router = express.Router();
const { queryDb, sql } = require("./db.js");
const { authorizeRoles, authenticateJWT } = require("./userRoutes.js");

module.exports = router;

// controller part
router.post(
  "/Category",
  authenticateJWT,
  authorizeRoles("admin", "user"),
  async (req, res) => {
    createCategory(req, res);
  }
);

router.post(
  "/Part",
  authenticateJWT,
  authorizeRoles("admin", "user"),
  async (req, res) => {
    createPart(req, res);
  }
);

router.post(
  "/IncreasePart",
  authenticateJWT,
  authorizeRoles("admin", "user"),
  async (req, res) => {
    increasePart(req, res);
  }
);

router.post(
  "/Order",
  authenticateJWT,
  authorizeRoles("admin", "user"),
  async (req, res) => {
    createOrder(req, res);
  }
);

router.put(
  "/Order",
  authenticateJWT,
  authorizeRoles("admin"),
  async (req, res) => {
    acceptOrder(req, res);
  }
);

// service part
async function createCategory(req, res) {
  const { Name,	CategorizationRef, Cost } = req.body;

  try {
    let category = await queryDb(
      `Select 1 FROM Categorization t
      where Name = @name`,
      [{ name: "name", type: sql.NVarChar, value: Name }]
    );
    if(category.length > 0)
      res.status(400).send("This name is already choosed for a Categorization. enter another name!");
  } catch (err) {
    res.status(500).send(err.message);
  }

  try {
    const result = await queryDb(
      `INSERT INTO Categorization (Name)
      VALUES (@name)`,
      [
        { name: "name", type: sql.NVarChar, value: Name }
      ]
    );
    const insertedId = result.recordset[0].CategorizationID;
    res.status(200).send({ id: insertedId }); 
  } catch (err) {
    res.status(500).send(err.message);
  }
}

async function createPart(req, res) {
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

async function increasePart(req, res) {
  const { PartID,	Count } = req.body;

  try {
    let parts = await queryDb(
      `Select 1 FROM Part t
      where PartID = @partId`,
      [{ name: "name", type: sql.BigInt, value: Name }]
    );
    if(parts.length = 0)
      res.status(400).send("There is no part with that ID!");

    const newCount = parts[0].Remaining + Count;

    await queryDb(
      `UPDATE Part SET Remaining = @newCount where PartID = @partId`,
      [
        { name: "newCount", type: sql.Int, value: newCount },
        { name: "partId", type: sql.BigInt, value: PartID }
      ]
    );
  } catch (err) {
    res.status(500).send(err.message);
  }
}

async function createOrder(req, res) {
  const { Description, TotalCost, PartID, Count, Cost } = req.body;
  const user = req.user;

  try {
    const result = await queryDb(
      `INSERT INTO [Order] (Description, CreateAt, TotalCost, UserRef)
      VALUES (@Description, getDate(), @TotalCost, @UserRef, 1, @PartID, @Count, @Cost)`,
      [
        { name: "Description", type: sql.NVarChar, value: Description },
        { name: "TotalCost", type: sql.BigInt, value: TotalCost },
        { name: "UserRef", type: sql.BigInt, value: user.id },
        { name: "PartID", type: sql.BigInt, value: PartID },
        { name: "Cost", type: sql.BigInt, value: Cost },
        { name: "Count", type: sql.BigInt, value: Count }
      ]
    );
    const orderId = result.recordset[0].orderID;
    res.status(200).send({ id: orderId }); 
  } catch (err) {
    res.status(500).send(err.message);
  }
}

async function acceptOrder(req, res) {
  const { orderID } = req.body;

  // try {
  //   const result = await queryDb(
  //     `INSERT INTO [Order] (Description, CreateAt, TotalCost, UserRef)
  //     VALUES (@Description, getDate(), @TotalCost, @UserRef, 1, @PartID, @Count, @Cost)`,
  //     [
  //       { name: "Description", type: sql.NVarChar, value: Description },
  //       { name: "TotalCost", type: sql.BigInt, value: TotalCost },
  //       { name: "UserRef", type: sql.BigInt, value: user.id },
  //       { name: "PartID", type: sql.BigInt, value: PartID },
  //       { name: "Cost", type: sql.BigInt, value: Cost },
  //       { name: "Count", type: sql.BigInt, value: Count }
  //     ]
  //   );
  //   const orderId = result.recordset[0].orderID;
  //   res.status(200).send({ id: orderId }); 
  // } catch (err) {
  //   res.status(500).send(err.message);
  // }
}