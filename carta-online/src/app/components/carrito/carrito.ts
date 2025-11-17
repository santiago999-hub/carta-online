import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { CarritoService } from '../../services/carrito.service';
import { CartItem } from '../../models/carrito.model';
import { fadeIn, slideUp, scaleIn } from '../../shared/animations';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatDialogModule,
  ],
  templateUrl: './carrito.html',
  styleUrls: ['./carrito.css'],
  animations: [fadeIn, slideUp, scaleIn]
})
export class CarritoComponent implements OnInit {
  items: CartItem[] = [];
  total = 0;

  displayedColumns: string[] = [
    'producto',
    'precio',
    'cantidad',
    'subtotal',
    'acciones',
  ];

  constructor(
    private carritoService: CarritoService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.carritoService.carrito$.subscribe(() => {
      this.cargarCarrito();
    });

    this.cargarCarrito(); // carga inicial
  }

  cargarCarrito(): void {
    this.items = this.carritoService.getCarrito();
    this.calcularTotal();
  }

  calcularTotal(): void {
    this.total = this.items.reduce(
      (acc, item) => acc + item.precio * item.cantidad,
      0
    );
  }

  obtenerSubtotal(item: CartItem): number {
    return item.precio * item.cantidad;
  }

  actualizarCantidad(item: CartItem, nuevaCantidad: number): void {
    const cantidadNum = Number(nuevaCantidad);

    if (!Number.isFinite(cantidadNum) || cantidadNum < 1) {
      this.snackBar.open('La cantidad mínima es 1', 'OK', { duration: 2000 });
      return;
    }

    this.carritoService.actualizarCantidad(item.id, cantidadNum);
    this.cargarCarrito();
  }

  eliminarItem(id: number): void {
    this.carritoService.eliminarItem(id);
    this.snackBar.open('🗑️ Producto eliminado', 'Cerrar', {
      duration: 2000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
    this.cargarCarrito();
  }

  vaciarCarrito(): void {
    const dialogRef = this.dialog.open(ConfirmarDialog, {
      width: '400px',
      data: {
        titulo: '¿Vaciar carrito?',
        mensaje: 'Se eliminarán todos los productos. Esta acción no se puede deshacer.',
        icono: 'delete_sweep',
        colorIcono: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.carritoService.vaciarCarrito();
        this.snackBar.open('🗑️ Carrito vaciado', 'Cerrar', { 
          duration: 2000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
        this.cargarCarrito();
      }
    });
  }

  continuarComprando(): void {
    this.router.navigate(['/menu']);
  }

  finalizarCompra(): void {
    if (this.items.length === 0) {
      this.snackBar.open('⚠️ No hay productos en el carrito', 'Cerrar', {
        duration: 2000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
      return;
    }

    const dialogRef = this.dialog.open(ConfirmarCompraDialog, {
      width: '500px',
      data: {
        items: this.items,
        total: this.total
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('✅ Compra realizada con éxito', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });

        this.carritoService.vaciarCarrito();
        this.router.navigate(['/menu']);
      }
    });
  }
}

// Componente de diálogo de confirmación genérico
@Component({
  selector: 'confirmar-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>
      <mat-icon [color]="data.colorIcono || 'primary'">{{ data.icono }}</mat-icon>
      {{ data.titulo }}
    </h2>
    <mat-dialog-content>
      <p>{{ data.mensaje }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close(false)">Cancelar</button>
      <button mat-raised-button [color]="data.colorIcono || 'primary'" (click)="dialogRef.close(true)">
        Confirmar
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    h2 {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }
    p {
      margin: 16px 0;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.7);
    }
  `]
})
export class ConfirmarDialog {
  constructor(
    public dialogRef: MatDialogRef<ConfirmarDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
}

// Componente de diálogo de confirmación de compra
@Component({
  selector: 'confirmar-compra-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatDividerModule],
  template: `
    <h2 mat-dialog-title>
      <mat-icon color="primary">shopping_bag</mat-icon>
      Confirmar compra
    </h2>
    <mat-dialog-content>
      <p class="resumen-texto">Estás por confirmar tu pedido con los siguientes productos:</p>
      
      <div class="items-list">
        <div class="item" *ngFor="let item of data.items">
          <span class="item-nombre">{{ item.productoNombre }}</span>
          <span class="item-cantidad">x{{ item.cantidad }}</span>
          <span class="item-precio">{{ item.precio * item.cantidad | currency: 'ARS' }}</span>
        </div>
      </div>

      <mat-divider></mat-divider>

      <div class="total-final">
        <span>Total:</span>
        <span class="monto-total">{{ data.total | currency: 'ARS' }}</span>
      </div>

      <p class="nota">💡 Se te contactará para coordinar el envío</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close(false)">Cancelar</button>
      <button mat-raised-button color="primary" (click)="dialogRef.close(true)">
        <mat-icon>check_circle</mat-icon>
        Confirmar pedido
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    h2 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
    }
    mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }
    .resumen-texto {
      margin-bottom: 16px;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.7);
    }
    .items-list {
      max-height: 300px;
      overflow-y: auto;
      margin: 16px 0;
    }
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      border-radius: 4px;
      margin-bottom: 8px;
      background: rgba(0, 0, 0, 0.03);
    }
    .item-nombre {
      flex: 1;
      font-weight: 500;
    }
    .item-cantidad {
      color: rgba(0, 0, 0, 0.6);
      margin: 0 16px;
    }
    .item-precio {
      font-weight: 600;
      color: #2e7d32;
    }
    mat-divider {
      margin: 16px 0;
    }
    .total-final {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      font-size: 18px;
      font-weight: 600;
    }
    .monto-total {
      color: #2e7d32;
      font-size: 24px;
    }
    .nota {
      margin-top: 16px;
      padding: 12px;
      background: #e3f2fd;
      border-left: 4px solid #2196f3;
      border-radius: 4px;
      font-size: 13px;
      color: rgba(0, 0, 0, 0.8);
    }
    mat-dialog-actions button mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      margin-right: 4px;
    }
  `]
})
export class ConfirmarCompraDialog {
  constructor(
    public dialogRef: MatDialogRef<ConfirmarCompraDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { items: CartItem[], total: number }
  ) {}
}
