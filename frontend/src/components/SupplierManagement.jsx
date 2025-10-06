import React, { useState, useEffect } from 'react';
import { 
  FiTruck, FiPackage, FiUser, FiMail, FiPhone, FiMapPin, FiCalendar,
  FiClock, FiDollarSign, FiTrendingUp, FiTrendingDown, FiCheckCircle,
  FiAlertCircle, FiX, FiPlus, FiEdit, FiTrash2, FiEye, FiDownload,
  FiUpload, FiRefreshCw, FiSearch, FiFilter, FiStar, FiShield,
  FiHash, FiTag, FiTarget, FiZap, FiHeart
} from 'react-icons/fi';
import { toast } from 'react-toastify';

const SupplierManagement = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('suppliers');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);

  const [suppliers, setSuppliers] = useState([
    {
      id: 1,
      name: 'Apple Inc.',
      contact: 'John Smith',
      email: 'orders@apple.com',
      phone: '+1 (555) 123-4567',
      address: '1 Apple Park Way, Cupertino, CA 95014',
      category: 'Electronics',
      rating: 4.9,
      totalOrders: 45,
      totalValue: 1250000,
      lastOrder: '2024-01-15',
      status: 'active',
      paymentTerms: 'Net 30',
      leadTime: '7-14 days',
      image: '🍎'
    },
    {
      id: 2,
      name: 'Samsung Electronics',
      contact: 'Sarah Johnson',
      email: 'procurement@samsung.com',
      phone: '+1 (555) 987-6543',
      address: '85 Challenger Rd, Ridgefield Park, NJ 07660',
      category: 'Electronics',
      rating: 4.7,
      totalOrders: 32,
      totalValue: 890000,
      lastOrder: '2024-01-12',
      status: 'active',
      paymentTerms: 'Net 15',
      leadTime: '5-10 days',
      image: '📱'
    },
    {
      id: 3,
      name: 'Microsoft Corporation',
      contact: 'Mike Wilson',
      email: 'sales@microsoft.com',
      phone: '+1 (555) 456-7890',
      address: '1 Microsoft Way, Redmond, WA 98052',
      category: 'Software',
      rating: 4.8,
      totalOrders: 28,
      totalValue: 650000,
      lastOrder: '2024-01-10',
      status: 'active',
      paymentTerms: 'Net 30',
      leadTime: '3-7 days',
      image: '💻'
    }
  ]);

  const [orders, setOrders] = useState([
    {
      id: 1,
      supplierId: 1,
      supplierName: 'Apple Inc.',
      orderNumber: 'PO-2024-001',
      date: '2024-01-15',
      expectedDate: '2024-01-29',
      status: 'pending',
      total: 25000,
      items: [
        { name: 'iPhone 15 Pro Max', quantity: 20, price: 1199.99 },
        { name: 'AirPods Pro 3rd Gen', quantity: 50, price: 249.99 }
      ],
      priority: 'high'
    },
    {
      id: 2,
      supplierId: 2,
      supplierName: 'Samsung Electronics',
      orderNumber: 'PO-2024-002',
      date: '2024-01-12',
      expectedDate: '2024-01-22',
      status: 'shipped',
      total: 18000,
      items: [
        { name: 'Galaxy S24 Ultra', quantity: 15, price: 1199.99 },
        { name: 'Galaxy Buds Pro', quantity: 30, price: 199.99 }
      ],
      priority: 'medium'
    },
    {
      id: 3,
      supplierId: 3,
      supplierName: 'Microsoft Corporation',
      orderNumber: 'PO-2024-003',
      date: '2024-01-10',
      expectedDate: '2024-01-17',
      status: 'delivered',
      total: 12000,
      items: [
        { name: 'Surface Pro 9', quantity: 10, price: 1199.99 }
      ],
      priority: 'low'
    }
  ]);

  const [analytics, setAnalytics] = useState({
    totalSuppliers: 24,
    activeSuppliers: 18,
    pendingOrders: 5,
    totalOrderValue: 125000,
    averageLeadTime: 8.5,
    topSupplier: 'Apple Inc.',
    monthlySavings: 15000
  });

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrders = orders.filter(order =>
    order.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateOrder = (supplier) => {
    setSelectedSupplier(supplier);
    setShowOrderModal(true);
  };

  const handleViewSupplier = (supplier) => {
    setSelectedSupplier(supplier);
    setShowSupplierModal(true);
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    toast.success(`Order status updated to ${newStatus}`);
  };

  const handleDeleteSupplier = (supplierId) => {
    setSuppliers(suppliers.filter(supplier => supplier.id !== supplierId));
    toast.success('Supplier deleted successfully');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <FiTruck className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Supplier Management</h2>
                <p className="text-green-100">Manage suppliers, orders, and procurement</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <FiX className="h-8 w-8" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex space-x-1 p-4">
            {[
              { id: 'suppliers', label: 'Suppliers', icon: FiUser },
              { id: 'orders', label: 'Orders', icon: FiPackage },
              { id: 'analytics', label: 'Analytics', icon: FiTrendingUp }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          {/* Suppliers Tab */}
          {activeTab === 'suppliers' && (
            <div className="h-full flex flex-col">
              {/* Search and Actions */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1 max-w-md relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Search suppliers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={() => setShowSupplierModal(true)}
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    <FiPlus className="h-5 w-5" />
                    <span>Add Supplier</span>
                  </button>
                </div>
              </div>

              {/* Suppliers Grid */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSuppliers.map(supplier => (
                    <div key={supplier.id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="text-3xl">{supplier.image}</div>
                          <div>
                            <h3 className="font-bold text-gray-900">{supplier.name}</h3>
                            <p className="text-sm text-gray-600">{supplier.category}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(supplier.status)}`}>
                          {supplier.status}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <FiUser className="h-4 w-4" />
                          <span>{supplier.contact}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <FiMail className="h-4 w-4" />
                          <span>{supplier.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <FiPhone className="h-4 w-4" />
                          <span>{supplier.phone}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-1">
                          <FiStar className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{supplier.rating}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {supplier.totalOrders} orders
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewSupplier(supplier)}
                          className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleCreateOrder(supplier)}
                          className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600 transition-colors"
                        >
                          New Order
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="h-full flex flex-col">
              {/* Search and Filters */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1 max-w-md relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Search orders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button className="flex items-center space-x-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
                      <FiFilter className="h-5 w-5" />
                      <span>Filter</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                      <FiPlus className="h-5 w-5" />
                      <span>New Order</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Orders List */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4">
                  {filteredOrders.map(order => (
                    <div key={order.id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="text-2xl">📦</div>
                          <div>
                            <h3 className="font-bold text-gray-900">{order.orderNumber}</h3>
                            <p className="text-sm text-gray-600">{order.supplierName}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(order.priority)}`}>
                            {order.priority}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Order Date</p>
                          <p className="font-medium">{order.date}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Expected Date</p>
                          <p className="font-medium">{order.expectedDate}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total Value</p>
                          <p className="font-medium">${order.total.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Items</p>
                          <p className="font-medium">{order.items.length}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          {order.status === 'pending' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, 'shipped')}
                              className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors"
                            >
                              Mark Shipped
                            </button>
                          )}
                          {order.status === 'shipped' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}
                              className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600 transition-colors"
                            >
                              Mark Delivered
                            </button>
                          )}
                          <button className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-600 transition-colors">
                            View Details
                          </button>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 transition-colors">
                            <FiEye className="h-5 w-5" />
                          </button>
                          <button className="text-green-600 hover:text-green-800 transition-colors">
                            <FiDownload className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="h-full overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 text-white">
                  <h3 className="text-lg font-bold mb-2">Total Suppliers</h3>
                  <p className="text-3xl font-bold">{analytics.totalSuppliers}</p>
                  <p className="text-blue-100 text-sm">+2 this month</p>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
                  <h3 className="text-lg font-bold mb-2">Active Suppliers</h3>
                  <p className="text-3xl font-bold">{analytics.activeSuppliers}</p>
                  <p className="text-green-100 text-sm">75% active rate</p>
                </div>
                <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white">
                  <h3 className="text-lg font-bold mb-2">Pending Orders</h3>
                  <p className="text-3xl font-bold">{analytics.pendingOrders}</p>
                  <p className="text-orange-100 text-sm">$125K value</p>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
                  <h3 className="text-lg font-bold mb-2">Monthly Savings</h3>
                  <p className="text-3xl font-bold">${analytics.monthlySavings.toLocaleString()}</p>
                  <p className="text-purple-100 text-sm">+12% from last month</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Top Suppliers</h3>
                  <div className="space-y-4">
                    {suppliers.slice(0, 5).map((supplier, index) => (
                      <div key={supplier.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{supplier.name}</p>
                            <p className="text-sm text-gray-600">{supplier.totalOrders} orders</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">${supplier.totalValue.toLocaleString()}</p>
                          <div className="flex items-center space-x-1">
                            <FiStar className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600">{supplier.rating}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Order Status Distribution</h3>
                  <div className="space-y-4">
                    {[
                      { status: 'Delivered', count: 15, color: 'bg-green-500', percentage: 60 },
                      { status: 'Shipped', count: 6, color: 'bg-blue-500', percentage: 24 },
                      { status: 'Pending', count: 4, color: 'bg-yellow-500', percentage: 16 }
                    ].map(item => (
                      <div key={item.status} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                          <span className="font-medium text-gray-900">{item.status}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${item.color}`}
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-600 w-8">{item.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplierManagement;
