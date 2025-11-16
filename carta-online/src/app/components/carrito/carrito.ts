import { Component, OnInit } from '@angular/core';
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
import { Router } from '@angular/router';

import { CarritoService } from '../../services/carrito.service';
import { CartItem } from '../../models/carrito.model';

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
  ],
  templateUrl: './carrito.html',
  styleUrls: ['./carrito.css'],
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
    private snackBar: MatSnackBar
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
    this.snackBar.open('Producto eliminado del carrito', 'OK', {
      duration: 1500,
    });
    this.cargarCarrito();
  }

  vaciarCarrito(): void {
    this.carritoService.vaciarCarrito();
    this.snackBar.open('Carrito vaciado', 'OK', { duration: 1500 });
    this.cargarCarrito();
  }

  continuarComprando(): void {
    this.router.navigate(['/menu']);
  }

  finalizarCompra(): void {
    if (this.items.length === 0) {
      this.snackBar.open('No hay productos en el carrito', 'OK', {
        duration: 2000,
      });
      return;
    }

    this.snackBar.open('Compra realizada con éxito 🛒✔️', 'OK', {
      duration: 2500,
    });

    // Vacía el carrito
    this.carritoService.vaciarCarrito();

    // Redirige a confirmación o menú
    this.router.navigate(['/confirmacion']);
  }
}
