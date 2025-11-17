import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { ProductoService } from '../../services/producto.service';
import { CategoriaService } from '../../services/categoria.service';
import { EmpresaService } from '../../services/empresa.service';
import { Producto } from '../../models/producto.model';

interface ProductosPorEmpresa {
  empresa: string;
  empresaId: number;
  total: number;
  productos: Producto[];
  precioPromedio: number;
}

@Component({
  selector: 'app-productos-resumen-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule
  ],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <div class="header-content">
          <mat-icon class="header-icon">inventory_2</mat-icon>
          <h2>Resumen de Productos por Empresa</h2>
        </div>
        <button mat-icon-button (click)="cerrar()" class="close-btn">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div class="dialog-stats">
        <div class="stat-card">
          <mat-icon>business</mat-icon>
          <div class="stat-info">
            <span class="stat-number">{{totalEmpresas}}</span>
            <span class="stat-label">Empresas</span>
          </div>
        </div>
        <div class="stat-card">
          <mat-icon>inventory_2</mat-icon>
          <div class="stat-info">
            <span class="stat-number">{{totalProductos}}</span>
            <span class="stat-label">Productos</span>
          </div>
        </div>
        <div class="stat-card">
          <mat-icon>attach_money</mat-icon>
          <div class="stat-info">
            <span class="stat-number">\${{precioPromedioTotal}}</span>
            <span class="stat-label">Precio Promedio</span>
          </div>
        </div>
      </div>

      <mat-divider></mat-divider>

      <div class="dialog-content">
        <div *ngFor="let grupo of productosPorEmpresa" class="empresa-section">
          <div class="empresa-header">
            <div class="empresa-title">
              <mat-icon>business</mat-icon>
              <h3>{{grupo.empresa}}</h3>
            </div>
            <div class="empresa-stats">
              <mat-chip class="chip-productos">{{grupo.total}} productos</mat-chip>
              <mat-chip class="chip-precio">Promedio: \${{grupo.precioPromedio}}</mat-chip>
            </div>
          </div>

          <div class="productos-grid">
            <div *ngFor="let producto of grupo.productos" class="producto-card">
              <div class="producto-header">
                <img *ngIf="producto.imageUrl" [src]="producto.imageUrl" [alt]="producto.name" class="producto-img">
                <div *ngIf="!producto.imageUrl" class="producto-img-placeholder">
                  <mat-icon>restaurant</mat-icon>
                </div>
              </div>
              <div class="producto-body">
                <h4 class="producto-nombre">{{producto.name}}</h4>
                <p class="producto-descripcion" *ngIf="producto.description">
                  {{producto.description}}
                </p>
                <div class="producto-footer">
                  <span class="producto-categoria">
                    <mat-icon>category</mat-icon>
                    {{getNombreCategoria(producto.categoryId)}}
                  </span>
                  <span class="producto-precio">\${{producto.price}}</span>
                </div>
              </div>
            </div>
          </div>

          <mat-divider *ngIf="!isLast(grupo)" class="empresa-divider"></mat-divider>
        </div>
      </div>

      <div class="dialog-footer">
        <button mat-raised-button color="primary" (click)="cerrar()">
          <mat-icon>check</mat-icon>
          Cerrar
        </button>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container {
      display: flex;
      flex-direction: column;
      max-height: 85vh;
      background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
    }

    .dialog-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 24px;
      background: rgba(0, 0, 0, 0.3);
      border-bottom: 2px solid rgba(0, 229, 255, 0.3);
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .header-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #00e5ff;
    }

    .dialog-header h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
      color: #00e5ff;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    }

    .close-btn {
      color: #e0e0e0;
    }

    .close-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #ff5252;
    }

    .dialog-stats {
      display: flex;
      gap: 16px;
      padding: 20px 24px;
      background: rgba(0, 0, 0, 0.2);
    }

    .stat-card {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: rgba(0, 229, 255, 0.1);
      border: 2px solid rgba(0, 229, 255, 0.3);
      border-radius: 12px;
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 229, 255, 0.3);
      border-color: #00e5ff;
    }

    .stat-card mat-icon {
      font-size: 36px;
      width: 36px;
      height: 36px;
      color: #ffa726;
    }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-number {
      font-size: 1.8rem;
      font-weight: 700;
      color: #00e5ff;
      line-height: 1;
    }

    .stat-label {
      font-size: 0.85rem;
      color: #b0b0b0;
      font-weight: 500;
    }

    .dialog-content {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
    }

    .dialog-content::-webkit-scrollbar {
      width: 8px;
    }

    .dialog-content::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.2);
    }

    .dialog-content::-webkit-scrollbar-thumb {
      background: rgba(0, 229, 255, 0.3);
      border-radius: 4px;
    }

    .dialog-content::-webkit-scrollbar-thumb:hover {
      background: rgba(0, 229, 255, 0.5);
    }

    .empresa-section {
      margin-bottom: 32px;
    }

    .empresa-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      padding: 16px;
      background: rgba(0, 229, 255, 0.1);
      border-left: 4px solid #00e5ff;
      border-radius: 8px;
    }

    .empresa-title {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .empresa-title mat-icon {
      color: #00e5ff;
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .empresa-title h3 {
      margin: 0;
      font-size: 1.4rem;
      font-weight: 700;
      color: #ffffff;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    }

    .empresa-stats {
      display: flex;
      gap: 8px;
    }

    .chip-productos {
      background: rgba(255, 167, 38, 0.2) !important;
      color: #ffa726 !important;
      font-weight: 600;
      border: 1px solid #ffa726;
    }

    .chip-precio {
      background: rgba(76, 175, 80, 0.2) !important;
      color: #66bb6a !important;
      font-weight: 600;
      border: 1px solid #66bb6a;
    }

    .productos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
      padding: 0 8px;
    }

    .producto-card {
      background: rgba(255, 255, 255, 0.05);
      border: 2px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .producto-card:hover {
      transform: translateY(-4px);
      border-color: #00e5ff;
      box-shadow: 0 8px 24px rgba(0, 229, 255, 0.3);
    }

    .producto-header {
      position: relative;
      height: 160px;
      overflow: hidden;
      background: rgba(0, 0, 0, 0.3);
    }

    .producto-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .producto-card:hover .producto-img {
      transform: scale(1.1);
    }

    .producto-img-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, rgba(0, 188, 212, 0.2) 0%, rgba(0, 151, 167, 0.2) 100%);
    }

    .producto-img-placeholder mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: rgba(0, 229, 255, 0.5);
    }

    .producto-body {
      padding: 16px;
    }

    .producto-nombre {
      margin: 0 0 8px 0;
      font-size: 1.1rem;
      font-weight: 700;
      color: #ffffff;
      line-height: 1.3;
    }

    .producto-descripcion {
      margin: 0 0 12px 0;
      font-size: 0.85rem;
      color: #b0b0b0;
      line-height: 1.4;
      max-height: 40px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .producto-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 12px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .producto-categoria {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.8rem;
      color: #ffa726;
      font-weight: 500;
    }

    .producto-categoria mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .producto-precio {
      font-size: 1.3rem;
      font-weight: 700;
      color: #66bb6a;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    }

    .empresa-divider {
      margin: 32px 0;
      background-color: rgba(0, 229, 255, 0.2);
      height: 2px;
    }

    .dialog-footer {
      padding: 16px 24px;
      background: rgba(0, 0, 0, 0.3);
      border-top: 2px solid rgba(0, 229, 255, 0.3);
      display: flex;
      justify-content: center;
      position: sticky;
      bottom: 0;
    }

    .dialog-footer button {
      padding: 0 32px;
      height: 48px;
      font-size: 1rem;
      font-weight: 600;
    }

    @media (max-width: 768px) {
      .dialog-stats {
        flex-direction: column;
      }

      .productos-grid {
        grid-template-columns: 1fr;
      }

      .empresa-header {
        flex-direction: column;
        gap: 12px;
        align-items: flex-start;
      }
    }
  `]
})
export class ProductosResumenDialog {
  productosPorEmpresa: ProductosPorEmpresa[] = [];
  totalEmpresas = 0;
  totalProductos = 0;
  precioPromedioTotal = 0;

  constructor(
    private dialogRef: MatDialogRef<ProductosResumenDialog>,
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private empresaService: EmpresaService
  ) {
    this.cargarDatos();
  }

  cargarDatos() {
    const empresas = this.empresaService.getAll();
    const productos = this.productoService.getAll();

    this.totalEmpresas = empresas.length;
    this.totalProductos = productos.length;
    this.precioPromedioTotal = productos.length > 0
      ? Math.round(productos.reduce((sum, p) => sum + p.price, 0) / productos.length)
      : 0;

    // Agrupar productos por empresa
    const grupos = new Map<number, Producto[]>();
    productos.forEach(p => {
      if (!grupos.has(p.companyId)) {
        grupos.set(p.companyId, []);
      }
      grupos.get(p.companyId)!.push(p);
    });

    // Crear array con información de cada empresa
    this.productosPorEmpresa = Array.from(grupos.entries()).map(([empresaId, prods]) => {
      const empresa = empresas.find(e => e.id === empresaId);
      const precioPromedio = Math.round(prods.reduce((sum, p) => sum + p.price, 0) / prods.length);
      
      return {
        empresa: empresa?.name || 'Sin empresa',
        empresaId,
        total: prods.length,
        productos: prods.sort((a, b) => a.name.localeCompare(b.name)),
        precioPromedio
      };
    }).sort((a, b) => b.total - a.total); // Ordenar por cantidad de productos
  }

  getNombreCategoria(categoryId: number): string {
    const categoria = this.categoriaService.getAll().find(c => c.id === categoryId);
    return categoria?.name || 'Sin categoría';
  }

  isLast(grupo: ProductosPorEmpresa): boolean {
    return this.productosPorEmpresa.indexOf(grupo) === this.productosPorEmpresa.length - 1;
  }

  cerrar() {
    this.dialogRef.close();
  }
}
