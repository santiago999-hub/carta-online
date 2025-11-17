import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../models/categoria.model';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private storageKey = 'categorias';
  private readonly apiBase = 'http://localhost:5230/api/categories';

  constructor(private http: HttpClient) {
    if (!localStorage.getItem(this.storageKey)) {
      const seed: Categoria[] = [
        // La Parrilla Criolla
        { id: 1, name: 'Entradas', companyId: 1 },
        { id: 2, name: 'Parrillada', companyId: 1 },
        { id: 3, name: 'Ensaladas', companyId: 1 },
        { id: 4, name: 'Postres', companyId: 1 },
        { id: 5, name: 'Bebidas', companyId: 1 },
        // Pizzería Don Antonio
        { id: 6, name: 'Pizzas', companyId: 2 },
        { id: 7, name: 'Empanadas', companyId: 2 },
        { id: 8, name: 'Pastas', companyId: 2 },
        { id: 9, name: 'Postres', companyId: 2 },
        { id: 10, name: 'Bebidas', companyId: 2 },
        // El Buen Sabor
        { id: 11, name: 'Minutas', companyId: 3 },
        { id: 12, name: 'Sandwiches', companyId: 3 },
        { id: 13, name: 'Ensaladas', companyId: 3 },
        { id: 14, name: 'Postres', companyId: 3 },
        { id: 15, name: 'Bebidas', companyId: 3 },
        // Café del Centro
        { id: 16, name: 'Cafés', companyId: 4 },
        { id: 17, name: 'Medialunas y Facturas', companyId: 4 },
        { id: 18, name: 'Tostados', companyId: 4 },
        { id: 19, name: 'Licuados y Jugos', companyId: 4 },
        { id: 20, name: 'Postres', companyId: 4 },
        // Sushi Express
        { id: 21, name: 'Rolls', companyId: 5 },
        { id: 22, name: 'Nigiris', companyId: 5 },
        { id: 23, name: 'Sashimis', companyId: 5 },
        { id: 24, name: 'Combinados', companyId: 5 },
        { id: 25, name: 'Bebidas', companyId: 5 }
      ];
      localStorage.setItem(this.storageKey, JSON.stringify(seed));
    }
  }

  // LocalStorage (modo offline)
  private read(): Categoria[] { return JSON.parse(localStorage.getItem(this.storageKey) || '[]'); }
  private write(items: Categoria[]) { localStorage.setItem(this.storageKey, JSON.stringify(items)); }
  private nextId(): number { const items = this.read(); return items.length ? Math.max(...items.map(i => i.id)) + 1 : 1; }

  getAll(): Categoria[] { return this.read(); }
  getById(id: number): Categoria | undefined { return this.read().find(c => c.id === id); }
  getByCompany(companyId: number): Categoria[] { return this.read().filter(c => c.companyId === companyId); }
  create(data: Omit<Categoria, 'id'>): Categoria { const items = this.read(); const it: Categoria = { id: this.nextId(), ...data }; items.push(it); this.write(items); return it; }
  update(item: Categoria): boolean { const items = this.read(); const idx = items.findIndex(i => i.id === item.id); if (idx === -1) return false; items[idx] = item; this.write(items); return true; }
  delete(id: number): boolean { const items = this.read(); const idx = items.findIndex(i => i.id === id); if (idx === -1) return false; items.splice(idx, 1); this.write(items); return true; }

  // HTTP (preparado para backend)
  getAll$(): Observable<Categoria[]> { return this.http.get<Categoria[]>(this.apiBase); }
  getById$(id: number): Observable<Categoria> { return this.http.get<Categoria>(`${this.apiBase}/${id}`); }
  create$(data: Omit<Categoria, 'id'>): Observable<Categoria> { return this.http.post<Categoria>(this.apiBase, data); }
  update$(id: number, data: Omit<Categoria, 'id'>): Observable<Categoria> { return this.http.put<Categoria>(`${this.apiBase}/${id}`, data); }
  delete$(id: number): Observable<void> { return this.http.delete<void>(`${this.apiBase}/${id}`); }
}
