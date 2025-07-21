import React, { useState } from 'react';
import { ArrowLeft, Search, Clock, DollarSign, Package, CheckCircle, Eye } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { formatPrice, formatTime, cn } from '../utils/helpers';

interface AdminPanelProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onBack: () => void;
  stats: {
    totalOrders: number;
    totalSales: number;
    activeOrders: number;
    completedOrders: number;
  };
}

const statusConfig = {
  received: { label: 'Recibido', color: 'bg-blue-500', textColor: 'text-blue-400', bgColor: 'bg-blue-900/30' },
  preparing: { label: 'En preparación', color: 'bg-yellow-500', textColor: 'text-yellow-400', bgColor: 'bg-yellow-900/30' },
  ready: { label: 'Listo', color: 'bg-green-500', textColor: 'text-green-400', bgColor: 'bg-green-900/30' },
  delivered: { label: 'Entregado', color: 'bg-gray-500', textColor: 'text-gray-400', bgColor: 'bg-gray-900/30' },
};

export const AdminPanel: React.FC<AdminPanelProps> = ({
  orders,
  onUpdateOrderStatus,
  onBack,
  stats,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchTerm === '' || 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.phone.includes(searchTerm);
    
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    const statusFlow: Record<OrderStatus, OrderStatus | null> = {
      received: 'preparing',
      preparing: 'ready',
      ready: 'delivered',
      delivered: null,
    };
    return statusFlow[currentStatus];
  };

  const handleStatusUpdate = (orderId: string, currentStatus: OrderStatus) => {
    const nextStatus = getNextStatus(currentStatus);
    if (nextStatus) {
      onUpdateOrderStatus(orderId, nextStatus);
    }
  };

  if (selectedOrder) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <div className="max-w-4xl mx-auto p-6">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <button
              onClick={() => setSelectedOrder(null)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Detalle del Pedido</h1>
              <p className="text-gray-400">#{selectedOrder.id}</p>
            </div>
          </div>

          {/* Order Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Customer Info */}
            <div className="card space-y-4">
              <h2 className="text-xl font-semibold mb-4">Información del Cliente</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-400">Nombre</label>
                  <p className="font-medium">{selectedOrder.customer.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Teléfono</label>
                  <p className="font-medium">{selectedOrder.customer.phone}</p>
                </div>
                {selectedOrder.customer.email && (
                  <div>
                    <label className="text-sm text-gray-400">Email</label>
                    <p className="font-medium">{selectedOrder.customer.email}</p>
                  </div>
                )}
                {selectedOrder.customer.address && (
                  <div>
                    <label className="text-sm text-gray-400">Dirección</label>
                    <p className="font-medium">{selectedOrder.customer.address}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Info */}
            <div className="card space-y-4">
              <h2 className="text-xl font-semibold mb-4">Información del Pedido</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-400">Estado</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={cn('badge', statusConfig[selectedOrder.status].bgColor, statusConfig[selectedOrder.status].textColor)}>
                      {statusConfig[selectedOrder.status].label}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Tipo de entrega</label>
                  <p className="font-medium">{selectedOrder.deliveryType === 'delivery' ? 'Delivery' : 'Retiro en local'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Método de pago</label>
                  <p className="font-medium">{selectedOrder.paymentMethod === 'cash' ? 'Efectivo' : 'MercadoPago'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Hora del pedido</label>
                  <p className="font-medium">{formatTime(selectedOrder.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Tiempo estimado</label>
                  <p className="font-medium">{selectedOrder.estimatedTime} minutos</p>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="lg:col-span-2 card">
              <h2 className="text-xl font-semibold mb-4">Items del Pedido</h2>
              <div className="space-y-3">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start p-4 bg-gray-800/30 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-400">Cantidad: {item.quantity}</p>
                      {item.notes && (
                        <p className="text-sm text-gray-400 italic mt-1">"{item.notes}"</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                      <p className="text-sm text-gray-400">{formatPrice(item.price)} c/u</p>
                    </div>
                  </div>
                ))}
                
                <div className="border-t border-gray-700 pt-3 mt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span className="text-primary-400">{formatPrice(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            {selectedOrder.status !== 'delivered' && (
              <div className="lg:col-span-2">
                <button
                  onClick={() => handleStatusUpdate(selectedOrder.id, selectedOrder.status)}
                  className="btn-primary w-full"
                >
                  Marcar como {statusConfig[getNextStatus(selectedOrder.status)!]?.label}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold">Panel de Administración</h1>
              <p className="text-gray-400">Gestión de pedidos en tiempo real</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <Package className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{stats.totalOrders}</p>
            <p className="text-sm text-gray-400">Pedidos hoy</p>
          </div>
          <div className="card text-center">
            <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{formatPrice(stats.totalSales)}</p>
            <p className="text-sm text-gray-400">Ventas hoy</p>
          </div>
          <div className="card text-center">
            <Clock className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{stats.activeOrders}</p>
            <p className="text-sm text-gray-400">Pedidos activos</p>
          </div>
          <div className="card text-center">
            <CheckCircle className="w-8 h-8 text-primary-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{stats.completedOrders}</p>
            <p className="text-sm text-gray-400">Completados hoy</p>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por ID, nombre o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field w-full pl-10"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as OrderStatus | 'all')}
              className="input-field"
            >
              <option value="all">Todos los estados</option>
              <option value="received">Recibido</option>
              <option value="preparing">En preparación</option>
              <option value="ready">Listo</option>
              <option value="delivered">Entregado</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="card text-center py-12">
              <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No hay pedidos que coincidan con los filtros</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="card hover:shadow-xl transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="font-mono font-bold text-primary-400">#{order.id}</p>
                      <p className="text-sm text-gray-400">{formatTime(order.createdAt)}</p>
                    </div>
                    <div>
                      <p className="font-medium">{order.customer.name}</p>
                      <p className="text-sm text-gray-400">{order.customer.phone}</p>
                    </div>
                    <div>
                      <p className="font-bold text-white">{formatPrice(order.total)}</p>
                      <p className="text-sm text-gray-400">
                        {order.deliveryType === 'delivery' ? 'Delivery' : 'Retiro'}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={cn('badge', statusConfig[order.status].bgColor, statusConfig[order.status].textColor)}>
                        {statusConfig[order.status].label}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                      title="Ver detalles"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    {order.status !== 'delivered' && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, order.status)}
                        className="btn-primary text-sm px-4 py-2"
                      >
                        {statusConfig[getNextStatus(order.status)!]?.label}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};