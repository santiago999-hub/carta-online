import { Injectable } from '@angular/core';
import { Producto } from '../models/producto.model';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private storageKey = 'productos';

  constructor() {
    if (!localStorage.getItem(this.storageKey)) {
      const seed: Producto[] = [
        { id: 1, name: 'Muzzarella', description: 'Clásica', price: 850, categoryId: 1, companyId: 1, imageUrl: '' },
        { id: 2, name: 'Coca-Cola 1.5L', description: 'Gaseosa', price: 300, categoryId: 2, companyId: 1, imageUrl: '' }
      ];
      localStorage.setItem(this.storageKey, JSON.stringify(seed));
    }
  }

  private read(): Producto[] {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  private write(items: Producto[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  private nextId(): number {
    const items = this.read();
    return items.length ? Math.max(...items.map(i => i.id)) + 1 : 1;
  }

  getAll(): Producto[] {
    return this.read();
  }

  getById(id: number): Producto | undefined {
    return this.read().find(p => p.id === id);
  }

  getByCompany(companyId: number): Producto[] {
    return this.read().filter(p => p.companyId === companyId);
  }

  /**
   * NOTE: Replace with HttpClient when connecting to backend.
   * Expected endpoints:
   *  - GET /api/products
   *  - GET /api/products/byCompany/{companyId}
   *  - POST /api/products
   */

  getByCategory(categoryId: number): Producto[] {
    return this.read().filter(p => p.categoryId === categoryId);
  }

  create(data: Omit<Producto, 'id'>): Producto {
    const items = this.read();
    const newItem: Producto = { id: this.nextId(), ...data };
    items.push(newItem);
    this.write(items);
    return newItem;
  }

  update(item: Producto): boolean {
    const items = this.read();
    const idx = items.findIndex(i => i.id === item.id);
    if (idx === -1) return false;
    items[idx] = item;
    this.write(items);
    return true;
  }

  delete(id: number): boolean {
    const items = this.read();
    const idx = items.findIndex(i => i.id === id);
    if (idx === -1) return false;
    items.splice(idx, 1);
    this.write(items);
    return true;
  }
}
