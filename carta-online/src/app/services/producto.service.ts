import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto.model';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private storageKey = 'productos';
  private readonly apiBase = 'http://localhost:5230/api/products';

  constructor(private http: HttpClient) {
    if (!localStorage.getItem(this.storageKey)) {
      const seed: Producto[] = [
        // La Parrilla Criolla - Entradas
        { id: 1, name: 'Provoleta a la parrilla', description: 'Queso provolone grillado con orégano y aceite de oliva', price: 3500, categoryId: 1, companyId: 1, imageUrl: 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=400&h=300&fit=crop' },
        { id: 2, name: 'Chorizo criollo', description: 'Chorizo argentino grillado con chimichurri', price: 2800, categoryId: 1, companyId: 1, imageUrl: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=300&fit=crop' },
        { id: 3, name: 'Morcilla', description: 'Morcilla casera con ensalada criolla', price: 2500, categoryId: 1, companyId: 1, imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop' },
        // La Parrilla Criolla - Parrillada
        { id: 4, name: 'Bife de chorizo', description: '400g de carne premium con guarnición', price: 8900, categoryId: 2, companyId: 1, imageUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=300&fit=crop' },
        { id: 5, name: 'Asado de tira', description: '500g de asado jugoso con papas fritas', price: 7500, categoryId: 2, companyId: 1, imageUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=300&fit=crop' },
        { id: 6, name: 'Vacío', description: '450g de vacío tierno con chimichurri', price: 8200, categoryId: 2, companyId: 1, imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop' },
        { id: 7, name: 'Entraña', description: '300g de entraña jugosa con ensalada', price: 9500, categoryId: 2, companyId: 1, imageUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=300&fit=crop' },
        { id: 8, name: 'Parrillada completa para 2', description: 'Chorizo, morcilla, vacío, asado y mollejas', price: 16500, categoryId: 2, companyId: 1, imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop' },
        // La Parrilla Criolla - Ensaladas
        { id: 9, name: 'Ensalada mixta', description: 'Lechuga, tomate, cebolla y zanahoria', price: 2200, categoryId: 3, companyId: 1, imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop' },
        { id: 10, name: 'Ensalada Caesar', description: 'Lechuga romana, pollo, croutones y parmesano', price: 3800, categoryId: 3, companyId: 1, imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop' },
        // La Parrilla Criolla - Postres
        { id: 11, name: 'Flan casero', description: 'Flan con dulce de leche y crema', price: 2000, categoryId: 4, companyId: 1, imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=300&fit=crop' },
        { id: 12, name: 'Panqueque con dulce de leche', description: 'Panqueques rellenos con DDL', price: 2200, categoryId: 4, companyId: 1, imageUrl: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400&h=300&fit=crop' },
        // La Parrilla Criolla - Bebidas
        { id: 13, name: 'Coca Cola 500ml', description: 'Gaseosa', price: 1200, categoryId: 5, companyId: 1, imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=300&fit=crop' },
        { id: 14, name: 'Agua mineral', description: 'Agua sin gas 500ml', price: 800, categoryId: 5, companyId: 1, imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=300&fit=crop' },
        { id: 15, name: 'Cerveza Quilmes', description: 'Cerveza rubia 1L', price: 2500, categoryId: 5, companyId: 1, imageUrl: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400&h=300&fit=crop' },

        // Pizzería Don Antonio - Pizzas
        { id: 16, name: 'Pizza Muzzarella', description: 'Salsa, muzzarella y aceitunas', price: 4500, categoryId: 6, companyId: 2, imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop' },
        { id: 17, name: 'Pizza Napolitana', description: 'Muzzarella, tomate y ajo', price: 5200, categoryId: 6, companyId: 2, imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop' },
        { id: 18, name: 'Pizza Calabresa', description: 'Muzzarella, longaniza y morrones', price: 5800, categoryId: 6, companyId: 2, imageUrl: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400&h=300&fit=crop' },
        { id: 19, name: 'Pizza Fugazzeta', description: 'Muzzarella y cebolla caramelizada', price: 5500, categoryId: 6, companyId: 2, imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop' },
        { id: 20, name: 'Pizza Especial', description: 'Jamón, morrones, huevo y aceitunas', price: 6200, categoryId: 6, companyId: 2, imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop' },
        // Pizzería Don Antonio - Empanadas
        { id: 21, name: 'Empanada de carne', description: 'Carne picada, cebolla y especias', price: 600, categoryId: 7, companyId: 2, imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop' },
        { id: 22, name: 'Empanada de jamón y queso', description: 'Jamón cocido y queso muzzarella', price: 550, categoryId: 7, companyId: 2, imageUrl: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=400&h=300&fit=crop' },
        { id: 23, name: 'Empanada de pollo', description: 'Pollo desmenuzado con verduras', price: 580, categoryId: 7, companyId: 2, imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop' },
        // Pizzería Don Antonio - Pastas
        { id: 24, name: 'Ravioles de ricota', description: 'Con salsa fileto o bolognesa', price: 4200, categoryId: 8, companyId: 2, imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop' },
        { id: 25, name: 'Ñoquis de papa', description: 'Con salsa a elección', price: 3800, categoryId: 8, companyId: 2, imageUrl: 'https://images.unsplash.com/photo-1511690078903-71dc5a49f5e3?w=400&h=300&fit=crop' },
        { id: 26, name: 'Sorrentinos de jamón y queso', description: 'Con salsa rosa', price: 4500, categoryId: 8, companyId: 2, imageUrl: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&h=300&fit=crop' },
        // Pizzería Don Antonio - Postres
        { id: 27, name: 'Tiramisú', description: 'Postre italiano con café', price: 2500, categoryId: 9, companyId: 2, imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop' },
        { id: 28, name: 'Helado artesanal', description: '2 bochas a elección', price: 1800, categoryId: 9, companyId: 2, imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop' },
        // Pizzería Don Antonio - Bebidas
        { id: 29, name: 'Coca Cola 1.5L', description: 'Gaseosa grande', price: 1800, categoryId: 10, companyId: 2, imageUrl: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=300&fit=crop' },
        { id: 30, name: 'Cerveza Stella Artois', description: 'Cerveza 1L', price: 2800, categoryId: 10, companyId: 2, imageUrl: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=300&fit=crop' },

        // El Buen Sabor - Minutas
        { id: 31, name: 'Milanesa napolitana', description: 'Milanesa de carne con jamón, muzzarella y salsa', price: 4800, categoryId: 11, companyId: 3, imageUrl: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=400&h=300&fit=crop' },
        { id: 32, name: 'Milanesa completa', description: 'Con huevo frito y papas fritas', price: 5200, categoryId: 11, companyId: 3, imageUrl: 'https://images.unsplash.com/photo-1625937286074-9ca519d5d9df?w=400&h=300&fit=crop' },
        { id: 33, name: 'Hamburguesa completa', description: 'Carne, lechuga, tomate, huevo y papas', price: 4500, categoryId: 11, companyId: 3, imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop' },
        { id: 34, name: 'Suprema a la Maryland', description: 'Pollo con salsa, banana y papas', price: 4200, categoryId: 11, companyId: 3, imageUrl: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop' },
        // El Buen Sabor - Sandwiches
        { id: 35, name: 'Carlitos', description: 'Jamón, queso, tomate y lechuga', price: 2800, categoryId: 12, companyId: 3, imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop' },
        { id: 36, name: 'Lomito completo', description: 'Lomo, jamón, queso, huevo, lechuga y tomate', price: 4500, categoryId: 12, companyId: 3, imageUrl: 'https://images.unsplash.com/photo-1619096252214-ef06c45683e3?w=400&h=300&fit=crop' },
        { id: 37, name: 'Sándwich de milanesa', description: 'Milanesa de carne con lechuga y tomate', price: 3800, categoryId: 12, companyId: 3, imageUrl: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?w=400&h=300&fit=crop' },
        // El Buen Sabor - Ensaladas
        { id: 38, name: 'Ensalada completa', description: 'Lechuga, tomate, huevo, zanahoria y palmitos', price: 3200, categoryId: 13, companyId: 3, imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop' },
        { id: 39, name: 'Ensalada de atún', description: 'Con atún, lechuga, tomate y huevo', price: 3500, categoryId: 13, companyId: 3, imageUrl: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=400&h=300&fit=crop' },
        // El Buen Sabor - Postres
        { id: 40, name: 'Helado con dulce de leche', description: '3 bochas con DDL', price: 2000, categoryId: 14, companyId: 3, imageUrl: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&h=300&fit=crop' },
        { id: 41, name: 'Ensalada de frutas', description: 'Frutas frescas de estación', price: 1800, categoryId: 14, companyId: 3, imageUrl: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&h=300&fit=crop' },
        // El Buen Sabor - Bebidas
        { id: 42, name: 'Licuado de banana', description: 'Con leche', price: 1500, categoryId: 15, companyId: 3, imageUrl: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=400&h=300&fit=crop' },
        { id: 43, name: 'Jugo de naranja exprimido', description: 'Natural', price: 1800, categoryId: 15, companyId: 3, imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=300&fit=crop' },

        // Café del Centro - Cafés
        { id: 44, name: 'Café expreso', description: 'Café italiano', price: 1200, categoryId: 16, companyId: 4, imageUrl: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&h=300&fit=crop' },
        { id: 45, name: 'Café con leche', description: 'Con leche vaporizada', price: 1500, categoryId: 16, companyId: 4, imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop' },
        { id: 46, name: 'Cappuccino', description: 'Con espuma de leche', price: 1800, categoryId: 16, companyId: 4, imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop' },
        { id: 47, name: 'Café cortado', description: 'Expreso con leche', price: 1300, categoryId: 16, companyId: 4, imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop' },
        { id: 48, name: 'Lágrima', description: 'Leche con un toque de café', price: 1400, categoryId: 16, companyId: 4, imageUrl: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=300&fit=crop' },
        // Café del Centro - Medialunas y Facturas
        { id: 49, name: 'Medialunas x3', description: 'De manteca', price: 1200, categoryId: 17, companyId: 4, imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop' },
        { id: 50, name: 'Facturas surtidas x6', description: 'Variedad de facturas', price: 2500, categoryId: 17, companyId: 4, imageUrl: 'https://images.unsplash.com/photo-1612203985729-70726954388c?w=400&h=300&fit=crop' },
        { id: 51, name: 'Churros x3', description: 'Con azúcar', price: 1500, categoryId: 17, companyId: 4, imageUrl: 'https://images.unsplash.com/photo-1590248568596-f95e2a5e1e02?w=400&h=300&fit=crop' },
        // Café del Centro - Tostados
        { id: 52, name: 'Tostado simple', description: 'Jamón y queso', price: 2000, categoryId: 18, companyId: 4, imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop' },
        { id: 53, name: 'Tostado especial', description: 'Jamón, queso y tomate', price: 2300, categoryId: 18, companyId: 4, imageUrl: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?w=400&h=300&fit=crop' },
        // Café del Centro - Licuados y Jugos
        { id: 54, name: 'Licuado de frutilla', description: 'Con leche', price: 1600, categoryId: 19, companyId: 4, imageUrl: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=400&h=300&fit=crop' },
        { id: 55, name: 'Jugo de naranja', description: 'Exprimido', price: 1700, categoryId: 19, companyId: 4, imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=300&fit=crop' },
        // Café del Centro - Postres
        { id: 56, name: 'Alfajor de maicena', description: 'Casero con DDL', price: 900, categoryId: 20, companyId: 4, imageUrl: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400&h=300&fit=crop' },
        { id: 57, name: 'Porción de torta', description: 'Del día', price: 1800, categoryId: 20, companyId: 4, imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop' },

        // Sushi Express - Rolls
        { id: 58, name: 'California Roll', description: '10 piezas - Palta, pepino y kanikama', price: 4500, categoryId: 21, companyId: 5, imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop' },
        { id: 59, name: 'Philadelphia Roll', description: '10 piezas - Salmón, queso crema y ciboulette', price: 5200, categoryId: 21, companyId: 5, imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop' },
        { id: 60, name: 'Spicy Tuna Roll', description: '10 piezas - Atún picante con salsa especial', price: 5500, categoryId: 21, companyId: 5, imageUrl: 'https://images.unsplash.com/photo-1563612116625-3012372fccce?w=400&h=300&fit=crop' },
        { id: 61, name: 'Dragon Roll', description: '10 piezas - Langostino, palta y anguila', price: 6200, categoryId: 21, companyId: 5, imageUrl: 'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=400&h=300&fit=crop' },
        // Sushi Express - Nigiris
        { id: 62, name: 'Nigiri de salmón', description: '2 piezas', price: 1800, categoryId: 22, companyId: 5, imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop' },
        { id: 63, name: 'Nigiri de atún', description: '2 piezas', price: 2000, categoryId: 22, companyId: 5, imageUrl: 'https://images.unsplash.com/photo-1564489563601-c53cfc451e93?w=400&h=300&fit=crop' },
        { id: 64, name: 'Nigiri de langostino', description: '2 piezas', price: 2200, categoryId: 22, companyId: 5, imageUrl: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=400&h=300&fit=crop' },
        // Sushi Express - Sashimis
        { id: 65, name: 'Sashimi de salmón', description: '8 cortes finos', price: 4800, categoryId: 23, companyId: 5, imageUrl: 'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=400&h=300&fit=crop' },
        { id: 66, name: 'Sashimi de atún', description: '8 cortes finos', price: 5200, categoryId: 23, companyId: 5, imageUrl: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400&h=300&fit=crop' },
        { id: 67, name: 'Sashimi mixto', description: 'Salmón y atún - 10 piezas', price: 5800, categoryId: 23, companyId: 5, imageUrl: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop' },
        // Sushi Express - Combinados
        { id: 68, name: 'Combo para 1', description: '20 piezas variadas', price: 6500, categoryId: 24, companyId: 5, imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop' },
        { id: 69, name: 'Combo para 2', description: '40 piezas variadas', price: 12000, categoryId: 24, companyId: 5, imageUrl: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400&h=300&fit=crop' },
        { id: 70, name: 'Combo Familiar', description: '60 piezas variadas', price: 17500, categoryId: 24, companyId: 5, imageUrl: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=400&h=300&fit=crop' },
        // Sushi Express - Bebidas
        { id: 71, name: 'Té verde japonés', description: 'Caliente', price: 1200, categoryId: 25, companyId: 5, imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop' },
        { id: 72, name: 'Sake frío', description: '250ml', price: 3500, categoryId: 25, companyId: 5, imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=300&fit=crop' },

        // La Parrilla Criolla - Más productos
        { id: 73, name: 'Costillas de cerdo', description: 'Costillas BBQ con papas rústicas', price: 7800, categoryId: 2, companyId: 1, imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop' },
        { id: 74, name: 'Matambre a la pizza', description: 'Con muzzarella y salsa', price: 6500, categoryId: 2, companyId: 1, imageUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=300&fit=crop' },
        { id: 75, name: 'Mollejas a la parrilla', description: 'Con ensalada y limón', price: 5200, categoryId: 2, companyId: 1, imageUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=300&fit=crop' },
        { id: 76, name: 'Picada criolla', description: 'Chorizo, morcilla, queso y aceitunas', price: 4500, categoryId: 1, companyId: 1, imageUrl: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=300&fit=crop' },
        { id: 77, name: 'Empanadas criollas x12', description: 'Carne cortada a cuchillo', price: 7200, categoryId: 1, companyId: 1, imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop' },
        { id: 78, name: 'Papas fritas grandes', description: 'Porción abundante', price: 2000, categoryId: 3, companyId: 1, imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop' },
        { id: 79, name: 'Vino tinto Malbec', description: 'Botella 750ml', price: 4500, categoryId: 5, companyId: 1, imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop' },
        { id: 80, name: 'Chocotorta casera', description: 'Porción generosa', price: 2400, categoryId: 4, companyId: 1, imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop' },

        // Pizzería Don Antonio - Más productos
        { id: 81, name: 'Pizza Cuatro Quesos', description: 'Muzzarella, roquefort, parmesano y fontina', price: 6800, categoryId: 6, companyId: 2, imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop' },
        { id: 82, name: 'Pizza Margarita', description: 'Salsa, muzzarella, tomate y albahaca', price: 5500, categoryId: 6, companyId: 2, imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop' },
        { id: 83, name: 'Calzone napolitano', description: 'Pizza cerrada con jamón y muzzarella', price: 5200, categoryId: 6, companyId: 2, imageUrl: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400&h=300&fit=crop' },
        { id: 84, name: 'Fainá porción', description: 'Masa de garbanzos crocante', price: 800, categoryId: 6, companyId: 2, imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop' },
        { id: 85, name: 'Empanada de verdura', description: 'Espinaca y queso', price: 550, categoryId: 7, companyId: 2, imageUrl: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=400&h=300&fit=crop' },
        { id: 86, name: 'Docena empanadas mixtas', description: '12 empanadas variadas', price: 6600, categoryId: 7, companyId: 2, imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop' },
        { id: 87, name: 'Canelones de ricota', description: 'Con salsa fileto', price: 4000, categoryId: 8, companyId: 2, imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop' },
        { id: 88, name: 'Lasagna de carne', description: 'Con bechamel y bolognesa', price: 4800, categoryId: 8, companyId: 2, imageUrl: 'https://images.unsplash.com/photo-1619895092538-128341789043?w=400&h=300&fit=crop' },
        { id: 89, name: 'Fernet con Coca', description: 'Bebida preparada 1L', price: 3200, categoryId: 10, companyId: 2, imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=300&fit=crop' },
        { id: 90, name: 'Cheesecake', description: 'Con frutos rojos', price: 2800, categoryId: 9, companyId: 2, imageUrl: 'https://images.unsplash.com/photo-1533134486753-c833f0ed4866?w=400&h=300&fit=crop' },

        // El Buen Sabor - Más productos
        { id: 91, name: 'Milanesa de pollo', description: 'Con ensalada y papas', price: 4000, categoryId: 11, companyId: 3, imageUrl: 'https://images.unsplash.com/photo-1625937286074-9ca519d5d9df?w=400&h=300&fit=crop' },
        { id: 92, name: 'Bife a caballo', description: 'Bife de chorizo con huevos fritos', price: 6800, categoryId: 11, companyId: 3, imageUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=300&fit=crop' },
        { id: 93, name: 'Pollo grillado', description: 'Con ensalada mixta', price: 4500, categoryId: 11, companyId: 3, imageUrl: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop' },
        { id: 94, name: 'Papas con cheddar y bacon', description: 'Porción grande', price: 3200, categoryId: 11, companyId: 3, imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop' },
        { id: 95, name: 'Pancho completo', description: 'Con papas fritas', price: 2500, categoryId: 12, companyId: 3, imageUrl: 'https://images.unsplash.com/photo-1612392062798-2dbce778c076?w=400&h=300&fit=crop' },
        { id: 96, name: 'Sándwich club', description: 'Triple con pollo, bacon y huevo', price: 4200, categoryId: 12, companyId: 3, imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop' },
        { id: 97, name: 'Nuggets de pollo x8', description: 'Con papas y salsas', price: 3500, categoryId: 11, companyId: 3, imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=300&fit=crop' },
        { id: 98, name: 'Café expreso doble', description: 'Café fuerte', price: 1400, categoryId: 15, companyId: 3, imageUrl: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&h=300&fit=crop' },
        { id: 99, name: 'Brownie con helado', description: 'Caliente con helado de vainilla', price: 2500, categoryId: 14, companyId: 3, imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop' },
        { id: 100, name: 'Limonada natural', description: '500ml', price: 1200, categoryId: 15, companyId: 3, imageUrl: 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2f8d?w=400&h=300&fit=crop' },

        // Café del Centro - Más productos
        { id: 101, name: 'Flat White', description: 'Café con microespuma', price: 1900, categoryId: 16, companyId: 4, imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop' },
        { id: 102, name: 'Café americano', description: 'Expreso con agua', price: 1400, categoryId: 16, companyId: 4, imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop' },
        { id: 103, name: 'Mochaccino', description: 'Café con chocolate', price: 2000, categoryId: 16, companyId: 4, imageUrl: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=300&fit=crop' },
        { id: 104, name: 'Té chai latte', description: 'Especiado con leche', price: 1800, categoryId: 16, companyId: 4, imageUrl: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&h=300&fit=crop' },
        { id: 105, name: 'Budín de limón', description: 'Porción con glaseado', price: 1600, categoryId: 17, companyId: 4, imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop' },
        { id: 106, name: 'Scones x2', description: 'Con mermelada y crema', price: 1700, categoryId: 17, companyId: 4, imageUrl: 'https://images.unsplash.com/photo-1612203985729-70726954388c?w=400&h=300&fit=crop' },
        { id: 107, name: 'Muffin de arándanos', description: 'Recién horneado', price: 1400, categoryId: 17, companyId: 4, imageUrl: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&h=300&fit=crop' },
        { id: 108, name: 'Tostado veggie', description: 'Verduras grilladas y queso', price: 2400, categoryId: 18, companyId: 4, imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop' },
        { id: 109, name: 'Smoothie de frutas', description: 'Frutilla, banana y mango', price: 2000, categoryId: 19, companyId: 4, imageUrl: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=400&h=300&fit=crop' },
        { id: 110, name: 'Lemon pie', description: 'Porción individual', price: 2200, categoryId: 20, companyId: 4, imageUrl: 'https://images.unsplash.com/photo-1519915212116-7cfef71f1d3e?w=400&h=300&fit=crop' },
        { id: 111, name: 'Brownie triple chocolate', description: 'Con nueces', price: 1900, categoryId: 20, companyId: 4, imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop' },
        { id: 112, name: 'Batido de chocolate', description: 'Con crema', price: 1800, categoryId: 19, companyId: 4, imageUrl: 'https://images.unsplash.com/photo-1568471173238-64e0b3ddc27e?w=400&h=300&fit=crop' },

        // Sushi Express - Más productos
        { id: 113, name: 'Rainbow Roll', description: '10 piezas - Roll mixto con pescados variados', price: 6800, categoryId: 21, companyId: 5, imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop' },
        { id: 114, name: 'Tempura Roll', description: '10 piezas - Langostino tempura con aguacate', price: 5800, categoryId: 21, companyId: 5, imageUrl: 'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=400&h=300&fit=crop' },
        { id: 115, name: 'Salmon Skin Roll', description: '10 piezas - Piel de salmón crocante', price: 4800, categoryId: 21, companyId: 5, imageUrl: 'https://images.unsplash.com/photo-1564489563601-c53cfc451e93?w=400&h=300&fit=crop' },
        { id: 116, name: 'Nigiri de anguila', description: '2 piezas con salsa teriyaki', price: 2400, categoryId: 22, companyId: 5, imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop' },
        { id: 117, name: 'Nigiri de pulpo', description: '2 piezas', price: 2100, categoryId: 22, companyId: 5, imageUrl: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=400&h=300&fit=crop' },
        { id: 118, name: 'Sashimi premium', description: 'Salmón, atún y pez mantequilla - 12 piezas', price: 6800, categoryId: 23, companyId: 5, imageUrl: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400&h=300&fit=crop' },
        { id: 119, name: 'Combo Ejecutivo', description: '25 piezas + sopa miso', price: 7800, categoryId: 24, companyId: 5, imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop' },
        { id: 120, name: 'Combo Premium', description: '50 piezas variadas + gyozas', price: 14500, categoryId: 24, companyId: 5, imageUrl: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=400&h=300&fit=crop' },
        { id: 121, name: 'Gyozas x6', description: 'Empanaditas japonesas de cerdo', price: 3200, categoryId: 24, companyId: 5, imageUrl: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&h=300&fit=crop' },
        { id: 122, name: 'Sopa miso', description: 'Con tofu y algas', price: 1500, categoryId: 25, companyId: 5, imageUrl: 'https://images.unsplash.com/photo-1562158147-f45edb65c5e0?w=400&h=300&fit=crop' },
        { id: 123, name: 'Cerveza Asahi', description: '330ml', price: 2800, categoryId: 25, companyId: 5, imageUrl: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=300&fit=crop' },
        { id: 124, name: 'Ramune', description: 'Gaseosa japonesa', price: 1800, categoryId: 25, companyId: 5, imageUrl: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=300&fit=crop' }
      ];
      localStorage.setItem(this.storageKey, JSON.stringify(seed));
    }
  }

  // LocalStorage (modo offline)
  private read(): Producto[] { return JSON.parse(localStorage.getItem(this.storageKey) || '[]'); }
  private write(items: Producto[]) { localStorage.setItem(this.storageKey, JSON.stringify(items)); }
  private nextId(): number { const items = this.read(); return items.length ? Math.max(...items.map(i => i.id)) + 1 : 1; }

  getAll(): Producto[] { return this.read(); }
  getById(id: number): Producto | undefined { return this.read().find(p => p.id === id); }
  getByCompany(companyId: number): Producto[] { return this.read().filter(p => p.companyId === companyId); }
  getByCategory(categoryId: number): Producto[] { return this.read().filter(p => p.categoryId === categoryId); }
  create(data: Omit<Producto, 'id'>): Producto { const items = this.read(); const it: Producto = { id: this.nextId(), ...data }; items.push(it); this.write(items); return it; }
  update(item: Producto): boolean { const items = this.read(); const idx = items.findIndex(i => i.id === item.id); if (idx === -1) return false; items[idx] = item; this.write(items); return true; }
  delete(id: number): boolean { const items = this.read(); const idx = items.findIndex(i => i.id === id); if (idx === -1) return false; items.splice(idx, 1); this.write(items); return true; }

  // HTTP (preparado para backend)
  getAll$(): Observable<Producto[]> { return this.http.get<Producto[]>(this.apiBase); }
  getById$(id: number): Observable<Producto> { return this.http.get<Producto>(`${this.apiBase}/${id}`); }
  create$(data: Omit<Producto, 'id'>): Observable<Producto> { return this.http.post<Producto>(this.apiBase, data); }
  update$(id: number, data: Omit<Producto, 'id'>): Observable<Producto> { return this.http.put<Producto>(`${this.apiBase}/${id}`, data); }
  delete$(id: number): Observable<void> { return this.http.delete<void>(`${this.apiBase}/${id}`); }
}

