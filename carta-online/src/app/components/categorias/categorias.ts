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
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CategoriaService } from '../../services/categoria.service';
import { EmpresaService } from '../../services/empresa.service';
import { Categoria } from '../../models/categoria.model';
import { Empresa } from '../../models/empresa.model';
import { CategoriaDialog } from './categoria-dialog';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, FormsModule, MatSelectModule, MatTooltipModule, MatSnackBarModule],
  templateUrl: './categorias.html',
  styleUrls: ['./categorias.css']
})
export class Categorias implements OnInit {
  displayedColumns = ['id', 'name', 'company', 'actions'];
  dataSource: Categoria[] = [];
  empresas: Empresa[] = [];
  selectedCompanyId: number | null = null;
  filter = '';

  constructor(private categoriaService: CategoriaService, private empresaService: EmpresaService, private dialog: MatDialog, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.empresas = this.empresaService.getAll();
    this.load();
  }

  load() {
    const all = this.categoriaService.getAll();
    this.dataSource = this.selectedCompanyId ? all.filter(c => c.companyId === this.selectedCompanyId) : all;
    if (this.filter.trim()) {
      const f = this.filter.trim().toLowerCase();
      this.dataSource = this.dataSource.filter(c => c.name.toLowerCase().includes(f));
    }
  }

  onCompanyChange() {
    this.load();
  }

  getNombreEmpresa(companyId: number): string {
    return this.empresas.find(e => e.id === companyId)?.name ?? 'Sin empresa';
  }

  openDialog(categoria?: Categoria) {
    const ref = this.dialog.open(CategoriaDialog, { data: categoria ? { ...categoria } : null, width: '400px' });
    ref.afterClosed().subscribe(result => {
      if (!result) return;
      if (result.id) {
        this.categoriaService.update(result);
        this.snackBar.open('✅ Categoría actualizada exitosamente', 'Cerrar', { duration: 3000, horizontalPosition: 'end', verticalPosition: 'top' });
      } else {
        this.categoriaService.create(result);
        this.snackBar.open('✅ Categoría creada exitosamente', 'Cerrar', { duration: 3000, horizontalPosition: 'end', verticalPosition: 'top' });
      }
      this.load();
    });
  }

  delete(id: number) {
    if (!confirm('¿Eliminar categoría? Los productos asociados quedarán sin categoría.')) return;
    this.categoriaService.delete(id);
    this.snackBar.open('🗑️ Categoría eliminada', 'Cerrar', { duration: 3000, horizontalPosition: 'end', verticalPosition: 'top' });
    this.load();
  }
}
