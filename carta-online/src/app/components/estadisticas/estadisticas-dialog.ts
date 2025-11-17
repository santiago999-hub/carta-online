import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { EmpresaService } from '../../services/empresa.service';
import { CategoriaService } from '../../services/categoria.service';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-estadisticas-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatTabsModule
  ],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <div class="header-content">
          <mat-icon class="header-icon">assessment</mat-icon>
          <h2>Estadísticas del Sistema</h2>
        </div>
        <button mat-icon-button (click)="cerrar()" class="close-btn">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-tab-group class="stats-tabs">
        <!-- Tab General -->
        <mat-tab label="General">
          <div class="tab-content">
            <div class="stats-grid">
              <mat-card class="stat-card empresas">
                <mat-card-header>
                  <mat-icon>business</mat-icon>
                  <h3>Empresas</h3>
                </mat-card-header>
                <mat-card-content>
                  <div class="stat-value">{{totalEmpresas}}</div>
                  <p>Total de empresas registradas</p>
                </mat-card-content>
              </mat-card>

              <mat-card class="stat-card categorias">
                <mat-card-header>
                  <mat-icon>category</mat-icon>
                  <h3>Categorías</h3>
                </mat-card-header>
                <mat-card-content>
                  <div class="stat-value">{{totalCategorias}}</div>
                  <p>Total de categorías</p>
                  <p class="stat-detail">Promedio: {{promedioCategoriasPorEmpresa}} por empresa</p>
                </mat-card-content>
              </mat-card>

              <mat-card class="stat-card productos">
                <mat-card-header>
                  <mat-icon>inventory_2</mat-icon>
                  <h3>Productos</h3>
                </mat-card-header>
                <mat-card-content>
                  <div class="stat-value">{{totalProductos}}</div>
                  <p>Total de productos</p>
                  <p class="stat-detail">Promedio: {{promedioProductosPorEmpresa}} por empresa</p>
                </mat-card-content>
              </mat-card>

              <mat-card class="stat-card precios">
                <mat-card-header>
                  <mat-icon>attach_money</mat-icon>
                  <h3>Precios</h3>
                </mat-card-header>
                <mat-card-content>
                  <div class="stat-value">\${{precioPromedio}}</div>
                  <p>Precio promedio</p>
                  <p class="stat-detail">Rango: \${{precioMinimo}} - \${{precioMaximo}}</p>
                </mat-card-content>
              </mat-card>
            </div>

            <mat-divider class="section-divider"></mat-divider>

            <h3 class="section-title">
              <mat-icon>trending_up</mat-icon>
              Top 5 Productos Más Caros
            </h3>
            <div class="ranking-list">
              <div *ngFor="let item of topProductosCaros; let i = index" class="ranking-item">
                <span class="rank">{{i + 1}}</span>
                <span class="name">{{item.name}}</span>
                <span class="empresa">{{item.empresa}}</span>
                <span class="price">\${{item.price}}</span>
              </div>
            </div>
          </div>
        </mat-tab>

        <!-- Tab Por Empresa -->
        <mat-tab label="Por Empresa">
          <div class="tab-content">
            <div *ngFor="let emp of estadisticasPorEmpresa" class="empresa-stats-section">
              <div class="empresa-stats-header">
                <div class="empresa-info">
                  <mat-icon>business</mat-icon>
                  <h3>{{emp.nombre}}</h3>
                </div>
                <div class="empresa-badges">
                  <span class="badge categorias">{{emp.categorias}} categorías</span>
                  <span class="badge productos">{{emp.productos}} productos</span>
                </div>
              </div>

              <div class="empresa-stats-grid">
                <div class="stat-box">
                  <mat-icon>attach_money</mat-icon>
                  <div class="stat-info">
                    <span class="label">Precio Promedio</span>
                    <span class="value">\${{emp.precioPromedio}}</span>
                  </div>
                </div>

                <div class="stat-box">
                  <mat-icon>trending_down</mat-icon>
                  <div class="stat-info">
                    <span class="label">Producto Más Barato</span>
                    <span class="value">\${{emp.precioMin}}</span>
                  </div>
                </div>

                <div class="stat-box">
                  <mat-icon>trending_up</mat-icon>
                  <div class="stat-info">
                    <span class="label">Producto Más Caro</span>
                    <span class="value">\${{emp.precioMax}}</span>
                  </div>
                </div>

                <div class="stat-box">
                  <mat-icon>restaurant</mat-icon>
                  <div class="stat-info">
                    <span class="label">Productos por Categoría</span>
                    <span class="value">{{emp.productosPorCategoria}}</span>
                  </div>
                </div>
              </div>

              <mat-divider></mat-divider>
            </div>
          </div>
        </mat-tab>

        <!-- Tab Categorías -->
        <mat-tab label="Categorías">
          <div class="tab-content">
            <h3 class="section-title">
              <mat-icon>category</mat-icon>
              Distribución de Categorías
            </h3>

            <div class="categoria-list">
              <div *ngFor="let cat of categoriasConStats" class="categoria-item">
                <div class="categoria-header">
                  <span class="categoria-name">{{cat.nombre}}</span>
                  <span class="categoria-empresa">{{cat.empresa}}</span>
                </div>
                <div class="categoria-stats">
                  <div class="stat">
                    <mat-icon>inventory_2</mat-icon>
                    <span>{{cat.productos}} productos</span>
                  </div>
                  <div class="stat">
                    <mat-icon>attach_money</mat-icon>
                    <span>Promedio: \${{cat.precioPromedio}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </mat-tab>

        <!-- Tab Resumen -->
        <mat-tab label="Resumen">
          <div class="tab-content">
            <mat-card class="summary-card">
              <mat-card-header>
                <mat-icon>summarize</mat-icon>
                <h3>Resumen Ejecutivo</h3>
              </mat-card-header>
              <mat-card-content>
                <div class="summary-section">
                  <h4><mat-icon>business</mat-icon> Empresas</h4>
                  <ul>
                    <li>Total de empresas: <strong>{{totalEmpresas}}</strong></li>
                    <li>Empresa con más productos: <strong>{{empresaConMasProductos.nombre}}</strong> ({{empresaConMasProductos.cantidad}} productos)</li>
                    <li>Empresa con más categorías: <strong>{{empresaConMasCategorias.nombre}}</strong> ({{empresaConMasCategorias.cantidad}} categorías)</li>
                  </ul>
                </div>

                <mat-divider></mat-divider>

                <div class="summary-section">
                  <h4><mat-icon>inventory_2</mat-icon> Productos</h4>
                  <ul>
                    <li>Total de productos: <strong>{{totalProductos}}</strong></li>
                    <li>Precio promedio general: <strong>\${{precioPromedio}}</strong></li>
                    <li>Rango de precios: <strong>\${{precioMinimo}} - \${{precioMaximo}}</strong></li>
                    <li>Producto más caro: <strong>{{productoMasCaro.nombre}}</strong> (\${{productoMasCaro.precio}})</li>
                  </ul>
                </div>

                <mat-divider></mat-divider>

                <div class="summary-section">
                  <h4><mat-icon>category</mat-icon> Categorías</h4>
                  <ul>
                    <li>Total de categorías: <strong>{{totalCategorias}}</strong></li>
                    <li>Promedio por empresa: <strong>{{promedioCategoriasPorEmpresa}}</strong></li>
                    <li>Categoría con más productos: <strong>{{categoriaConMasProductos.nombre}}</strong> ({{categoriaConMasProductos.cantidad}} productos)</li>
                  </ul>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>
      </mat-tab-group>

      <div class="dialog-footer">
        <button mat-raised-button color="primary" (click)="cerrar()">
          <mat-icon>close</mat-icon>
          Cerrar
        </button>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
    }

    .dialog-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 24px;
      background: rgba(0, 0, 0, 0.3);
      border-bottom: 2px solid rgba(0, 229, 255, 0.3);
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

    ::ng-deep .stats-tabs {
      flex: 1;
      overflow: hidden;
    }

    ::ng-deep .stats-tabs .mat-mdc-tab-labels {
      background: rgba(0, 0, 0, 0.2);
    }

    ::ng-deep .stats-tabs .mat-mdc-tab {
      color: #b0b0b0;
    }

    ::ng-deep .stats-tabs .mat-mdc-tab.mdc-tab--active {
      color: #00e5ff;
    }

    ::ng-deep .stats-tabs .mat-mdc-tab-body-wrapper {
      flex: 1;
      overflow-y: auto;
    }

    .tab-content {
      padding: 24px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .stat-card {
      background: rgba(255, 255, 255, 0.05) !important;
      border: 2px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px !important;
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 229, 255, 0.3);
      border-color: #00e5ff;
    }

    .stat-card mat-card-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 16px 8px;
    }

    .stat-card mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #ffa726;
    }

    .stat-card h3 {
      margin: 0;
      color: #ffffff;
      font-size: 1.2rem;
      font-weight: 600;
    }

    .stat-card mat-card-content {
      padding: 8px 16px 16px;
    }

    .stat-value {
      font-size: 2.5rem;
      font-weight: 700;
      color: #00e5ff;
      margin: 8px 0;
    }

    .stat-card p {
      margin: 4px 0;
      color: #b0b0b0;
      font-size: 0.9rem;
    }

    .stat-detail {
      color: #ffa726 !important;
      font-weight: 500;
    }

    .section-divider {
      background-color: rgba(0, 229, 255, 0.2);
      margin: 32px 0;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #00e5ff;
      font-size: 1.3rem;
      margin: 24px 0 16px;
    }

    .section-title mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .ranking-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .ranking-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      transition: all 0.2s ease;
    }

    .ranking-item:hover {
      background: rgba(0, 229, 255, 0.1);
      border-color: #00e5ff;
    }

    .ranking-item .rank {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #ffa726 0%, #fb8c00 100%);
      border-radius: 50%;
      font-weight: 700;
      font-size: 1.2rem;
      color: #fff;
    }

    .ranking-item .name {
      flex: 1;
      color: #ffffff;
      font-weight: 600;
      font-size: 1.1rem;
    }

    .ranking-item .empresa {
      color: #b0b0b0;
      font-size: 0.9rem;
    }

    .ranking-item .price {
      color: #66bb6a;
      font-weight: 700;
      font-size: 1.3rem;
    }

    .empresa-stats-section {
      margin-bottom: 32px;
    }

    .empresa-stats-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      background: rgba(0, 229, 255, 0.1);
      border-left: 4px solid #00e5ff;
      border-radius: 8px;
      margin-bottom: 16px;
    }

    .empresa-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .empresa-info mat-icon {
      color: #00e5ff;
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .empresa-info h3 {
      margin: 0;
      color: #ffffff;
      font-size: 1.3rem;
    }

    .empresa-badges {
      display: flex;
      gap: 8px;
    }

    .badge {
      padding: 6px 12px;
      border-radius: 16px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .badge.categorias {
      background: rgba(255, 167, 38, 0.2);
      color: #ffa726;
      border: 1px solid #ffa726;
    }

    .badge.productos {
      background: rgba(76, 175, 80, 0.2);
      color: #66bb6a;
      border: 1px solid #66bb6a;
    }

    .empresa-stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .stat-box {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
    }

    .stat-box mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #ffa726;
    }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-info .label {
      font-size: 0.85rem;
      color: #b0b0b0;
    }

    .stat-info .value {
      font-size: 1.3rem;
      font-weight: 700;
      color: #00e5ff;
    }

    .categoria-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .categoria-item {
      padding: 16px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
    }

    .categoria-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }

    .categoria-name {
      font-size: 1.1rem;
      font-weight: 600;
      color: #ffffff;
    }

    .categoria-empresa {
      color: #ffa726;
      font-size: 0.9rem;
    }

    .categoria-stats {
      display: flex;
      gap: 24px;
    }

    .categoria-stats .stat {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #b0b0b0;
      font-size: 0.9rem;
    }

    .categoria-stats mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #00e5ff;
    }

    .summary-card {
      background: rgba(255, 255, 255, 0.05) !important;
      border: 2px solid rgba(0, 229, 255, 0.3);
      border-radius: 16px !important;
    }

    .summary-card mat-card-header {
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(0, 229, 255, 0.1);
      padding: 20px;
      border-radius: 14px 14px 0 0;
    }

    .summary-card mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #00e5ff;
    }

    .summary-card h3 {
      margin: 0;
      color: #ffffff;
      font-size: 1.4rem;
    }

    .summary-section {
      padding: 20px 0;
    }

    .summary-section h4 {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #00e5ff;
      font-size: 1.2rem;
      margin-bottom: 12px;
    }

    .summary-section h4 mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .summary-section ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .summary-section li {
      padding: 8px 0;
      color: #b0b0b0;
      font-size: 1rem;
      line-height: 1.6;
    }

    .summary-section strong {
      color: #ffffff;
      font-weight: 600;
    }

    .dialog-footer {
      padding: 16px 24px;
      background: rgba(0, 0, 0, 0.3);
      border-top: 2px solid rgba(0, 229, 255, 0.3);
      display: flex;
      justify-content: center;
    }

    .dialog-footer button {
      padding: 0 32px;
      height: 48px;
      font-size: 1rem;
      font-weight: 600;
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }

      .empresa-stats-header {
        flex-direction: column;
        gap: 12px;
        align-items: flex-start;
      }

      .empresa-stats-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class EstadisticasDialog {
  totalEmpresas = 0;
  totalCategorias = 0;
  totalProductos = 0;
  precioPromedio = 0;
  precioMinimo = 0;
  precioMaximo = 0;
  promedioCategoriasPorEmpresa = 0;
  promedioProductosPorEmpresa = 0;

  topProductosCaros: any[] = [];
  estadisticasPorEmpresa: any[] = [];
  categoriasConStats: any[] = [];

  empresaConMasProductos = { nombre: '-', cantidad: 0 };
  empresaConMasCategorias = { nombre: '-', cantidad: 0 };
  productoMasCaro = { nombre: '-', precio: 0 };
  categoriaConMasProductos = { nombre: '-', cantidad: 0 };

  constructor(
    private dialogRef: MatDialogRef<EstadisticasDialog>,
    private empresaService: EmpresaService,
    private categoriaService: CategoriaService,
    private productoService: ProductoService
  ) {
    this.calcularEstadisticas();
  }

  calcularEstadisticas() {
    const empresas = this.empresaService.getAll();
    const categorias = this.categoriaService.getAll();
    const productos = this.productoService.getAll();

    this.totalEmpresas = empresas.length;
    this.totalCategorias = categorias.length;
    this.totalProductos = productos.length;

    // Precios
    if (productos.length > 0) {
      const precios = productos.map(p => p.price);
      this.precioPromedio = Math.round(precios.reduce((a, b) => a + b, 0) / precios.length);
      this.precioMinimo = Math.min(...precios);
      this.precioMaximo = Math.max(...precios);
    }

    this.promedioCategoriasPorEmpresa = Math.round((categorias.length / empresas.length) * 10) / 10;
    this.promedioProductosPorEmpresa = Math.round((productos.length / empresas.length) * 10) / 10;

    // Top productos caros
    this.topProductosCaros = productos
      .sort((a, b) => b.price - a.price)
      .slice(0, 5)
      .map(p => ({
        ...p,
        empresa: empresas.find(e => e.id === p.companyId)?.name || 'Sin empresa'
      }));

    // Estadísticas por empresa
    this.estadisticasPorEmpresa = empresas.map(emp => {
      const catEmpr = categorias.filter(c => c.companyId === emp.id);
      const prodEmp = productos.filter(p => p.companyId === emp.id);
      const preciosEmp = prodEmp.map(p => p.price);

      return {
        nombre: emp.name,
        categorias: catEmpr.length,
        productos: prodEmp.length,
        precioPromedio: prodEmp.length > 0 ? Math.round(preciosEmp.reduce((a, b) => a + b, 0) / preciosEmp.length) : 0,
        precioMin: prodEmp.length > 0 ? Math.min(...preciosEmp) : 0,
        precioMax: prodEmp.length > 0 ? Math.max(...preciosEmp) : 0,
        productosPorCategoria: catEmpr.length > 0 ? Math.round((prodEmp.length / catEmpr.length) * 10) / 10 : 0
      };
    });

    // Categorías con stats
    this.categoriasConStats = categorias.map(cat => {
      const prodsCat = productos.filter(p => p.categoryId === cat.id);
      const preciosCat = prodsCat.map(p => p.price);

      return {
        nombre: cat.name,
        empresa: empresas.find(e => e.id === cat.companyId)?.name || 'Sin empresa',
        productos: prodsCat.length,
        precioPromedio: prodsCat.length > 0 ? Math.round(preciosCat.reduce((a, b) => a + b, 0) / preciosCat.length) : 0
      };
    }).sort((a, b) => b.productos - a.productos);

    // Empresa con más productos
    const empProds = this.estadisticasPorEmpresa.sort((a, b) => b.productos - a.productos);
    if (empProds.length > 0) {
      this.empresaConMasProductos = { nombre: empProds[0].nombre, cantidad: empProds[0].productos };
    }

    // Empresa con más categorías
    const empCats = this.estadisticasPorEmpresa.sort((a, b) => b.categorias - a.categorias);
    if (empCats.length > 0) {
      this.empresaConMasCategorias = { nombre: empCats[0].nombre, cantidad: empCats[0].categorias };
    }

    // Producto más caro
    if (this.topProductosCaros.length > 0) {
      this.productoMasCaro = { nombre: this.topProductosCaros[0].name, precio: this.topProductosCaros[0].price };
    }

    // Categoría con más productos
    if (this.categoriasConStats.length > 0) {
      this.categoriaConMasProductos = { nombre: this.categoriasConStats[0].nombre, cantidad: this.categoriasConStats[0].productos };
    }
  }

  cerrar() {
    this.dialogRef.close();
  }
}
