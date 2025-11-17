import { Routes } from '@angular/router';

export const routes: Routes = [
	{ path: '', redirectTo: 'empresas', pathMatch: 'full' },
	{ path: 'empresas', loadComponent: () => import('./components/empresas/empresas').then(m => m.Empresas) },
	{ path: 'categorias', loadComponent: () => import('./components/categorias/categorias').then(m => m.Categorias) },
	{ path: 'productos', loadComponent: () => import('./components/productos/productos').then(m => m.Productos) },
	{ path: 'menu/:companyId', loadComponent: () => import('./components/menu-publico/menu-publico').then(m => m.MenuPublicoComponent) },
	// legacy route kept as alias
	{ path: 'menu/:empresaId', loadComponent: () => import('./components/menu-publico/menu-publico').then(m => m.MenuPublicoComponent) },
	{ path: 'carrito', loadComponent: () => import('./components/carrito/carrito').then(m => m.CarritoComponent) },
];
