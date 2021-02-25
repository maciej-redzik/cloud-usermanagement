
CREATE TABLE Locations(
    ID int NOT NULL IDENTITY(1,1) PRIMARY KEY,
    Name VARCHAR(100)
);

CREATE TABLE Users (
    ID int NOT NULL IDENTITY(1,1) PRIMARY KEY,
    FirstName VARCHAR(100),
    LastName VARCHAR(100),
    Phone VARCHAR(100),
    LocationID int,
    FOREIGN KEY (LocationID) REFERENCES Locations(ID)
);

INSERT INTO Locations (Name) VALUES ('Gdansk')
INSERT INTO Locations (Name) VALUES ('Warsaw')
INSERT INTO Locations (Name) VALUES ('Vilno')

INSERT INTO Users (FirstName, LastName, Phone, LocationID)
VALUES ('Maciej', 'Redzik', '888 111 999', 1);

INSERT INTO Users (FirstName, LastName, Phone, LocationID)
VALUES ('Testing', 'User', '111 776 999', 1);