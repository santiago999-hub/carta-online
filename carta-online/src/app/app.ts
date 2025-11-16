import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { EmpresaService } from './services/empresa.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, MatToolbarModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatSelectModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('carta-online');
  empresas: any[] = [];
  selectedCompanyId: number | null = null;

  constructor(private empresaService: EmpresaService, private router: Router) {
    this.empresas = this.empresaService.getAll();
  }

  openMenu() {
    if (!this.selectedCompanyId) {
      alert('Seleccioná una empresa');
      return;
    }
    this.router.navigate(['/menu', this.selectedCompanyId]);
  }
}
