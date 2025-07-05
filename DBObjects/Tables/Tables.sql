use hw6;
IF Object_ID('User') IS NULL
CREATE TABLE [User](
    [UserID] [BIGINT] NOT NULL PRIMARY KEY,
	[UserName] nvarchar(50) NOT NULL,
	[password] nvarchar(50) NOT NULL,
	[FirstName] nvarchar(50) NULL,
	[LastName] [DateTime] NOT NULL,
	[Email] nvarchar(50) NOT NULL
)
GO

IF Object_ID('Teacher') IS NULL
CREATE TABLE [Teacher](
    [TeacherID] [BIGINT] NOT NULL PRIMARY KEY,
	[UserRef] [BIGINT] NOT NULL,
	[Code] nvarchar(50) NOT NULL,
	CONSTRAINT FK_Teacher_User FOREIGN KEY (TeacherRef) REFERENCES [User](UserID)
)
GO

IF Object_ID('Student') IS NULL
CREATE TABLE [Student](
    [StudentID] [BIGINT] NOT NULL PRIMARY KEY,
	[UserRef] [BIGINT] NOT NULL,
	[Code] nvarchar(50) NOT NULL,
	CONSTRAINT FK_Student_User FOREIGN KEY (StudentRef) REFERENCES [User](UserID)
)
GO

IF Object_ID('Course') IS NULL
CREATE TABLE [Course](
    [CourseID] [BIGINT] NOT NULL PRIMARY KEY,
	[Name] nvarchar(50) NOT NULL,
	[Detail] nvarchar(50) NOT NULL,
	[Credit] nvarchar(50) NULL,
)
GO

IF Object_ID('Term') IS NULL
CREATE TABLE [Term](
    [TermID] [BIGINT] NOT NULL PRIMARY KEY,
	[Name] nvarchar(50) NOT NULL,
	[StartDate] [DateTime] NOT NULL,
	[EndDate] nvarchar(50) NULL,
)
GO

IF OBJECT_ID('Class') IS NULL
CREATE TABLE [Class] (
    [ClassID] BIGINT NOT NULL PRIMARY KEY,
    [CourseRef] NVARCHAR(50) NOT NULL,
    [TermRef] NVARCHAR(50) NOT NULL,
    [TeacherRef] NVARCHAR(50) NULL,
    CONSTRAINT FK_Class_Teacher FOREIGN KEY (TeacherRef) REFERENCES Teacher(TeacherID),
	CONSTRAINT FK_Class_Term FOREIGN KEY (TermRef) REFERENCES Term(TermID),
);

IF OBJECT_ID('StudentCourse') IS NULL
CREATE TABLE [StudentCourse] (
    [StudentCourseID] BIGINT NOT NULL PRIMARY KEY,
    [ClassRef] NVARCHAR(50) NOT NULL,
    [StudentRef] NVARCHAR(50) NOT NULL,
    [TeacherRef] NVARCHAR(50) NULL,
    CONSTRAINT FK_StudentCourse_Student FOREIGN KEY (StudentRef) REFERENCES Student(StudentID),
	CONSTRAINT FK_StudentCourse_Class FOREIGN KEY (ClassRef) REFERENCES Class(ClassID),
);