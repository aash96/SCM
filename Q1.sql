-- -----------------------------------------------------
-- Schema scmsystem
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema scmsystem
-- -------------------------
USE scmsystem;

-- -----------------------------------------------------
-- Table scmsystem.Person
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Person (
  idPerson INT NOT NULL auto_increment,
  Username VARCHAR(45) NULL DEFAULT NULL,
  Password VARCHAR(255) NULL DEFAULT NULL,
  Fullname VARCHAR(45) NULL DEFAULT NULL,
  Address VARCHAR(45) NULL DEFAULT NULL,
  Phone VARCHAR(45) NULL DEFAULT NULL,
  Email VARCHAR(45) NULL DEFAULT NULL,
  LastLogin datetime NOT NULL default '2023-01-01 00:00:00',
  PRIMARY KEY (idPerson));


-- -----------------------------------------------------
-- Table scmsystem.Supplychain
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Supplychain (
  idSupplychain INT NOT NULL auto_increment,
  TimeCreated DATETIME NULL,
  Product VARCHAR(45) NULL,
  OwnerID INT NOT NULL,
  PRIMARY KEY (idSupplychain),
    FOREIGN KEY (OwnerID)
    REFERENCES Person (idPerson)
    ON DELETE CASCADE
    ON UPDATE NO ACTION);

-- -----------------------------------------------------
-- Table scmsystem.Role
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Role (
  Role VARCHAR(45) NULL,
  SupplychainID INT NOT NULL,
  PersonID INT NOT NULL,
    FOREIGN KEY (SupplychainID)
    REFERENCES Supplychain (idsupplychain)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
    FOREIGN KEY (PersonID)
    REFERENCES Person (idPerson)
    ON DELETE CASCADE
    ON UPDATE NO ACTION);
-- -----------------------------------------------------
-- Table scmsystem.Shipment
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Shipment (
  idShipment INT NOT NULL auto_increment,
  TimeCreated DATETIME NULL,
  Quantity VARCHAR(255) NULL,
  SupplychainID INT NOT NULL,
  PRIMARY KEY (idShipment),
    FOREIGN KEY (SupplychainID)
    REFERENCES Supplychain (idSupplychain)
    ON DELETE CASCADE
    ON UPDATE NO ACTION);
 -- -----------------------------------------------------
-- Table scmsystem.Certificate
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS Certificate (
  idCertificate INT NOT NULL auto_increment,
  TimeCreated DATETIME NULL,
  IssuerID INT NOT NULL,
  ShipmentID INT NOT NULL,
  PRIMARY KEY (idCertificate),
    FOREIGN KEY (ShipmentID)
    REFERENCES Shipment (idShipment)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
    FOREIGN KEY (IssuerID)
    REFERENCES Person (idPerson)
    ON DELETE CASCADE
    ON UPDATE NO ACTION);   
show tables;
