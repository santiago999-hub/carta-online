import { Routes } from '@angular/router';
import { Empresas } from './components/empresas/empresas';
import { CartaPublica } from './components/carta-publica/carta-publica';
import { MenuPublicoComponent } from './components/menu-publico/menu-publico';
import { Categorias } from './components/categorias/categorias';
import { Productos } from './components/productos/productos';
import { CarritoComponent } from './components/carrito/carrito';

export const routes: Routes = [
	{ path: '', redirectTo: 'empresas', pathMatch: 'full' },
	{ path: 'empresas', component: Empresas },
	{ path: 'categorias', component: Categorias },
	{ path: 'productos', component: Productos },
	{ path: 'menu/:companyId', component: MenuPublicoComponent },
	// legacy route kept as alias
	{ path: 'menu/:empresaId', component: MenuPublicoComponent },
	{ path: 'carrito', component: CarritoComponent },
];
