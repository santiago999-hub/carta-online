-- SQL Seed para CartaOnlineDB
CREATE DATABASE CartaOnlineDB;
GO

USE CartaOnlineDB;
GO

-- Tabla Companies
IF OBJECT_ID('dbo.Companies') IS NULL
BEGIN
CREATE TABLE dbo.Companies (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(200) NOT NULL,
    Address NVARCHAR(300) NULL,
    Phone NVARCHAR(50) NULL,
    Email NVARCHAR(150) NULL,
    LogoUrl NVARCHAR(500) NULL
);
END
GO

-- Tabla Categories
IF OBJECT_ID('dbo.Categories') IS NULL
BEGIN
CREATE TABLE dbo.Categories (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(200) NOT NULL,
    CompanyId INT NOT NULL REFERENCES dbo.Companies(Id)
);
END
GO

-- Tabla Products
IF OBJECT_ID('dbo.Products') IS NULL
BEGIN
CREATE TABLE dbo.Products (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(300) NOT NULL,
    Description NVARCHAR(1000) NULL,
    Price DECIMAL(18,2) NOT NULL,
    CategoryId INT NOT NULL REFERENCES dbo.Categories(Id),
    CompanyId INT NOT NULL REFERENCES dbo.Companies(Id),
    ImageUrl NVARCHAR(500) NULL
);
END
GO

-- Seed: 2 empresas
INSERT INTO dbo.Companies (Name, Address, Phone, Email, LogoUrl) VALUES
('La Buena Mesa', 'Calle Falsa 123', '011-5555-0001', 'contacto@labuenamesa.com', ''),
('Sabor Urbano', 'Av. Siempreviva 742', '011-5555-0002', 'hola@saborurbano.com', '');
GO

-- Seed: categorías y productos por empresa
-- Empresa 1
INSERT INTO dbo.Categories (Name, CompanyId) VALUES
('Entradas', 1),
('Platos Principales', 1);
GO

INSERT INTO dbo.Products (Name, Description, Price, CategoryId, CompanyId, ImageUrl) VALUES
('Bruschetta', 'Pan tostado con tomate y albahaca', 1200, 1, 1, ''),
('Provoleta', 'Queso provolone a la plancha', 1500, 1, 1, ''),
('Milanesa Napolitana', 'Milanesa con jamón y queso', 3500, 2, 1, ''),
('Risotto de hongos', 'Risotto cremoso con hongos', 3800, 2, 1, '');
GO

-- Empresa 2
INSERT INTO dbo.Categories (Name, CompanyId) VALUES
('Bebidas', 2),
('Postres', 2);
GO

INSERT INTO dbo.Products (Name, Description, Price, CategoryId, CompanyId, ImageUrl) VALUES
('Cerveza Artesanal', 'Botella 500ml', 900, 3, 2, ''),
('Limonada Casera', 'Limonada con hierbabuena', 600, 3, 2, ''),
('Cheesecake', 'Cheesecake de frutos rojos', 1400, 4, 2, ''),
('Brownie', 'Brownie con helado', 1200, 4, 2, '');
GO
