export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'hamburguesas' | 'pizzas' | 'bebidas' | 'postres';
  available: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
  notes?: string;
}

export interface Customer {
  name: string;
  phone: string;
  email?: string;
  address?: string;
}

export interface Order {
  id: string;
  customer: Customer;
  items: CartItem[];
  total: number;
  deliveryType: 'delivery' | 'pickup';
  paymentMethod: 'mercadopago' | 'cash';
  status: 'received' | 'preparing' | 'ready' | 'delivered';
  createdAt: Date;
  estimatedTime: number; // en minutos
  notes?: string;
}

export type OrderStatus = Order['status'];
export type DeliveryType = Order['deliveryType'];
export type PaymentMethod = Order['paymentMethod'];
export type Category = MenuItem['category'];