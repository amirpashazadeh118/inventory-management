const express = require("express");
const router = express.Router();
const { queryDb, sql } = require("./index.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = await sql.connect(config);
const { authorizeRoles, authenticateJWT } = require('./userRoots.js');

module.exports = router;

const JWT_SECRET = "it_is_my_secret_key_amir_bmola";

// controller part

// get course participants
router.get(
  "/courses/:courseId/participants",
  authenticateJWT,
  authorizeRoles("admin"),
  async (req, res) => {
    participatns(req, res);
  }
);

router.get(
  "/courses/:courseId",
  authenticateJWT,
  authorizeRoles("admin, teacher, student"),
  async (req, res) => {
    getDetail(req, res);
  }
);

//  services part
async function participatns(req, res) {
    const { courseId } = req.params;

    try {
      const participants = await queryDb(
        `SELECT u.* FROM User u
        JOIN Student s ON s.UserRef = u.UserID
        JOIN StudentClass sc ON sc.StudentRef = s.StudentID
        WHERE sc.CourseRef = @courseId
        UNION
        SELECT User.* FROM User u
        JOIN Teacher t ON t.UserRef = u.UserID
        JOIN Course c ON c.TeacherRef = t.TeacherID
        WHERE c.CourseID = @courseId`,
        [{ name: "courseId", type: sql.BigInt, value: courseId }]
      );

      res.json(participants);
    } catch (err) {
      res.status(500).send(err.message);
    }
}

async function getDetail(req, res) {
    const { courseId } = req.params;

    try {
      const classDetail = await queryDb(
        `SELECT u.LastName AS TeacherName, c.*, cl.*, 
        FROM User u
        JOIN Teacher t ON t.UserRef = u.UserID
        JOIN Course c ON c.TeacherRef = t.TeacherID
        JOIN Class cl ON cl.ClassID = c.ClassRef
        WHERE c.CourseID = @courseId`,
        [{ name: "courseId", type: sql.BigInt, value: courseId }]
      );

      const participants = await queryDb(
        `SELECT u.LastName AS TeacherName, c.*, cl.*, 
        FROM User u
        JOIN Student c ON c.UserRef = u.UserID
        JOIN StudentCourse sc ON sc.StudentRef = s.StudentID
        JOIN Class cl ON cl.ClassID = sc.ClassRef
        WHERE cl.CourseRef = @courseId`,
        [{ name: "courseId", type: sql.BigInt, value: courseId }]
      );

      res.json(participants, classDetail);
    } catch (err) {
      res.status(500).send(err.message);
    }
}
