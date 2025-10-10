import React, { useState, useEffect } from 'react';
import { 
  FiUser, FiShoppingBag, FiPackage, FiTruck, FiTrendingUp, 
  FiZap, FiAward, FiBell, FiSettings, FiLogOut, FiSearch,
  FiCreditCard, FiShield, FiMessageCircle, FiCalendar, 
  FiMapPin, FiClock, FiUsers, FiShare2, FiEye, FiThumbsUp,
  FiGrid, FiList, FiChevronRight, FiPlus, FiMinus, FiRefreshCw, 
  FiDollarSign, FiTarget, FiAlertCircle, FiCheckCircle, FiEdit,
  FiDownload, FiUpload, FiPrinter, FiMail, FiStar, FiHeart,
  FiShoppingCart, FiTag, FiHash, FiImage, FiInfo, FiHelpCircle,
  FiBarChart, FiPieChart, FiActivity, FiGift, FiNavigation, 
  FiX, FiCheck, FiPercent, FiPhone, FiWifi, FiGlobe, FiCamera
} from 'react-icons/fi';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import BarcodeScannerModal from '../components/BarcodeScannerModal';
import ProductInventoryInterface from '../components/ProductInventoryInterface';

const CashierPortal = () => {
  const [activeTab, setActiveTab] = useState('pos');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentTransaction, setCurrentTransaction] = useState({
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0,
    paymentMethod: null,
    customer: null
  });
  const [paymentModal, setPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  
  // Sample products for POS
  const [sampleProducts] = useState([
    { id: 'P001', name: 'Posho (Maize Flour) 1kg', price: 2500, barcode: '1234567890123', category: 'Groceries', stock: 150 },
    { id: 'P002', name: 'Rice - Local 1kg', price: 3500, barcode: '1234567890124', category: 'Groceries', stock: 200 },
    { id: 'P003', name: 'Sugar - Kakira 1kg', price: 2800, barcode: '1234567890125', category: 'Groceries', stock: 85 },
    { id: 'P004', name: 'Cooking Oil - Fresh 1L', price: 4500, barcode: '1234567890126', category: 'Groceries', stock: 120 },
    { id: 'P005', name: 'Beans - Red 1kg', price: 3200, barcode: '1234567890127', category: 'Groceries', stock: 95 },
    { id: 'P006', name: 'Milk - Fresh 1L', price: 2000, barcode: '1234567890128', category: 'Dairy', stock: 45 },
    { id: 'P007', name: 'Bread - Local', price: 1500, barcode: '1234567890129', category: 'Bakery', stock: 78 },
    { id: 'P008', name: 'Soap - Imperial', price: 800, barcode: '1234567890130', category: 'Personal Care', stock: 165 },
    { id: 'P009', name: 'Tomatoes 1kg', price: 3000, barcode: '1234567890131', category: 'Fresh Produce', stock: 25 },
    { id: 'P010', name: 'Onions 1kg', price: 2200, barcode: '1234567890132', category: 'Fresh Produce', stock: 40 }
  ]);

  // Payment methods available in Uganda
  const paymentMethods = [
    {
      id: 'mtn_momo',
      name: 'MTN Mobile Money',
      icon: '📱',
      color: 'bg-yellow-600 hover:bg-yellow-700',
      description: 'Pay with MTN MoMo',
      fee: 0.015, // 1.5% fee
      limit: 10000000 // UGX 10M daily limit
    },
    {
      id: 'airtel_money',
      name: 'Airtel Money',
      icon: '📲',
      color: 'bg-red-600 hover:bg-red-700',
      description: 'Pay with Airtel Money',
      fee: 0.02, // 2% fee
      limit: 5000000 // UGX 5M daily limit
    },
    {
      id: 'card_payment',
      name: 'Card Payment',
      icon: '💳',
      color: 'bg-blue-600 hover:bg-blue-700',
      description: 'Visa/Mastercard',
      fee: 0.025, // 2.5% fee
      limit: 50000000 // UGX 50M
    },
    {
      id: 'cash_ugx',
      name: 'Cash (UGX)',
      icon: '💵',
      color: 'bg-green-600 hover:bg-green-700',
      description: 'Uganda Shillings',
      fee: 0, // No fee
      limit: Infinity
    },
    {
      id: 'utl_money',
      name: 'UTL Money',
      icon: '📞',
      color: 'bg-purple-600 hover:bg-purple-700',
      description: 'UTL Mobile Money',
      fee: 0.018,
      limit: 3000000
    },
    {
      id: 'm_sente',
      name: 'M-Sente',
      icon: '💰',
      color: 'bg-orange-600 hover:bg-orange-700',
      description: 'Uganda Telecom',
      fee: 0.02,
      limit: 2000000
    }
  ];

  // Ugandan Cashier Profile
  const [cashierProfile] = useState({
    name: 'Nakato Sarah',
    role: 'Senior Cashier',
    department: 'Front End Operations',
    employeeId: 'CASH-UG001',
    joinDate: '2023-08-15',
    avatar: '🛒',
    shift: 'Morning Shift (7:00 AM - 3:00 PM)',
    register: 'Till #3',
    manager: 'Mukasa James',
    location: 'Kampala Branch - Garden City',
    languages: ['English', 'Luganda', 'Swahili'],
    permissions: {
      pos: true,
      returns: true,
      voidTransactions: true,
      mobileMoneyTransactions: true,
      foreignCurrency: true,
      loyaltyProgram: true
    }
  });

  // Ugandan Supermarket Performance Data
  const [performanceMetrics] = useState({
    todaySales: 2850000, // UGX
    todayTransactions: 156,
    averageBasketSize: 18275, // UGX
    customersServed: 156,
    scanRate: 38.5, // items per minute
    efficiency: 94,
    mobileMoneyTransactions: 89, // 57% of transactions
    cashTransactions: 45,
    cardTransactions: 22,
    loyaltySignups: 12,
    returnRate: 1.8
  });

  const [dailyTasks, setDailyTasks] = useState([
    { id: 1, title: 'Clock In & Till Opening', completed: true, priority: 'high', time: '7:00 AM' },
    { id: 2, title: 'Count Starting Cash (UGX)', completed: true, priority: 'high', time: '7:15 AM' },
    { id: 3, title: 'Mobile Money System Check', completed: true, priority: 'medium', time: '7:30 AM' },
    { id: 4, title: 'Mid-Day Till Balance', completed: false, priority: 'medium', time: '11:30 AM' },
    { id: 5, title: 'Process Customer Returns', completed: false, priority: 'medium', time: '1:00 PM' },
    { id: 6, title: 'End of Shift Cash Count', completed: false, priority: 'high', time: '2:45 PM' },
    { id: 7, title: 'Clean & Sanitize Station', completed: false, priority: 'low', time: '2:55 PM' }
  ]);

  // Ugandan-specific transaction data
  const [recentTransactions] = useState([
    { id: 'TXN-4156', customer: 'Regular Customer', amount: 45000, items: 8, time: '10:45 AM', method: 'MTN MoMo', status: 'completed', currency: 'UGX' },
    { id: 'TXN-4155', customer: 'Namukasa Grace', amount: 125000, items: 18, time: '10:42 AM', method: 'Cash', status: 'completed', currency: 'UGX' },
    { id: 'TXN-4154', customer: 'Okello Patrick', amount: 67500, items: 12, time: '10:38 AM', method: 'Airtel Money', status: 'completed', currency: 'UGX' },
    { id: 'TXN-4153', customer: 'Asiimwe Mary', amount: 185000, items: 25, time: '10:35 AM', method: 'Visa Card', status: 'completed', currency: 'UGX' },
    { id: 'TXN-4152', customer: 'Mubiru John', amount: 32000, items: 6, time: '10:31 AM', method: 'Cash', status: 'completed', currency: 'UGX' }
  ]);

  // Ugandan supermarket specific departments
  const [departmentSales] = useState([
    { name: 'Groceries & Cereals', value: 850000, color: '#22C55E', percentage: 35 },
    { name: 'Fresh Produce', value: 620000, color: '#3B82F6', percentage: 26 },
    { name: 'Meat & Poultry', value: 485000, color: '#EF4444', percentage: 20 },
    { name: 'Dairy & Beverages', value: 340000, color: '#F59E0B', percentage: 14 },
    { name: 'Personal Care', value: 125000, color: '#8B5CF6', percentage: 5 }
  ]);

  // Local products popular in Uganda
  const [topProducts] = useState([
    { name: 'Posho (Maize Flour)', sales: 145, revenue: 290000 },
    { name: 'Rice - Local', sales: 98, revenue: 245000 },
    { name: 'Sugar - Kakira', sales: 87, revenue: 174000 },
    { name: 'Cooking Oil - Fresh', sales: 76, revenue: 228000 },
    { name: 'Beans - Red', sales: 65, revenue: 130000 }
  ]);

  const [achievements] = useState([
    { id: 1, title: 'Mobile Money Expert', description: 'Processed 100+ MoMo transactions', icon: '📱', date: '2024-01-15', earned: true },
    { id: 2, title: 'Customer Champion', description: 'Perfect customer service rating', icon: '⭐', date: '2024-01-10', earned: true },
    { id: 3, title: 'Language Bridge', description: 'Served customers in 3+ languages', icon: '🗣️', date: '2024-01-08', earned: true },
    { id: 4, title: 'Sales Champion', description: 'Highest daily sales this month', icon: '🏆', date: '2024-01-20', earned: false }
  ]);

  const [notifications] = useState([
    { id: 1, title: 'Break Time', message: 'Tea break in 10 minutes', time: '10:50 AM', read: false, type: 'info' },
    { id: 2, title: 'Mobile Money Issue', message: 'MTN network temporarily slow', time: '10:30 AM', read: false, type: 'urgent' },
    { id: 3, title: 'Price Update', message: 'Sugar prices updated - Check system', time: '9:45 AM', read: true, type: 'info' },
    { id: 4, title: 'Customer Complaint', message: 'Customer needs assistance at Till #2', time: '9:30 AM', read: true, type: 'warning' }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // POS Functions
  const addItemToTransaction = (product) => {
    setCurrentTransaction(prev => {
      const existingItem = prev.items.find(item => item.id === product.id);
      let newItems;
      
      if (existingItem) {
        newItems = prev.items.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...prev.items, { ...product, quantity: 1 }];
      }
      
      const subtotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const tax = subtotal * 0.18; // 18% VAT in Uganda
      const total = subtotal + tax;
      
      return {
        ...prev,
        items: newItems,
        subtotal,
        tax,
        total
      };
    });
  };

  const handleBarcodeScanned = (barcode) => {
    // Find product by barcode
    const product = sampleProducts.find(p => 
      p.barcode === barcode || 
      p.id === barcode ||
      p.name.toLowerCase().includes(barcode.toLowerCase())
    );
    
    if (product) {
      addItemToTransaction(product);
      setShowBarcodeScanner(false);
      // Add success notification or toast here
      console.log(`✅ Product ${product.name} scanned and added!`);
    } else {
      // Create demo product for unrecognized barcode
      const demoProduct = {
        id: `SCAN_${Date.now()}`,
        name: `Scanned Item ${barcode.slice(-4)}`,
        price: Math.floor(Math.random() * 10000) + 2000, // Random price 2k-12k UGX
        barcode: barcode,
        category: 'Scanned Items',
        stock: 50
      };
      addItemToTransaction(demoProduct);
      setShowBarcodeScanner(false);
      console.log(`📦 New item ${demoProduct.name} created and added!`);
    }
  };

  const removeItemFromTransaction = (productId) => {
    setCurrentTransaction(prev => {
      const newItems = prev.items.filter(item => item.id !== productId);
      const subtotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const tax = subtotal * 0.18;
      const total = subtotal + tax;
      
      return {
        ...prev,
        items: newItems,
        subtotal,
        tax,
        total
      };
    });
  };

  const updateItemQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItemFromTransaction(productId);
      return;
    }
    
    setCurrentTransaction(prev => {
      const newItems = prev.items.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      );
      
      const subtotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const tax = subtotal * 0.18;
      const total = subtotal + tax;
      
      return {
        ...prev,
        items: newItems,
        subtotal,
        tax,
        total
      };
    });
  };

  const processPayment = async (paymentMethodId) => {
    setPaymentProcessing(true);
    const paymentMethod = paymentMethods.find(pm => pm.id === paymentMethodId);
    
    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
      
      // Calculate fees
      const fee = currentTransaction.total * paymentMethod.fee;
      const finalAmount = currentTransaction.total + fee;
      
      // Check limits
      if (finalAmount > paymentMethod.limit) {
        throw new Error(`Amount exceeds ${paymentMethod.name} limit of ${formatUGX(paymentMethod.limit)}`);
      }
      
      // Simulate different payment scenarios
      const successRate = paymentMethodId === 'cash_ugx' ? 1 : 0.95; // Cash always succeeds
      const isSuccessful = Math.random() < successRate;
      
      if (!isSuccessful) {
        const errors = [
          'Insufficient funds',
          'Network timeout',
          'Invalid PIN',
          'Transaction declined by bank',
          'Service temporarily unavailable'
        ];
        throw new Error(errors[Math.floor(Math.random() * errors.length)]);
      }
      
      const result = {
        success: true,
        transactionId: `${paymentMethodId.toUpperCase()}_${Date.now()}`,
        amount: currentTransaction.total,
        fee: fee,
        finalAmount: finalAmount,
        paymentMethod: paymentMethod.name,
        timestamp: new Date().toISOString(),
        receipt: {
          items: currentTransaction.items,
          subtotal: currentTransaction.subtotal,
          tax: currentTransaction.tax,
          total: currentTransaction.total,
          cashier: cashierProfile.name,
          register: cashierProfile.register
        }
      };
      
      setPaymentResult(result);
      
      // Clear transaction after successful payment
      setTimeout(() => {
        setCurrentTransaction({
          items: [],
          subtotal: 0,
          tax: 0,
          total: 0,
          paymentMethod: null,
          customer: null
        });
        setPaymentModal(false);
        setPaymentResult(null);
      }, 3000);
      
    } catch (error) {
      setPaymentResult({
        success: false,
        error: error.message,
        paymentMethod: paymentMethod.name
      });
    } finally {
      setPaymentProcessing(false);
    }
  };

  const formatUGX = (amount) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getShiftStatus = () => {
    const hour = currentTime.getHours();
    if (hour >= 7 && hour < 15) return { status: 'On Shift', icon: '🛒', color: 'text-green-600' };
    if (hour >= 15 && hour < 23) return { status: 'Off Shift', icon: '🏠', color: 'text-blue-600' };
    return { status: 'Closed', icon: '🌙', color: 'text-purple-600' };
  };

  const toggleTask = (taskId) => {
    setDailyTasks(tasks => 
      tasks.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const renderPOS = () => (
    <div className="space-y-6 animate-fadeInUp container-glass shadow-xl rounded-2xl p-8 border border-yellow-200">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Selection */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              🛒 Product Selection
            </h3>
            <button
              onClick={() => setShowBarcodeScanner(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg font-bold hover:from-blue-700 hover:to-green-700 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 shadow-lg"
            >
              <FiCamera className="h-5 w-5" />
              <span>📱 Scan Barcode</span>
            </button>
          </div>
          
          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {sampleProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => addItemToTransaction(product)}
                className="border rounded-lg p-4 hover:shadow-md transition-all duration-300 cursor-pointer hover:bg-yellow-50 border-gray-200 hover:border-yellow-300"
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">
                    {product.category === 'Fresh Produce' ? '🥬' :
                     product.category === 'Dairy' ? '🥛' :
                     product.category === 'Bakery' ? '🍞' :
                     product.category === 'Personal Care' ? '🧼' : '🌾'}
                  </div>
                  <h4 className="font-semibold text-sm text-gray-900 mb-1">{product.name}</h4>
                  <p className="text-green-600 font-bold">{formatUGX(product.price)}</p>
                  <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction Summary */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            🧾 Current Transaction
          </h3>
          
          {/* Transaction Items */}
          <div className="space-y-3 max-h-64 overflow-y-auto mb-6">
            {currentTransaction.items.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No items added</p>
            ) : (
              currentTransaction.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                    <p className="text-sm text-gray-600">{formatUGX(item.price)} x {item.quantity}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      <FiMinus />
                    </button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-green-600"
                    >
                      <FiPlus />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItemFromTransaction(item.id)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <FiX className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Transaction Totals */}
          {currentTransaction.items.length > 0 && (
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold">{formatUGX(currentTransaction.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">VAT (18%):</span>
                <span className="font-semibold">{formatUGX(currentTransaction.tax)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span className="text-green-600">{formatUGX(currentTransaction.total)}</span>
              </div>
              
              <button
                onClick={() => setPaymentModal(true)}
                className="w-full bg-gradient-to-r from-yellow-500 to-red-600 text-white py-3 rounded-lg font-semibold hover:from-yellow-600 hover:to-red-700 transition-all duration-300 mt-4"
              >
                💳 Process Payment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6 animate-slideInLeft container-3d bg-white rounded-2xl p-8 shadow-2xl">
      {/* Ugandan-themed Welcome Section */}
      <div className="bg-gradient-to-r from-yellow-500 via-red-600 to-black rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {getGreeting()}, {cashierProfile.name}! 🇺🇬
            </h1>
            <p className="text-yellow-100 text-lg">
              Webale nyo! Ready to serve our customers with excellence!
            </p>
            <div className="flex items-center mt-4 space-x-6">
              <div className="flex items-center space-x-2">
                <FiClock className="h-5 w-5" />
                <span>{currentTime.toLocaleTimeString('en-UG')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiMapPin className="h-5 w-5" />
                <span>{cashierProfile.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`font-semibold ${getShiftStatus().color}`}>
                  {getShiftStatus().icon} {getShiftStatus().status}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <FiShoppingCart className="h-5 w-5" />
                <span>{cashierProfile.register}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-6xl mb-2">🏪</div>
            <p className="text-yellow-100 font-semibold">FAREDEAL Uganda</p>
            <p className="text-yellow-200 text-sm">Supermarket</p>
            
            {/* Quick Scanner Access */}
            <button
              onClick={() => setShowBarcodeScanner(true)}
              className="mt-4 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-xl font-bold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 shadow-lg border border-white/30"
            >
              <FiCamera className="h-6 w-6" />
              <span>📱 Quick Scan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hardware Scanner Banner */}
      <div className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 rounded-xl p-6 shadow-2xl animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <FiCamera className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                <span className="text-xs font-bold text-black">!</span>
              </div>
            </div>
            <div className="text-white">
              <h3 className="text-2xl font-bold mb-2">🔍 Advanced Hardware Scanner System</h3>
              <p className="text-green-100 text-lg">Mobile Camera • USB Scanners • Bluetooth • Network Scanners</p>
              <div className="flex items-center space-x-4 mt-2 text-sm">
                <span className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>📱 Mobile Ready</span>
                </span>
                <span className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span>🔌 USB Compatible</span>
                </span>
                <span className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  <span>📶 Bluetooth Support</span>
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => setShowBarcodeScanner(true)}
              className="px-8 py-4 bg-white text-purple-600 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center space-x-3"
            >
              <FiZap className="h-6 w-6" />
              <span>Launch Scanner</span>
            </button>
            <div className="text-center text-white/80 text-sm">
              <p>✨ Real hardware integration</p>
              <p>🇺🇬 Built for Uganda retail</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ugandan Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Today\'s Sales', value: formatUGX(performanceMetrics.todaySales), icon: FiDollarSign, color: 'from-green-500 to-green-600', change: '+15.2%', desc: 'vs yesterday' },
          { title: 'Customers Served', value: performanceMetrics.customersServed, icon: FiUsers, color: 'from-blue-500 to-blue-600', change: '+12.3%', desc: 'customers' },
          { title: 'Avg Basket Size', value: formatUGX(performanceMetrics.averageBasketSize), icon: FiShoppingBag, color: 'from-purple-500 to-purple-600', change: '+8.2%', desc: 'per customer' },
          { title: 'Mobile Money', value: `${performanceMetrics.mobileMoneyTransactions}`, icon: FiPhone, color: 'from-orange-500 to-orange-600', change: '+18.7%', desc: 'transactions' },
          { title: 'Efficiency Score', value: `${performanceMetrics.efficiency}%`, icon: FiTarget, color: 'from-indigo-500 to-indigo-600', change: '+2.1%', desc: 'accuracy' },
          { title: 'Loyalty Signups', value: performanceMetrics.loyaltySignups, icon: FiAward, color: 'from-pink-500 to-pink-600', change: '+6', desc: 'new members' },
          { title: 'Return Rate', value: `${performanceMetrics.returnRate}%`, icon: FiRefreshCw, color: 'from-red-500 to-red-600', change: '-0.5%', desc: 'returns' },
          { 
            title: 'Quick Scanner', 
            value: '📱', 
            icon: FiCamera, 
            color: 'from-green-500 to-blue-600', 
            change: 'Ready', 
            desc: 'Tap to scan',
            isButton: true,
            onClick: () => setShowBarcodeScanner(true)
          }
        ].map((metric, index) => (
          <div 
            key={index} 
            className={`bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
              metric.isButton ? 'cursor-pointer border-2 border-green-200 hover:border-green-400' : ''
            }`}
            onClick={metric.onClick || (() => {})}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-gray-600 text-sm font-medium">{metric.title}</p>
                <p className={`text-2xl font-bold text-gray-900 mt-1 ${metric.isButton ? 'text-center' : ''}`}>
                  {metric.value}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-sm font-medium ${
                    metric.isButton ? 'text-green-600' : 'text-green-600'
                  }`}>
                    {metric.change}
                  </span>
                  <span className="text-gray-500 text-xs">{metric.desc}</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg bg-gradient-to-r ${metric.color} ml-4 ${
                metric.isButton ? 'animate-pulse' : ''
              }`}>
                <metric.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Methods - Ugandan Focus */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'MTN Mobile Money', count: 52, icon: '📱', color: 'bg-yellow-600 hover:bg-yellow-700' },
          { title: 'Cash (UGX)', count: 45, icon: '💵', color: 'bg-green-600 hover:bg-green-700' },
          { title: 'Airtel Money', count: 37, icon: '📲', color: 'bg-red-600 hover:bg-red-700' },
          { title: 'Card Payments', count: 22, icon: '💳', color: 'bg-blue-600 hover:bg-blue-700' }
        ].map((method, index) => (
          <div key={index} className={`${method.color} text-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
            <div className="text-center">
              <div className="text-2xl mb-2">{method.icon}</div>
              <div className="text-2xl font-bold">{method.count}</div>
              <div className="text-sm opacity-90">{method.title}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Daily Tasks */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">📋 Daily Cashier Tasks</h3>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {dailyTasks.filter(t => t.completed).length} of {dailyTasks.length} completed
          </span>
        </div>
        <div className="space-y-3">
          {dailyTasks.map((task) => (
            <div key={task.id} className={`flex items-center p-4 border rounded-lg transition-all duration-300 ${
              task.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:border-gray-300'
            }`}>
              <button
                onClick={() => toggleTask(task.id)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 transition-all duration-300 ${
                  task.completed 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : 'border-gray-300 hover:border-green-500'
                }`}
              >
                {task.completed && <FiCheck className="h-4 w-4" />}
              </button>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className={`font-medium ${task.completed ? 'text-green-800 line-through' : 'text-gray-900'}`}>
                    {task.title}
                  </h4>
                  <span className="text-sm text-gray-500 font-mono">{task.time}</span>
                </div>
                <div className="flex items-center mt-1">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    task.priority === 'high' ? 'bg-red-100 text-red-800' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {task.priority} priority
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-6">💳 Recent Transactions</h3>
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-red-600 rounded-full flex items-center justify-center">
                    <FiShoppingCart className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{transaction.id}</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        transaction.method.includes('MoMo') || transaction.method.includes('Money') ? 'bg-orange-100 text-orange-800' :
                        transaction.method === 'Cash' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {transaction.method}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{transaction.items} items • {transaction.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatUGX(transaction.amount)}</p>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-6">🥇 Top Selling Products</h3>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.sales} units sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatUGX(product.revenue)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6 animate-fadeInUp">
      {/* Profile Header Card */}
      <div className="bg-gradient-to-r from-yellow-500 via-red-600 to-black rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              {/* Profile Avatar */}
              <div className="relative">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-xl">
                  <span className="text-6xl">{cashierProfile.avatar}</span>
                </div>
                <div className="absolute bottom-0 right-0 w-10 h-10 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                  <FiCheckCircle className="text-white h-5 w-5" />
                </div>
              </div>
              
              {/* Profile Info */}
              <div className="text-white">
                <h1 className="text-4xl font-bold mb-2">{cashierProfile.name}</h1>
                <p className="text-xl text-yellow-200 mb-4">{cashierProfile.role}</p>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <FiShield className="h-5 w-5" />
                    <span>ID: {cashierProfile.employeeId}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FiCalendar className="h-5 w-5" />
                    <span>Joined: {new Date(cashierProfile.joinDate).toLocaleDateString('en-US', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FiMapPin className="h-5 w-5" />
                    <span>{cashierProfile.location}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col space-y-2">
              <button className="px-4 py-2 bg-white text-red-600 rounded-lg hover:bg-gray-100 transition-all flex items-center space-x-2 font-medium">
                <FiEdit className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
              <button className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all flex items-center space-x-2 font-medium">
                <FiSettings className="h-4 w-4" />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-black/30 backdrop-blur-sm px-8 py-4">
          <div className="grid grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-yellow-200 text-sm mb-1">Today's Sales</p>
              <p className="text-white text-2xl font-bold">UGX {performanceMetrics.todaySales.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-yellow-200 text-sm mb-1">Transactions</p>
              <p className="text-white text-2xl font-bold">{performanceMetrics.todayTransactions}</p>
            </div>
            <div className="text-center">
              <p className="text-yellow-200 text-sm mb-1">Efficiency</p>
              <p className="text-white text-2xl font-bold">{performanceMetrics.efficiency}%</p>
            </div>
            <div className="text-center">
              <p className="text-yellow-200 text-sm mb-1">Scan Rate</p>
              <p className="text-white text-2xl font-bold">{performanceMetrics.scanRate} /min</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
            <FiUser className="h-6 w-6 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="text-base font-semibold text-gray-900">{cashierProfile.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Employee ID</p>
              <p className="text-base font-semibold text-gray-900">{cashierProfile.employeeId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Department</p>
              <p className="text-base font-semibold text-gray-900">{cashierProfile.department}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Position</p>
              <p className="text-base font-semibold text-gray-900">{cashierProfile.role}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Join Date</p>
              <p className="text-base font-semibold text-gray-900">
                {new Date(cashierProfile.joinDate).toLocaleDateString('en-US', { 
                  day: 'numeric',
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Languages</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {cashierProfile.languages.map(lang => (
                  <span key={lang} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Work Details */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Work Details</h3>
            <FiClock className="h-6 w-6 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Current Shift</p>
              <p className="text-base font-semibold text-gray-900">{cashierProfile.shift}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Assigned Register</p>
              <p className="text-base font-semibold text-gray-900">{cashierProfile.register}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Branch Location</p>
              <p className="text-base font-semibold text-gray-900">{cashierProfile.location}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Direct Manager</p>
              <p className="text-base font-semibold text-gray-900">{cashierProfile.manager}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Work Status</p>
              <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Permissions & Access */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Permissions & Access</h3>
            <FiShield className="h-6 w-6 text-gray-400" />
          </div>
          <div className="space-y-3">
            {Object.entries(cashierProfile.permissions).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                {value ? (
                  <span className="flex items-center text-green-600">
                    <FiCheckCircle className="h-5 w-5" />
                  </span>
                ) : (
                  <span className="flex items-center text-red-600">
                    <FiXCircle className="h-5 w-5" />
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Performance Overview</h3>
          <FiTrendingUp className="h-6 w-6 text-green-500" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
            <FiDollarSign className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-blue-600 mb-1">Today's Sales</p>
            <p className="text-2xl font-bold text-gray-900">
              UGX {(performanceMetrics.todaySales / 1000).toFixed(0)}K
            </p>
            <p className="text-xs text-gray-600 mt-1">+12% from yesterday</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
            <FiShoppingCart className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-green-600 mb-1">Transactions</p>
            <p className="text-2xl font-bold text-gray-900">{performanceMetrics.todayTransactions}</p>
            <p className="text-xs text-gray-600 mt-1">+8% from yesterday</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
            <FiZap className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-sm text-purple-600 mb-1">Efficiency</p>
            <p className="text-2xl font-bold text-gray-900">{performanceMetrics.efficiency}%</p>
            <p className="text-xs text-gray-600 mt-1">Above target</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
            <FiUsers className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-sm text-orange-600 mb-1">Customers Served</p>
            <p className="text-2xl font-bold text-gray-900">{performanceMetrics.customersServed}</p>
            <p className="text-xs text-gray-600 mt-1">Great service!</p>
          </div>
        </div>
      </div>

      {/* Achievements & Badges */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Achievements & Recognition</h3>
          <FiAward className="h-6 w-6 text-yellow-500" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border-2 border-yellow-300">
            <div className="text-4xl mb-2">🏆</div>
            <p className="text-sm font-bold text-gray-900">Top Performer</p>
            <p className="text-xs text-gray-600">This Month</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-300">
            <div className="text-4xl mb-2">⭐</div>
            <p className="text-sm font-bold text-gray-900">Customer Favorite</p>
            <p className="text-xs text-gray-600">5-Star Rating</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-300">
            <div className="text-4xl mb-2">🎯</div>
            <p className="text-sm font-bold text-gray-900">100% Accuracy</p>
            <p className="text-xs text-gray-600">Last Week</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-300">
            <div className="text-4xl mb-2">💎</div>
            <p className="text-sm font-bold text-gray-900">Loyalty Expert</p>
            <p className="text-xs text-gray-600">Most Signups</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPerformance = () => (
    <div className="space-y-6 animate-slideInRight container-neon rounded-2xl p-8">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-6">📈 Weekly Performance Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={[
            { name: 'Mon', sales: 2400000, transactions: 125, momo: 65 },
            { name: 'Tue', sales: 2100000, transactions: 108, momo: 58 },
            { name: 'Wed', sales: 2700000, transactions: 142, momo: 78 },
            { name: 'Thu', sales: 2300000, transactions: 118, momo: 62 },
            { name: 'Fri', sales: 2850000, transactions: 156, momo: 89 },
            { name: 'Sat', sales: 3200000, transactions: 175, momo: 98 },
            { name: 'Sun', sales: 2650000, transactions: 138, momo: 75 }
          ]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value, name) => name === 'sales' ? [formatUGX(value), 'Sales'] : [value, name]} />
            <Line type="monotone" dataKey="sales" stroke="#3B82F6" strokeWidth={3} name="Sales (UGX)" />
            <Line type="monotone" dataKey="transactions" stroke="#10B981" strokeWidth={3} name="Transactions" />
            <Line type="monotone" dataKey="momo" stroke="#F59E0B" strokeWidth={3} name="Mobile Money" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-6">🏪 Department Sales</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={departmentSales}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name} ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {departmentSales.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [formatUGX(value), 'Sales']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-6">🏆 Achievements</h3>
          <div className="grid grid-cols-1 gap-4">
            {achievements.map((achievement) => (
              <div key={achievement.id} className={`p-4 border rounded-lg text-center transition-all duration-300 ${
                achievement.earned 
                  ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                      achievement.earned 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {achievement.earned ? 'Earned' : 'In Progress'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderInventory = () => (
    <div className="space-y-6 animate-zoomIn">
      {/* Enhanced Inventory Header */}
      <div className="bg-gradient-to-r from-blue-500 to-emerald-600 rounded-xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">📦 Complete Inventory Management</h3>
            <p className="text-blue-100">Full product inventory with reorder and adjustment capabilities</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">6</div>
            <div className="text-blue-100 text-sm">Products Available</div>
          </div>
        </div>
      </div>

      {/* Till Supplies Quick View */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">🏪</span>
          Till & Station Supplies
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {[
            { item: 'Shopping Bags', stock: 150, minStock: 50, status: 'good' },
            { item: 'Receipt Paper', stock: 8, minStock: 15, status: 'low' },
            { item: 'Coin Trays', stock: 3, minStock: 5, status: 'critical' },
            { item: 'Sanitizer', stock: 12, minStock: 10, status: 'good' },
            { item: 'Price Tags', stock: 25, minStock: 30, status: 'low' },
            { item: 'Batteries', stock: 6, minStock: 8, status: 'good' }
          ].map((supply, index) => (
            <div key={index} className={`p-3 border-2 rounded-lg text-center ${
              supply.status === 'critical' ? 'border-red-300 bg-red-50' :
              supply.status === 'low' ? 'border-yellow-300 bg-yellow-50' :
              'border-green-300 bg-green-50'
            }`}>
              <h5 className="font-medium text-gray-900 text-sm">{supply.item}</h5>
              <p className="text-xs text-gray-600 mt-1">{supply.stock}/{supply.minStock}</p>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                supply.status === 'critical' ? 'bg-red-100 text-red-800' :
                supply.status === 'low' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {supply.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Full Product Inventory Interface */}
      <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
        <ProductInventoryInterface />
      </div>

      {/* Cashier Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">⚡</span>
          Quick Cashier Actions
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: 'Price Check', icon: '🏷️', color: 'bg-blue-600 hover:bg-blue-700', action: () => alert('Price check scanner activated') },
            { title: 'Stock Alert', icon: '⚠️', color: 'bg-yellow-600 hover:bg-yellow-700', action: () => alert('Stock alert system activated') },
            { title: 'Request Restock', icon: '📞', color: 'bg-green-600 hover:bg-green-700', action: () => alert('Restock request sent to manager') },
            { title: 'Report Issue', icon: '🚨', color: 'bg-red-600 hover:bg-red-700', action: () => alert('Issue reporting system opened') }
          ].map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`${action.color} text-white p-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex flex-col items-center space-y-2 text-sm font-medium`}
            >
              <span className="text-2xl">{action.icon}</span>
              <span>{action.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6 animate-slideInRight container-glass shadow-xl rounded-2xl p-8 border border-blue-200">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-6">🔔 Notifications</h3>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div key={notification.id} className={`p-4 border rounded-lg transition-all duration-300 ${
              notification.read ? 'bg-gray-50 border-gray-200' : 
              notification.type === 'urgent' ? 'bg-red-50 border-red-200' :
              notification.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
              'bg-blue-50 border-blue-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {!notification.read && (
                    <div className={`w-2 h-2 rounded-full ${
                      notification.type === 'urgent' ? 'bg-red-500' :
                      notification.type === 'warning' ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`}></div>
                  )}
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-gray-900">{notification.title}</h4>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        notification.type === 'urgent' ? 'bg-red-100 text-red-800' :
                        notification.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {notification.type}
                      </span>
                    </div>
                    <p className="text-gray-600">{notification.message}</p>
                    <p className="text-sm text-gray-500 mt-1">{notification.time}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'pos', label: 'POS System', icon: FiShoppingCart },
    { id: 'dashboard', label: 'Dashboard', icon: FiBarChart },
    { id: 'profile', label: 'My Profile', icon: FiUser },
    { id: 'performance', label: 'Performance', icon: FiTrendingUp },
    { id: 'inventory', label: 'Till Supplies', icon: FiPackage },
    { id: 'notifications', label: 'Notifications', icon: FiBell }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideInLeft {
            from { opacity: 0; transform: translateX(-50px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes slideInRight {
            from { opacity: 0; transform: translateX(50px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes zoomIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 10px rgba(255, 193, 7, 0.5); }
            50% { box-shadow: 0 0 20px rgba(255, 193, 7, 0.8); }
          }
          @keyframes rotate3d {
            0% { transform: perspective(1000px) rotateX(0deg) rotateY(0deg); }
            100% { transform: perspective(1000px) rotateX(360deg) rotateY(360deg); }
          }
          @keyframes shimmer {
            0% { background-position: -100% 0; }
            100% { background-position: 100% 0; }
          }
          .animate-fadeInUp { animation: fadeInUp 0.8s ease-out; }
          .animate-slideInLeft { animation: slideInLeft 0.8s ease-out; }
          .animate-slideInRight { animation: slideInRight 0.8s ease-out; }
          .animate-zoomIn { animation: zoomIn 0.5s ease-out; }
          .animate-bounce { animation: bounce 2s infinite; }
          .animate-glow { animation: glow 2s infinite; }
          .animate-rotate3d { animation: rotate3d 10s linear infinite; }
          .animate-shimmer {
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            background-size: 200% 100%;
            animation: shimmer 2s infinite;
          }
          .container-3d {
            transform-style: preserve-3d;
            perspective: 1000px;
            transition: transform 0.5s;
          }
          .container-3d:hover {
            transform: rotateY(5deg) rotateX(5deg);
          }
          .container-glass {
            backdrop-filter: blur(10px);
            background: rgba(255, 255, 255, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.3);
          }
          .container-neon {
            box-shadow: 0 0 15px rgba(255, 193, 7, 0.5);
            border: 2px solid rgba(255, 193, 7, 0.3);
          }
          .container-gradient {
            background: linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(249,250,251,1) 100%);
          }
        `
      }} />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-gradient-to-r from-yellow-500 to-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">🛒</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Cashier Portal 🇺🇬</h1>
                <p className="text-gray-600">Uganda Supermarket Cashier Workspace</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setActiveTab('profile')}
                className="text-right hover:bg-gray-50 p-2 rounded-lg transition-all duration-300 cursor-pointer group"
              >
                <p className="text-sm text-gray-600 group-hover:text-gray-900 font-medium">{cashierProfile.name}</p>
                <p className="text-xs text-gray-500 group-hover:text-gray-700">{cashierProfile.role}</p>
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-all duration-300">
                <FiBell className="h-6 w-6" />
              </button>
              <button 
                onClick={() => setActiveTab('profile')}
                className="p-2 text-gray-400 hover:text-gray-600 transition-all duration-300"
                title="Profile Settings"
              >
                <FiSettings className="h-6 w-6" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-all duration-300">
                <FiLogOut className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'border-yellow-500 text-yellow-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'pos' && renderPOS()}
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'profile' && renderProfile()}
        {activeTab === 'performance' && renderPerformance()}
        {activeTab === 'inventory' && renderInventory()}
        {activeTab === 'notifications' && renderNotifications()}
      </div>

      {/* Payment Modal */}
      {paymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">💳 Choose Payment Method</h3>
              <p className="text-gray-600">Total: {formatUGX(currentTransaction.total)}</p>
            </div>

            {!paymentProcessing && !paymentResult && (
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => processPayment(method.id)}
                    className={`w-full p-4 rounded-lg text-white font-semibold transition-all duration-300 transform hover:scale-105 ${method.color}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{method.icon}</span>
                        <div className="text-left">
                          <div className="font-semibold">{method.name}</div>
                          <div className="text-sm opacity-90">{method.description}</div>
                        </div>
                      </div>
                      {method.fee > 0 && (
                        <div className="text-right text-sm">
                          <div>Fee: {(method.fee * 100).toFixed(1)}%</div>
                          <div>{formatUGX(currentTransaction.total * method.fee)}</div>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {paymentProcessing && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Processing payment...</p>
                <p className="text-sm text-gray-500 mt-2">Please wait while we process your transaction</p>
              </div>
            )}

            {paymentResult && (
              <div className="text-center py-8">
                {paymentResult.success ? (
                  <div>
                    <div className="text-6xl mb-4">✅</div>
                    <h3 className="text-xl font-bold text-green-600 mb-2">Payment Successful!</h3>
                    <p className="text-gray-600 mb-4">Transaction ID: {paymentResult.transactionId}</p>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-800">
                        Amount: {formatUGX(paymentResult.amount)}<br/>
                        {paymentResult.fee > 0 && `Fee: ${formatUGX(paymentResult.fee)}`}<br/>
                        Method: {paymentResult.paymentMethod}<br/>
                        Time: {new Date(paymentResult.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-6xl mb-4">❌</div>
                    <h3 className="text-xl font-bold text-red-600 mb-2">Payment Failed</h3>
                    <p className="text-gray-600 mb-4">{paymentResult.error}</p>
                    <button
                      onClick={() => {
                        setPaymentResult(null);
                        setPaymentProcessing(false);
                      }}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            )}

            {!paymentProcessing && !paymentResult && (
              <button
                onClick={() => setPaymentModal(false)}
                className="w-full mt-4 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-all duration-300"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}

      {/* Advanced Barcode Scanner Modal */}
      <BarcodeScannerModal
        isOpen={showBarcodeScanner}
        onClose={() => setShowBarcodeScanner(false)}
        onBarcodeScanned={handleBarcodeScanned}
      />
    </div>
  );
};

export default CashierPortal;
