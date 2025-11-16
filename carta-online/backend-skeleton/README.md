# CartaOnline Backend Skeleton - .NET 9 + Entity Framework

API REST completa para gestionar Empresas, Categorías, Productos y Pagos con auditoría integrada.

## Requerimientos previos

- **.NET 9 SDK**: [Descargar](https://dotnet.microsoft.com/en-us/download/dotnet/9.0)
- **SQL Server LocalDB** (incluido con Visual Studio) o SQL Server instalado
- **PowerShell** o terminal compatible

## Instalación y configuración rápida

### 1. Restaurar paquetes

```powershell
cd backend-skeleton
dotnet restore
```

### 2. Crear migración inicial

```powershell
dotnet ef migrations add Initial
```

### 3. Aplicar migración a la BD

```powershell
dotnet ef database update
```

Si todo funciona, deberías ver un mensaje: "Done. To undo this action, use 'ef migrations remove'."

### 4. Compilar

```powershell
dotnet build
```

### 5. Ejecutar el servidor

```powershell
dotnet run
```

Verás:
```
Iniciando servidor en http://localhost:5230 (HTTPS: https://localhost:7230)
✓ Base de datos migrada correctamente.
```

El servidor está listo en **http://localhost:5230**.

## Documentación de APIs (Swagger)

Mientras el servidor esté activo, abrí:

```
http://localhost:5230/swagger/index.html
```

Desde Swagger puedes:
- Ver todos los endpoints disponibles
- Probar peticiones directamente en el navegador
- Ver esquemas de request/response

## Endpoints disponibles

### Empresas (Companies)
- `GET /api/companies` - Listar todas
- `GET /api/companies/{id}` - Obtener por ID
- `POST /api/companies` - Crear nueva
- `PUT /api/companies/{id}` - Actualizar
- `DELETE /api/companies/{id}` - Eliminar

### Categorías (Categories)
- `GET /api/categories` - Listar todas
- `GET /api/categories/{id}` - Obtener por ID
- `POST /api/categories` - Crear nueva
- `PUT /api/categories/{id}` - Actualizar
- `DELETE /api/categories/{id}` - Eliminar

### Productos (Products)
- `GET /api/products` - Listar todos
- `GET /api/products/{id}` - Obtener por ID
- `POST /api/products` - Crear nuevo
- `PUT /api/products/{id}` - Actualizar
- `DELETE /api/products/{id}` - Eliminar

### Pagos (Payments)
- `GET /api/payments` - Listar todos
- `GET /api/payments/{id}` - Obtener por ID
- `POST /api/payments` - Crear nuevo
- `DELETE /api/payments/{id}` - Eliminar

### Auditoría (Audit)
- `GET /api/audit` - Listar registros de auditoría (ordenados por fecha desc)

### Health Check
- `GET /health` - Estado del servidor

## Ejemplo de petición (cURL)

### Crear un pago

```bash
curl -X POST http://localhost:5230/api/payments \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Juan Pérez",
    "item": "Pedido #123",
    "amount": 2500.50,
    "status": "Pending"
  }'
```

### Listar pagos

```bash
curl http://localhost:5230/api/payments
```

### Listar auditoría

```bash
curl http://localhost:5230/api/audit
```

## Integrarse con el frontend

El frontend (en `../frontend/`) está configurado para enviar peticiones a `http://localhost:5230/api/payments`.

Si ejecutás el backend aquí, solo necesitás servir el frontend y todo debería funcionar sin cambios.

Alternativa rápida: servir frontend con Python

```powershell
cd ../frontend
python -m http.server 8080
# abrir http://localhost:8080 en el navegador
```

## Cambiar la connection string

Si querés usar SQL Server remoto o modificar la BD:

1. Abrí `appsettings.json`
2. Actualiza `DefaultConnection`:
   - LocalDB: `Server=(localdb)\\mssqllocaldb;Database=CartaOnlineDB;Trusted_Connection=True;`
   - SQL Server remoto: `Server=tu_servidor;Database=CartaOnlineDB;User Id=usuario;Password=contraseña;`
3. Ejecutá `dotnet ef database update` nuevamente

## Troubleshooting

### Error: "No se encuentra .NET 9"
```powershell
dotnet --version
# Descargá .NET 9 de https://dotnet.microsoft.com/en-us/download/dotnet/9.0
```

### Error: "LocalDB no disponible"
Instalá SQL Server Express o LocalDB desde:
https://www.microsoft.com/es-es/sql-server/sql-server-downloads

O usa una connection string remota.

### Error: "Migración no encontrada"
```powershell
dotnet ef migrations list
# Limpia y crea de nuevo:
dotnet ef migrations remove
dotnet ef migrations add Initial
dotnet ef database update
```

### Puerto 5230 ya está en uso
Modificá el puerto en `launchSettings.json` o usa:
```powershell
dotnet run --urls "http://localhost:5231"
```

## Notas de desarrollo

- **CORS habilitado**: El backend acepta peticiones desde cualquier origen (cambiar si es necesario en `Program.cs`).
- **Auto-migración**: El servidor aplica migraciones automáticamente al iniciar.
- **Swagger**: Disponible solo en Development (por defecto).
- **Auditoría**: Los controladores de Pagos registran acciones automáticamente en `AuditLogs`.

## Próximos pasos

- [ ] Agregar autenticación (JWT)
- [ ] Implementar validaciones avanzadas
- [ ] Agregar filtros y paginación
- [ ] Conectar con frontend completo (Angular)
- [ ] Desplegar a Azure/AWS/Heroku

---

**¿Dudas?** Consultá la documentación oficial:
- [Microsoft Docs - ASP.NET Core](https://docs.microsoft.com/en-us/aspnet/core/)
- [Entity Framework Core](https://docs.microsoft.com/en-us/ef/core/)
