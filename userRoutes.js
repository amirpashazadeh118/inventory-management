const express = require("express");
const router = express.Router();
const { queryDb, sql } = require("./index.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = await sql.connect(config);

module.exports = router;

const JWT_SECRET = "it_is_my_secret_key_amir_bmola";

// controller part

// login
router.post("/Login", async (req, res) => {
  const token = Login(req);

  res.json({ token });
});

// Register
router.post("/Register", async (req, res) => {
  Register(req, res);
});

// Register put : edit profile
router.put("/Register", authenticateJWT, async (req, res) => {
  const token = EditProfile(req, res);

  res.json({ token });
});

//  services part
async function Register(req, res) {
  const { username, password, firstName, lastName, email } = req.body;

  var hashPassword = await bcrypt.hash(password, 10);

  try {
    await InsertUser(username, hashPassword, firstName, lastName, email, res);
  } catch (e) {
    res.status(500).send(err.message);
  }
}

async function EditProfile(req, res) {
  const { username, password, firstName, lastName, email } = req.body;
  var user = req.user;

  if (!getUserByUsername(username)) {
    return res.status(409).json({ message: "نام کاربری تکراری است." });
  }

  if (!getUserByEmail(email)) {
    return res.status(409).json({ message: "کاربری با این ایمیل ثبت نام کرده است." });
  }

  try {
    const result = await pool
      .request()
      .input("username", sql.VarChar, username)
      .input("password", sql.VarChar, password)
      .input("firstName", sql.VarChar, firstName)
      .input("lastName", sql.VarChar, lastName)
      .input("email", sql.VarChar, email)
      .input("userid", sql.BigInt, user.UserID)
      .query(
        `UPDATE User SET 
          UserName = @username, Password = @password, FirstName = @firstName,
          LastName = @lastName, Email = @email 
         WHERE UserID = @userid`
      );
  } catch (err) {
    throw err;
  }

  const token = jwt.sign(
    { id: user.UserID, username: username, roles: req.user.roles },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
}

async function Login(req) {
  const { username, password } = req.body;

  var hashPassword = await bcrypt.hash(password, 10);

  var user = await getUserByCredentials(username, hashPassword);
  if (user == null) {
    res.status(401).send("رمز یا نام کاربری اشتباه است.");
  }

  var roles = [];
  try {
    if (await isAdmin(user)) {
      roles.push("admin");
    } else if (await isTeacher(user)) {
      roles.push("teacher");
    } else if (await isStudent(user)) {
      roles.push("student");
    } else {
      throw new Error("without roll");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }

  const token = jwt.sign(
    { id: user.UserID, username: username, roles: roles },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
}

function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
}

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.roles) {
      return res.status(403).json({ message: "دسترسی غیر مجاز" });
    }

    const hasRole = req.user.roles.some((role) => allowedRoles.includes(role));
    if (!hasRole) {
      return res.status(403).json({ message: "دسترسی غیر مجاز" });
    }

    next();
  };
}

async function InsertUser(username, password, firstName, lastName, email, res) {
  if (!getUserByUsername(username)) {
    return res.status(409).json({ message: "نام کاربری تکراری است." });
  }

  if (!getUserByEmail(email)) {
    return res.status(409).json({ message: "کاربری با این ایمیل ثبت نام کرده است." });
  }

  try {
    const result = await pool
      .request()
      .input("username", sql.VarChar, username)
      .input("password", sql.VarChar, password)
      .input("firstName", sql.VarChar, firstName)
      .input("lastName", sql.VarChar, lastName)
      .input("email", sql.VarChar, email)
      .query(
        "INSERT INTO User( username, password, firstName, lastName, email) VALUES ( @username, @password, @firstName, @lastName, @email)"
      );
  } catch (err) {
    throw err;
  }
}

async function getUserByCredentials(username, password) {
  try {
    const result = await pool
      .request()
      .input("username", sql.VarChar, username)
      .input("password", sql.VarChar, password)
      .query(
        "SELECT * FROM Users WHERE Username = @username AND Password = @password"
      );
    return result.recordset[0];
  } catch (err) {
    console.error("Error in getUserByCredentials:", err);
    return null;
  }
}

async function getUserByEmail(email) {
  var result = await queryDb("SELECT TOP 1 * FROM User WHERE Email = @email", [
    { name: "email", type: sql.NVarChar, value: email },
  ]);

  if (result.recordset[0] != null) {
    return true;
  }
}

async function getUserByUsername(username) {
  var result = await queryDb("SELECT TOP 1 * FROM User WHERE UserName = @username", [
    { name: "username", type: sql.NVarChar, value: username },
  ]);

  if (result.recordset[0] != null) {
    return true;
  }
}

async function isAdmin(user) {
  var result = await queryDb("SELECT * FROM Admin WHERE UserID = @userid", [
    { name: "userid", type: sql.BigInt, value: user.id }
  ]);

  if (result.recordset[0] != null) {
    return true;
  }
}

async function isTeacher(user) {
  var result = await queryDb("SELECT * FROM Teacher WHERE UserID = @userid", [
    { name: "userid", type: sql.BigInt, value: user.id }
  ]);

  if (result.recordset[0] != null) {
    return true;
  }
}

async function isStudent(user) {
  var result = await queryDb("SELECT * FROM Student WHERE UserID = @userid", [
    { name: "userid", type: sql.BigInt, value: user.id }
  ]);

  if (result.recordset[0] != null) {
    return true;
  }
}


module.exports = { authorizeRoles, authenticateJWT };