import { useState, useCallback } from 'react';
import { Order, OrderStatus } from '../types';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  const addOrder = useCallback((order: Order) => {
    setOrders(prev => [order, ...prev]);
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  }, []);

  const getOrderById = useCallback((orderId: string) => {
    return orders.find(order => order.id === orderId);
  }, [orders]);

  const getOrdersByStatus = useCallback((status: OrderStatus) => {
    return orders.filter(order => order.status === status);
  }, [orders]);

  const getTodayStats = useCallback(() => {
    const today = new Date().toDateString();
    const todayOrders = orders.filter(order => 
      order.createdAt.toDateString() === today
    );

    return {
      totalOrders: todayOrders.length,
      totalSales: todayOrders.reduce((sum, order) => sum + order.total, 0),
      activeOrders: orders.filter(order => 
        order.status !== 'delivered'
      ).length,
      completedOrders: todayOrders.filter(order => 
        order.status === 'delivered'
      ).length,
    };
  }, [orders]);

  return {
    orders,
    addOrder,
    updateOrderStatus,
    getOrderById,
    getOrdersByStatus,
    getTodayStats,
  };
};