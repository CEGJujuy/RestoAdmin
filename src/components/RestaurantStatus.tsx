import React from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { isRestaurantOpen } from '../utils/helpers';

export const RestaurantStatus: React.FC = () => {
  const isOpen = isRestaurantOpen();

  if (isOpen) return null;

  return (
    <div className="bg-red-900/20 border border-red-800/50 rounded-xl p-6 mb-8 text-center">
      <div className="flex items-center justify-center space-x-3 mb-3">
        <AlertCircle className="w-6 h-6 text-red-400" />
        <h2 className="text-xl font-semibold text-red-400">Restaurante Cerrado</h2>
      </div>
      <p className="text-gray-300 mb-4">
        Estamos cerrados en este momento. Nuestro horario de atención es de 18:00 a 01:00.
      </p>
      <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
        <Clock className="w-4 h-4" />
        <span>Abrimos a las 18:00</span>
      </div>
    </div>
  );
};