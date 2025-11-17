# 🚀 Backend - Carta Online API

## Requisitos Previos

- **.NET SDK 9.0** → [Descargar](https://dotnet.microsoft.com/download/dotnet/9.0)
- **SQL Server Express** o **LocalDB** (incluido con Visual Studio)
- **Entity Framework Core Tools**

### Verificar instalación:
```bash
dotnet --version
# Debe mostrar 9.0 o superior
```

---

## 🔧 Configuración Inicial

### 1. Instalar herramientas de EF Core (si no las tienes)
```bash
dotnet tool install --global dotnet-ef
```

### 2. Restaurar dependencias
```bash
cd backend-skeleton
dotnet restore
```

### 3. Configurar Cadena de Conexión

Editar `appsettings.json`:

**Opción A: LocalDB (por defecto)**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=CartaOnlineDB;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

**Opción B: SQL Server Express**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=CartaOnlineDB;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

**Opción C: SQL Server con usuario/contraseña**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=CartaOnlineDB;User Id=sa;Password=TuPassword;TrustServerCertificate=True;"
  }
}
```

---

## 🗄️ Crear Base de Datos

### Opción 1: Usar Migraciones de EF Core (Automático)

El backend está configurado para crear la BD automáticamente al iniciar. Solo ejecuta:

```bash
dotnet run
```

### Opción 2: Script SQL Manual

Si prefieres crear la BD manualmente:

```bash
# Abre SQL Server Management Studio (SSMS)
# Ejecuta el script: ../sql/CartaOnlineDB_Complete.sql
```

---

## ▶️ Ejecutar el Backend

### Modo Desarrollo
```bash
cd backend-skeleton
dotnet run
```

El servidor estará disponible en:
- **HTTP:** http://localhost:5230
- **HTTPS:** https://localhost:7230

### Modo Watch (recarga automática)
```bash
dotnet watch run
```

---

## 🧪 Probar la API

### Swagger UI (Documentación Interactiva)
Una vez iniciado el backend, abre:
- **Swagger:** http://localhost:5230/swagger

### Endpoints Disponibles

#### **Companies (Empresas)**
- `GET /api/companies` - Listar todas
- `GET /api/companies/{id}` - Obtener por ID
- `POST /api/companies` - Crear nueva
- `PUT /api/companies/{id}` - Actualizar
- `DELETE /api/companies/{id}` - Eliminar

#### **Categories (Categorías)**
- `GET /api/categories` - Listar todas
- `GET /api/categories/{id}` - Obtener por ID
- `GET /api/categories/company/{companyId}` - Por empresa
- `POST /api/categories` - Crear nueva
- `PUT /api/categories/{id}` - Actualizar
- `DELETE /api/categories/{id}` - Eliminar

#### **Products (Productos)**
- `GET /api/products` - Listar todos
- `GET /api/products/{id}` - Obtener por ID
- `GET /api/products/company/{companyId}` - Por empresa
- `GET /api/products/category/{categoryId}` - Por categoría
- `POST /api/products` - Crear nuevo
- `PUT /api/products/{id}` - Actualizar
- `DELETE /api/products/{id}` - Eliminar

### Ejemplo con curl:
```bash
# Listar empresas
curl http://localhost:5230/api/companies

# Crear empresa
curl -X POST http://localhost:5230/api/companies \
  -H "Content-Type: application/json" \
  -d '{"name":"Mi Restaurante","address":"Calle 123","phone":"555-1234","email":"info@mirestaurante.com"}'
```

---

## 🔄 Conectar con Frontend Angular

### 1. Configurar environment en Angular

Archivo: `src/environments/environment.ts`
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5230/api',
  useBackend: true  // true = API, false = LocalStorage
};
```

### 2. Asegurarse que CORS esté habilitado

Ya está configurado en `Program.cs` para permitir:
- `http://localhost:4200`
- `http://localhost:50596`

### 3. Iniciar ambos servidores

**Terminal 1 - Backend:**
```bash
cd backend-skeleton
dotnet run
```

**Terminal 2 - Frontend:**
```bash
cd ..
ng serve
```

---

## 🐛 Solución de Problemas

### Error: "No se puede conectar a SQL Server"
**Solución:**
```bash
# Verificar que SQL Server esté corriendo
sqllocaldb info
sqllocaldb start mssqllocaldb
```

### Error: "Puerto 5230 en uso"
**Solución:** Edita `Properties/launchSettings.json` y cambia el puerto.

### Error de CORS en navegador
**Solución:** Verifica que el puerto del frontend esté en `Program.cs` línea 21-24.

### Error: "No se encontró el comando dotnet-ef"
**Solución:**
```bash
dotnet tool install --global dotnet-ef
```

---

## 📦 Compilar para Producción

```bash
dotnet publish -c Release -o ./publish
```

Los archivos compilados estarán en `./publish/`

---

## 🔒 Seguridad (Producción)

Antes de deployar:

1. **Cambiar cadena de conexión** en `appsettings.json`
2. **Usar secrets** para credenciales:
   ```bash
   dotnet user-secrets init
   dotnet user-secrets set "ConnectionStrings:DefaultConnection" "tu-cadena-de-conexion"
   ```
3. **Actualizar CORS** con dominios específicos (eliminar `AllowAnyOrigin`)
4. **Habilitar HTTPS** obligatorio
5. **Agregar autenticación/autorización** (JWT, Identity, etc.)

---

## 📚 Más Información

- **Entity Framework Core:** https://docs.microsoft.com/ef/core
- **ASP.NET Core:** https://docs.microsoft.com/aspnet/core
- **SQL Server:** https://docs.microsoft.com/sql

---

¡Backend listo para usar! 🎉
