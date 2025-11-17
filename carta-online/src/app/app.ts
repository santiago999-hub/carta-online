import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { EmpresaService } from './services/empresa.service';
import { CategoriaService } from './services/categoria.service';
import { ProductoService } from './services/producto.service';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CarritoService } from './services/carrito.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatToolbarModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatSelectModule, FormsModule, MatBadgeModule, MatTooltipModule, MatMenuModule, MatDividerModule, MatSnackBarModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('carta-online');
  empresas: any[] = [];
  selectedCompanyId: number | null = null;
  cartCount = 0;
  
  // Estadísticas
  totalEmpresas = 0;
  totalCategorias = 0;
  totalProductos = 0;
  precioPromedio = 0;
  categoriasPorEmpresa: Array<{empresa: string, count: number}> = [];
  productosPorEmpresa: Array<{empresa: string, count: number}> = [];

  constructor(
    private empresaService: EmpresaService,
    private categoriaService: CategoriaService,
    private productoService: ProductoService,
    private router: Router,
    private carritoService: CarritoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.empresas = this.empresaService.getAll();
    this.cartCount = this.carritoService.obtenerCantidadItems();
    this.carritoService.carrito$.subscribe(() => {
      this.cartCount = this.carritoService.obtenerCantidadItems();
    });
    this.actualizarEstadisticas();
  }

  actualizarEstadisticas() {
    this.totalEmpresas = this.empresaService.getAll().length;
    this.totalCategorias = this.categoriaService.getAll().length;
    
    const productos = this.productoService.getAll();
    this.totalProductos = productos.length;
    this.precioPromedio = productos.length > 0 
      ? Math.round(productos.reduce((sum, p) => sum + p.price, 0) / productos.length)
      : 0;
    
    // Categorías por empresa
    const catsPorEmp = new Map<number, number>();
    this.categoriaService.getAll().forEach(c => {
      catsPorEmp.set(c.companyId, (catsPorEmp.get(c.companyId) || 0) + 1);
    });
    this.categoriasPorEmpresa = Array.from(catsPorEmp.entries())
      .map(([id, count]) => ({
        empresa: this.empresas.find(e => e.id === id)?.name || 'Sin empresa',
        count
      }))
      .sort((a, b) => b.count - a.count);
    
    // Productos por empresa
    const prodsPorEmp = new Map<number, number>();
    productos.forEach(p => {
      prodsPorEmp.set(p.companyId, (prodsPorEmp.get(p.companyId) || 0) + 1);
    });
    this.productosPorEmpresa = Array.from(prodsPorEmp.entries())
      .map(([id, count]) => ({
        empresa: this.empresas.find(e => e.id === id)?.name || 'Sin empresa',
        count
      }))
      .sort((a, b) => b.count - a.count);
  }

  async crearEmpresa() {
    const module = await import('./components/empresas/empresa-dialog');
    const ref = this.dialog.open(module.EmpresaDialog, { width: '400px', data: null });
    ref.afterClosed().subscribe(result => {
      if (result) {
        this.empresaService.create(result);
        this.empresas = this.empresaService.getAll();
        this.actualizarEstadisticas();
        this.snackBar.open('✅ Empresa creada exitosamente', 'Cerrar', { duration: 3000 });
      }
    });
  }

  async crearCategoria() {
    const module = await import('./components/categorias/categoria-dialog');
    const ref = this.dialog.open(module.CategoriaDialog, { width: '400px', data: null });
    ref.afterClosed().subscribe(result => {
      if (result) {
        this.categoriaService.create(result);
        this.actualizarEstadisticas();
        this.snackBar.open('✅ Categoría creada exitosamente', 'Cerrar', { duration: 3000 });
      }
    });
  }

  async crearProducto() {
    const module = await import('./components/productos/producto-dialog');
    const ref = this.dialog.open(module.ProductoDialog, { width: '500px', data: null });
    ref.afterClosed().subscribe(result => {
      if (result) {
        this.productoService.create(result);
        this.actualizarEstadisticas();
        this.snackBar.open('✅ Producto creado exitosamente', 'Cerrar', { duration: 3000 });
      }
    });
  }

  async verTodosProductos() {
    const module = await import('./components/productos/productos-resumen-dialog');
    this.dialog.open(module.ProductosResumenDialog, { 
      width: '95vw',
      maxWidth: '1400px',
      height: '90vh',
      panelClass: 'productos-resumen-dialog'
    });
  }

  openMenu() {
    if (!this.selectedCompanyId) {
      alert('Seleccioná una empresa');
      return;
    }
    this.router.navigate(['/menu', this.selectedCompanyId]);
  }

  exportarDatos() {
    const datos = {
      empresas: this.empresaService.getAll(),
      categorias: this.categoriaService.getAll(),
      productos: this.productoService.getAll(),
      fecha: new Date().toISOString(),
      version: '1.0'
    };

    const dataStr = JSON.stringify(datos, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `carta-online-backup-${new Date().getTime()}.json`;
    link.click();
    URL.revokeObjectURL(url);

    this.snackBar.open('✅ Datos exportados exitosamente', 'Cerrar', { duration: 3000 });
  }

  importarDatos() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event: any) => {
        try {
          const datos = JSON.parse(event.target.result);
          
          if (confirm('¿Importar datos? Esto sobrescribirá los datos actuales.')) {
            if (datos.empresas) localStorage.setItem('empresas', JSON.stringify(datos.empresas));
            if (datos.categorias) localStorage.setItem('categorias', JSON.stringify(datos.categorias));
            if (datos.productos) localStorage.setItem('productos', JSON.stringify(datos.productos));
            
            this.empresas = this.empresaService.getAll();
            this.actualizarEstadisticas();
            this.snackBar.open('✅ Datos importados exitosamente', 'Cerrar', { duration: 3000 });
            window.location.reload();
          }
        } catch (error) {
          this.snackBar.open('❌ Error al importar datos. Archivo inválido.', 'Cerrar', { duration: 5000 });
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  async verEstadisticasCompletas() {
    const module = await import('./components/estadisticas/estadisticas-dialog');
    this.dialog.open(module.EstadisticasDialog, { 
      width: '90vw',
      maxWidth: '1200px',
      height: '85vh'
    });
  }

  limpiarDatosPrueba() {
    if (confirm('¿Eliminar TODOS los datos? Esta acción no se puede deshacer.')) {
      localStorage.clear();
      this.snackBar.open('🗑️ Todos los datos eliminados', 'Cerrar', { duration: 3000 });
      setTimeout(() => window.location.reload(), 1500);
    }
  }

  reiniciarDatosPrueba() {
    if (confirm('¿Reiniciar datos de prueba? Esto eliminará los datos actuales.')) {
      localStorage.clear();
      this.snackBar.open('🔄 Reiniciando datos...', 'Cerrar', { duration: 2000 });
      setTimeout(() => window.location.reload(), 1500);
    }
  }
}
