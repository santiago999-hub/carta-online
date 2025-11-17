import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empresa } from '../models/empresa.model';

@Injectable({ providedIn: 'root' })
export class EmpresaService {
  private storageKey = 'empresas';
  // API base opcional (preparado para backend). Si no se usa, quedan métodos sync de LocalStorage.
  private readonly apiBase = 'http://localhost:5230/api/companies';

  constructor(private http: HttpClient) {
    if (!localStorage.getItem(this.storageKey)) {
      const seed: Empresa[] = [
        { id: 1, name: 'La Parrilla Criolla', address: 'Av. Corrientes 1234, CABA', phone: '011-4567-8901', email: 'info@laparrillacriolla.com.ar', logoUrl: '' },
        { id: 2, name: 'Pizzería Don Antonio', address: 'Av. Santa Fe 2456, CABA', phone: '011-4567-8902', email: 'contacto@donantonio.com.ar', logoUrl: '' },
        { id: 3, name: 'El Buen Sabor', address: 'Av. Cabildo 3789, CABA', phone: '011-4567-8903', email: 'pedidos@elbuensabor.com.ar', logoUrl: '' },
        { id: 4, name: 'Café del Centro', address: 'Florida 567, CABA', phone: '011-4567-8904', email: 'hola@cafedelcentro.com.ar', logoUrl: '' },
        { id: 5, name: 'Sushi Express', address: 'Av. Libertador 5678, CABA', phone: '011-4567-8905', email: 'delivery@sushiexpress.com.ar', logoUrl: '' }
      ];
      localStorage.setItem(this.storageKey, JSON.stringify(seed));
    }
  }

  // --- LocalStorage (modo offline por defecto) ---
  private read(): Empresa[] { return JSON.parse(localStorage.getItem(this.storageKey) || '[]'); }
  private write(items: Empresa[]) { localStorage.setItem(this.storageKey, JSON.stringify(items)); }
  private nextId(): number { const items = this.read(); return items.length ? Math.max(...items.map(i => i.id)) + 1 : 1; }

  getAll(): Empresa[] { return this.read(); }
  getById(id: number): Empresa | undefined { return this.read().find(e => e.id === id); }
  create(data: Omit<Empresa, 'id'>): Empresa { const items = this.read(); const it: Empresa = { id: this.nextId(), ...data }; items.push(it); this.write(items); return it; }
  update(item: Empresa): boolean { const items = this.read(); const idx = items.findIndex(i => i.id === item.id); if (idx === -1) return false; items[idx] = item; this.write(items); return true; }
  delete(id: number): boolean { const items = this.read(); const idx = items.findIndex(i => i.id === id); if (idx === -1) return false; items.splice(idx, 1); this.write(items); return true; }

  // --- Métodos preparados para backend (no usados aún en componentes) ---
  getAll$(): Observable<Empresa[]> { return this.http.get<Empresa[]>(this.apiBase); }
  getById$(id: number): Observable<Empresa> { return this.http.get<Empresa>(`${this.apiBase}/${id}`); }
  create$(data: Omit<Empresa, 'id'>): Observable<Empresa> { return this.http.post<Empresa>(this.apiBase, data); }
  update$(id: number, data: Omit<Empresa, 'id'>): Observable<Empresa> { return this.http.put<Empresa>(`${this.apiBase}/${id}`, data); }
  delete$(id: number): Observable<void> { return this.http.delete<void>(`${this.apiBase}/${id}`); }

  /**
   * Nota: cuando conectes el backend, cambia las llamadas en componentes a las versiones con $.
   */
}

