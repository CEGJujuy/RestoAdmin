import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingBag, MapPin, Clock, CreditCard, DollarSign } from 'lucide-react';
import { CartItem, Customer, DeliveryType, PaymentMethod } from '../types';
import { formatPrice, validatePhone, validateEmail, generateOrderId, getEstimatedTime } from '../utils/helpers';
import { restaurantConfig } from '../data/config';

interface CartProps {
  isOpen: boolean;
  items: CartItem[];
  total: number;
  onClose: () => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onPlaceOrder: (customer: Customer, deliveryType: DeliveryType, paymentMethod: PaymentMethod, notes?: string) => void;
  onClearCart: () => void;
}

export const Cart: React.FC<CartProps> = ({
  isOpen,
  items,
  total,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onUpdateNotes,
  onPlaceOrder,
  onClearCart,
}) => {
  const [step, setStep] = useState<'cart' | 'checkout' | 'confirmation'>('cart');
  const [customer, setCustomer] = useState<Customer>({ name: '', phone: '', email: '', address: '' });
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('pickup');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [orderNotes, setOrderNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [orderId, setOrderId] = useState('');

  const deliveryFee = deliveryType === 'delivery' ? restaurantConfig.deliveryFee : 0;
  const finalTotal = total + deliveryFee;
  const canProceed = total >= restaurantConfig.minOrderAmount || deliveryType === 'pickup';

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!customer.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!customer.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!validatePhone(customer.phone)) {
      newErrors.phone = 'Formato de teléfono inválido';
    }

    if (customer.email && !validateEmail(customer.email)) {
      newErrors.email = 'Formato de email inválido';
    }

    if (deliveryType === 'delivery' && !customer.address?.trim()) {
      newErrors.address = 'La dirección es requerida para delivery';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = () => {
    if (!validateForm()) return;

    const newOrderId = generateOrderId();
    setOrderId(newOrderId);
    onPlaceOrder(customer, deliveryType, paymentMethod, orderNotes.trim() || undefined);
    setStep('confirmation');
  };

  const handleNewOrder = () => {
    onClearCart();
    setStep('cart');
    setCustomer({ name: '', phone: '', email: '', address: '' });
    setOrderNotes('');
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-gray-950 shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <h2 className="text-xl font-semibold text-white">
              {step === 'cart' && 'Tu Pedido'}
              {step === 'checkout' && 'Datos de Entrega'}
              {step === 'confirmation' && '¡Pedido Confirmado!'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {step === 'cart' && (
              <div className="p-6 space-y-6">
                {items.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Tu carrito está vacío</p>
                  </div>
                ) : (
                  <>
                    {/* Items */}
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div key={item.id} className="bg-gray-900/50 rounded-xl p-4 space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-medium text-white">{item.name}</h3>
                              <p className="text-sm text-gray-400">{formatPrice(item.price)}</p>
                            </div>
                            <button
                              onClick={() => onRemoveItem(item.id)}
                              className="text-gray-400 hover:text-red-400 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Quantity controls */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 bg-gray-800/50 rounded-lg p-1">
                              <button
                                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-700 transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-8 text-center font-medium">{item.quantity}</span>
                              <button
                                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-700 transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            <span className="font-semibold text-primary-400">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>

                          {/* Notes */}
                          {item.notes && (
                            <p className="text-sm text-gray-400 italic">"{item.notes}"</p>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Minimum order warning */}
                    {!canProceed && (
                      <div className="bg-yellow-900/20 border border-yellow-800/50 rounded-xl p-4">
                        <p className="text-yellow-400 text-sm">
                          Monto mínimo para delivery: {formatPrice(restaurantConfig.minOrderAmount)}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {step === 'checkout' && (
              <div className="p-6 space-y-6">
                {/* Customer Info */}
                <div className="space-y-4">
                  <h3 className="font-medium text-white">Datos de contacto</h3>
                  
                  <div>
                    <input
                      type="text"
                      placeholder="Nombre completo *"
                      value={customer.name}
                      onChange={(e) => setCustomer(prev => ({ ...prev, name: e.target.value }))}
                      className={`input-field w-full ${errors.name ? 'border-red-500' : ''}`}
                    />
                    {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <input
                      type="tel"
                      placeholder="Teléfono *"
                      value={customer.phone}
                      onChange={(e) => setCustomer(prev => ({ ...prev, phone: e.target.value }))}
                      className={`input-field w-full ${errors.phone ? 'border-red-500' : ''}`}
                    />
                    {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <input
                      type="email"
                      placeholder="Email (opcional)"
                      value={customer.email}
                      onChange={(e) => setCustomer(prev => ({ ...prev, email: e.target.value }))}
                      className={`input-field w-full ${errors.email ? 'border-red-500' : ''}`}
                    />
                    {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                  </div>
                </div>

                {/* Delivery Type */}
                <div className="space-y-4">
                  <h3 className="font-medium text-white">Tipo de entrega</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setDeliveryType('pickup')}
                      className={`p-4 rounded-xl border transition-all ${
                        deliveryType === 'pickup'
                          ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                          : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600'
                      }`}
                    >
                      <Clock className="w-6 h-6 mx-auto mb-2" />
                      <div className="text-sm font-medium">Retiro</div>
                      <div className="text-xs text-gray-400">20 min</div>
                    </button>
                    <button
                      onClick={() => setDeliveryType('delivery')}
                      className={`p-4 rounded-xl border transition-all ${
                        deliveryType === 'delivery'
                          ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                          : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600'
                      }`}
                    >
                      <MapPin className="w-6 h-6 mx-auto mb-2" />
                      <div className="text-sm font-medium">Delivery</div>
                      <div className="text-xs text-gray-400">35 min</div>
                    </button>
                  </div>
                </div>

                {/* Address for delivery */}
                {deliveryType === 'delivery' && (
                  <div>
                    <input
                      type="text"
                      placeholder="Dirección completa *"
                      value={customer.address}
                      onChange={(e) => setCustomer(prev => ({ ...prev, address: e.target.value }))}
                      className={`input-field w-full ${errors.address ? 'border-red-500' : ''}`}
                    />
                    {errors.address && <p className="text-red-400 text-sm mt-1">{errors.address}</p>}
                  </div>
                )}

                {/* Payment Method */}
                <div className="space-y-4">
                  <h3 className="font-medium text-white">Método de pago</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setPaymentMethod('cash')}
                      className={`p-4 rounded-xl border transition-all ${
                        paymentMethod === 'cash'
                          ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                          : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600'
                      }`}
                    >
                      <DollarSign className="w-6 h-6 mx-auto mb-2" />
                      <div className="text-sm font-medium">Efectivo</div>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('mercadopago')}
                      className={`p-4 rounded-xl border transition-all ${
                        paymentMethod === 'mercadopago'
                          ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                          : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600'
                      }`}
                    >
                      <CreditCard className="w-6 h-6 mx-auto mb-2" />
                      <div className="text-sm font-medium">MercadoPago</div>
                    </button>
                  </div>
                </div>

                {/* Order Notes */}
                <div>
                  <textarea
                    placeholder="Notas del pedido (opcional)"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="input-field w-full h-20 resize-none"
                    maxLength={200}
                  />
                </div>
              </div>
            )}

            {step === 'confirmation' && (
              <div className="p-6 text-center space-y-6">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl">✓</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">¡Pedido Confirmado!</h3>
                  <p className="text-gray-400">Tu pedido ha sido recibido y está siendo preparado</p>
                </div>

                <div className="bg-gray-900/50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Número de pedido:</span>
                    <span className="font-mono font-bold text-primary-400">#{orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tiempo estimado:</span>
                    <span className="font-medium text-white">
                      {getEstimatedTime(deliveryType)} minutos
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tipo de entrega:</span>
                    <span className="font-medium text-white">
                      {deliveryType === 'delivery' ? 'Delivery' : 'Retiro en local'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleNewOrder}
                  className="btn-primary w-full"
                >
                  Hacer otro pedido
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          {step !== 'confirmation' && items.length > 0 && (
            <div className="border-t border-gray-800 p-6 space-y-4">
              {/* Total */}
              <div className="space-y-2">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal:</span>
                  <span>{formatPrice(total)}</span>
                </div>
                {deliveryType === 'delivery' && (
                  <div className="flex justify-between text-gray-400">
                    <span>Envío:</span>
                    <span>{formatPrice(deliveryFee)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-semibold text-white border-t border-gray-800 pt-2">
                  <span>Total:</span>
                  <span className="text-primary-400">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                {step === 'cart' && (
                  <>
                    <button
                      onClick={() => setStep('checkout')}
                      disabled={!canProceed}
                      className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continuar
                    </button>
                  </>
                )}
                {step === 'checkout' && (
                  <>
                    <button
                      onClick={() => setStep('cart')}
                      className="btn-secondary flex-1"
                    >
                      Volver
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      className="btn-primary flex-1"
                    >
                      Confirmar Pedido
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};