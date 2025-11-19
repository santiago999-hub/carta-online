import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { EmpresaService } from '../../services/empresa.service';
import { Empresa } from '../../models/empresa.model';
import { RouterModule } from '@angular/router';
import { fadeIn, slideUp, listAnimation } from '../../shared/animations';
// EmpresaDialog will be loaded dynamically to avoid static module resolution issues

@Component({
  selector: 'app-empresas',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, FormsModule, RouterModule, MatTooltipModule, MatSnackBarModule, MatCardModule],
  templateUrl: './empresas.html',
  styleUrls: ['./empresas.css'],
  animations: [fadeIn, slideUp, listAnimation]
})
export class Empresas implements OnInit {
  displayedColumns = ['id', 'name', 'address', 'phone', 'email', 'actions'];
  dataSource = new MatTableDataSource<Empresa>([]);
  filter = '';
  productos: any[] = [];
  categorias: any[] = [];

  constructor(private empresaService: EmpresaService, private dialog: MatDialog, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.dataSource.data = this.empresaService.getAll();
  }

  applyFilter() {
    const f = this.filter.trim().toLowerCase();
    this.dataSource.filter = f;
    this.dataSource.data = this.empresaService.getAll().filter(e => e.name.toLowerCase().includes(f) || (e.address || '').toLowerCase().includes(f));
  }

  async openDialog(empresa?: Empresa) {
    const module = await import('./empresa-dialog');
    const DialogComp = module.EmpresaDialog;
    const ref = this.dialog.open(DialogComp, {
      data: empresa ? { ...empresa } : null,
      width: '400px'
    });

    ref.afterClosed().subscribe(result => {
      if (!result) return;
      if (result.id) {
        this.empresaService.update(result);
        this.snackBar.open('✅ Empresa actualizada exitosamente', 'Cerrar', { duration: 3000, horizontalPosition: 'end', verticalPosition: 'top' });
      } else {
        this.empresaService.create(result);
        this.snackBar.open('✅ Empresa creada exitosamente', 'Cerrar', { duration: 3000, horizontalPosition: 'end', verticalPosition: 'top' });
      }
      this.load();
    });
  }

  delete(id: number) {
    if (!confirm('¿Eliminar empresa? Esta acción no se puede deshacer.')) return;
    this.empresaService.delete(id);
    this.snackBar.open('🗑️ Empresa eliminada', 'Cerrar', { duration: 3000, horizontalPosition: 'end', verticalPosition: 'top' });
    this.load();
  }

  // Métodos auxiliares para las cards
  getProductosPorEmpresa(empresaId: number): number {
    const ProductoService = (window as any)['ProductoService'];
    if (!ProductoService) {
      // Carga perezosa desde localStorage
      const prods = JSON.parse(localStorage.getItem('productos') || '[]');
      return prods.filter((p: any) => p.companyId === empresaId).length;
    }
    return 0;
  }

  getCategoriasPorEmpresa(empresaId: number): number {
    const cats = JSON.parse(localStorage.getItem('categorias') || '[]');
    return cats.filter((c: any) => c.companyId === empresaId).length;
  }

  getPrecioPromedioEmpresa(empresaId: number): number {
    const prods = JSON.parse(localStorage.getItem('productos') || '[]');
    const productosFiltrados = prods.filter((p: any) => p.companyId === empresaId);
    if (productosFiltrados.length === 0) return 0;
    const suma = productosFiltrados.reduce((acc: number, p: any) => acc + p.price, 0);
    return Math.round(suma / productosFiltrados.length);
  }

  getPrecioMinimoEmpresa(empresaId: number): number {
    const prods = JSON.parse(localStorage.getItem('productos') || '[]');
    const productosFiltrados = prods.filter((p: any) => p.companyId === empresaId);
    if (productosFiltrados.length === 0) return 0;
    return Math.min(...productosFiltrados.map((p: any) => p.price));
  }
}
