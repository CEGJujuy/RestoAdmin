import { MenuItem } from '../types';

export const menuItems: MenuItem[] = [
  // Hamburguesas
  {
    id: 'h1',
    name: 'Burger Clásica',
    description: 'Carne 150g, lechuga, tomate, cebolla, queso cheddar y salsa especial',
    price: 2800,
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'hamburguesas',
    available: true,
  },
  {
    id: 'h2',
    name: 'Burger BBQ',
    description: 'Doble carne, bacon, queso, cebolla caramelizada y salsa BBQ',
    price: 3500,
    image: 'https://images.pexels.com/photos/3738730/pexels-photo-3738730.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'hamburguesas',
    available: true,
  },
  {
    id: 'h3',
    name: 'Burger Veggie',
    description: 'Medallón de quinoa y vegetales, palta, tomate y mayonesa vegana',
    price: 2600,
    image: 'https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'hamburguesas',
    available: true,
  },
  
  // Pizzas
  {
    id: 'p1',
    name: 'Pizza Margherita',
    description: 'Salsa de tomate, mozzarella fresca, albahaca y aceite de oliva',
    price: 3200,
    image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'pizzas',
    available: true,
  },
  {
    id: 'p2',
    name: 'Pizza Pepperoni',
    description: 'Salsa de tomate, mozzarella, pepperoni y orégano',
    price: 3600,
    image: 'https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'pizzas',
    available: true,
  },
  {
    id: 'p3',
    name: 'Pizza Cuatro Quesos',
    description: 'Mozzarella, gorgonzola, parmesano y provolone',
    price: 3800,
    image: 'https://images.pexels.com/photos/4109111/pexels-photo-4109111.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'pizzas',
    available: true,
  },
  
  // Bebidas
  {
    id: 'b1',
    name: 'Coca Cola 500ml',
    description: 'Bebida gaseosa clásica',
    price: 800,
    image: 'https://images.pexels.com/photos/2775860/pexels-photo-2775860.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'bebidas',
    available: true,
  },
  {
    id: 'b2',
    name: 'Agua Mineral 500ml',
    description: 'Agua mineral natural sin gas',
    price: 600,
    image: 'https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'bebidas',
    available: true,
  },
  {
    id: 'b3',
    name: 'Cerveza Artesanal',
    description: 'Cerveza IPA 473ml',
    price: 1200,
    image: 'https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'bebidas',
    available: true,
  },
  
  // Postres
  {
    id: 'd1',
    name: 'Brownie con Helado',
    description: 'Brownie de chocolate tibio con helado de vainilla',
    price: 1800,
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'postres',
    available: true,
  },
  {
    id: 'd2',
    name: 'Cheesecake',
    description: 'Cheesecake de frutos rojos con base de galletas',
    price: 2000,
    image: 'https://images.pexels.com/photos/140831/pexels-photo-140831.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'postres',
    available: true,
  },
];