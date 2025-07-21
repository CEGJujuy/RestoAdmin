import { useState, useCallback } from 'react';
import { CartItem, MenuItem } from '../types';

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((menuItem: MenuItem, quantity: number = 1, notes?: string) => {
    setItems(prev => {
      const existingItem = prev.find(item => item.id === menuItem.id);
      
      if (existingItem) {
        return prev.map(item =>
          item.id === menuItem.id
            ? { ...item, quantity: item.quantity + quantity, notes: notes || item.notes }
            : item
        );
      }
      
      return [...prev, { ...menuItem, quantity, notes }];
    });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const updateNotes = useCallback((id: string, notes: string) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, notes } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const toggleCart = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    items,
    total,
    itemCount,
    isOpen,
    addItem,
    updateQuantity,
    removeItem,
    updateNotes,
    clearCart,
    toggleCart,
    setIsOpen,
  };
};