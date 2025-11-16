import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { EmpresaService } from '../../services/empresa.service';
import { Empresa } from '../../models/empresa.model';
// EmpresaDialog will be loaded dynamically to avoid static module resolution issues

@Component({
  selector: 'app-empresas',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './empresas.html',
  styleUrls: ['./empresas.css']
})
export class Empresas implements OnInit {
  displayedColumns = ['id', 'name', 'address', 'phone', 'email', 'actions'];
  dataSource = new MatTableDataSource<Empresa>([]);
  filter = '';

  constructor(private empresaService: EmpresaService, private dialog: MatDialog) {}

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
      } else {
        this.empresaService.create(result);
      }
      this.load();
    });
  }

  delete(id: number) {
    if (!confirm('¿Eliminar empresa?')) return;
    this.empresaService.delete(id);
    this.load();
  }
}
