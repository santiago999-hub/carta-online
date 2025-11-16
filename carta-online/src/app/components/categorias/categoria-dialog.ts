import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { EmpresaService } from '../../services/empresa.service';
import { Categoria } from '../../models/categoria.model';

@Component({
  selector: 'app-categoria-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  templateUrl: './categoria-dialog.html',
  styleUrls: ['./categoria-dialog.css']
})
export class CategoriaDialog {
  empresas: any[] = [];
  form: any;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CategoriaDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Categoria | null,
    private empresaService: EmpresaService
  ) {
    this.empresas = this.empresaService.getAll();
    
    this.form = this.fb.group({
      id: [null as number | null],
      name: ['', Validators.required],
      companyId: [null as number | null, Validators.required]
    });

    if (data) {
      this.form.patchValue(data as any);
    }
  }

  save() { if (this.form.invalid) return; this.dialogRef.close(this.form.value); }
  cancel() { this.dialogRef.close(null); }
}
