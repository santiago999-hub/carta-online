# 🍕 Carta Online - Sistema Multiempresa de Menú Digital

Un proyecto Angular completo para gestionar y publicar cartas (menús) digitales de locales gastronómicos. Incluye panel administrativo para cada empresa y vistas públicas del menú.

---

## 🎯 Características principales

- **Gestión de Empresas**: CRUD completo (crear, listar, editar, eliminar) de locales gastronómicos.
- **Gestión de Categorías**: Organiza productos por categoría (Pizzas, Bebidas, etc.) asociadas a cada empresa.
- **Gestión de Productos**: CRUD de productos con precio, descripción, imagen y categoría.
- **Carta Pública**: Vista accesible por URL (`/menu/:empresaId`) para mostrar la carta digital de cada empresa.
- **Búsqueda y Filtrado**: Filtra empresas, categorías y productos por nombre.
- **Validación de Formularios**: Campos requeridos y validación de email.
- **LocalStorage**: Todos los datos se persisten en el navegador sin backend ni base de datos.
- **Diseño Responsivo**: Interfaz moderna con Angular Material.

---

## 📋 Requisitos previos

- **Node.js** (v18 o superior): [Descargar](https://nodejs.org/)
- **npm** (incluido con Node.js)
- **Angular CLI** (instalado globalmente)

Verificar instalaciones:
```powershell
node --version
npm --version
ng version
```

---

## 🚀 Instalación y configuración

### 1. Navegar al directorio del proyecto
```powershell
cd "C:\Users\Santy\OneDrive\Desktop\tp nuevo prog\carta-online"
```

### 2. Instalar dependencias
```powershell
npm install
```

### 3. Levantar el servidor de desarrollo
```powershell
ng serve
```

O:
```powershell
npm start
```

El navegador se abrirá automáticamente en:
```
http://localhost:4200/
```

---

## 🗺️ Rutas disponibles

| Ruta | Descripción |
|------|-------------|
| `/` | Redirige a `/empresas` |
| `/empresas` | Panel de gestión de empresas (CRUD) |
| `/categorias` | Panel de gestión de categorías (CRUD) |
| `/productos` | Panel de gestión de productos (CRUD) |
| `/menu/:empresaId` | Vista pública de la carta (menú) de una empresa |

### Ejemplo de uso de rutas públicas
- Empresa con ID 1: `http://localhost:4200/menu/1`
- Empresa con ID 2: `http://localhost:4200/menu/2`

---

## 📱 Cómo usar la aplicación

### 1. **Crear una empresa**
   - Navega a **Empresas**
   - Haz clic en **Nueva empresa**
   - Completa los campos: Nombre, Dirección, Teléfono, Email (y opcionalmente URL del logo)
   - Haz clic en **Guardar**

### 2. **Crear categorías**
   - Navega a **Categorías**
   - Selecciona la empresa en el selector
   - Haz clic en **Nueva categoría**
   - Ingresa el nombre y elige la empresa
   - Haz clic en **Guardar**

### 3. **Crear productos**
   - Navega a **Productos**
   - Selecciona la empresa en el selector
   - Haz clic en **Nuevo producto**
   - Completa: Nombre, Descripción, Precio, Empresa, Categoría, e imagen (opcional)
   - Haz clic en **Guardar**

### 4. **Ver carta pública**
   - En la **toolbar superior**, selecciona una empresa en el dropdown
   - Haz clic en **Ver carta**
   - Se abrirá la vista pública (`/menu/:empresaId`) mostrando categorías y productos

### 5. **Buscar y filtrar**
   - Utiliza los campos de búsqueda en cada sección para filtrar por nombre
   - En tablas, selecciona una empresa para ver solo sus datos

---

## 💾 Datos de demostración

Al ejecutar el proyecto por primera vez, se crean datos de semilla automáticamente:

**Empresa demo:**
- ID: 1
- Nombre: "Demo Resto"
- Dirección: "Calle Falsa 123"
- Teléfono: "12345678"
- Email: "demo@resto.com"

**Categorías demo:**
- "Pizzas" (para Demo Resto)
- "Bebidas" (para Demo Resto)

**Productos demo:**
- "Muzzarella" → Categoría: Pizzas → Precio: $850
- "Coca-Cola 1.5L" → Categoría: Bebidas → Precio: $300

Puedes editar, eliminar o agregar nuevos datos en cualquier momento.

---

## 🗄️ Almacenamiento de datos (LocalStorage)

Los datos se guardan automáticamente en el **LocalStorage** del navegador bajo estas claves:

| Clave | Contenido |
|-------|-----------|
| `empresas` | Array de empresas |
| `categorias` | Array de categorías |
| `productos` | Array de productos |

### Limpiar datos (reiniciar LocalStorage)

Abre la consola del navegador (F12 → Consola) y ejecuta:
```javascript
// Eliminar todas las claves
localStorage.removeItem('empresas');
localStorage.removeItem('categorias');
localStorage.removeItem('productos');

// O limpiar todo
localStorage.clear();

// Luego recarga la página (F5 o Ctrl+R)
```

---

## 📂 Estructura del proyecto

```
src/app/
├── models/                    # Interfaces de datos
│   ├── empresa.model.ts
│   ├── categoria.model.ts
│   └── producto.model.ts
│
├── services/                  # Servicios de gestión (LocalStorage)
│   ├── empresa.service.ts
│   ├── categoria.service.ts
│   └── producto.service.ts
│
├── components/                # Componentes (standalone)
│   ├── empresas/              # CRUD de empresas
│   │   ├── empresas.ts
│   │   ├── empresas.html
│   │   ├── empresa-dialog.ts
│   │   └── empresa-dialog.html
│   │
│   ├── categorias/            # CRUD de categorías
│   │   ├── categorias.ts
│   │   ├── categoria-dialog.ts
│   │   └── ...
│   │
│   ├── productos/             # CRUD de productos
│   │   ├── productos.ts
│   │   ├── producto-dialog.ts
│   │   └── ...
│   │
│   └── carta-publica/         # Vista pública del menú
│       ├── carta-publica.ts
│       └── carta-publica.html
│
├── app.routes.ts              # Configuración de rutas
├── app.config.ts              # Configuración de providers (BrowserAnimations, etc.)
├── app.ts                     # Componente raíz
└── app.html                   # Template raíz (toolbar de navegación)
```

---

## 🛠️ Comandos útiles

```powershell
# Iniciar servidor de desarrollo
ng serve

# Construir para producción
ng build --configuration production

# Ejecutar tests
ng test

# Generar un nuevo componente (si necesitas)
ng generate component components/mi-componente

# Generar un nuevo servicio (si necesitas)
ng generate service services/mi-servicio

# Linter
ng lint
```

---

## 🎨 Dependencias principales

- **Angular 20+**: Framework principal
- **Angular Material 20+**: Componentes UI (tablas, diálogos, toolbars, etc.)
- **Angular Reactive Forms**: Validación de formularios
- **RxJS**: Reactive programming

Ver `package.json` para la lista completa.

---

## 🐛 Solución de problemas

### Error: "No se puede compilar la aplicación"
1. Asegurate de tener Node.js actualizado: `node --version` (mínimo v18)
2. Limpia la caché: `npm cache clean --force`
3. Elimina `node_modules` y reinstala: `rm -r node_modules && npm install`

### Error: "Puerto 4200 ya está en uso"
```powershell
# Usa otro puerto
ng serve --port 4201
```

### Los datos no se guardan
- Verifica que el navegador **no esté en modo privado/incógnito** (LocalStorage no funciona en ese modo)
- Abre DevTools (F12) → Aplicación → Almacenamiento local para inspeccionar datos

### El diálogo no abre
- Verifica que `MatDialog` esté importado correctamente en el componente
- Asegurate de que `BrowserAnimationsModule` esté habilitado en `app.config.ts`

---

## 📝 Notas de desarrollo

- **Sin backend**: Este proyecto usa LocalStorage, así que todos los datos son locales del navegador. Para producción, integra un backend (Node.js, .NET, etc.) con una base de datos real.
- **Componentes standalone**: Todos los componentes usan la arquitectura standalone de Angular 14+ (sin módulos).
- **Validación de formularios**: Se validan campos requeridos y email. Puedes extender validadores según necesites.

---

## 🚀 Próximos pasos (mejoras futuras)

- [ ] Integrar un backend real (API REST)
- [ ] Autenticación de usuarios (login de dueños)
- [ ] Carga de imágenes (en lugar de URLs)
- [ ] Carrito de compras (para clientes)
- [ ] Sistema de pedidos
- [ ] Calificaciones y comentarios
- [ ] Integración con pasarelas de pago
- [ ] PWA (Progressive Web App) para acceso offline
- [ ] Exportar menú a PDF

---

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo licencia MIT.

---

## 👨‍💻 Autor

Desarrollado como proyecto universitario de Programación Web.

---

## 📞 Contacto y soporte

Si encontrás errores o tienes sugerencias, reportalas en la sección de Issues del repositorio o contacta al equipo de desarrollo.

---

**¡Disfrutá la app! 🎉**
