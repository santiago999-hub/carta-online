import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Empresa } from '../../models/empresa.model';

@Component({
  selector: 'app-empresa-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './empresa-dialog.html',
  styleUrls: ['./empresa-dialog.css']
})
export class EmpresaDialog {
  form: any;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EmpresaDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Empresa | null
  ) {
    this.form = this.fb.group({
      id: [null as number | null],
      name: ['', Validators.required],
      address: [''],
      phone: [''],
      email: ['', Validators.email],
      logoUrl: ['']
    });

    if (data) {
      this.form.patchValue(data as any);
    }
  }

  save() {
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.value);
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
