use hw6;
IF Object_ID('User') IS NULL
CREATE TABLE [User](
    [UserID] [BIGINT] NOT NULL PRIMARY KEY IDENTITY(1,1),
	[UserName] nvarchar(50) NOT NULL,
	[password] nvarchar(100) NOT NULL,
	[FirstName] nvarchar(50) NULL,
	[LastName] nvarchar(50) NOT NULL,
	[Email] nvarchar(50) NOT NULL,
	IsActive BIT NOT NULL
)
GO

IF Object_ID('Admin') IS NULL
CREATE TABLE [Admin](
    [AdminID] [BIGINT] NOT NULL PRIMARY KEY IDENTITY(1,1),
	[UserRef] [BIGINT] NOT NULL,
	CONSTRAINT FK_Admin_User FOREIGN KEY (UserRef) REFERENCES [User](UserID)
)
GO

IF Object_ID('Teacher') IS NULL
CREATE TABLE [Teacher](
    [TeacherID] [BIGINT] NOT NULL PRIMARY KEY IDENTITY(1,1),
	[UserRef] [BIGINT] NOT NULL,
	[Code] nvarchar(50) NOT NULL,
	CONSTRAINT FK_Teacher_User FOREIGN KEY (UserRef) REFERENCES [User](UserID)
)
GO

IF Object_ID('Student') IS NULL
CREATE TABLE [Student](
    [StudentID] [BIGINT] NOT NULL PRIMARY KEY IDENTITY(1,1),
	[UserRef] [BIGINT] NOT NULL,
	[Code] nvarchar(50) NOT NULL,
	CONSTRAINT FK_Student_User FOREIGN KEY (UserRef) REFERENCES [User](UserID)
)
GO

IF Object_ID('Course') IS NULL
CREATE TABLE [Course](
    [CourseID] [BIGINT] NOT NULL PRIMARY KEY IDENTITY(1,1),
	[Name] nvarchar(50) NOT NULL,
	[Code] BIGINT NOT NULL UNIQUE,
	[Detail] nvarchar(50) NOT NULL,
	[Credit] INT NOT NULL,
	CONSTRAINT Course_CreditRange CHECK (0<[Credit] AND [Credit]<6),
)
GO

IF Object_ID('Term') IS NULL
CREATE TABLE [Term](
    [TermID] [BIGINT] NOT NULL PRIMARY KEY IDENTITY(1,1),
	[Name] nvarchar(50) NOT NULL,
	[StartDate] [DateTime] NOT NULL,
	[EndDate] nvarchar(50) NULL,
)
GO

IF OBJECT_ID('Class') IS NULL
CREATE TABLE [Class] (
    [ClassID] BIGINT NOT NULL PRIMARY KEY IDENTITY(1,1),
    [CourseRef] NVARCHAR(50) NOT NULL,
    [TermRef] BIGINT NOT NULL,
    [TeacherRef] BIGINT NULL,
	[Capacity] INT NOT NULL,
    CONSTRAINT FK_Class_Teacher FOREIGN KEY (TeacherRef) REFERENCES Teacher(TeacherID),
	CONSTRAINT FK_Class_Term FOREIGN KEY (TermRef) REFERENCES Term(TermID),
	CONSTRAINT Class_ScoreRange CHECK (0 < Capacity)
);

IF OBJECT_ID('StudentClass') IS NULL
CREATE TABLE [StudentClass] (
    [StudentClassID] BIGINT NOT NULL PRIMARY KEY IDENTITY(1,1),
    [ClassRef] BIGINT NOT NULL,
    [StudentRef] BIGINT NOT NULL,
	[Score] INT NULL,
    CONSTRAINT FK_StudentClass_Student FOREIGN KEY (StudentRef) REFERENCES Student(StudentID),
	CONSTRAINT FK_StudentClass_Class FOREIGN KEY (ClassRef) REFERENCES Class(ClassID),
	CONSTRAINT StudentClass_ScoreRange CHECK (Score <21 AND -1 < Score)
);

IF OBJECT_ID('Messages') IS NULL
CREATE TABLE [Messages] (
    [MessagesID] BIGINT NOT NULL PRIMARY KEY IDENTITY(1,1),
    [TeacherRef] BIGINT NOT NULL,
    [ClassRef] BIGINT NOT NULL,
	[Title] NVARCHAR(50) NOT NULL,
    [Detail] NVARCHAR(500) NOT NULL,
	[CreateAt] DATETIME NOT NULL,
    CONSTRAINT FK_Messages_Teacher FOREIGN KEY (TeacherRef) REFERENCES Teacher(TeacherID),
	CONSTRAINT FK_Messages_Class FOREIGN KEY (ClassRef) REFERENCES Class(ClassID),
);

