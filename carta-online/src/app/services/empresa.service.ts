import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Empresa } from '../models/empresa.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EmpresaService {
  private storageKey = 'empresas';
  private readonly apiBase = `${environment.apiUrl}/companies`;
  private readonly useBackend = environment.useBackend;

  constructor(private http: HttpClient) {
    if (!localStorage.getItem(this.storageKey)) {
      const seed: Empresa[] = [
        { 
          id: 1, 
          name: 'La Parrilla Criolla', 
          address: 'Av. Corrientes 1234, CABA', 
          phone: '011-4567-8901', 
          email: 'info@laparrillacriolla.com.ar', 
          logoUrl: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=200&h=200&fit=crop'
        },
        { 
          id: 2, 
          name: 'Pizzería Don Antonio', 
          address: 'Av. Santa Fe 2456, CABA', 
          phone: '011-4567-8902', 
          email: 'contacto@donantonio.com.ar', 
          logoUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop'
        },
        { 
          id: 3, 
          name: 'El Buen Sabor', 
          address: 'Av. Cabildo 3789, CABA', 
          phone: '011-4567-8903', 
          email: 'pedidos@elbuensabor.com.ar', 
          logoUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop'
        },
        { 
          id: 4, 
          name: 'Café del Centro', 
          address: 'Florida 567, CABA', 
          phone: '011-4567-8904', 
          email: 'hola@cafedelcentro.com.ar', 
          logoUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=200&fit=crop'
        },
        { 
          id: 5, 
          name: 'Sushi Express', 
          address: 'Av. Libertador 5678, CABA', 
          phone: '011-4567-8905', 
          email: 'delivery@sushiexpress.com.ar', 
          logoUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=200&h=200&fit=crop'
        }
      ];
      localStorage.setItem(this.storageKey, JSON.stringify(seed));
    }
  }

  // --- LocalStorage helpers ---
  private read(): Empresa[] { return JSON.parse(localStorage.getItem(this.storageKey) || '[]'); }
  private write(items: Empresa[]) { localStorage.setItem(this.storageKey, JSON.stringify(items)); }
  private nextId(): number { const items = this.read(); return items.length ? Math.max(...items.map(i => i.id)) + 1 : 1; }

  // --- Métodos principales (soportan LocalStorage y API) ---
  
  getAll(): Empresa[] {
    if (!this.useBackend) {
      return this.read();
    }
    // Si usa backend, usar getAll$() en su lugar
    return [];
  }

  getAll$(): Observable<Empresa[]> {
    if (this.useBackend) {
      return this.http.get<Empresa[]>(this.apiBase).pipe(
        catchError(err => {
          console.error('Error al obtener empresas:', err);
          return of([]);
        })
      );
    }
    return of(this.read());
  }

  getById(id: number): Empresa | undefined {
    return this.read().find(e => e.id === id);
  }

  getById$(id: number): Observable<Empresa | undefined> {
    if (this.useBackend) {
      return this.http.get<Empresa>(`${this.apiBase}/${id}`).pipe(
        catchError(() => of(undefined))
      );
    }
    return of(this.getById(id));
  }

  create(data: Omit<Empresa, 'id'>): Empresa {
    const items = this.read();
    const it: Empresa = { id: this.nextId(), ...data };
    items.push(it);
    this.write(items);
    return it;
  }

  create$(data: Omit<Empresa, 'id'>): Observable<Empresa> {
    if (this.useBackend) {
      return this.http.post<Empresa>(this.apiBase, data);
    }
    return of(this.create(data));
  }

  update(item: Empresa): boolean {
    const items = this.read();
    const idx = items.findIndex(i => i.id === item.id);
    if (idx === -1) return false;
    items[idx] = item;
    this.write(items);
    return true;
  }

  update$(item: Empresa): Observable<boolean> {
    if (this.useBackend) {
      return this.http.put<Empresa>(`${this.apiBase}/${item.id}`, item).pipe(
        map(() => true),
        catchError(() => of(false))
      );
    }
    return of(this.update(item));
  }

  delete(id: number): boolean {
    const items = this.read();
    const idx = items.findIndex(i => i.id === id);
    if (idx === -1) return false;
    items.splice(idx, 1);
    this.write(items);
    return true;
  }

  delete$(id: number): Observable<boolean> {
    if (this.useBackend) {
      return this.http.delete<void>(`${this.apiBase}/${id}`).pipe(
        map(() => true),
        catchError(() => of(false))
      );
    }
    return of(this.delete(id));
  }
}

