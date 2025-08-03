const express = require("express");
const router = express.Router();
const { queryDb, sql } = require("./db.js");
const { authorizeRoles, authenticateJWT } = require("./userRoutes.js");
const nodemailer = require('nodemailer');

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

router.get(
  "/PartLow",
  authenticateJWT,
  authorizeRoles("admin", "user"),
  async (req, res) => {
    getPartLow(req, res);
  }
);

router.get(
  "/Part",
  authenticateJWT,
  authorizeRoles("admin", "user"),
  async (req, res) => {
    getPartWithFilter(req, res);
  }
);

router.get(
  "/Categorization",
  authenticateJWT,
  authorizeRoles("admin", "user"),
  async (req, res) => {
    getCategorization(req, res);
  }
);
// service part
async function getPartLow(req, res) {
  try {
    let parts = await queryDb(
      "Select * FROM Part where Remaining < 10 ",
      []
    );
    res.status(200).send(parts);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

async function getCategorization(req, res) {
  try {
    let categories = await queryDb(
      "Select * FROM Categorization ",
      []
    );
    res.status(200).send(categories);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

async function getPartWithFilter(req, res) {
  const { Name,	CategorizationRef} = req.query;

  var filterQuery = null;
  if(Name != null){
    filterQuery = `Where p.Name like N'%${Name}%'`;
  } else if(CategorizationRef != null){
    filterQuery = `Where p.CategorizationRef = ${CategorizationRef}`;
  }

  if(CategorizationRef != null && filterQuery != null){
    filterQuery = `and Where p.Name like N'%${Name}%'`;
  }

  try {
    let parts = await queryDb(
      "Select * FROM Part p" + filterQuery,
      []
    );
    res.status(200).send(parts);
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
  const { orderID, partID, state , count, partName} = req.body;

  if(state === 3){// reject
    try {
      const result = await queryDb(
        `UPDATE [Order] SET State = 3 where OrderID = @OrderID`,
        [
          { name: "OrderID", type: sql.BigInt, value: orderID }
        ]
      );
      sendEmail("Order Rejected",`order ${orderID} rejected`);
      res.status(200).send({ id: orderId }); 
    } catch (err) {
      res.status(500).send(err.message);
    }
  } else if (state === 2) { //accept
    try {
      const part = await queryDb(
        `Select Remaining FROM [Part] where PartID = @PartID`,
        [
          { name: "PartID", type: sql.BigInt, value: partID }
        ]
      );
      var Remaining = part.recordset[0];
      var newRemaining = Remaining - count;
      if(newRemaining < 0){
        return res.status(400).send("There is not enough goods in inventory"); 
      }
      
      const result = await queryDb(
        `Update [Part] set remaining = @newRemaining where PartID = @PartID;
         UPDATE [Order] SET State = 2 where OrderID = @OrderID `,
        [
          { name: "PartID", type: sql.BigInt, value: partID },
          { name: "newRemaining", type: sql.Int, value: newRemaining },
          { name: "OrderID", type: sql.Int, value: orderID }
        ]
      );

      sendEmail("Order Accepted",`order ${orderID} accepted`);

      const partRemaining = await queryDb(
        `Select Remaining FROM [Part] where PartID = @PartID`,
        [
          { name: "PartID", type: sql.BigInt, value: partID }
        ]
      );
      var RemainingNow = part.partRemaining[0];
      if(RemainingNow < 10){
        sendEmail("LOW Part Remaining",`there is just RemainingNow of ${partName} in ${inventory}`);
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  } else {
    res.status(500).send("Invalid State");
  }
}

async function sendEmail(subject, text) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'takhfifano@gmail.com',
        pass: 'najbvnnfhiisgwjj', // Use App Password, NOT your actual password
      },
    });

    // Set up mail options
    const mailOptions = {
      from: '"takhfifano" <takhfifano@gmail.com>',
      to: "amiramjad2002@gmail.com", // TODO email of admin or ...
      subject: subject,
      text: text,
    };

    // Send mail
    const info = await transporter.sendMail(mailOptions);
  } catch (err) {
    return res.status(500).send(`Failed to send email: ${err.message}`);
  }
}