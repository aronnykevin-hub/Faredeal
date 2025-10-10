import React, { useState, useEffect } from 'react';
import { 
  FiTruck, FiPackage, FiDollarSign, FiTrendingUp, FiBarChart, 
  FiPieChart, FiTarget, FiAward, FiClock, FiAlertTriangle,
  FiCalendar, FiMail, FiBell, FiSettings, FiLogOut, FiSearch,
  FiFilter, FiDownload, FiRefreshCw, FiEye, FiEdit, FiTrash2,
  FiPlus, FiMinus, FiChevronRight, FiChevronDown, FiStar,
  FiHeart, FiZap, FiShield, FiGift, FiNavigation, FiMapPin,
  FiSmartphone, FiHeadphones, FiCamera, FiWatch, FiHome,
  FiCreditCard, FiMessageCircle, FiShare2, FiThumbsUp,
  FiBookmark, FiGrid, FiList, FiInfo, FiHelpCircle,
  FiMaximize, FiMinimize, FiRotateCw, FiUpload, FiPrinter,
  FiTag, FiHash, FiImage, FiCheckCircle, FiXCircle, FiUsers,
  FiShoppingCart, FiPercent, FiFlag, FiWifi, FiSend, FiFileText
} from 'react-icons/fi';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, ComposedChart
} from 'recharts';
import { supabase } from '../services/supabase';
import PaymentService from '../services/paymentService';

const SupplierPortal = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [supplierProfile, setSupplierProfile] = useState({
    name: 'Nakumatt Fresh Supplies Ltd',
    contactPerson: 'Mukasa James',
    email: 'james.mukasa@nakumattfresh.co.ug',
    phone: '+256 700 456 789',
    address: 'Plot 15-17, Industrial Area, Kampala, Uganda',
    category: 'Fresh Produce & Groceries',
    rating: 4.7,
    partnershipYears: 5,
    avatar: '🇺�',
    status: 'Active Premium Supplier',
    paymentTerms: 'Net 15 (Mobile Money/Bank Transfer)',
    creditLimit: 85000000, // UGX
    businessLicense: 'UG-BS-2019-045671',
    taxID: 'TIN-1000234567',
    exportLicense: 'EXP-UG-2020-891',
    languages: ['English', 'Luganda', 'Swahili'],
    certifications: ['HACCP', 'ISO 22000', 'Organic Certification'],
    specialties: ['Organic Vegetables', 'Local Cereals', 'Dairy Products'],
    deliveryAreas: ['Kampala', 'Entebbe', 'Mukono', 'Wakiso', 'Jinja']
  });

  // Ugandan Supplier Performance Data
  const [performanceMetrics, setPerformanceMetrics] = useState({
    totalOrders: 287,
    totalRevenue: 245000000, // UGX (approximately $65,000 USD)
    onTimeDelivery: 89, // Considering Uganda's infrastructure challenges
    qualityRating: 4.7,
    activeProducts: 156,
    pendingOrders: 18,
    avgOrderValue: 853600, // UGX
    customerSatisfaction: 4.6,
    mobileMoneyTransactions: 78, // percentage
    bankTransferTransactions: 22,
    weeklyGrowth: 12.8,
    monthlyGrowth: 18.5,
    exportOrders: 8, // international orders
    localOrders: 279,
    seasonalProductsAvailable: 89,
    organicCertifiedProducts: 67
  });

  const [orderHistory, setOrderHistory] = useState([
    { id: 'ORD-UG-001', date: '2024-01-15', items: 145, amount: 8750000, status: 'delivered', rating: 5, products: 'Matooke, Posho, Rice' },
    { id: 'ORD-UG-002', date: '2024-01-12', items: 89, amount: 5340000, status: 'delivered', rating: 4, products: 'Fresh Vegetables, Fruits' },
    { id: 'ORD-UG-003', date: '2024-01-10', items: 234, amount: 14040000, status: 'delivered', rating: 5, products: 'Sugar, Cooking Oil, Beans' },
    { id: 'ORD-UG-004', date: '2024-01-08', items: 167, amount: 10020000, status: 'delivered', rating: 4, products: 'Dairy Products, Eggs' },
    { id: 'ORD-UG-005', date: '2024-01-05', items: 198, amount: 11880000, status: 'delivered', rating: 5, products: 'Irish Potatoes, Onions' }
  ]);

  const [pendingOrders, setPendingOrders] = useState([
    { id: 'ORD-UG-006', date: '2024-01-18', items: 178, amount: 10680000, status: 'processing', expectedDelivery: '2024-01-25', products: 'Fresh Fish, Meat' },
    { id: 'ORD-UG-007', date: '2024-01-16', items: 234, amount: 14040000, status: 'shipped', expectedDelivery: '2024-01-22', products: 'Cereals, Grains' },
    { id: 'ORD-UG-008', date: '2024-01-14', items: 312, amount: 18720000, status: 'processing', expectedDelivery: '2024-01-28', products: 'Organic Vegetables' }
  ]);

  const [productCatalog, setProductCatalog] = useState([
    { id: 1, name: 'Matooke (Green Bananas)', category: 'Fresh Produce', price: 15000, stock: 500, status: 'active', unit: 'bunch', season: 'year-round' },
    { id: 2, name: 'Posho (Maize Flour)', category: 'Cereals', price: 120000, stock: 200, status: 'active', unit: 'bag (50kg)', season: 'year-round' },
    { id: 3, name: 'Irish Potatoes', category: 'Fresh Produce', price: 45000, stock: 150, status: 'active', unit: 'bag (100kg)', season: 'seasonal' },
    { id: 4, name: 'Sugar - Kakira Brand', category: 'Sweeteners', price: 180000, stock: 100, status: 'active', unit: 'bag (50kg)', season: 'year-round' },
    { id: 5, name: 'Red Beans (Local)', category: 'Pulses', price: 8000, stock: 300, status: 'active', unit: 'kg', season: 'seasonal' },
    { id: 6, name: 'Rice - Tilda (Local)', category: 'Cereals', price: 12000, stock: 250, status: 'active', unit: 'kg', season: 'year-round' },
    { id: 7, name: 'Cooking Oil - Fresh Dairy', category: 'Cooking Essentials', price: 18000, stock: 180, status: 'active', unit: 'liter', season: 'year-round' },
    { id: 8, name: 'Tomatoes (Nakasero Quality)', category: 'Fresh Produce', price: 4500, stock: 400, status: 'active', unit: 'kg', season: 'seasonal' },
    { id: 9, name: 'Onions (Red)', category: 'Fresh Produce', price: 6000, stock: 200, status: 'active', unit: 'kg', season: 'year-round' },
    { id: 10, name: 'Fresh Milk - Jesa Farm', category: 'Dairy', price: 2500, stock: 150, status: 'active', unit: 'liter', season: 'year-round' }
  ]);

  const [revenueData, setRevenueData] = useState([
    { name: 'Jan', revenue: 25000, orders: 12, products: 45 },
    { name: 'Feb', revenue: 32000, orders: 15, products: 48 },
    { name: 'Mar', revenue: 28000, orders: 13, products: 46 },
    { name: 'Apr', revenue: 35000, orders: 18, products: 52 },
    { name: 'May', revenue: 42000, orders: 22, products: 55 },
    { name: 'Jun', revenue: 38000, orders: 19, products: 50 }
  ]);

  const [performanceInsights] = useState([
    { metric: 'On-Time Delivery', value: 96, target: 95, status: 'excellent', icon: '🚚' },
    { metric: 'Quality Rating', value: 4.8, target: 4.5, status: 'excellent', icon: '⭐' },
    { metric: 'Customer Satisfaction', value: 4.7, target: 4.3, status: 'excellent', icon: '😊' },
    { metric: 'Order Accuracy', value: 98, target: 95, status: 'excellent', icon: '🎯' }
  ]);

  const [notifications] = useState([
    { id: 1, title: 'New Order Received', message: 'Order ORD-009 for $15,600 has been placed', time: '2 hours ago', type: 'order' },
    { id: 2, title: 'Payment Processed', message: 'Payment of $12,500 has been processed', time: '1 day ago', type: 'payment' },
    { id: 3, title: 'Inventory Alert', message: 'iPhone 15 Pro Max stock is running low', time: '2 days ago', type: 'inventory' },
    { id: 4, title: 'Performance Review', message: 'Monthly performance review is available', time: '3 days ago', type: 'review' }
  ]);

  const [partnershipGoals] = useState([
    { id: 1, title: 'Increase Monthly Revenue', target: 50000, current: 42000, deadline: '2024-12-31', progress: 84 },
    { id: 2, title: 'Improve Delivery Time', target: 95, current: 96, deadline: '2024-11-30', progress: 101 },
    { id: 3, title: 'Expand Product Catalog', target: 60, current: 45, deadline: '2024-12-15', progress: 75 },
    { id: 4, title: 'Achieve 5-Star Rating', target: 5.0, current: 4.8, deadline: '2024-12-31', progress: 96 }
  ]);

  // Enhanced payment history for supplier view (with setState for database updates)
  const [paymentHistory, setPaymentHistory] = useState([
    { id: 'PAY-001', date: '2024-01-15', amount: 8750000, status: 'paid', dueDate: '2024-02-14', paymentMethod: 'bank_transfer', reference: 'BT-2024-001', orderId: 'ORD-UG-001', daysOverdue: 0 },
    { id: 'PAY-002', date: '2024-01-12', amount: 5340000, status: 'paid', dueDate: '2024-02-11', paymentMethod: 'mobile_money', reference: 'MTN-2024-002', orderId: 'ORD-UG-002', daysOverdue: 0 },
    { id: 'PAY-003', date: '2024-01-10', amount: 14040000, status: 'partial', dueDate: '2024-02-09', paymentMethod: 'bank_transfer', reference: 'BT-2024-003', orderId: 'ORD-UG-003', daysOverdue: 0, paidAmount: 7020000 },
    { id: 'PAY-004', date: '2024-01-08', amount: 10020000, status: 'paid', dueDate: '2024-02-07', paymentMethod: 'mobile_money', reference: 'AIRTL-2024-004', orderId: 'ORD-UG-004', daysOverdue: 0 },
    { id: 'PAY-005', date: '2024-01-05', amount: 11880000, status: 'unpaid', dueDate: '2024-01-25', paymentMethod: 'bank_transfer', reference: 'BT-2024-005', orderId: 'ORD-UG-005', daysOverdue: 12 },
    { id: 'PAY-006', date: '2023-12-28', amount: 6750000, status: 'paid', dueDate: '2024-01-27', paymentMethod: 'check', reference: 'CHK-2023-006', orderId: 'ORD-UG-006', daysOverdue: 0 },
    { id: 'PAY-007', date: '2023-12-20', amount: 9250000, status: 'partial', dueDate: '2024-01-19', paymentMethod: 'mobile_money', reference: 'MTN-2023-007', orderId: 'ORD-UG-007', daysOverdue: 0, paidAmount: 4625000 }
  ]);

  const [paymentFilter, setPaymentFilter] = useState('all');

  // Enhanced payment history for supplier to view their own payments
  const [supplierPaymentHistory] = useState([
    { 
      id: 'PAY-SUP-001', 
      orderRef: 'ORD-UG-001', 
      date: '2024-01-15', 
      amount: 8750000, 
      status: 'paid', 
      dueDate: '2024-02-14', 
      paymentMethod: 'bank_transfer', 
      reference: 'BT-FAREDEAL-001', 
      daysOverdue: 0,
      description: 'Payment for Matooke, Posho, Rice supply',
      processingFee: 25000
    },
    { 
      id: 'PAY-SUP-002', 
      orderRef: 'ORD-UG-002', 
      date: '2024-01-12', 
      amount: 5340000, 
      status: 'paid', 
      dueDate: '2024-02-11', 
      paymentMethod: 'mobile_money', 
      reference: 'MTN-FAREDEAL-002', 
      daysOverdue: 0,
      description: 'Fresh Vegetables, Fruits supply payment',
      processingFee: 15000
    },
    { 
      id: 'PAY-SUP-003', 
      orderRef: 'ORD-UG-003', 
      date: '2024-01-10', 
      amount: 14040000, 
      status: 'partial', 
      dueDate: '2024-02-09', 
      paymentMethod: 'bank_transfer', 
      reference: 'BT-FAREDEAL-003', 
      daysOverdue: 0,
      paidAmount: 10000000,
      description: 'Sugar, Cooking Oil, Beans supply',
      processingFee: 40000
    },
    { 
      id: 'PAY-SUP-004', 
      orderRef: 'ORD-UG-004', 
      date: '2024-01-08', 
      amount: 10020000, 
      status: 'pending', 
      dueDate: '2024-02-07', 
      paymentMethod: 'bank_transfer', 
      reference: 'BT-FAREDEAL-004', 
      daysOverdue: 5,
      description: 'Dairy Products, Eggs supply payment',
      processingFee: 30000
    },
    { 
      id: 'PAY-SUP-005', 
      orderRef: 'ORD-UG-005', 
      date: '2024-01-05', 
      amount: 11880000, 
      status: 'overdue', 
      dueDate: '2024-02-04', 
      paymentMethod: 'mobile_money', 
      reference: 'AIRTL-FAREDEAL-005', 
      daysOverdue: 12,
      description: 'Irish Potatoes, Onions supply',
      processingFee: 35000
    }
  ]);

  // Payment statistics
  const [paymentStats] = useState({
    totalPaid: 24090000,
    totalPending: 14040000,
    totalOverdue: 11880000,
    averagePaymentTime: '18 days',
    onTimePaymentRate: 75,
    totalEarnings: 49010000,
    processingFees: 145000
  });

  // Helper function to calculate years from created date
  const calculateYears = (createdAt) => {
    if (!createdAt) return 0;
    const years = Math.floor((new Date() - new Date(createdAt)) / (1000 * 60 * 60 * 24 * 365));
    return years;
  };

  // Load supplier profile from database
  const loadSupplierProfile = async (userId) => {
    try {
      // First try to get from suppliers table
      const { data: supplier, error: suppError } = await supabase
        .from('suppliers')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (suppError && suppError.code !== 'PGRST116') {
        throw suppError;
      }

      if (supplier) {
        setSupplierProfile({
          id: supplier.id,
          name: supplier.company_name || 'Your Company',
          contactPerson: supplier.contact_person || '',
          email: supplier.email || '',
          phone: supplier.phone || '',
          address: supplier.address || '',
          rating: supplier.rating || 0,
          paymentTerms: `Net ${supplier.payment_terms || 30} Days`,
          creditLimit: supplier.credit_limit || 0,
          businessLicense: supplier.business_license || '',
          taxID: supplier.tax_number || '',
          category: 'Supplier',
          avatar: '🇺🇬',
          status: supplier.is_active ? 'Active' : 'Inactive',
          partnershipYears: calculateYears(supplier.created_at),
          languages: ['English', 'Luganda', 'Swahili'],
          certifications: [],
          specialties: [],
          deliveryAreas: ['Kampala', 'Entebbe', 'Mukono', 'Wakiso', 'Jinja']
        });
      } else {
        // If no supplier record, get from users table
        const { data: user } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        if (user) {
          setSupplierProfile({
            id: userId,
            name: user.full_name || user.username || 'Your Company',
            contactPerson: user.full_name || '',
            email: user.email || '',
            phone: user.phone || '',
            username: user.username,
            avatar: '🇺🇬',
            status: user.is_active ? 'Active' : 'Pending',
            partnershipYears: calculateYears(user.created_at),
            rating: 0,
            creditLimit: 0,
            address: '',
            category: 'Supplier',
            paymentTerms: 'Net 30 Days',
            languages: ['English', 'Luganda', 'Swahili'],
            certifications: [],
            specialties: [],
            deliveryAreas: ['Kampala']
          });
        }
      }
    } catch (error) {
      console.error('Error loading supplier profile:', error);
    }
  };

  // Load performance metrics from database
  const loadPerformanceMetrics = async (userId) => {
    try {
      // Get supplier ID
      const { data: supplier } = await supabase
        .from('suppliers')
        .select('id, rating')
        .eq('user_id', userId)
        .maybeSingle();

      const supplierId = supplier?.id;
      if (!supplierId) {
        console.log('No supplier ID found');
        return;
      }

      // Get total orders
      const { count: totalOrders } = await supabase
        .from('purchase_orders')
        .select('*', { count: 'exact', head: true })
        .eq('supplier_id', supplierId);

      // Get pending orders
      const { count: pendingOrders } = await supabase
        .from('purchase_orders')
        .select('*', { count: 'exact', head: true })
        .eq('supplier_id', supplierId)
        .in('status', ['pending', 'approved', 'ordered']);

      // Get all orders for calculations
      const { data: orders } = await supabase
        .from('purchase_orders')
        .select('total_amount, status, order_date, expected_delivery_date, actual_delivery_date')
        .eq('supplier_id', supplierId);

      // Calculate total revenue (received orders only)
      const totalRevenue = orders
        ?.filter(o => o.status === 'received')
        .reduce((sum, o) => sum + (parseFloat(o.total_amount) || 0), 0) || 0;

      // Calculate average order value
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Calculate on-time delivery
      const deliveredOrders = orders?.filter(o => o.status === 'received') || [];
      const onTimeOrders = deliveredOrders.filter(o => {
        if (!o.expected_delivery_date || !o.actual_delivery_date) return false;
        return new Date(o.actual_delivery_date) <= new Date(o.expected_delivery_date);
      });
      const onTimeDelivery = deliveredOrders.length > 0 
        ? Math.round((onTimeOrders.length / deliveredOrders.length) * 100)
        : 0;

      // Get active products count
      const { count: activeProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('supplier_id', supplierId)
        .eq('is_active', true);

      setPerformanceMetrics({
        totalOrders: totalOrders || 0,
        totalRevenue: totalRevenue,
        onTimeDelivery: onTimeDelivery,
        qualityRating: supplier?.rating || 0,
        activeProducts: activeProducts || 0,
        pendingOrders: pendingOrders || 0,
        avgOrderValue: avgOrderValue,
        customerSatisfaction: supplier?.rating || 0,
        mobileMoneyTransactions: 0,
        bankTransferTransactions: 0,
        weeklyGrowth: 0,
        monthlyGrowth: 0,
        exportOrders: 0,
        localOrders: totalOrders || 0,
        seasonalProductsAvailable: 0,
        organicCertifiedProducts: 0
      });
    } catch (error) {
      console.error('Error loading performance metrics:', error);
    }
  };

  // Load order history from database
  const loadOrderHistory = async (userId) => {
    try {
      const { data: supplier } = await supabase
        .from('suppliers')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (!supplier?.id) return;

      const { data: orders } = await supabase
        .from('purchase_orders')
        .select(`
          id,
          po_number,
          order_date,
          total_amount,
          status,
          items:purchase_order_items(
            quantity_ordered,
            product:products(name)
          )
        `)
        .eq('supplier_id', supplier.id)
        .eq('status', 'received')
        .order('order_date', { ascending: false })
        .limit(10);

      const formatted = orders?.map(order => ({
        id: order.po_number,
        date: order.order_date,
        items: order.items?.length || 0,
        amount: parseFloat(order.total_amount) || 0,
        status: 'delivered',
        rating: 5,
        products: order.items?.map(item => item.product?.name).filter(Boolean).join(', ') || 'N/A'
      })) || [];

      setOrderHistory(formatted);
    } catch (error) {
      console.error('Error loading order history:', error);
    }
  };

  // Load product catalog from database
  const loadProductCatalog = async (userId) => {
    try {
      const { data: supplier } = await supabase
        .from('suppliers')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (!supplier?.id) return;

      const { data: products } = await supabase
        .from('products')
        .select(`
          id,
          name,
          sku,
          selling_price,
          category:categories(name),
          inventory(current_stock, status)
        `)
        .eq('supplier_id', supplier.id)
        .order('name');

      const formatted = products?.map(product => ({
        id: product.id,
        name: product.name,
        category: product.category?.name || 'Uncategorized',
        price: parseFloat(product.selling_price) || 0,
        stock: product.inventory?.[0]?.current_stock || 0,
        status: 'active',
        unit: 'unit',
        season: 'year-round'
      })) || [];

      setProductCatalog(formatted);
    } catch (error) {
      console.error('Error loading product catalog:', error);
    }
  };

  // Load revenue data for charts
  const loadRevenueData = async (userId) => {
    try {
      const { data: supplier } = await supabase
        .from('suppliers')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (!supplier?.id) return;

      // Get orders from last 6 months
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const { data: orders } = await supabase
        .from('purchase_orders')
        .select('total_amount, status, order_date')
        .eq('supplier_id', supplier.id)
        .eq('status', 'received')
        .gte('order_date', sixMonthsAgo.toISOString().split('T')[0])
        .order('order_date');

      // Group by month
      const revenueByMonth = {};
      orders?.forEach(order => {
        const month = new Date(order.order_date).toLocaleDateString('en-US', { month: 'short' });
        if (!revenueByMonth[month]) {
          revenueByMonth[month] = { name: month, revenue: 0, orders: 0, products: 0 };
        }
        revenueByMonth[month].revenue += parseFloat(order.total_amount) || 0;
        revenueByMonth[month].orders += 1;
      });

      const revenueArray = Object.values(revenueByMonth);
      if (revenueArray.length > 0) {
        setRevenueData(revenueArray);
      }
    } catch (error) {
      console.error('Error loading revenue data:', error);
    }
  };

  // Main data loading function
  const loadSupplierData = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No user logged in');
        return;
      }

      console.log('Loading supplier data for user:', user.id);
      
      // Load all data
      await Promise.all([
        loadSupplierProfile(user.id),
        loadPerformanceMetrics(user.id),
        loadOrderHistory(user.id),
        loadProductCatalog(user.id),
        loadRevenueData(user.id)
      ]);
      
      console.log('Supplier data loaded successfully');
    } catch (error) {
      console.error('Error loading supplier data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Load supplier data from database
    loadSupplierData();
    // Load payment data from database
    loadPaymentData();

    return () => clearInterval(timer);
  }, []);

  // Function to load payment data from database
  const loadPaymentData = async () => {
    try {
      // In a real app, you'd get the supplier ID from authentication context
      const supplierId = supplierProfile.id || 'demo-supplier-id';
      
      // Attempt to load from database, fallback to mock data on error
      const dbPayments = await PaymentService.getSupplierPaymentHistory(supplierId);
      
      if (dbPayments && dbPayments.length > 0) {
        setPaymentHistory(dbPayments);
        toast.success('Payment data loaded from database');
      } else {
        // Use existing mock data if no database records
        console.log('Using mock payment data - no database records found');
      }
    } catch (error) {
      console.log('Database not available, using mock data:', error.message);
      // Mock data is already set in useState, so no action needed
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  // Payment status helper functions
  const getPaymentStatusColor = (status) => {
    switch(status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'unpaid': return 'bg-red-100 text-red-800';
      case 'partial': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusIcon = (status) => {
    switch(status) {
      case 'paid': return '✅';
      case 'unpaid': return '❌';
      case 'partial': return '⚡';
      default: return '❓';
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch(method) {
      case 'mobile_money': return '📱';
      case 'bank_transfer': return '🏦';
      case 'check': return '📝';
      case 'cash': return '💰';
      default: return '💳';
    }
  };

  const getFilteredPaymentHistory = () => {
    if (paymentFilter === 'all') return paymentHistory;
    return paymentHistory.filter(payment => payment.status === paymentFilter);
  };

  const getPaymentStats = () => {
    const total = paymentHistory.length;
    const paid = paymentHistory.filter(p => p.status === 'paid').length;
    const unpaid = paymentHistory.filter(p => p.status === 'unpaid').length;
    const partial = paymentHistory.filter(p => p.status === 'partial').length;
    const totalAmount = paymentHistory.reduce((sum, p) => sum + p.amount, 0);
    const paidAmount = paymentHistory.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0) +
                     paymentHistory.filter(p => p.status === 'partial').reduce((sum, p) => sum + (p.paidAmount || 0), 0);
    const outstandingAmount = totalAmount - paidAmount;
    
    return { total, paid, unpaid, partial, totalAmount, paidAmount, outstandingAmount };
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];

  const renderProfile = () => (
    <div className="space-y-6 animate-fadeInUp">
      {/* Profile Header Card */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              {/* Company Logo/Avatar */}
              <div className="relative">
                <div className="w-32 h-32 bg-white rounded-2xl flex items-center justify-center shadow-xl">
                  <span className="text-6xl">{supplierProfile.avatar}</span>
                </div>
                <div className="absolute bottom-0 right-0 w-10 h-10 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                  <FiCheckCircle className="text-white h-5 w-5" />
                </div>
                <div className="absolute -top-2 -right-2 px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full animate-pulse">
                  PREMIUM
                </div>
              </div>
              
              {/* Company Info */}
              <div className="text-white">
                <h1 className="text-4xl font-bold mb-2">{supplierProfile.name}</h1>
                <p className="text-xl text-purple-200 mb-4">{supplierProfile.category}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <FiUsers className="h-5 w-5" />
                    <span>Contact: {supplierProfile.contactPerson}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FiMail className="h-5 w-5" />
                    <span>{supplierProfile.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FiSmartphone className="h-5 w-5" />
                    <span>{supplierProfile.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FiMapPin className="h-5 w-5" />
                    <span>Kampala, Uganda</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col space-y-2">
              <button className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-all flex items-center space-x-2 font-medium">
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
          <div className="grid grid-cols-5 gap-6">
            <div className="text-center">
              <p className="text-purple-200 text-sm mb-1">Total Revenue</p>
              <p className="text-white text-2xl font-bold">UGX {(performanceMetrics.totalRevenue / 1000000).toFixed(1)}M</p>
            </div>
            <div className="text-center">
              <p className="text-purple-200 text-sm mb-1">Total Orders</p>
              <p className="text-white text-2xl font-bold">{performanceMetrics.totalOrders}</p>
            </div>
            <div className="text-center">
              <p className="text-purple-200 text-sm mb-1">Quality Rating</p>
              <p className="text-white text-2xl font-bold flex items-center justify-center">
                {supplierProfile.rating}
                <FiStar className="h-5 w-5 text-yellow-400 ml-1 fill-current" />
              </p>
            </div>
            <div className="text-center">
              <p className="text-purple-200 text-sm mb-1">On-Time Delivery</p>
              <p className="text-white text-2xl font-bold">{performanceMetrics.onTimeDelivery}%</p>
            </div>
            <div className="text-center">
              <p className="text-purple-200 text-sm mb-1">Partnership</p>
              <p className="text-white text-2xl font-bold">{supplierProfile.partnershipYears} Years</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Business Information */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Business Information</h3>
            <FiHome className="h-6 w-6 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Company Name</p>
              <p className="text-base font-semibold text-gray-900">{supplierProfile.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Business License</p>
              <p className="text-base font-semibold text-gray-900">{supplierProfile.businessLicense}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tax ID (TIN)</p>
              <p className="text-base font-semibold text-gray-900">{supplierProfile.taxID}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Export License</p>
              <p className="text-base font-semibold text-gray-900">{supplierProfile.exportLicense}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Category</p>
              <p className="text-base font-semibold text-gray-900">{supplierProfile.category}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                {supplierProfile.status}
              </span>
            </div>
          </div>
        </div>

        {/* Contact & Location */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Contact & Location</h3>
            <FiMapPin className="h-6 w-6 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Contact Person</p>
              <p className="text-base font-semibold text-gray-900">{supplierProfile.contactPerson}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email Address</p>
              <p className="text-base font-semibold text-gray-900">{supplierProfile.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone Number</p>
              <p className="text-base font-semibold text-gray-900">{supplierProfile.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Business Address</p>
              <p className="text-base font-semibold text-gray-900">{supplierProfile.address}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Languages</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {supplierProfile.languages.map(lang => (
                  <span key={lang} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Delivery Areas</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {supplierProfile.deliveryAreas.slice(0, 3).map(area => (
                  <span key={area} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    {area}
                  </span>
                ))}
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                  +{supplierProfile.deliveryAreas.length - 3} more
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Details */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Financial Details</h3>
            <FiDollarSign className="h-6 w-6 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Payment Terms</p>
              <p className="text-base font-semibold text-gray-900">{supplierProfile.paymentTerms}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Credit Limit</p>
              <p className="text-base font-semibold text-gray-900">
                UGX {(supplierProfile.creditLimit / 1000000).toFixed(1)}M
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Payment Methods</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center">
                  <FiSmartphone className="h-3 w-3 mr-1" />
                  Mobile Money
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center">
                  <FiCreditCard className="h-3 w-3 mr-1" />
                  Bank Transfer
                </span>
              </div>
            </div>
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-500 mb-3">Transaction Distribution</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">Mobile Money</span>
                  <span className="font-semibold">{performanceMetrics.mobileMoneyTransactions}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${performanceMetrics.mobileMoneyTransactions}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-sm mt-3">
                  <span className="text-gray-700">Bank Transfer</span>
                  <span className="font-semibold">{performanceMetrics.bankTransferTransactions}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${performanceMetrics.bankTransferTransactions}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Certifications & Specialties */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Certifications */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Certifications & Compliance</h3>
            <FiShield className="h-6 w-6 text-green-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {supplierProfile.certifications.map((cert, index) => (
              <div key={index} className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl border-2 border-green-200">
                <FiCheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="font-semibold text-gray-900">{cert}</p>
                  <p className="text-xs text-gray-600">Certified</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-xl">
            <div className="flex items-start space-x-3">
              <FiInfo className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Compliance Status</p>
                <p className="text-xs text-blue-700 mt-1">All certifications are up to date and verified</p>
              </div>
            </div>
          </div>
        </div>

        {/* Specialties */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Product Specialties</h3>
            <FiPackage className="h-6 w-6 text-purple-500" />
          </div>
          <div className="space-y-3">
            {supplierProfile.specialties.map((specialty, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                    <FiStar className="h-5 w-5 text-white" />
                  </div>
                  <p className="font-semibold text-gray-900">{specialty}</p>
                </div>
                <FiChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-xl text-center">
              <p className="text-sm text-green-600 mb-1">Organic Products</p>
              <p className="text-2xl font-bold text-gray-900">{performanceMetrics.organicCertifiedProducts}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl text-center">
              <p className="text-sm text-orange-600 mb-1">Seasonal Items</p>
              <p className="text-2xl font-bold text-gray-900">{performanceMetrics.seasonalProductsAvailable}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Performance Overview</h3>
          <FiTrendingUp className="h-6 w-6 text-green-500" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
            <FiPackage className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-blue-600 mb-1">Active Products</p>
            <p className="text-2xl font-bold text-gray-900">{performanceMetrics.activeProducts}</p>
            <p className="text-xs text-gray-600 mt-1">In catalog</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
            <FiTruck className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-green-600 mb-1">On-Time Delivery</p>
            <p className="text-2xl font-bold text-gray-900">{performanceMetrics.onTimeDelivery}%</p>
            <p className="text-xs text-gray-600 mt-1">Success rate</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
            <FiStar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-sm text-purple-600 mb-1">Customer Rating</p>
            <p className="text-2xl font-bold text-gray-900">{performanceMetrics.customerSatisfaction}</p>
            <p className="text-xs text-gray-600 mt-1">Out of 5.0</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
            <FiDollarSign className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-sm text-orange-600 mb-1">Avg Order Value</p>
            <p className="text-2xl font-bold text-gray-900">
              {(performanceMetrics.avgOrderValue / 1000).toFixed(0)}K
            </p>
            <p className="text-xs text-gray-600 mt-1">UGX</p>
          </div>
        </div>
      </div>

      {/* Achievements & Recognition */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Achievements & Recognition</h3>
          <FiAward className="h-6 w-6 text-yellow-500" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border-2 border-yellow-300">
            <div className="text-4xl mb-2">🏆</div>
            <p className="text-sm font-bold text-gray-900">Premium Supplier</p>
            <p className="text-xs text-gray-600">{supplierProfile.partnershipYears} Years Partner</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-300">
            <div className="text-4xl mb-2">⭐</div>
            <p className="text-sm font-bold text-gray-900">Top Rated</p>
            <p className="text-xs text-gray-600">{supplierProfile.rating} Rating</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-300">
            <div className="text-4xl mb-2">🎯</div>
            <p className="text-sm font-bold text-gray-900">Quality Leader</p>
            <p className="text-xs text-gray-600">Certified Organic</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-300">
            <div className="text-4xl mb-2">💎</div>
            <p className="text-sm font-bold text-gray-900">Trusted Partner</p>
            <p className="text-xs text-gray-600">Verified Business</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6 animate-fadeInUp">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {getGreeting()}, {supplierProfile.contactPerson}! 👋
            </h1>
            <p className="text-purple-100 text-lg">
              Welcome to your supplier dashboard - {supplierProfile.name}
            </p>
            <div className="flex items-center mt-4 space-x-4">
              <div className="flex items-center space-x-2">
                <FiClock className="h-5 w-5" />
                <span>{currentTime.toLocaleTimeString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiCalendar className="h-5 w-5" />
                <span>{currentTime.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiStar className="h-5 w-5" />
                <span>{supplierProfile.rating} Rating</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl mb-2">🏢</div>
            <p className="text-purple-100">Partnership Strong!</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Revenue', value: formatCurrency(performanceMetrics.totalRevenue), icon: FiDollarSign, color: 'from-green-500 to-green-600', change: '+18.5%' },
          { title: 'Total Orders', value: formatNumber(performanceMetrics.totalOrders), icon: FiPackage, color: 'from-blue-500 to-blue-600', change: '+12.3%' },
          { title: 'On-Time Delivery', value: `${performanceMetrics.onTimeDelivery}%`, icon: FiTruck, color: 'from-purple-500 to-purple-600', change: '+2.1%' },
          { title: 'Quality Rating', value: performanceMetrics.qualityRating, icon: FiStar, color: 'from-yellow-500 to-yellow-600', change: '+0.3' }
        ].map((metric, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                <p className="text-green-600 text-sm font-medium mt-1">{metric.change}</p>
              </div>
              <div className={`p-3 rounded-lg bg-gradient-to-r ${metric.color}`}>
                <metric.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Revenue Trends</h3>
          <div className="flex space-x-2">
            {['6m', '1y', '2y'].map((range) => (
              <button
                key={range}
                className="px-3 py-1 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-300"
              >
                {range}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="revenue" fill="#8B5CF6" fillOpacity={0.3} />
            <Line type="monotone" dataKey="revenue" stroke="#8B5CF6" strokeWidth={3} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Partnership Goals */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Partnership Goals Progress</h3>
        <div className="space-y-4">
          {partnershipGoals.map((goal) => (
            <div key={goal.id} className="border rounded-lg p-4 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{goal.title}</h4>
                <span className="text-sm text-gray-500">{goal.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(goal.progress, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Target: {typeof goal.target === 'number' && goal.target > 1000 ? formatCurrency(goal.target) : goal.target}</span>
                <span>Current: {typeof goal.current === 'number' && goal.current > 1000 ? formatCurrency(goal.current) : goal.current}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6 animate-fadeInUp">
      {/* Pending Orders */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Pending Orders</h3>
        <div className="space-y-4">
          {pendingOrders.map((order) => (
            <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <FiPackage className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{order.id}</h4>
                    <p className="text-sm text-gray-600">{order.items} items • {order.date}</p>
                    <p className="text-sm text-gray-500">Expected: {order.expectedDelivery}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatCurrency(order.amount)}</p>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    order.status === 'shipped' ? 'bg-green-100 text-green-800' :
                    order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order History */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Order History</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orderHistory.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-all duration-300">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.items}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(order.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FiStar className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-sm text-gray-900">{order.rating}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6 animate-fadeInUp">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Product Catalog</h3>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all duration-300 flex items-center space-x-2">
            <FiPlus className="h-4 w-4" />
            <span>Add Product</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productCatalog.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">{product.name}</h4>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {product.status}
                </span>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Category: {product.category}</p>
                <p className="text-sm text-gray-600">Price: {formatCurrency(product.price)}</p>
                <p className="text-sm text-gray-600">Stock: {product.stock} units</p>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button className="text-blue-600 hover:text-blue-800">
                  <FiEdit className="h-4 w-4" />
                </button>
                <button className="text-green-600 hover:text-green-800">
                  <FiEye className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPerformance = () => (
    <div className="space-y-6 animate-fadeInUp">
      {/* Performance Insights */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Performance Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {performanceInsights.map((insight, index) => (
            <div key={index} className="text-center p-4 border rounded-lg hover:shadow-md transition-all duration-300">
              <div className="text-3xl mb-2">{insight.icon}</div>
              <h4 className="font-semibold text-gray-900 mb-1">{insight.metric}</h4>
              <div className="text-2xl font-bold text-gray-900 mb-1">{insight.value}</div>
              <p className="text-sm text-gray-600">Target: {insight.target}</p>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-2 ${
                insight.status === 'excellent' ? 'bg-green-100 text-green-800' :
                insight.status === 'good' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {insight.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Monthly Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#8B5CF6" />
            <Bar dataKey="orders" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6 animate-fadeInUp">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Notifications</h3>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div key={notification.id} className={`border-l-4 p-4 rounded-lg ${
              notification.type === 'order' ? 'border-blue-500 bg-blue-50' :
              notification.type === 'payment' ? 'border-green-500 bg-green-50' :
              notification.type === 'inventory' ? 'border-yellow-500 bg-yellow-50' :
              'border-purple-500 bg-purple-50'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">{notification.title}</h4>
                  <p className="text-gray-600">{notification.message}</p>
                  <p className="text-sm text-gray-500 mt-1">{notification.time}</p>
                </div>
                <button className="text-blue-600 hover:text-blue-800">
                  <FiEye className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPayments = () => {
    const paymentStats = getPaymentStats();
    return (
      <div className="space-y-6 animate-fadeInUp">
        {/* Payment Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Total Earned</p>
                <p className="text-2xl font-bold text-green-700">{formatCurrency(paymentStats.paidAmount)}</p>
                <p className="text-xs text-green-500 mt-1">{paymentStats.paid} payments</p>
              </div>
              <div className="text-3xl">💰</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Outstanding</p>
                <p className="text-2xl font-bold text-red-700">{formatCurrency(paymentStats.outstandingAmount)}</p>
                <p className="text-xs text-red-500 mt-1">{paymentStats.unpaid + paymentStats.partial} pending</p>
              </div>
              <div className="text-3xl">⏳</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Partial Payments</p>
                <p className="text-2xl font-bold text-yellow-700">{paymentStats.partial}</p>
                <p className="text-xs text-yellow-500 mt-1">In progress</p>
              </div>
              <div className="text-3xl">⚡</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Payment Rate</p>
                <p className="text-2xl font-bold text-blue-700">{Math.round((paymentStats.paid / paymentStats.total) * 100)}%</p>
                <p className="text-xs text-blue-500 mt-1">On-time rate</p>
              </div>
              <div className="text-3xl">📊</div>
            </div>
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Payment History</h3>
            <div className="flex items-center space-x-3">
              {[
                { value: 'all', label: 'All', icon: '📋' },
                { value: 'paid', label: 'Paid', icon: '✅' },
                { value: 'partial', label: 'Partial', icon: '⚡' },
                { value: 'unpaid', label: 'Unpaid', icon: '❌' }
              ].map(filter => (
                <button
                  key={filter.value}
                  onClick={() => setPaymentFilter(filter.value)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    paymentFilter === filter.value
                      ? 'bg-purple-100 text-purple-700 ring-2 ring-purple-500'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{filter.icon}</span>
                  <span>{filter.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {getFilteredPaymentHistory().map(payment => (
              <div key={payment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl" title={`Status: ${payment.status}`}>
                      {getPaymentStatusIcon(payment.status)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-3">
                        <span className="font-bold text-gray-900">{payment.reference}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(payment.status)}`}>
                          {payment.status.toUpperCase()}
                        </span>
                        {payment.daysOverdue > 0 && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                            {payment.daysOverdue} days overdue
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                        <span>
                          {getPaymentMethodIcon(payment.paymentMethod)} {payment.paymentMethod.replace('_', ' ').toUpperCase()}
                        </span>
                        <span>📅 {new Date(payment.date).toLocaleDateString('en-UG')}</span>
                        <span>📦 Order: {payment.orderId}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-gray-900">
                      {formatCurrency(payment.amount)}
                    </div>
                    {payment.status === 'partial' && payment.paidAmount && (
                      <div className="text-sm text-gray-600">
                        Paid: {formatCurrency(payment.paidAmount)}
                        <div className="text-xs text-orange-600">
                          Remaining: {formatCurrency(payment.amount - payment.paidAmount)}
                        </div>
                      </div>
                    )}
                    <div className="text-sm text-gray-500">
                      Due: {new Date(payment.dueDate).toLocaleDateString('en-UG')}
                    </div>
                  </div>
                </div>
                
                {/* Progress Bar for Partial Payments */}
                {payment.status === 'partial' && payment.paidAmount && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Payment Progress</span>
                      <span>{Math.round((payment.paidAmount / payment.amount) * 100)}% Complete</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(payment.paidAmount / payment.amount) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {getFilteredPaymentHistory().length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💸</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Payment Records</h3>
              <p className="text-gray-600">
                {paymentFilter === 'all' ? 'No payment history available.' : `No ${paymentFilter} payments found.`}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiBarChart },
    { id: 'profile', label: 'My Profile', icon: FiUsers },
    { id: 'orders', label: 'Orders', icon: FiPackage },
    { id: 'products', label: 'Products', icon: FiShoppingCart },
    { id: 'payments', label: 'Payments', icon: FiDollarSign },
    { id: 'performance', label: 'Performance', icon: FiTrendingUp },
    { id: 'notifications', label: 'Notifications', icon: FiBell }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeInUp {
            animation: fadeInUp 0.8s ease-out;
          }
        `
      }} />
      
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Header Content */}
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-6">
              {/* Animated Logo */}
              <div className="relative">
                <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-all duration-300">
                  <span className="text-4xl animate-bounce">🏢</span>
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              
              <div>
                <h1 className="text-3xl font-bold text-white mb-1 flex items-center space-x-3">
                  Supplier Portal
                  <span className="px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
                    PREMIUM
                  </span>
                </h1>
                <p className="text-purple-100 text-lg">Partnership Management Hub</p>
              </div>
            </div>
            
            {/* Right Side - Profile & Actions */}
            <div className="flex items-center space-x-4">
              {/* Quick Stats Container */}
              <div className="hidden lg:flex items-center space-x-4 mr-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                  <div className="flex items-center space-x-2 text-white">
                    <FiTrendingUp className="h-5 w-5 text-green-300" />
                    <div>
                      <p className="text-xs text-purple-200">Monthly Growth</p>
                      <p className="text-sm font-bold">+{performanceMetrics.monthlyGrowth}%</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                  <div className="flex items-center space-x-2 text-white">
                    <FiPackage className="h-5 w-5 text-yellow-300" />
                    <div>
                      <p className="text-xs text-purple-200">Pending Orders</p>
                      <p className="text-sm font-bold">{performanceMetrics.pendingOrders}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Container - Clickable */}
              <button 
                onClick={() => setActiveTab('profile')}
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-xl px-4 py-3 border border-white/20 transition-all duration-300 group"
              >
                <div className="text-right">
                  <p className="text-sm text-white font-semibold group-hover:text-yellow-300 transition-colors">
                    {supplierProfile.name}
                  </p>
                  <p className="text-xs text-purple-200">{supplierProfile.contactPerson}</p>
                </div>
              </button>

              {/* Action Buttons Container */}
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-xl px-2 py-2 border border-white/20">
                {/* Notifications with Badge */}
                <button className="relative p-2 text-white hover:bg-white/20 rounded-lg transition-all duration-300 group">
                  <FiBell className="h-6 w-6 group-hover:animate-bounce" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                    {performanceMetrics.pendingOrders}
                  </span>
                </button>
                
                {/* Settings */}
                <button 
                  onClick={() => setActiveTab('profile')}
                  className="p-2 text-white hover:bg-white/20 rounded-lg transition-all duration-300 group"
                  title="Settings & Profile"
                >
                  <FiSettings className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
                </button>
                
                {/* Logout */}
                <button className="p-2 text-white hover:bg-red-500/50 rounded-lg transition-all duration-300 group">
                  <FiLogOut className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Status Bar with Live Stats */}
          <div className="pb-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                {/* Total Revenue */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <FiDollarSign className="h-5 w-5 text-green-300" />
                  </div>
                  <div>
                    <p className="text-xs text-purple-200">Total Revenue</p>
                    <p className="text-sm font-bold text-white">
                      UGX {(performanceMetrics.totalRevenue / 1000000).toFixed(1)}M
                    </p>
                  </div>
                </div>

                {/* Total Orders */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <FiShoppingCart className="h-5 w-5 text-blue-300" />
                  </div>
                  <div>
                    <p className="text-xs text-purple-200">Total Orders</p>
                    <p className="text-sm font-bold text-white">{performanceMetrics.totalOrders}</p>
                  </div>
                </div>

                {/* Quality Rating */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <FiStar className="h-5 w-5 text-yellow-300" />
                  </div>
                  <div>
                    <p className="text-xs text-purple-200">Quality Rating</p>
                    <p className="text-sm font-bold text-white flex items-center">
                      {supplierProfile.rating} 
                      <FiStar className="h-3 w-3 text-yellow-300 ml-1 fill-current" />
                    </p>
                  </div>
                </div>

                {/* On-Time Delivery */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <FiTruck className="h-5 w-5 text-purple-300" />
                  </div>
                  <div>
                    <p className="text-xs text-purple-200">On-Time</p>
                    <p className="text-sm font-bold text-white">{performanceMetrics.onTimeDelivery}%</p>
                  </div>
                </div>

                {/* Active Products */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <FiPackage className="h-5 w-5 text-orange-300" />
                  </div>
                  <div>
                    <p className="text-xs text-purple-200">Products</p>
                    <p className="text-sm font-bold text-white">{performanceMetrics.activeProducts}</p>
                  </div>
                </div>

                {/* Partnership Years */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center">
                    <FiAward className="h-5 w-5 text-pink-300" />
                  </div>
                  <div>
                    <p className="text-xs text-purple-200">Partnership</p>
                    <p className="text-sm font-bold text-white">{supplierProfile.partnershipYears} Years</p>
                  </div>
                </div>
              </div>
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
                    ? 'border-purple-500 text-purple-600'
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
        {(loading && ['overview','orders','products','payments'].includes(activeTab)) ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <FiRefreshCw className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading supplier data from database...</p>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'profile' && renderProfile()}
            {activeTab === 'orders' && renderOrders()}
            {activeTab === 'products' && renderProducts()}
            {activeTab === 'payments' && renderPayments()}
            {activeTab === 'performance' && renderPerformance()}
            {activeTab === 'notifications' && renderNotifications()}
          </>
        )}
      </div>
    </div>
  );
};

export default SupplierPortal;
