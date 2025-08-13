IF NOT EXISTS (SELECT 1 FROM sys.databases WHERE name = N'ProjectDB')
    CREATE DATABASE [ProjectDB];
GO

USE [ProjectDB];
-- TABLE: Categorization
IF OBJECT_ID('Categorization') IS NULL
CREATE TABLE Categorization (
  CategorizationID BIGINT NOT NULL PRIMARY KEY IDENTITY(1,1),
  Name NVARCHAR(100) NOT NULL
);
GO

-- TABLE: Part
IF OBJECT_ID('Part') IS NULL
CREATE TABLE Part (
  PartID BIGINT NOT NULL PRIMARY KEY IDENTITY(1,1),
  Name NVARCHAR(100) NOT NULL,
  CategorizationRef BIGINT NOT NULL,
  Remaining INT NOT NULL,
  Cost BIGINT NOT NULL,
  CONSTRAINT FK_Part_Categorization FOREIGN KEY (CategorizationRef) REFERENCES Categorization(CategorizationID)
);
GO

-- TABLE: User
IF OBJECT_ID('[User]') IS NULL
CREATE TABLE [User] (
  UserID BIGINT NOT NULL PRIMARY KEY IDENTITY(1,1),
  Name NVARCHAR(100) NOT NULL,
  UserName NVARCHAR(100) NOT NULL,
  [Password] NVARCHAR(100) NOT NULL,
  [Email] NVARCHAR(100) NOT NULL,
  IsAdmin BIT NOT NULL
);
GO

-- TABLE: [Order]
IF OBJECT_ID('[Order]') IS NULL
CREATE TABLE [Order] (
  OrderID BIGINT NOT NULL PRIMARY KEY IDENTITY(1,1),
  [Description] NVARCHAR(200) NOT NULL,
  CreateAt DATETIME NOT NULL,
  TotalCost BIGINT NOT NULL,
  UserRef BIGINT NOT NULL,
  [State] INT NOT NULL,
  [PartID] BIGINT NOT NULL,
  [Cost] BIGINT NOT NULL,
  [Count] INT NOT NULL
  CONSTRAINT FK_Order_User FOREIGN KEY (UserRef) REFERENCES [User](UserID),
  CONSTRAINT FK_Order_Part FOREIGN KEY (PartRef) REFERENCES [Part](PartID)
);
GO

-- TABLE: InventoryVoucher
IF OBJECT_ID('InventoryVoucher') IS NULL
CREATE TABLE InventoryVoucher (
  InventoryVoucherID BIGINT NOT NULL PRIMARY KEY IDENTITY(1,1),
  [Description] NVARCHAR(200) NOT NULL,
  CreateAt DATETIME NOT NULL,
  UserRef BIGINT NOT NULL,
  CONSTRAINT FK_InventoryVoucher_User FOREIGN KEY (UserRef) REFERENCES [User](UserID)
);
GO

-- TABLE: InventoryVoucherItem
IF OBJECT_ID('InventoryVoucherItem') IS NULL
CREATE TABLE InventoryVoucherItem (
  InventoryVoucherItemID BIGINT NOT NULL PRIMARY KEY IDENTITY(1,1),
  RowNumber INT NOT NULL,
  Number INT NOT NULL,
  State INT NOT NULL,
  InventoryVoucherRef BIGINT NOT NULL,
  PartRef BIGINT NOT NULL,
  CONSTRAINT FK_InventoryVoucherItem_InventoryVoucher FOREIGN KEY (InventoryVoucherRef) REFERENCES InventoryVoucher(InventoryVoucherID),
  CONSTRAINT FK_InventoryVoucherItem_Part FOREIGN KEY (PartRef) REFERENCES Part(PartID)
);
GO

-- TABLE: MoneyType
IF OBJECT_ID('MoneyType') IS NULL
CREATE TABLE MoneyType (
  MoneyTypeID INT NOT NULL PRIMARY KEY IDENTITY(1,1),
  Name NVARCHAR(50) NOT NULL
);
GO

-- TABLE: Settings
IF OBJECT_ID('Settings') IS NULL
CREATE TABLE Settings (
  SettingsID INT NOT NULL PRIMARY KEY CHECK (SettingsID = 1),
  LimmitOfLowCount INT NOT NULL,
  MoneyTypeRef BIGINT NOT NULL,
  CONSTRAINT FK_Settings_MoneyType FOREIGN KEY (MoneyTypeRef) REFERENCES MoneyType(MoneyTypeID)
);
GO
