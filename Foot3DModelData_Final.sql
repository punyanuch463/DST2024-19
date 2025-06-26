CREATE DATABASE foot3dmodel;
USE foot3dmodel;


-- Create Table 
-- User
CREATE TABLE User (
    UserId INT AUTO_INCREMENT PRIMARY KEY,
    UserName VARCHAR(50) NOT NULL,
    UserPassWord VARCHAR(255) NOT NULL,
    UserEmail VARCHAR(100),
    PhoneNumber VARCHAR(15),
    FullName VARCHAR(100),
    Gender VARCHAR(10),
    BirthDate DATE,
    FootSizeCM DECIMAL(5,2),
    HeightCM DECIMAL(5,2),
    FootSizeEU INT,
    PathProfileImage TEXT,
    Consent BOOLEAN ,
    Address VARCHAR(255) ,
	houseNumber VARCHAR(40) ,
    street VARCHAR(255) ,
    district VARCHAR(100),
    city VARCHAR(100) ,
    province VARCHAR(100) ,
    zip_code VARCHAR(10) 
);


-- Email Verification for User
CREATE TABLE EmailVerificationForUser (
    VerificationID INT AUTO_INCREMENT PRIMARY KEY,
    UserId INT,
    VerificationCode VARCHAR(255) NOT NULL,
    ExpirationDate DATETIME NOT NULL,
       Verified boolean ,

    CONSTRAINT FK_EmailVerification_User FOREIGN KEY (UserId) REFERENCES User(UserId) ON DELETE CASCADE
);



-- Admin
CREATE TABLE Admin (
    AdminID INT AUTO_INCREMENT PRIMARY KEY,
    AdminName VARCHAR(100) NOT NULL,
    AdminEmail VARCHAR(100) NOT NULL,
    AdminPassword VARCHAR(100) NOT NULL,
    PhoneNumber VARCHAR(20),
    FullName VARCHAR(100),
    Gender VARCHAR(20),
    BirthDate DATE,
    Height DECIMAL(5,2),
    PathProfileImage TEXT,
    Consent BOOLEAN,
     Address VARCHAR(255) ,
	houseNumber VARCHAR(40) ,
    street VARCHAR(255) ,
    district VARCHAR(100),
    city VARCHAR(100) ,
    province VARCHAR(100) ,
    zip_code VARCHAR(10) 
);


-- Email Verification for Admin
CREATE TABLE EmailVerificationForAdmin (
    VerificationID INT AUTO_INCREMENT PRIMARY KEY,
    AdminID INT,
    VerificationCode VARCHAR(255) NOT NULL,
    ExpirationDate DATETIME NOT NULL,
	Verified boolean,
    
    CONSTRAINT FK_EmailVerification_Admin FOREIGN KEY (AdminID) REFERENCES Admin(AdminID) ON DELETE SET NULL
);


-- Order
CREATE TABLE `Order` (
    OrderID INT AUTO_INCREMENT PRIMARY KEY,
    UserId INT,
    DateTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FirstDateTime TIMESTAMP ,
     LastDateTime TIMESTAMP ,
    Status VARCHAR(20) NOT NULL,
	
    
     CONSTRAINT FK_Order_User FOREIGN KEY (UserID) REFERENCES User(UserId) ON DELETE CASCADE
);

-- Notification For Admin
CREATE TABLE NotificationForAdmin (
    NotificationID INT AUTO_INCREMENT PRIMARY KEY,
    OrderID INT,
     AdminID INT, 
    Message varchar(400) ,
    NotificationDateTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Status VARCHAR(20) NOT NULL,
	isRead boolean,
    
       CONSTRAINT FK_NotificationForAdmin_Admin FOREIGN KEY (AdminID) REFERENCES Admin(AdminID) ON DELETE SET NULL,
    CONSTRAINT FK_NotificationForAdmin_Order FOREIGN KEY (OrderID) REFERENCES `Order`(OrderID) ON DELETE CASCADE
);


-- Notification For User
CREATE TABLE Notification (
    NotificationID INT AUTO_INCREMENT PRIMARY KEY,
    OrderID INT,
    Message varchar(50) ,
    NotificationDateTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Status VARCHAR(20) NOT NULL,
	isRead boolean,
    
   CONSTRAINT FK_Notification_Order FOREIGN KEY (OrderID) REFERENCES `Order`(OrderID) ON DELETE CASCADE
);

-- Image Category
CREATE TABLE ImageCategory (
    ImageCategoryID INT AUTO_INCREMENT PRIMARY KEY,
    Description VARCHAR(255) NOT NULL
);

INSERT INTO ImageCategory (ImageCategoryID ,Description) 
VALUES 
(1,'มุมข้างเท้าด้านในข้างซ้าย'), 
(2,'มุมฝ่าเท้าข้างซ้าย'), 
(3,'มุมหลังเท้าบนกระดาษข้างซ้าย'),
(4,'วาดเท้าบนกระดาษข้างซ้าย'),
(5,'มุมข้างเท้าด้านในข้างขวา'),
(6,'มุมฝ่าเท้าข้างขวา'), 
(7,'มุมหลังเท้าบนกระดาษข้างขวา'),
(8,'วาดเท้าบนกระดาษข้างขวา');


-- Foot Image
CREATE TABLE FootImage (
    FootImageID INT AUTO_INCREMENT PRIMARY KEY,
    ImageCategoryID INT,
    Side VARCHAR(20) NOT NULL,
    PathUrl TEXT,
	DateTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	UserId INT,

      
    CONSTRAINT FK_FootImage_Category FOREIGN KEY (ImageCategoryID) REFERENCES ImageCategory(ImageCategoryID) ON DELETE CASCADE,
	CONSTRAINT FK_FootImage_User FOREIGN KEY (UserId) REFERENCES User(UserId) ON DELETE CASCADE,


);


-- Order Detailed
CREATE TABLE OrderDetailed (
    OrderDetailedID INT AUTO_INCREMENT PRIMARY KEY,
    OrderID INT,  
    UserId INT,
    DateTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Quantity INT,
    ShippingFee DOUBLE,
    TotalPrice DOUBLE,
	Address VARCHAR(255), 
    houseNumber VARCHAR(40),
	street VARCHAR(255) ,
    district VARCHAR(100) ,
    city VARCHAR(100) ,
    province VARCHAR(100) ,
    zip_code VARCHAR(10) ,
    
    CONSTRAINT FK_OrderDetailed_Order FOREIGN KEY (OrderID) REFERENCES `Order`(OrderID) ON DELETE CASCADE,
    CONSTRAINT FK_OrderDetailed_User FOREIGN KEY (UserId) REFERENCES User(UserId) ON DELETE CASCADE
);

-- Foot Data
CREATE TABLE FootData (
    FootDataID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    FootLength DECIMAL(5,2),
    HeelToDistalMetatarsal DECIMAL(5,2),
    MiddleFootWidth DECIMAL(5,2),
    ApexOf1stMTH DECIMAL(5,2),
    ApexOf5thMTH DECIMAL(5,2),
    ApexOf1stTo5thMTH DECIMAL(5,2),
    HeelWidth DECIMAL(5,2),
    ArchHeight DECIMAL(5,2),
    HeelToMiddleFoot DECIMAL(5,2),
    Side VARCHAR(20) NOT NULL,

    CONSTRAINT FK_FootData_User FOREIGN KEY (UserID) REFERENCES User (UserId) ON DELETE CASCADE
);

-- Foot 3D
CREATE TABLE Foot3D (
    Foot3DID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    Foot3DPath TEXT,
    Side VARCHAR(20) NOT NULL,

    CONSTRAINT FK_Foot3D_User FOREIGN KEY (UserID) REFERENCES User(UserId) ON DELETE CASCADE
);

