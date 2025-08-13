const express = require("express");
const router = express.Router();
const { queryDb, sql } = require("./db");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");



const JWT_SECRET = "it_is_my_secret_key";


// login

router.post("/Login", async (req, res) => {
  await Login(req, res);
});

router.get("/login", (req, res) => {
  res.json({ error: null });
});

router.get("/register", (req, res) => {
  res.json({ error: null, formData: null, success: null });
});
// Register
router.post("/Register", async (req, res) => {
  await Register(req, res);
});

// Register put : edit profile
router.put("/Register", authenticateJWT, async (req, res) => {
  const token = await EditProfile(req, res);

  res.json({ token });
});

//  services part
async function Register(req, res) {
  const { username, password, name, email } = req.body;

  var hashPassword = await crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");
  try {
    await InsertUser(username, hashPassword, name, email, res);
  } catch (e) {
    res.status(500).send(e.message);
  }
}

async function EditProfile(req, res) {
  const { username, password, Name, email } = req.body;
  var user = req.user;

  if (!getUserByUsername(username)) {
    return res.status(409).json({ message: "نام کاربری تکراری است." });
  }

  if (!getUserByEmail(email)) {
    return res
      .status(409)
      .json({ error: "کاربری با این ایمیل ثبت نام کرده است." });
  }

  try {
    const result = await queryDb(
      `UPDATE [User] SET 
    UserName = @username, Password = @password, Name = @Name, Email = @email 
   WHERE UserID = @userid`,
      [
        { name: "username", type: sql.VarChar, value: username },
        { name: "password", type: sql.VarChar, value: password },
        { name: "Name", type: sql.VarChar, value: Name },
        { name: "email", type: sql.VarChar, value: email },
        { name: "userid", type: sql.BigInt, value: user.UserID },
      ]
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

function isLoggedIn(req, res){
  const token = req.cookies.token;

  if (token) {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return false;
      }
      req.user = user;
      return true;
    });
  } else {
    return false;
  }
}

async function Login(req, res) {
  if(isLoggedIn(req,res)){
    res.redirect("/inventory/term-courses");
  }

  const { username, password } = req.body;

  var hashPassword = await crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");

  var user = await getUserByCredentials(username, hashPassword);
  if (user == null) {
    return res
      .status(401)
      .json({ error: "رمز یا نام کاربری اشتباه است." });
  }

  var roles = [];
  try {
    if (isAdmin(user)) {
      roles.push("admin");
    } else {
      roles.push("user");
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }

  const token = jwt.sign(
    { id: user.UserID, username: username, roles: roles },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 60 * 60 * 1000, // 1 hour
  });

  res.redirect("/inventory/term-courses");
}

function authenticateJWT(req, res, next) {
  const token = req.cookies.token;

  if (token) {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
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
      res.redirect('/login');
    }

    const hasRole = req.user.roles.some((role) => allowedRoles.includes(role));
    if (!hasRole) {
      res.redirect('/login');
    }

    next();
  };
}

async function InsertUser(username, password, Name, email, res) {
  if (!(await getUserByUsername(username))) {
    return res.status(409).json({
      error: "نام کاربری تکراری است.",
      success: null,
    });
  }

  if (!(await getUserByEmail(email))) {
    return res.status(409).json({
      error: "کاربری با این ایمیل ثبت نام کرده است.",
      success: null,
    });
  }

  try {
    const result = await queryDb(
      "INSERT INTO [User](username, password, name, email, IsAdmin) VALUES (@username, @password, @name, @email, 0)",
      [
        { name: "username", type: sql.VarChar, value: username },
        { name: "password", type: sql.VarChar, value: password },
        { name: "Name", type: sql.VarChar, value: Name },
        { name: "email", type: sql.VarChar, value: email },
      ]
    );
  } catch (err) {
    throw err;
  }

  res.json( {
    success: "Registration successful! Redirecting...",
  });
}

async function getUserByCredentials(username, hashPassword) {
  try {
    const result = await queryDb(
      "SELECT * FROM [User] WHERE Username = @username AND IsActive = 1",
      [{ name: "username", type: sql.VarChar, value: username }]
    );

    if (result.length == 0) return null;

    const user = result[0];

    const isMatch = hashPassword == user.password; 

    if (!isMatch) return null;

    return user;
  } catch (err) {
    console.error("Error in getUserByCredentials:", err);
    throw err;
  }
}

async function getUserByEmail(email) {
  var result = await queryDb(
    "SELECT TOP 1 * FROM [User] WHERE Email = @email",
    [{ name: "email", type: sql.NVarChar, value: email }]
  );

  if (result.length == 0) {
    return true;
  }
  return false;
}

async function getUserByUsername(username) {
  var result = await queryDb(
    "SELECT TOP 1 * FROM [User] where UserName = @username",
    [{ name: "username", type: sql.NVarChar, value: username }]
  );

  if (result.length == 0) {
    return true;
  }
  return false;
}

function isAdmin(user) {
  if (user.isAdmin != 0) {
    return true;
  }
  return false;
}

// async function isCustomer(user) {
//   var result = await queryDb("SELECT * FROM Teacher WHERE UserRef = @userid", [
//     { name: "userid", type: sql.BigInt, value: user.UserID },
//   ]);

//   if (result.length != 0) {
//     return true;
//   }
//   return false;
// }

// async function isSeller(user) {
//   var result = await queryDb("SELECT * FROM Student WHERE UserRef = @userid", [
//     { name: "userid", type: sql.BigInt, value: user.UserID },
//   ]);

//   if (result.length != 0) {
//     return true;
//   }
//   return false;
// }

module.exports = {router, authorizeRoles, authenticateJWT};