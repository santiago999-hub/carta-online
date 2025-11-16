export interface Producto {
  id: number;
  name: string;
  description?: string;
  price: number;
  categoryId: number;
  companyId: number;
  imageUrl?: string;
}
