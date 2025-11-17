# 📦 Guía de Instalación - Carta Online

## Requisitos Previos

### Software Necesario
- **Node.js** v18 o superior → [Descargar](https://nodejs.org/)
- **Angular CLI** v20 → Se instalará globalmente
- **Git** → [Descargar](https://git-scm.com/)
- **Editor de código:** Visual Studio Code (recomendado)

### Opcional para Backend
- **.NET SDK 9.0** → [Descargar](https://dotnet.microsoft.com/download)
- **SQL Server Express** → [Descargar](https://www.microsoft.com/sql-server/sql-server-downloads)

---

## 🚀 Instalación Paso a Paso

### 1. Clonar el Repositorio

```bash
git clone https://github.com/santiago999-hub/carta-online.git
cd carta-online
```

### 2. Instalar Angular CLI Globalmente

```bash
npm install -g @angular/cli@20
```

### 3. Instalar Dependencias del Frontend

```bash
npm install
```

**Nota:** Si aparecen advertencias de dependencias, es normal. Angular 20 las resuelve automáticamente.

### 4. Configurar Variables de Entorno (Opcional)

El proyecto usa **LocalStorage** por defecto, no requiere configuración adicional.

Para usar el backend ASP.NET Core:
1. Navegar a `backend-skeleton/`
2. Editar `appsettings.json` con tu cadena de conexión SQL Server
3. Ejecutar migraciones con Entity Framework

---

## ▶️ Ejecutar la Aplicación

### Modo Desarrollo (Frontend)

```bash
ng serve
```

La aplicación estará disponible en: **http://localhost:4200**

### Modo Desarrollo con Puerto Personalizado

```bash
ng serve --port 4300
```

### Compilar para Producción

```bash
ng build --configuration production
```

Los archivos compilados estarán en: `dist/carta-online/`

---

## 🗄️ Configurar Base de Datos (Opcional)

### Opción 1: Usar LocalStorage (Por Defecto)
✅ **Ya configurado** - La aplicación usa datos de prueba en el navegador.

### Opción 2: Usar SQL Server

#### Paso 1: Crear la Base de Datos
```sql
-- Ejecutar el script en SQL Server Management Studio
-- Ubicación: sql/CartaOnlineDB_Complete.sql
```

#### Paso 2: Configurar Backend
```bash
cd backend-skeleton
dotnet restore
dotnet ef database update
dotnet run
```

El backend estará en: **http://localhost:5000**

#### Paso 3: Conectar Frontend con Backend
Editar `src/app/services/*.service.ts` y cambiar:
```typescript
// De:
private apiUrl = 'localStorage';

// A:
private apiUrl = 'http://localhost:5000/api';
```

---

## 🧪 Ejecutar Tests

```bash
# Tests unitarios
ng test

# Tests con cobertura
ng test --code-coverage

# Tests end-to-end
ng e2e
```

---

## 📱 Probar en Dispositivos Móviles

### Método 1: Navegador con DevTools
1. Abrir Chrome DevTools (F12)
2. Click en el ícono de dispositivos móviles
3. Seleccionar dispositivo (iPhone, Samsung, etc.)

### Método 2: Red Local
1. Obtener tu IP local:
   ```bash
   ipconfig  # Windows
   ifconfig  # Linux/Mac
   ```
2. Ejecutar con host:
   ```bash
   ng serve --host 0.0.0.0
   ```
3. Acceder desde móvil: `http://TU_IP:4200`

---

## 🎨 Personalización

### Cambiar Tema de Colores
Editar: `src/custom-theme.scss`

### Modificar Logo
Reemplazar: `src/favicon.ico`

### Ajustar Datos de Prueba
Editar: `src/app/services/producto.service.ts`

---

## 🐛 Solución de Problemas

### Error: "Port 4200 is already in use"
**Solución:**
```bash
# Matar proceso en el puerto
netstat -ano | findstr :4200
taskkill /PID <PID> /F

# O usar otro puerto
ng serve --port 4300
```

### Error: "Module not found"
**Solución:**
```bash
# Limpiar caché e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Error: "Cannot find module @angular/material"
**Solución:**
```bash
npm install @angular/material@20 @angular/cdk@20
```

### Problemas con TypeScript
**Solución:**
```bash
npm install typescript@5.6 --save-dev
```

---

## 📂 Estructura del Proyecto

```
carta-online/
├── src/
│   ├── app/
│   │   ├── components/      # Componentes (Empresas, Categorías, Productos)
│   │   ├── services/        # Servicios con datos
│   │   ├── models/          # Interfaces TypeScript
│   │   └── shared/          # Animaciones y utilidades
│   ├── assets/              # Recursos estáticos
│   └── styles.css           # Estilos globales
├── backend-skeleton/        # API ASP.NET Core (opcional)
├── sql/                     # Scripts SQL
└── public/                  # Archivos públicos
```

---

## 🎯 Datos de Prueba Incluidos

El sistema incluye automáticamente:
- ✅ **5 Empresas** (Don Pepito, Café Bonafide, Sushi Master, McBurger, Pizzería Nápoles)
- ✅ **25 Categorías** distribuidas por empresa
- ✅ **72 Productos** con imágenes de Unsplash

Para **reiniciar** los datos de prueba:
1. Abrir la aplicación
2. Click en el menú "⋮" (Utilidades)
3. Seleccionar "Reiniciar datos de prueba"

---

## 🔄 Actualizar el Proyecto

```bash
# Descargar últimos cambios
git pull origin master

# Reinstalar dependencias si hubo cambios
npm install

# Reiniciar servidor
ng serve
```

---

## 📞 Soporte

**Repositorio:** https://github.com/santiago999-hub/carta-online  
**Issues:** https://github.com/santiago999-hub/carta-online/issues  
**Documentación completa:** Ver `TP_ENTREGA_README.md`

---

## 📄 Licencia

Este proyecto fue desarrollado como Trabajo Práctico para la materia **Algoritmos y Estructuras de Datos II** - Tecnicatura Superior en Análisis de Sistemas.

---

¡Listo para usar! 🚀 Si tienes problemas, consulta la sección de **Solución de Problemas** o abre un issue en GitHub.
