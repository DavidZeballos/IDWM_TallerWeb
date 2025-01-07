# IDWM Store - Proyecto de Gestión de Usuarios y Productos

Este proyecto es una tienda online donde los usuarios pueden ver productos, agregarlos al carrito y proceder al checkout. Los administradores tienen permisos adicionales para gestionar productos y usuarios. El proyecto está diseñado usando Angular y utiliza un backend API en .NET.

## Requerimientos

1. **Node.js** (preferiblemente la versión LTS).
2. **Angular CLI** (instalado globalmente).
3. **Backend API en .NET Core** con rutas y funcionalidades definidas:
```bash
https://github.com/DavidZeballos/IDWM_Taller1
```

## Instalación

### 1. Clonar el repositorio:

```bash
git clone https://github.com/DavidZeballos/IDWM_TallerWeb
```

### 2. Instalación de dependencias:

Instala las dependencias de Angular usando npm:

```bash
npm install
```

### 3. Ejecutar la aplicación:

Inicia la aplicación de desarrollo:

```bash
ng serve
```

### 4. Configuración del Backend:

Asegúrate de tener el backend en .NET Core configurado y ejecutándose en `http://localhost:5230`. Este backend maneja la autenticación, gestión de productos y usuarios, y el carrito de compras.

## Estructura del Proyecto

- `src/app/`: Contiene todos los componentes y servicios de la aplicación.
- `src/assets/`: Carpeta para archivos estáticos como imágenes.
- `src/environments/`: Configuración de entornos (desarrollo y producción).
- `src/core/`: Servicios y utilidades globales (autenticación, almacenamiento local, etc.).
- `src/features/`: Funcionalidades específicas (productos, usuarios, carrito).
- `src/styles/`: Archivos de estilos globales.

## Funcionalidades

### 1. **Autenticación**

- **Login**: Los usuarios pueden iniciar sesión usando su correo y contraseña. El backend genera un token JWT para autenticación.
- **Registro**: Los nuevos usuarios pueden registrarse con un nombre, correo, contraseña, etc.
- **Cerrar sesión**: El token JWT se elimina y el usuario es redirigido al login.

### 2. **Productos**

- Los productos se muestran en una lista, y los usuarios pueden filtrarlos o ordenarlos.
- Los usuarios pueden agregar productos al carrito.

### 3. **Carrito**

- Los usuarios pueden agregar productos al carrito y realizar un checkout.
- Los productos en el carrito se mantienen en `localStorage`.

### 4. **Gestión de Usuarios (Admin)**

- Los administradores pueden ver, editar y eliminar usuarios.
- Los administradores pueden activar/desactivar el estado de los usuarios.
- La vista de gestión de usuarios y productos está protegida por un guardia de administrador.

### 5. **Gestión de Productos (Admin)**

- Los administradores pueden añadir, editar y eliminar productos.
- Pueden gestionar el inventario de productos, incluyendo la cantidad disponible.

## Paginación

Se implementa la paginación en la lista de productos y usuarios para mejorar la navegación y la carga eficiente de datos.

## Notas

- **Autenticación**: El backend maneja la creación, inicio de sesión y autorización de usuarios. Los tokens JWT se deben incluir en los encabezados de las solicitudes.
- **Estado del carrito**: El carrito se guarda en `localStorage` y se actualiza cada vez que se añaden o eliminan productos.
- **Responsive**: El diseño está adaptado para dispositivos móviles, tabletas y escritorios.
