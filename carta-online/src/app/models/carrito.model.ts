export interface CartItem {
  id: number;
  productoId: number;
  productoNombre: string;
  precio: number;
  cantidad: number;
  empresaId: number;
}

export interface Carrito {
  items: CartItem[];
  empresaId?: number;
}
