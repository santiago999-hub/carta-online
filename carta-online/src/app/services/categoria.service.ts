import { Injectable } from '@angular/core';
import { Categoria } from '../models/categoria.model';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private storageKey = 'categorias';

  constructor() {
    if (!localStorage.getItem(this.storageKey)) {
      const seed: Categoria[] = [
        { id: 1, name: 'Pizzas', companyId: 1 },
        { id: 2, name: 'Bebidas', companyId: 1 }
      ];
      localStorage.setItem(this.storageKey, JSON.stringify(seed));
    }
  }

  private read(): Categoria[] {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  private write(items: Categoria[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  private nextId(): number {
    const items = this.read();
    return items.length ? Math.max(...items.map(i => i.id)) + 1 : 1;
  }

  getAll(): Categoria[] {
    return this.read();
  }

  getById(id: number): Categoria | undefined {
    return this.read().find(c => c.id === id);
  }

  getByCompany(companyId: number): Categoria[] {
    return this.read().filter(c => c.companyId === companyId);
  }

  /**
   * NOTE: Replace with HttpClient when connecting to backend.
   * Expected endpoints:
   *  - GET /api/categories
   *  - GET /api/categories/byCompany/{companyId}
   *  - POST /api/categories
   */

  create(data: Omit<Categoria, 'id'>): Categoria {
    const items = this.read();
    const newItem: Categoria = { id: this.nextId(), ...data };
    items.push(newItem);
    this.write(items);
    return newItem;
  }

  update(item: Categoria): boolean {
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
