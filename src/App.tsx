import React, { useState } from 'react';
import { Header } from './components/Header';
import { CategoryFilter } from './components/CategoryFilter';
import { MenuCard } from './components/MenuCard';
import { Cart } from './components/Cart';
import { AdminPanel } from './components/AdminPanel';
import { RestaurantStatus } from './components/RestaurantStatus';
import { useCart } from './hooks/useCart';
import { useOrders } from './hooks/useOrders';
import { menuItems } from './data/menu';
import { Category, MenuItem, Customer, DeliveryType, PaymentMethod } from './types';
import { generateOrderId, getEstimatedTime, isRestaurantOpen } from './utils/helpers';

function App() {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [showAdmin, setShowAdmin] = useState(false);
  
  const cart = useCart();
  const orders = useOrders();

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const handleAddToCart = (item: MenuItem, quantity: number, notes?: string) => {
    if (!isRestaurantOpen()) {
      alert('El restaurante está cerrado. Horario: 18:00 - 01:00');
      return;
    }
    cart.addItem(item, quantity, notes);
  };

  const handlePlaceOrder = (
    customer: Customer, 
    deliveryType: DeliveryType, 
    paymentMethod: PaymentMethod, 
    notes?: string
  ) => {
    const order = {
      id: generateOrderId(),
      customer,
      items: cart.items,
      total: cart.total + (deliveryType === 'delivery' ? 500 : 0),
      deliveryType,
      paymentMethod,
      status: 'received' as const,
      createdAt: new Date(),
      estimatedTime: getEstimatedTime(deliveryType),
      notes,
    };

    orders.addOrder(order);
    cart.clearCart();
  };

  if (showAdmin) {
    return (
      <AdminPanel
        orders={orders.orders}
        onUpdateOrderStatus={orders.updateOrderStatus}
        onBack={() => setShowAdmin(false)}
        stats={orders.getTodayStats()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Header
        cartItemCount={cart.itemCount}
        onCartClick={cart.toggleCart}
        onAdminClick={() => setShowAdmin(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RestaurantStatus />
        
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Menú Digital
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Descubre nuestros deliciosos platos preparados con ingredientes frescos y de la mejor calidad
          </p>
        </div>

        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {filteredItems.map((item) => (
            <MenuCard
              key={item.id}
              item={item}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">
              No hay productos disponibles en esta categoría
            </p>
          </div>
        )}
      </main>

      <Cart
        isOpen={cart.isOpen}
        items={cart.items}
        total={cart.total}
        onClose={() => cart.setIsOpen(false)}
        onUpdateQuantity={cart.updateQuantity}
        onRemoveItem={cart.removeItem}
        onUpdateNotes={cart.updateNotes}
        onPlaceOrder={handlePlaceOrder}
        onClearCart={cart.clearCart}
      />
    </div>
  );
}

export default App;