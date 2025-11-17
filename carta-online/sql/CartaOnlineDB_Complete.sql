-- =============================================
-- Script SQL Completo - CartaOnlineDB
-- Sistema Web Multiempresa - Carta Digital
-- Tecnicatura Superior en Análisis de Sistemas
-- =============================================

-- Crear base de datos
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'CartaOnlineDB')
BEGIN
    CREATE DATABASE CartaOnlineDB;
END
GO

USE CartaOnlineDB;
GO

-- =============================================
-- TABLAS
-- =============================================

-- Tabla Companies
IF OBJECT_ID('dbo.Companies', 'U') IS NOT NULL DROP TABLE dbo.Companies;
IF OBJECT_ID('dbo.Categories', 'U') IS NOT NULL DROP TABLE dbo.Categories;
IF OBJECT_ID('dbo.Products', 'U') IS NOT NULL DROP TABLE dbo.Products;
GO

CREATE TABLE dbo.Companies (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(200) NOT NULL,
    Address NVARCHAR(300) NULL,
    Phone NVARCHAR(50) NULL,
    Email NVARCHAR(150) NULL,
    LogoUrl NVARCHAR(500) NULL,
    CONSTRAINT CHK_Email CHECK (Email LIKE '%@%.%' OR Email IS NULL)
);
GO

-- Tabla Categories
CREATE TABLE dbo.Categories (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(200) NOT NULL,
    CompanyId INT NOT NULL,
    CONSTRAINT FK_Categories_Companies FOREIGN KEY (CompanyId) REFERENCES dbo.Companies(Id) ON DELETE CASCADE
);
GO

-- Tabla Products
CREATE TABLE dbo.Products (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(300) NOT NULL,
    Description NVARCHAR(1000) NULL,
    Price DECIMAL(18,2) NOT NULL CHECK (Price >= 0),
    CategoryId INT NOT NULL,
    CompanyId INT NOT NULL,
    ImageUrl NVARCHAR(500) NULL,
    CONSTRAINT FK_Products_Categories FOREIGN KEY (CategoryId) REFERENCES dbo.Categories(Id),
    CONSTRAINT FK_Products_Companies FOREIGN KEY (CompanyId) REFERENCES dbo.Companies(Id) ON DELETE CASCADE
);
GO

-- =============================================
-- DATOS DE EJEMPLO - 5 EMPRESAS
-- =============================================

-- Empresas
SET IDENTITY_INSERT dbo.Companies ON;
INSERT INTO dbo.Companies (Id, Name, Address, Phone, Email, LogoUrl) VALUES
(1, 'La Parrilla Criolla', 'Av. Corrientes 1234, CABA', '011-4555-1234', 'contacto@laparrillacriolla.com', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200'),
(2, 'Pizzería Don Antonio', 'Calle San Martín 567, CABA', '011-4555-5678', 'pedidos@donantonio.com', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200'),
(3, 'El Buen Sabor', 'Av. Rivadavia 890, CABA', '011-4555-8901', 'info@elbuensabor.com', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200'),
(4, 'Café del Centro', 'Av. de Mayo 321, CABA', '011-4555-3210', 'cafe@delcentro.com', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=200'),
(5, 'Sushi Express', 'Av. Santa Fe 654, CABA', '011-4555-6543', 'delivery@sushiexpress.com', 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=200');
SET IDENTITY_INSERT dbo.Companies OFF;
GO

-- Categorías (5 por empresa = 25 total)
SET IDENTITY_INSERT dbo.Categories ON;
INSERT INTO dbo.Categories (Id, Name, CompanyId) VALUES
-- La Parrilla Criolla
(1, 'Entradas', 1),
(2, 'Parrillada', 1),
(3, 'Ensaladas', 1),
(4, 'Postres', 1),
(5, 'Bebidas', 1),
-- Pizzería Don Antonio
(6, 'Pizzas', 2),
(7, 'Empanadas', 2),
(8, 'Pastas', 2),
(9, 'Postres', 2),
(10, 'Bebidas', 2),
-- El Buen Sabor
(11, 'Minutas', 3),
(12, 'Sandwiches', 3),
(13, 'Ensaladas', 3),
(14, 'Postres', 3),
(15, 'Bebidas', 3),
-- Café del Centro
(16, 'Cafés', 4),
(17, 'Medialunas y Facturas', 4),
(18, 'Tostados', 4),
(19, 'Licuados y Jugos', 4),
(20, 'Postres', 4),
-- Sushi Express
(21, 'Rolls', 5),
(22, 'Nigiris', 5),
(23, 'Sashimis', 5),
(24, 'Combos', 5),
(25, 'Bebidas', 5);
SET IDENTITY_INSERT dbo.Categories OFF;
GO

-- Productos (selección representativa - 40 productos)
SET IDENTITY_INSERT dbo.Products ON;
INSERT INTO dbo.Products (Id, Name, Description, Price, CategoryId, CompanyId, ImageUrl) VALUES
-- La Parrilla Criolla (8 productos)
(1, 'Provoleta a la parrilla', 'Queso provolone grillado con orégano y aceite de oliva', 3500, 1, 1, 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=400&h=300&fit=crop'),
(2, 'Chorizo criollo', 'Chorizo argentino grillado con chimichurri', 2800, 1, 1, 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=300&fit=crop'),
(3, 'Bife de chorizo', '400g de carne premium con guarnición', 8900, 2, 1, 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=300&fit=crop'),
(4, 'Vacío', '450g de vacío tierno con chimichurri', 8200, 2, 1, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop'),
(5, 'Entraña', '300g de entraña jugosa con ensalada', 9500, 2, 1, 'https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=300&fit=crop'),
(6, 'Ensalada mixta', 'Lechuga, tomate, cebolla y zanahoria', 2200, 3, 1, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop'),
(7, 'Flan casero', 'Flan con dulce de leche y crema', 2000, 4, 1, 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=300&fit=crop'),
(8, 'Cerveza Quilmes', 'Cerveza rubia 1L', 2500, 5, 1, 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400&h=300&fit=crop'),

-- Pizzería Don Antonio (8 productos)
(9, 'Pizza Muzzarella', 'Salsa, muzzarella y aceitunas', 4500, 6, 2, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop'),
(10, 'Pizza Napolitana', 'Muzzarella, tomate y ajo', 5200, 6, 2, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop'),
(11, 'Pizza Calabresa', 'Muzzarella, longaniza y morrones', 5800, 6, 2, 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400&h=300&fit=crop'),
(12, 'Empanada de carne', 'Carne picada, cebolla y especias', 600, 7, 2, 'https://images.unsplash.com/photo-1599974333013-8e6a7fd6d3ae?w=400&h=300&fit=crop'),
(13, 'Ravioles de ricota', 'Con salsa fileto o bolognesa', 4200, 8, 2, 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop'),
(14, 'Ñoquis de papa', 'Con salsa a elección', 3800, 8, 2, 'https://images.unsplash.com/photo-1511690078903-71dc5a49f5e3?w=400&h=300&fit=crop'),
(15, 'Tiramisú', 'Postre italiano con café', 2500, 9, 2, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop'),
(16, 'Cerveza Stella Artois', 'Cerveza 1L', 2800, 10, 2, 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=300&fit=crop'),

-- El Buen Sabor (8 productos)
(17, 'Milanesa napolitana', 'Milanesa de carne con jamón, muzzarella y salsa', 4800, 11, 3, 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=400&h=300&fit=crop'),
(18, 'Hamburguesa completa', 'Carne, lechuga, tomate, huevo y papas', 4500, 11, 3, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop'),
(19, 'Suprema a la Maryland', 'Pollo con salsa, banana y papas', 4200, 11, 3, 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop'),
(20, 'Carlitos', 'Jamón, queso, tomate y lechuga', 2800, 12, 3, 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop'),
(21, 'Lomito completo', 'Lomo, jamón, queso, huevo, lechuga y tomate', 4500, 12, 3, 'https://images.unsplash.com/photo-1619096252214-ef06c45683e3?w=400&h=300&fit=crop'),
(22, 'Ensalada completa', 'Lechuga, tomate, huevo, zanahoria y palmitos', 3200, 13, 3, 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop'),
(23, 'Helado con dulce de leche', '3 bochas con DDL', 2000, 14, 3, 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&h=300&fit=crop'),
(24, 'Licuado de banana', 'Con leche', 1500, 15, 3, 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=400&h=300&fit=crop'),

-- Café del Centro (8 productos)
(25, 'Café expreso', 'Café italiano', 1200, 16, 4, 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&h=300&fit=crop'),
(26, 'Cappuccino', 'Con espuma de leche', 1800, 16, 4, 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop'),
(27, 'Café cortado', 'Expreso con leche', 1300, 16, 4, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop'),
(28, 'Medialunas x3', 'De manteca', 1200, 17, 4, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop'),
(29, 'Churros x3', 'Con azúcar', 1500, 17, 4, 'https://images.unsplash.com/photo-1602142456047-21f6bbe6a0dd?w=400&h=300&fit=crop'),
(30, 'Tostado simple', 'Jamón y queso', 2000, 18, 4, 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop'),
(31, 'Tostado especial', 'Jamón, queso y tomate', 2300, 18, 4, 'https://images.unsplash.com/photo-1553909489-cd47e0907980?w=400&h=300&fit=crop'),
(32, 'Alfajor de maicena', 'Casero con DDL', 900, 20, 4, 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400&h=300&fit=crop'),

-- Sushi Express (8 productos)
(33, 'California Roll', '10 piezas - Palta, pepino y kanikama', 4500, 21, 5, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop'),
(34, 'Philadelphia Roll', '10 piezas - Salmón, queso crema y ciboulette', 5200, 21, 5, 'https://images.unsplash.com/photo-1617196035183-421b4917c92d?w=400&h=300&fit=crop'),
(35, 'Dragon Roll', '10 piezas - Langostino, palta y anguila', 6200, 21, 5, 'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=400&h=300&fit=crop'),
(36, 'Nigiri de salmón', '5 piezas', 3800, 22, 5, 'https://images.unsplash.com/photo-1564489563601-c53cfc451e93?w=400&h=300&fit=crop'),
(37, 'Nigiri de atún', '5 piezas', 4200, 22, 5, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop'),
(38, 'Sashimi mixto', '15 cortes variados', 6800, 23, 5, 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400&h=300&fit=crop'),
(39, 'Combo Express', '20 piezas variadas + bebida', 8500, 24, 5, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop'),
(40, 'Té verde', 'Infusión japonesa', 800, 25, 5, 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&h=300&fit=crop');
SET IDENTITY_INSERT dbo.Products OFF;
GO

-- =============================================
-- CONSULTAS DE VERIFICACIÓN
-- =============================================

-- Total de registros
SELECT 'Empresas' AS Tabla, COUNT(*) AS Total FROM dbo.Companies
UNION ALL
SELECT 'Categorías', COUNT(*) FROM dbo.Categories
UNION ALL
SELECT 'Productos', COUNT(*) FROM dbo.Products;
GO

-- Productos por empresa
SELECT 
    c.Name AS Empresa,
    COUNT(p.Id) AS CantidadProductos,
    AVG(p.Price) AS PrecioPromedio,
    MIN(p.Price) AS PrecioMinimo,
    MAX(p.Price) AS PrecioMaximo
FROM dbo.Companies c
LEFT JOIN dbo.Products p ON c.Id = p.CompanyId
GROUP BY c.Name
ORDER BY CantidadProductos DESC;
GO

-- Categorías por empresa
SELECT 
    c.Name AS Empresa,
    COUNT(cat.Id) AS CantidadCategorias
FROM dbo.Companies c
LEFT JOIN dbo.Categories cat ON c.Id = cat.CompanyId
GROUP BY c.Name
ORDER BY CantidadCategorias DESC;
GO

-- Vista completa de productos con empresa y categoría
SELECT TOP 10
    p.Name AS Producto,
    p.Price AS Precio,
    cat.Name AS Categoria,
    c.Name AS Empresa
FROM dbo.Products p
INNER JOIN dbo.Categories cat ON p.CategoryId = cat.Id
INNER JOIN dbo.Companies c ON p.CompanyId = c.Id
ORDER BY p.Price DESC;
GO

PRINT '✅ Base de datos CartaOnlineDB creada y poblada exitosamente';
PRINT '📊 5 empresas, 25 categorías y 40 productos insertados';
GO
