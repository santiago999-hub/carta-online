import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { ProductoService } from '../../services/producto.service';
import { CategoriaService } from '../../services/categoria.service';
import { EmpresaService } from '../../services/empresa.service';
import { Producto } from '../../models/producto.model';
import { Categoria } from '../../models/categoria.model';
import { Empresa } from '../../models/empresa.model';
import { ProductoDialog } from './producto-dialog';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, FormsModule, MatSelectModule],
  templateUrl: './productos.html',
  styleUrls: ['./productos.css']
})
export class Productos implements OnInit {
  displayedColumns = ['id', 'name', 'price', 'category', 'company', 'actions'];
  dataSource: Producto[] = [];
  empresas: Empresa[] = [];
  categorias: Categoria[] = [];
  selectedCompanyId: number | null = null;
  filter = '';

  constructor(private productoService: ProductoService, private categoriaService: CategoriaService, private empresaService: EmpresaService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.empresas = this.empresaService.getAll();
    this.load();
  }

  load() {
    let all = this.productoService.getAll();
    if (this.selectedCompanyId) {
      all = all.filter(p => p.companyId === this.selectedCompanyId);
      this.categorias = this.categoriaService.getByCompany(this.selectedCompanyId);
    } else {
      this.categorias = this.categoriaService.getAll();
    }
    if (this.filter.trim()) {
      const f = this.filter.trim().toLowerCase();
      all = all.filter(p => p.name.toLowerCase().includes(f) || (p.description || '').toLowerCase().includes(f));
    }
    this.dataSource = all;
  }

  onCompanyChange() { this.load(); }

  getNombreEmpresa(companyId: number): string {
    return this.empresas.find(e => e.id === companyId)?.name ?? 'Sin empresa';
  }

  getNombreCategoria(categoryId: number): string {
    return this.categorias.find(c => c.id === categoryId)?.name ?? 'Sin categoría';
  }

  openDialog(producto?: Producto) {
    const ref = this.dialog.open(ProductoDialog, { data: producto ? { ...producto } : null, width: '500px' });
    ref.afterClosed().subscribe(result => {
      if (!result) return;
      if (result.id) this.productoService.update(result);
      else this.productoService.create(result);
      this.load();
    });
  }

  delete(id: number) { if (!confirm('¿Eliminar producto?')) return; this.productoService.delete(id); this.load(); }
}

