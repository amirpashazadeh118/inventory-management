const express = require("express");
const router = express.Router();
const { queryDb, sql } = require("./index.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = await sql.connect(config);
const { authorizeRoles, authenticateJWT } = require("./userRoots.js");

module.exports = router;

// controller part

// get course participants
router.get(
  "/dashboard/term-courses",
  authenticateJWT,
  authorizeRoles("teacher", "student"),
  async (req, res) => {
    GetCurrentCourses(req, res);
  }
);

router.get(
  "/dashboard/my-courses",
  authenticateJWT,
  authorizeRoles("teacher, student"),
  async (req, res) => {
    GetCourses(req, res);
  }
);

//  services part
async function GetCourses(req, res) {
  const userId = req.user.UserID;
  isStudent = req.user.roles.some((role) => role === "student");
  isTeacher = req.user.roles.some((role) => role === "teacher");

  if (isTeacher) {
    try {
      teacherClasses = await queryDb(
        `Select cl.*, c.* FROM Teacher t
        join [User] u join u.userId = t.userref
        join Class cl on t.TeacherID = cl.ClassID
        join Course c on c.courseID = cl.CourseRef
        where userid = @userid`,
        [{ name: "userid", type: sql.BigInt, value: userId }]
      );
      res.json(teacherClasses);
    } catch (err) {
      res.status(500).send(err.message);
      return;
    }
  } else if (isStudent) {
    try {
      studentClasses = await queryDb(
        `Select cl.*, c.* FROM Student s
        join [User] u join u.userId = s.userref
        join studentClasse sc on sc.studentRef = s.studentID
        join Class cl on sc.classRef = cl.ClassID
        join Course c on c.courseID = cl.CourseRef
        where userid = @userid`,
        [{ name: "userid", type: sql.BigInt, value: userId }]
      );
      res.json(teacherClasses);
    } catch (err) {
      res.status(500).send(err.message);
      return;
    }
  } else {
    throw new Error("you dont have permission.");
  }
}

async function GetCurrentCourses(req, res) {
  const userId = req.user.UserID;
  isStudent = req.user.roles.some((role) => role === "student");
  isTeacher = req.user.roles.some((role) => role === "teacher");
  var now = Date.now;

  if (isTeacher) {
    try {
      teacherClasses = await queryDb(
        `Select cl.*, c.* FROM Teacher t
        join [User] u join u.userId = t.userref
        join Class cl on t.TeacherID = cl.ClassID
        join Course c on c.courseID = cl.CourseRef
        where userid = @userid
        AND StartDate < getdate() AND EndDate > getdate() `,
        [{ name: "userid", type: sql.BigInt, value: userId }]
      );
      res.json(teacherClasses);
    } catch (err) {
      res.status(500).send(err.message);
      return;
    }
  } else if (isStudent) {
    try {
      studentClasses = await queryDb(
        `Select cl.*, c.* FROM Student s
        join [User] u join u.userId = s.userref
        join studentClasse sc on sc.studentRef = s.studentID
        join Class cl on sc.classRef = cl.ClassID
        join Course c on c.courseID = cl.CourseRef
        join Term tr on tr.TermID
        where userid = @userid 
        AND StartDate < getdate() AND EndDate > getdate() `,
        [{ name: "userid", type: sql.BigInt, value: userId }]
      );
      res.json(teacherClasses);
    } catch (err) {
      res.status(500).send(err.message);
      return;
    }
  } else {
    throw new Error("you dont have permission.");
  }
}
