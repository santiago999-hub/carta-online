# 🔄 Guía Rápida: Cambiar entre LocalStorage y Backend API

## Estado Actual: LocalStorage ✅
Por defecto, la aplicación usa **LocalStorage** para almacenar datos en el navegador.

---

## 🚀 Activar Backend API

### Paso 1: Iniciar el Backend

**Terminal 1 - Backend ASP.NET:**
```bash
cd backend-skeleton
dotnet run
```

✅ Verás: `Iniciando servidor en http://localhost:5230`

### Paso 2: Configurar Frontend

**Editar:** `src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5230/api',
  useBackend: true  // ⬅️ Cambiar a true
};
```

### Paso 3: Reiniciar Frontend

**Terminal 2 - Angular:**
```bash
# Si está corriendo, detener con Ctrl+C
ng serve
```

---

## 🔙 Volver a LocalStorage

### Paso 1: Configurar Frontend

**Editar:** `src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5230/api',
  useBackend: false  // ⬅️ Cambiar a false
};
```

### Paso 2: Reiniciar Frontend

```bash
ng serve
```

Listo! Ahora usa LocalStorage nuevamente.

---

## ⚡ Diferencias

| Característica | LocalStorage | Backend API |
|----------------|-------------|-------------|
| **Persistencia** | Solo en navegador | Base de datos SQL Server |
| **Compartir datos** | ❌ Solo tu navegador | ✅ Todos los usuarios |
| **Requiere backend** | ❌ No | ✅ Sí (dotnet run) |
| **Datos de ejemplo** | ✅ 5 empresas, 72 productos | Tabla vacía (usar script SQL) |
| **Velocidad** | ⚡ Muy rápida | 🚀 Rápida (red local) |

---

## 🗄️ Cargar Datos de Ejemplo en Backend

Si activas el backend y quieres los datos de ejemplo:

```bash
# Opción 1: Ejecutar script SQL
# Abre SQL Server Management Studio
# Ejecuta: sql/CartaOnlineDB_Complete.sql

# Opción 2: Copiar desde LocalStorage
# 1. Con useBackend=false, abre la app
# 2. Menu -> Utilidades -> Exportar datos
# 3. Guarda el JSON
# 4. Cambiar useBackend=true
# 5. Menu -> Utilidades -> Importar datos (próximamente adaptado para API)
```

---

## 🐛 Verificar qué modo está activo

Abre la consola del navegador (F12) al cargar la app:

```javascript
// LocalStorage activo:
console: "Using LocalStorage"

// Backend API activo:
console: "Using Backend API: http://localhost:5230/api"
```

---

## ✅ Checklist de Verificación

### LocalStorage Mode:
- [ ] `environment.ts` → `useBackend: false`
- [ ] Frontend corriendo (`ng serve`)
- [ ] Datos visibles inmediatamente

### Backend API Mode:
- [ ] `environment.ts` → `useBackend: true`
- [ ] Backend corriendo (`dotnet run` en backend-skeleton/)
- [ ] Backend en http://localhost:5230
- [ ] Frontend corriendo (`ng serve`)
- [ ] Ver Swagger en http://localhost:5230/swagger
- [ ] Base de datos creada con datos

---

## 🎯 Recomendación para el Profesor

**Para demostración:**
1. Mostrar la app con **LocalStorage** (funciona sin configuración)
2. Luego cambiar a **Backend API** y mostrar:
   - Swagger UI (documentación automática)
   - SQL Server con datos persistentes
   - Múltiples usuarios accediendo a los mismos datos

---

¿Dudas? Revisa `backend-skeleton/README_BACKEND.md` para más detalles.
