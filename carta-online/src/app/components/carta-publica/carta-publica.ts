import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriaService } from '../../services/categoria.service';
import { ProductoService } from '../../services/producto.service';
import { EmpresaService } from '../../services/empresa.service';
import { CarritoService } from '../../services/carrito.service';
import { Empresa } from '../../models/empresa.model';

@Component({
  selector: 'app-carta-publica',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatToolbarModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatTooltipModule,
    MatSnackBarModule,
  ],
  templateUrl: './carta-publica.html',
  styleUrls: ['./carta-publica.css'],
})
export class CartaPublica implements OnInit {
  empresaId: number | null = null;
  empresa?: Empresa;
  categorias: any[] = [];
  cargando = true;
  cantidadCarrito = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoriaService: CategoriaService,
    private productoService: ProductoService,
    private empresaService: EmpresaService,
    private carritoService: CarritoService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Suscribirse a cambios del carrito
    this.carritoService.carrito$.subscribe(() => {
      this.cantidadCarrito = this.carritoService.obtenerCantidadItems();
    });
    this.cantidadCarrito = this.carritoService.obtenerCantidadItems();

    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('empresaId'));
      this.empresaId = id;
      if (this.empresaId) {
        this.loadCarta();
      } else {
        this.cargando = false;
      }
    });
  }

  loadCarta() {
    this.cargando = true;
    if (!this.empresaId) return;

    const emp = this.empresaService.getById(this.empresaId);
    if (!emp) {
      this.cargando = false;
      return;
    }

    this.empresa = emp;
    const cats = this.categoriaService.getByCompany(this.empresaId);
    this.categorias = cats
      .map(c => ({
        ...c,
        productos: this.productoService
          .getByCategory(c.id)
          .filter(p => p.companyId === this.empresaId),
      }))
      .filter(c => c.productos.length > 0);

    this.cargando = false;
  }

  agregarAlCarrito(producto: any): void {
    this.carritoService.agregarAlCarrito(
      producto.id,
      producto.name,
      producto.price,
      this.empresaId!,
      1
    );
    this.snackBar.open(`${producto.name} agregado al carrito`, 'Cerrar', {
      duration: 3000,
    });
  }

  irAlCarrito(): void {
    this.router.navigate(['/carrito']);
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
