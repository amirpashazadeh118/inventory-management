const express = require("express");
const router = express.Router();
const { queryDb, sql } = require("./index.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = await sql.connect(config);
const { authorizeRoles,authenticateJWT } = require('./userRoots.js');

module.exports = router;


// controller part

// get course participants
router.post(
  "/courses/:courseId/announcements",
  authenticateJWT,
  authorizeRoles("teacher"),
  async (req, res) => {
    sendMessages(req, res);
  }
);

router.get(
  "/courses/:courseId/announcements",
  authenticateJWT,
  authorizeRoles("admin, teacher, student"),
  async (req, res) => {
    getMessages(req, res);
  }
);

//  services part
async function sendMessagesMessages(req, res) {
    const { courseId } = req.params;
    const { Title, Detail } = req.body;

    var teacherRef;
    try {
      teacherRef = await queryDb(
        `Select t.TeacherID FROM Teacher t
        join [User] u join u.userId = t.userref
        where userid = @userid`,
        [
            { name: "userid", type: sql.BigInt, value: req.user.UserID },
        ]
    ).recordset[0];
    } catch (err) {
      res.status(500).send(err.message);
      return
    }

    try {
      const messages = await queryDb(
        `INSERT INTO Messages (TeacherRef, ClassRef, Title, Detail, CreatedAt)
        VALUES(@TeacherRef, @ClassRef, @Title, @Detail, GETDATE())`,
        [
            { name: "TeacherRef", type: sql.BigInt, value: teacherRef },
            { name: "ClassRef", type: sql.BigInt, value: courseId },
            { name: "Title", type: sql.NVarChar, value: Title },
            { name: "Detail", type: sql.NVarChar, value: Detail },
        ]
      );

      res.json(messages);
    } catch (err) {
      res.status(500).send(err.message);
    }
}


async function getMessages(req, res) {
    const { courseId } = req.params;

    try {
      const messages = await queryDb(
        `SELECT DISTINCT m.*, u.LastName AS TeacherName
        FROM Messages m
        JOIN Teacher t ON t.TeacherID = m.TeacherRef
        JOIN User u ON u.UserID = t.UserRef
        JOIN Class cl ON m.ClassRef = cl.ClassID
        WHERE cl.ClassID = @courseId`,
        [{ name: "courseId", type: sql.BigInt, value: courseId }]
      );

      res.json(messages);
    } catch (err) {
      res.status(500).send(err.message);
    }
}


