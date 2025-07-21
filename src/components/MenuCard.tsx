import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { MenuItem } from '../types';
import { formatPrice } from '../utils/helpers';

interface MenuCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem, quantity: number, notes?: string) => void;
}

export const MenuCard: React.FC<MenuCardProps> = ({ item, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(item, quantity, notes.trim() || undefined);
    setQuantity(1);
    setNotes('');
    setShowNotes(false);
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  return (
    <div className="card group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      {/* Imagen */}
      <div className="relative overflow-hidden rounded-xl mb-4">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        {!item.available && (
          <div className="absolute inset-0 bg-gray-900/80 flex items-center justify-center">
            <span className="text-white font-semibold bg-red-600 px-3 py-1 rounded-full text-sm">
              No disponible
            </span>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="space-y-3">
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">{item.name}</h3>
          <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary-400">
            {formatPrice(item.price)}
          </span>
          {item.available && (
            <div className="flex items-center space-x-3">
              {/* Control de cantidad */}
              <div className="flex items-center space-x-2 bg-gray-800/50 rounded-lg p-1">
                <button
                  onClick={decrementQuantity}
                  className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-700 transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notas especiales */}
        {item.available && (
          <div className="space-y-3">
            {showNotes && (
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notas especiales (opcional)"
                className="input-field w-full h-20 resize-none text-sm"
                maxLength={100}
              />
            )}
            
            <div className="flex space-x-2">
              <button
                onClick={() => setShowNotes(!showNotes)}
                className="btn-secondary text-sm flex-1"
              >
                {showNotes ? 'Ocultar notas' : 'Agregar notas'}
              </button>
              <button
                onClick={handleAddToCart}
                className="btn-primary text-sm flex-1"
              >
                Agregar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};