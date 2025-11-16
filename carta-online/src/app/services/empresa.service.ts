import { Injectable } from '@angular/core';
import { Empresa } from '../models/empresa.model';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  private storageKey = 'empresas';

  constructor() {
    if (!localStorage.getItem(this.storageKey)) {
      const seed: Empresa[] = [
        { id: 1, name: 'Demo Resto', address: 'Calle Falsa 123', phone: '12345678', email: 'demo@resto.com', logoUrl: '' }
      ];
      localStorage.setItem(this.storageKey, JSON.stringify(seed));
    }
  }

  private read(): Empresa[] {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  private write(items: Empresa[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  private nextId(): number {
    const items = this.read();
    return items.length ? Math.max(...items.map(i => i.id)) + 1 : 1;
  }

  getAll(): Empresa[] {
    return this.read();
  }

  getById(id: number): Empresa | undefined {
    return this.read().find(e => e.id === id);
  }

  /**
   * NOTE: Replace with HttpClient when connecting to backend.
   * Example endpoints:
   *  - GET /api/companies
   *  - GET /api/companies/{id}
   *  - POST /api/companies
   *  - PUT /api/companies/{id}
   *  - DELETE /api/companies/{id}
   */

  create(data: Omit<Empresa, 'id'>): Empresa {
    const items = this.read();
    const newItem: Empresa = { id: this.nextId(), ...data };
    items.push(newItem);
    this.write(items);
    return newItem;
  }

  update(item: Empresa): boolean {
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
