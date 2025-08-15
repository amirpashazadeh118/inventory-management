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
  authorizeRoles("admin", "user"),
  async (req, res) => {
    acceptOrder(req, res);
  }
);

router.get(
  "/Order",
  authenticateJWT,
  authorizeRoles("admin", "user"),
  async (req, res) => {
    getOrderWithFilter(req, res);
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

router.get(
  "/InventoryVoucher",
  authenticateJWT,
  authorizeRoles("admin", "user"),
  async (req, res) => {
    getInventoryVoucher(req, res);
  }
);
// service part
async function getInventoryVoucher(req, res) {
  try {
    let InventoryVoucher = await queryDb(
      "Select i.*, p.name as pname, u.name as uname FROM [InventoryVoucher] i join part p on p.PartID = i.partRef join [user] u on u.userId = i.userRef",
      []
    );
    res.status(200).send(InventoryVoucher);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

async function getPartLow(req, res) {
  const { Name, CategorizationRef } = req.query;
  let conditions = [];
  let params = [];

  if (Name) {
    conditions.push("p.Name LIKE @Name");
    params.push({ name: 'Name', type: sql.NVarChar, value: `%${Name}%` });
  }
  if (CategorizationRef) {
    conditions.push("p.CategorizationRef = @CategorizationRef");
    params.push({ name: 'CategorizationRef', type: sql.BigInt, value: CategorizationRef });
  }

  // to fetch the CategoryName for the front-end.
  let query = `
    SELECT p.*, c.Name as CategoryName 
    FROM Part p
    JOIN Categorization c ON p.CategorizationRef = c.CategorizationID
    WHERE Remaining < 10
  `;

  if (conditions.length > 0) {
    query += " AND " + conditions.join(" AND ");
  }

  try {
    let parts = await queryDb(query, params);
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

async function getOrderWithFilter(req, res) {
  const { partName, state, beforeTime, afterTime} = req.query;
  let conditions = [];
  let params = [];

  if (partName) {
    conditions.push("p.Name LIKE @partName");
    params.push({ name: 'partName', type: sql.NVarChar, value: `%${partName}%` });
  }
  if (state) {
    conditions.push("o.State = @state");
    params.push({ name: 'state', type: sql.Int, value: state });
  }
  if (beforeTime) {
    conditions.push("o.CreateAt < @beforeTime");
    params.push({ name: 'beforeTime', type: sql.DateTime, value: beforeTime });
  }
  if (afterTime) {
    conditions.push("o.CreateAt > @afterTime");
    params.push({ name: 'afterTime', type: sql.DateTime, value: afterTime });
  }

  let query = "Select o.*, p.Name as pname, u.Name as uname FROM [Order] o join Part p on p.PartID = o.PartID join [User] u on u.UserID = o.UserRef";
  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  try {
    let orders = await queryDb(query, params);
    res.status(200).send(orders);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

async function getPartWithFilter(req, res) {
  const { Name, CategorizationRef } = req.query;
  let conditions = [];
  let params = [];

  if (Name) {
    conditions.push("p.Name LIKE @Name");
    params.push({ name: 'Name', type: sql.NVarChar, value: `%${Name}%` });
  }
  if (CategorizationRef) {
    conditions.push("p.CategorizationRef = @CategorizationRef");
    params.push({ name: 'CategorizationRef', type: sql.BigInt, value: CategorizationRef });
  }

  // to fetch the CategoryName for the front-end.
  let query = `
    SELECT p.*, c.Name as CategoryName 
    FROM Part p
    JOIN Categorization c ON p.CategorizationRef = c.CategorizationID
  `;

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  try {
    let parts = await queryDb(query, params);
    res.status(200).send(parts);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

async function createCategory(req, res) {
  const { Name } = req.body;

  try {
    let category = await queryDb(
      `Select 1 FROM Categorization t
      where Name = @name`,
      [{ name: "name", type: sql.NVarChar, value: Name }]
    );
    if(category.length > 0) {
      return res.status(400).send("This name is already choosed for a Categorization. enter another name!");
    }
  } catch (err) {
    return res.status(500).send(err.message);
  }

  try {
    const result = await queryDb(
      `INSERT INTO Categorization (Name)
      OUTPUT INSERTED.CategorizationID
      VALUES (@name)`,
      [
        { name: "name", type: sql.NVarChar, value: Name }
      ]
    );
    const insertedId = result[0].CategorizationID;
    res.status(200).send({ id: insertedId }); 
  } catch (err) {
    res.status(500).send(err.message);
  }
}

async function createPart(req, res) {
  const { Name, CategorizationRef, Cost, Count } = req.body;
  const user = req.user;

  try {
    let existingParts = await queryDb(
      `SELECT PartID, Remaining FROM Part WHERE Name = @name`,
      [{ name: "name", type: sql.NVarChar, value: Name }]
    );

    if (existingParts.length > 0) {
      const existingPart = existingParts[0];
      const newCount = existingPart.Remaining + Count;

      await queryDb(
        `UPDATE Part SET Remaining = @newCount WHERE PartID = @partId`,
        [
          { name: "newCount", type: sql.Int, value: newCount },
          { name: "partId", type: sql.BigInt, value: existingPart.PartID }
        ]
      );

      // creates an InventoryVoucher for this additional stock
      await queryDb(
        `INSERT INTO InventoryVoucher (Description, CreateAt, UserRef, Number, PartRef)
         VALUES (@description, GETDATE(), @userRef, @number, @partRef)`,
        [
          { name: "description", type: sql.NVarChar, value: 'Added additional stock' },
          { name: "userRef", type: sql.BigInt, value: user.id },
          { name: "number", type: sql.Int, value: Count },
          { name: "partRef", type: sql.BigInt, value: existingPart.PartID }
        ]
      );

      return res.status(200).send({ id: existingPart.PartID, message: 'Stock updated for existing part.' });

    } else {
      const partResult = await queryDb(
        `INSERT INTO Part (Name, CategorizationRef, Remaining, Cost)
         OUTPUT INSERTED.PartID
         VALUES (@name, @categoryRef, @count, @cost)`,
        [
          { name: "name", type: sql.NVarChar, value: Name },
          { name: "categoryRef", type: sql.BigInt, value: CategorizationRef },
          { name: "count", type: sql.Int, value: Count },
          { name: "cost", type: sql.BigInt, value: Cost }
        ]
      );
      const insertedPartId = partResult[0].PartID;

      // creates an InventoryVoucher for this initial stock
      await queryDb(
        `INSERT INTO InventoryVoucher (Description, CreateAt, UserRef, Number, PartRef)
         VALUES (@description, GETDATE(), @userRef, @number, @partRef)`,
        [
          { name: "description", type: sql.NVarChar, value: 'Initial stock' },
          { name: "userRef", type: sql.BigInt, value: user.id },
          { name: "number", type: sql.Int, value: Count },
          { name: "partRef", type: sql.BigInt, value: insertedPartId }
        ]
      );

      return res.status(200).send({ id: insertedPartId, message: 'New part created.' });
    }
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

async function increasePart(req, res) {
  const { PartID, Count, Description } = req.body;
  const user = req.user;

  try {
    let parts = await queryDb(
      `SELECT Remaining FROM Part t
      where PartID = @partId`,
      [{ name: "partId", type: sql.BigInt, value: PartID }]
    );
    if(parts.length === 0) {
      return res.status(400).send("There is no part with that ID!");
    }

    const newCount = parts[0].Remaining + Count;

    await queryDb(
      `UPDATE Part SET Remaining = @newCount where PartID = @partId`,
      [
        { name: "newCount", type: sql.Int, value: newCount },
        { name: "partId", type: sql.BigInt, value: PartID }
      ]
    );

    await queryDb(
      "INSERT INTO [InventoryVoucher](Description, CreateAt, UserRef, Number, PartRef) VALUES (@description, GETDATE(), @userRef, @number, @partRef)",
      [
        { name: "description", type: sql.NVarChar, value: Description },
        { name: "userRef", type: sql.BigInt, value: user.id },
        { name: "number", type: sql.Int, value: Count },
        { name: "partRef", type: sql.BigInt, value: PartID },
      ]
    );
    res.status(200).send({ message: 'Part increased successfully' });
  } catch (err) {
    res.status(500).send(err.message);
  }
}

async function createOrder(req, res) {
  const { PartID, Count, Description } = req.body;
  const user = req.user;

  try {
    // Step 1: Get the part's actual data from the database
    const partResult = await queryDb(
      `SELECT Cost, Remaining FROM Part WHERE PartID = @PartID`,
      [{ name: "PartID", type: sql.BigInt, value: PartID }]
    );

    if (partResult.length === 0) {
      return res.status(404).send("The selected part does not exist.");
    }

    const part = partResult[0];
    const actualCost = part.Cost;
    const availableStock = part.Remaining;

    // Step 2: Validate the order against available stock
    if (Count > availableStock) {
      return res.status(400).send(`Cannot order more than the available stock. Only ${availableStock} remaining.`);
    }

    // Step 3: Calculate the total cost securely on the server
    const totalCost = actualCost * Count;

    // Step 4: Insert the validated order into the database with State = 1
    const orderResult = await queryDb(
      `INSERT INTO [Order] (Description, CreateAt, TotalCost, UserRef, State, PartID, Cost, [Count])
       OUTPUT INSERTED.OrderID
       VALUES (@Description, GETDATE(), @TotalCost, @UserRef, 1, @PartID, @Cost, @Count)`,
      [
        { name: "Description", type: sql.NVarChar, value: Description },
        { name: "TotalCost", type: sql.BigInt, value: totalCost },
        { name: "UserRef", type: sql.BigInt, value: user.id },
        { name: "PartID", type: sql.BigInt, value: PartID },
        { name: "Cost", type: sql.BigInt, value: actualCost },
        { name: "Count", type: sql.Int, value: Count }
      ]
    );
    const orderId = orderResult[0].OrderID;
    res.status(200).send({ id: orderId });

  } catch (err) {
    res.status(500).send(err.message);
  }
}

async function acceptOrder(req, res) {
  const { orderID, partID, state, count, partName } = req.body;

  if (state === 3) { // Reject order
    try {
      await queryDb(
        `UPDATE [Order] SET State = 3 WHERE OrderID = @OrderID`,
        [{ name: "OrderID", type: sql.BigInt, value: orderID }]
      );
      sendEmail("Order Rejected", `Order #${orderID} has been rejected.`);
      return res.status(200).send({ message: "Order rejected successfully" });
    } catch (err) {
      return res.status(500).send(err.message);
    }
  } 
  
  if (state === 2) {
    try {
      const partResult = await queryDb(
        `SELECT Remaining FROM Part WHERE PartID = @PartID`,
        [{ name: "PartID", type: sql.BigInt, value: partID }]
      );
      
      if (partResult.length === 0) {
        return res.status(404).send("Part not found.");
      }

      const remainingStock = partResult[0].Remaining;
      const newRemaining = remainingStock - count;

      if (newRemaining < 0) {
        return res.status(400).send("There is not enough stock to fulfill this order.");
      }
      
      await queryDb(
        `UPDATE Part SET Remaining = @newRemaining WHERE PartID = @PartID;
         UPDATE [Order] SET State = 2 WHERE OrderID = @OrderID;`,
        [
          { name: "newRemaining", type: sql.Int, value: newRemaining },
          { name: "PartID", type: sql.BigInt, value: partID },
          { name: "OrderID", type: sql.BigInt, value: orderID }
        ]
      );

      sendEmail("Order Accepted", `Order #${orderID} has been accepted.`);

      if (newRemaining < 10) {
        sendEmail("Low Stock Warning", `There are only ${newRemaining} of ${partName} left in inventory.`);
      }
      return res.status(200).send({ message: 'Order accepted successfully' });
    } catch (err) {
      return res.status(500).send(err.message);
    }
  }
  
  // If the state is not 2 or 3
  return res.status(400).send("Invalid state provided.");
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

    const mailOptions = {
      from: '"takhfifano" <takhfifano@gmail.com>',
      to: "amiramjad2002@gmail.com", // TODO email of admin or ...
      subject: subject,
      text: text,
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error(`Failed to send email: ${err.message}`);
  }
}
