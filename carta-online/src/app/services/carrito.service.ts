import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../models/carrito.model';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  private readonly CARRITO_KEY = 'carrito';

  private carritoSubject = new BehaviorSubject<CartItem[]>([]);
  public carrito$: Observable<CartItem[]> = this.carritoSubject.asObservable();

  constructor() {
    this.cargarCarrito();
  }

  /**
   * NOTA: Este servicio usa LocalStorage y BehaviorSubject.
   * Para integrar con un backend reemplazar los métodos
   * internos por HttpClient y mapear a los endpoints:
   *  - GET  /api/cart
   *  - POST /api/cart
   *  - PUT  /api/cart/{id}
   *  - DELETE /api/cart/{id}
   * También mantener el BehaviorSubject para notificar cambios.
   */

  /** 🔹 Cargar carrito desde localStorage con protección ante errores */
  private cargarCarrito(): void {
    try {
      const guardado = localStorage.getItem(this.CARRITO_KEY);
      const items = guardado ? JSON.parse(guardado) : [];
      this.carritoSubject.next(items);
    } catch (e) {
      console.warn('Carrito corrupto. Se reinicia.');
      this.carritoSubject.next([]);
      localStorage.removeItem(this.CARRITO_KEY);
    }
  }

  /** 🔹 Guardar carrito */
  private guardarCarrito(items: CartItem[]): void {
    localStorage.setItem(this.CARRITO_KEY, JSON.stringify(items));
    this.carritoSubject.next([...items]); // referencia nueva
  }

  /** 🔹 Obtener snapshot actual */
  getCarrito(): CartItem[] {
    return [...this.carritoSubject.value];
  }

  /** 🔹 Generar un ID realmente único */
  private generarId(): number {
    return Number(Date.now().toString() + Math.floor(Math.random() * 1000));
  }

  /** 🔹 Agregar producto al carrito */
  agregarAlCarrito(
    productoId: number,
    productoNombre: string,
    precio: number,
    empresaId: number,
    cantidad: number = 1
  ): void {
    const items = this.getCarrito();
    const cantidadFinal = Math.max(1, Number(cantidad) || 1);

    const existente = items.find(
      item => item.productoId === productoId && item.empresaId === empresaId
    );

    if (existente) {
      existente.cantidad += cantidadFinal;
    } else {
      items.push({
        id: this.generarId(),
        productoId,
        productoNombre,
        precio,
        cantidad: cantidadFinal,
        empresaId,
      });
    }

    this.guardarCarrito(items);
  }

  /** 🔹 Actualizar cantidad */
  actualizarCantidad(itemId: number, cantidad: number): void {
    let nuevaCantidad = Number(cantidad);

    if (!Number.isFinite(nuevaCantidad) || nuevaCantidad <= 0) {
      return this.eliminarItem(itemId);
    }

    const items = this.getCarrito();
    const item = items.find(i => i.id === itemId);

    if (item) {
      item.cantidad = nuevaCantidad;
      this.guardarCarrito(items);
    }
  }

  /** 🔹 Eliminar un producto */
  eliminarItem(itemId: number): void {
    const items = this.getCarrito().filter(item => item.id !== itemId);
    this.guardarCarrito(items);
  }

  /** 🔹 Vaciar carrito */
  vaciarCarrito(): void {
    this.guardarCarrito([]);
  }

  /** 🔹 Total en pesos */
  obtenerTotal(): number {
    return this.getCarrito().reduce(
      (acc, item) => acc + item.precio * item.cantidad,
      0
    );
  }

  /** 🔹 Total de items (sumatoria de cantidades) */
  obtenerCantidadItems(): number {
    return this.getCarrito().reduce((t, item) => t + item.cantidad, 0);
  }

  /** 🔹 Filtro por empresa */
  obtenerPorEmpresa(empresaId: number): CartItem[] {
    return this.getCarrito().filter(item => item.empresaId === empresaId);
  }
}
