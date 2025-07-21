import React from 'react';
import { ShoppingCart, Clock, Phone, MapPin } from 'lucide-react';
import { restaurantConfig } from '../data/config';
import { isRestaurantOpen } from '../utils/helpers';

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
  onAdminClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  cartItemCount, 
  onCartClick, 
  onAdminClick 
}) => {
  const isOpen = isRestaurantOpen();

  return (
    <header className="sticky top-0 z-50 bg-gray-950/95 backdrop-blur-md border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo y nombre */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{restaurantConfig.name}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span className={`font-medium ${isOpen ? 'text-green-400' : 'text-red-400'}`}>
                    {isOpen ? 'Abierto' : 'Cerrado'}
                  </span>
                </div>
                <div className="hidden sm:flex items-center space-x-1">
                  <Phone className="w-3 h-3" />
                  <span>{restaurantConfig.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onAdminClick}
              className="hidden sm:inline-flex items-center px-3 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Admin
            </button>
            
            <button
              onClick={onCartClick}
              className="relative btn-primary flex items-center space-x-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:inline">Carrito</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-bounce-subtle">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};