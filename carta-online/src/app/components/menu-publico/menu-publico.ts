import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { EmpresaService } from '../../services/empresa.service';
import { CategoriaService } from '../../services/categoria.service';
import { ProductoService } from '../../services/producto.service';
import { CarritoService } from '../../services/carrito.service';
import { Empresa } from '../../models/empresa.model';
import { Categoria } from '../../models/categoria.model';
import { Producto } from '../../models/producto.model';
import { fadeIn, cardAnimation, listAnimation, scaleIn } from '../../shared/animations';

@Component({
  selector: 'app-menu-publico',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatInputModule,
    MatFormFieldModule,
    MatGridListModule,
    MatSelectModule,
    MatBadgeModule,
    MatSnackBarModule,
  ],
  templateUrl: './menu-publico.html',
  styleUrls: ['./menu-publico.css'],
  animations: [fadeIn, cardAnimation, listAnimation, scaleIn]
})
export class MenuPublicoComponent implements OnInit {
  companyId: number | null = null;
  empresa?: Empresa;
  categorias: Categoria[] = [];
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  agrupadoPorCategoria: { [key: string]: Producto[] } = {};

  search = '';
  selectedCategoriaId: number | null = null;
  sortOrder: 'asc' | 'desc' | '' = '';

  cargando = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private empresaService: EmpresaService,
    private categoriaService: CategoriaService,
    private productoService: ProductoService,
    private carritoService: CarritoService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const raw = params.get('companyId') || params.get('empresaId');
      const id = raw ? Number(raw) : NaN;
      if (!id || Number.isNaN(id)) {
        this.cargando = false;
        this.empresa = undefined;
        return;
      }
      this.companyId = id;
      this.loadData();
    });

    // Suscribirse a cambios del carrito para mostrar badge si se desea
    this.carritoService.carrito$.subscribe(() => {});
  }

  private loadData(): void {
    if (!this.companyId) return;
    this.cargando = true;

    try {
      const emp = this.empresaService.getById(this.companyId);
      if (!emp) {
        this.empresa = undefined;
        this.categorias = [];
        this.productos = [];
        this.productosFiltrados = [];
        this.agrupadoPorCategoria = {};
        this.cargando = false;
        return;
      }
      this.empresa = emp;

      this.categorias = this.categoriaService.getByCompany(this.companyId) || [];
      this.productos = this.productoService.getByCompany(this.companyId) || [];

      // Si no hay productos, inicializar datos de ejemplo ligeros
      if (this.productos.length === 0) {
        // crear demo ligero (no sobrescribe si existen productos)
        this.initDemoData();
        this.productos = this.productoService.getByCompany(this.companyId) || [];
      }

      this.applyFilters();
    } catch (err) {
      console.error(err);
      this.snackBar.open('Error al cargar la carta', 'Cerrar', { duration: 3000 });
    } finally {
      this.cargando = false;
    }
  }

  private initDemoData(): void {
    if (!this.companyId) return;
    // sólo si no hay categorías o productos para esta compañía
    const cats = this.categoriaService.getByCompany(this.companyId);
    if (!cats || cats.length === 0) {
      this.categoriaService.create({ name: 'Entradas', companyId: this.companyId });
      this.categoriaService.create({ name: 'Platos', companyId: this.companyId });
      this.categorias = this.categoriaService.getByCompany(this.companyId);
    }

    const prods = this.productoService.getByCompany(this.companyId);
    if (!prods || prods.length === 0) {
      const c = this.categorias[0];
      const c2 = this.categorias[1] || c;
      this.productoService.create({ name: 'Producto A', description: 'Descripción A', price: 1200, categoryId: c.id, companyId: this.companyId, imageUrl: '' });
      this.productoService.create({ name: 'Producto B', description: 'Descripción B', price: 900, categoryId: c.id, companyId: this.companyId, imageUrl: '' });
      this.productoService.create({ name: 'Producto C', description: 'Descripción C', price: 1500, categoryId: c2.id, companyId: this.companyId, imageUrl: '' });
    }
  }

  applyFilters(): void {
    const q = this.search.trim().toLowerCase();
    let items = [...this.productos];

    if (this.selectedCategoriaId) {
      items = items.filter(p => p.categoryId === this.selectedCategoriaId);
    }

    if (q) {
      items = items.filter(p => p.name.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q));
    }

    if (this.sortOrder === 'asc') items.sort((a,b) => a.price - b.price);
    else if (this.sortOrder === 'desc') items.sort((a,b) => b.price - a.price);

    this.productosFiltrados = items;
    this.groupByCategory();
  }

  private groupByCategory(): void {
    this.agrupadoPorCategoria = {};
    for (const cat of this.categorias) {
      const arr = this.productosFiltrados.filter(p => p.categoryId === cat.id);
      if (arr.length > 0) this.agrupadoPorCategoria[cat.name] = arr;
    }
  }

  agregarAlCarrito(producto: Producto): void {
    if (!this.companyId) return;
    this.carritoService.agregarAlCarrito(producto.id, producto.name, producto.price, this.companyId, 1);
    this.snackBar.open(`${producto.name} agregado al carrito`, 'Cerrar', { duration: 2000 });
  }

  limpiarFiltros(): void {
    this.search = '';
    this.selectedCategoriaId = null;
    this.sortOrder = '';
    this.applyFilters();
  }

  volver(): void {
    this.router.navigate(['/empresas']);
  }

  volverInicio(): void {
    this.router.navigate(['/']);
  }
}
