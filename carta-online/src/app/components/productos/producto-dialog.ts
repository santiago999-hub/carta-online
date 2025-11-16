import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { EmpresaService } from '../../services/empresa.service';
import { CategoriaService } from '../../services/categoria.service';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-producto-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  templateUrl: './producto-dialog.html',
  styleUrls: ['./producto-dialog.css']
})
export class ProductoDialog {
  empresas: any[] = [];
  categorias: any[] = [];
  form: any;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProductoDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Producto | null,
    private empresaService: EmpresaService,
    private categoriaService: CategoriaService
  ) {
    this.empresas = this.empresaService.getAll();
    this.categorias = this.categoriaService.getAll();
    
    this.form = this.fb.group({
      id: [null as number | null],
      name: ['', Validators.required],
      description: [''],
      price: [0, Validators.required],
      companyId: [null as number | null, Validators.required],
      categoryId: [null as number | null, Validators.required],
      imageUrl: ['']
    });

    if (data) {
      this.form.patchValue(data as any);
    }
  }

  onCompanyChange() {
    const cid = this.form.value.companyId;
    this.categorias = cid ? this.categoriaService.getByCompany(cid) : this.categoriaService.getAll();
  }

  save() { if (this.form.invalid) return; this.dialogRef.close(this.form.value); }
  cancel() { this.dialogRef.close(null); }
}
