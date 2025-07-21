export const restaurantConfig = {
  name: 'RestoAdmin',
  phone: '+54 388 485-8907',
  address: 'Av. Principal 123, Ciudad',
  
  // Horarios de atención
  openingHours: {
    start: 18, // 18:00
    end: 24,   // 00:00 (medianoche)
  },
  
  // Configuración de pedidos
  minOrderAmount: 2000, // Monto mínimo para delivery
  deliveryFee: 500,
  estimatedPrepTime: {
    pickup: 20,   // 20 minutos
    delivery: 35, // 35 minutos
  },
  
  // Métodos de pago disponibles
  paymentMethods: [
    { id: 'mercadopago', name: 'MercadoPago', icon: '💳' },
    { id: 'cash', name: 'Efectivo', icon: '💵' },
  ],
  
  // Categorías del menú
  categories: [
    { id: 'hamburguesas', name: 'Hamburguesas', icon: '🍔' },
    { id: 'pizzas', name: 'Pizzas', icon: '🍕' },
    { id: 'bebidas', name: 'Bebidas', icon: '🥤' },
    { id: 'postres', name: 'Postres', icon: '🍰' },
  ],
};