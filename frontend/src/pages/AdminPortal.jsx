import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { adminService } from '../services/adminService';
import { notificationService } from '../services/notificationService';
import { portalConfigService } from '../services/portalConfigService';
import ProductInventoryInterface from '../components/ProductInventoryInterface';
import { 
  FiUsers, FiUser, FiShield, FiSettings, FiBarChart, FiActivity,
  FiGlobe, FiServer, FiDatabase, FiLock, FiAlertTriangle,
  FiTerminal, FiCpu, FiHardDrive, FiRefreshCw, FiZap,
  FiPower, FiTrendingUp, FiUserCheck, FiShoppingBag,
  FiDollarSign, FiPieChart, FiCalendar, FiBell, FiCheckCircle,
  FiXCircle, FiUserPlus, FiSearch, FiFilter, FiDownload,
  FiUpload, FiTrash2, FiEdit, FiEye, FiRotateCw, FiX,
  FiMoreVertical
} from 'react-icons/fi';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

const AdminPortal = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [systemData, setSystemData] = useState({
    analytics: {},
    users: {},
    settings: {}
  });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showQuickRegister, setShowQuickRegister] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [adminForm, setAdminForm] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: ''
  });

  // Real-time state management
  const [realTimeData, setRealTimeData] = useState({
    activeUsers: 89,
    todaysOrders: 142,
    dailyRevenue: 4200,
    systemHealth: 99.9,
    employeeLogins: 234,
    failedAttempts: 3,
    activeSessions: 89,
    managerAccess: 18,
    systemLoad: 23,
    memoryUsage: 67,
    diskUsage: 45,
    networkLoad: 12,
    isEmployeeLoginEnabled: true,
    isManagerLoginEnabled: true,
    recentActivities: [],
    systemServices: [
      { name: 'Web Server', status: 'online', uptime: 99.9 },
      { name: 'Database', status: 'online', uptime: 99.8 },
      { name: 'Payment Gateway', status: 'online', uptime: 99.7 },
      { name: 'Backup Service', status: 'online', uptime: 100 }
    ]
  });

  const [notifications, setNotifications] = useState([]);
  const [wsConnection, setWsConnection] = useState(null);

  // Portal Configuration Management - Real Data Integration
  const [portalConfig, setPortalConfig] = useState({
    adminPortal: 'Admin Portal',
    employeePortal: 'Employee Portal',
    managerPortal: 'Manager Portal',
    customerPortal: 'Customer Portal',
    supplierPortal: 'Supplier Portal',
    deliveryPortal: 'Delivery Portal',
    systemName: 'FAREDEAL',
    companyName: 'FareDeal Uganda',
    appTitle: 'FareDeal Management System',
    tagline: 'Your Trusted Marketplace',
    version: '2.0.0'
  });
  
  const [showPortalConfig, setShowPortalConfig] = useState(false);
  const [configForm, setConfigForm] = useState({});
  const [configLoading, setConfigLoading] = useState(false);
  const [configHistory, setConfigHistory] = useState([]);
  const [realTimeListener, setRealTimeListener] = useState(null);
  // Mock admin user for development
  const user = {
    id: 1,
    name: "System Admin",
    role: "admin",
    email: "admin"
  };

  useEffect(() => {
    loadSystemData();
    initializeRealTimeUpdates();
    simulateWebSocketConnection();
    loadPortalConfiguration();
    setupRealTimeConfigUpdates();
    
    return () => {
      if (wsConnection) {
        wsConnection.close();
      }
      if (realTimeListener) {
        realTimeListener();
      }
    };
  }, []);

  // Load portal configuration from server with fallback to localStorage
  const loadPortalConfiguration = async () => {
    try {
      showNotification('Loading portal configuration...', 'info');
      
      const response = await portalConfigService.getPortalConfiguration();
      
      if (response.success) {
        setPortalConfig(response.data);
        showNotification('Portal configuration loaded successfully', 'success');
      } else {
        // Fallback to localStorage or default
        const savedConfig = localStorage.getItem('portalConfiguration');
        if (savedConfig) {
          const parsedConfig = JSON.parse(savedConfig);
          setPortalConfig(parsedConfig);
          showNotification('Portal configuration loaded from local storage', 'warning');
        } else {
          showNotification('Using default portal configuration', 'info');
        }
      }
      
      // Load configuration history
      loadConfigurationHistory();
      
    } catch (error) {
      console.error('Failed to load portal configuration:', error);
      showNotification('Failed to load portal configuration, using defaults', 'error');
    }
  };

  // Initialize real-time updates
  const initializeRealTimeUpdates = () => {
    // Simulate real-time data updates every 5 seconds
    const interval = setInterval(() => {
      updateRealTimeData();
      generateRandomActivity();
    }, 5000);

    return () => clearInterval(interval);
  };

  // Simulate WebSocket connection for real-time updates
  const simulateWebSocketConnection = () => {
    // Simulate WebSocket connection
    const mockWs = {
      readyState: 1, // OPEN
      send: (data) => {
        console.log('Sending data:', data);
        showNotification('Command sent successfully', 'success');
      },
      close: () => console.log('WebSocket connection closed'),
      onmessage: null,
      onopen: () => console.log('WebSocket connected'),
      onerror: (error) => console.error('WebSocket error:', error)
    };
    
    setWsConnection(mockWs);
    showNotification('Real-time connection established', 'success');
  };

  // Update real-time data with simulated changes
  const updateRealTimeData = () => {
    setRealTimeData(prev => ({
      ...prev,
      activeUsers: prev.activeUsers + Math.floor(Math.random() * 10 - 5),
      todaysOrders: prev.todaysOrders + Math.floor(Math.random() * 5),
      dailyRevenue: prev.dailyRevenue + Math.floor(Math.random() * 1000),
      systemLoad: Math.max(10, Math.min(90, prev.systemLoad + Math.floor(Math.random() * 10 - 5))),
      memoryUsage: Math.max(30, Math.min(90, prev.memoryUsage + Math.floor(Math.random() * 6 - 3))),
      activeSessions: Math.max(50, Math.min(200, prev.activeSessions + Math.floor(Math.random() * 8 - 4))),
      employeeLogins: prev.employeeLogins + Math.floor(Math.random() * 3),
      systemServices: prev.systemServices.map(service => ({
        ...service,
        uptime: Math.max(95, Math.min(100, service.uptime + (Math.random() * 0.2 - 0.1)))
      }))
    }));
  };

  // Generate random system activities
  const generateRandomActivity = () => {
    const activities = [
      { type: 'order', message: `New order #${Math.floor(Math.random() * 1000 + 2000)} received from Customer Portal`, severity: 'info' },
      { type: 'payment', message: `Payment of $${(Math.random() * 200 + 50).toFixed(2)} processed successfully`, severity: 'success' },
      { type: 'employee', message: `Employee ${['John Doe', 'Jane Smith', 'Mike Wilson', 'Sarah Johnson'][Math.floor(Math.random() * 4)]} logged into system`, severity: 'info' },
      { type: 'inventory', message: `${['Rice', 'Beans', 'Sugar', 'Oil'][Math.floor(Math.random() * 4)]} stock level updated`, severity: 'warning' },
      { type: 'system', message: 'System optimization completed successfully', severity: 'success' }
    ];

    const newActivity = {
      ...activities[Math.floor(Math.random() * activities.length)],
      time: 'Just now',
      id: Date.now()
    };

    setRealTimeData(prev => ({
      ...prev,
      recentActivities: [newActivity, ...prev.recentActivities.slice(0, 9)]
    }));
  };

  // Show notifications
  const showNotification = (message, type = 'info') => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setNotifications(prev => [notification, ...prev.slice(0, 4)]);
    
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  const loadSystemData = async () => {
    try {
      setLoading(true);
      
      const [analytics, users, settings] = await Promise.all([
        adminService.getSystemAnalytics(),
        adminService.getAllUsers(),
        adminService.getSystemSettings()
      ]);

      setSystemData({
        analytics: analytics || {},
        users: users || {},
        settings: settings || {}
      });
    } catch (error) {
      console.error('Error loading system data:', error);
      notificationService.show('Failed to load system data', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Quick Admin Registration - Creative instant access
  const createQuickAdmin = async () => {
    try {
      setLoading(true);
      
      // Auto-generate missing fields for quick setup
      const quickAdminData = {
        email: adminForm.email || `admin${Date.now()}@faredeal.com`,
        password: adminForm.password || 'FareAdmin2025!',
        full_name: adminForm.full_name || 'Quick Admin',
        phone: adminForm.phone || '+1234567890',
        admin_id: `QA-${Date.now()}`, // Quick Admin ID
        role: 'super_admin',
        permissions: [
          'user_management',
          'system_administration', 
          'financial_oversight',
          'inventory_control',
          'analytics_access',
          'security_management'
        ]
      };

      // Register admin in database with instant activation
      const result = await adminService.register(quickAdminData);
      
      if (result.success) {
        notificationService.show('🚀 Admin account created! Instant access granted!', 'success');
        
        // Auto-login the new admin
        setTimeout(() => {
          window.location.href = '/login?email=' + encodeURIComponent(quickAdminData.email);
        }, 2000);
        
        setShowQuickRegister(false);
        setAdminForm({ email: '', password: '', full_name: '', phone: '' });
      } else {
        throw new Error(result.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Quick admin creation error:', error);
      notificationService.show('Failed to create admin account: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (action, userType, userId) => {
    try {
      setLoading(true);
      
      switch (action) {
        case 'activate':
          await adminService.activateUser(userType, userId);
          notificationService.show('User activated successfully', 'success');
          break;
        case 'deactivate':
          await adminService.deactivateUser(userType, userId);
          notificationService.show('User deactivated successfully', 'success');
          break;
        case 'delete':
          if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            await adminService.deleteUser(userType, userId);
            notificationService.show('User deleted successfully', 'success');
          }
          break;
        default:
          break;
      }
      
      loadSystemData(); // Refresh data
    } catch (error) {
      console.error(`Error ${action} user:`, error);
      notificationService.show(`Failed to ${action} user`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedUsers.length === 0) {
      notificationService.show('Please select users first', 'error');
      return;
    }

    try {
      setLoading(true);
      
      // Group users by type
      const usersByType = selectedUsers.reduce((acc, user) => {
        if (!acc[user.type]) acc[user.type] = [];
        acc[user.type].push(user.id);
        return acc;
      }, {});

      // Perform bulk operation for each user type
      const promises = Object.entries(usersByType).map(([userType, userIds]) =>
        adminService.bulkUserOperation(action, userType, userIds)
      );

      await Promise.all(promises);
      
      notificationService.show(`Bulk ${action} completed successfully`, 'success');
      setSelectedUsers([]);
      loadSystemData();
    } catch (error) {
      console.error(`Error performing bulk ${action}:`, error);
      notificationService.show(`Failed to perform bulk ${action}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Import Employee Access Service
  const [employeeAccessService, setEmployeeAccessService] = useState(null);
  const [showEmployeeControlModal, setShowEmployeeControlModal] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);
  const [accessControlStats, setAccessControlStats] = useState({});
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [auditLog, setAuditLog] = useState([]);
  const [accessControlLoading, setAccessControlLoading] = useState(false);

  // Admin Data Storage System
  const [adminDataService, setAdminDataService] = useState(null);
  const [showDataDashboard, setShowDataDashboard] = useState(false);
  const [dashboardData, setDashboardData] = useState({});
  const [dataInsights, setDataInsights] = useState([]);
  const [businessIntelligence, setBusinessIntelligence] = useState({});
  const [dataLoading, setDataLoading] = useState(false);

  // Initialize Employee Access Service
  useEffect(() => {
    const initEmployeeAccessService = async () => {
      try {
        const { employeeAccessService: service } = await import('../services/employeeAccessService.js');
        setEmployeeAccessService(service);
        
        // Load initial data
        const employees = service.getEmployeeList();
        const stats = service.getAccessControlStats();
        const audit = service.getAuditLog();
        
        setEmployeeList(employees);
        setAccessControlStats(stats);
        setAuditLog(audit);
        
        // Subscribe to real-time updates
        service.subscribe((update) => {
          if (update.type === 'GLOBAL_ACCESS_CHANGED' || update.type === 'INDIVIDUAL_ACCESS_CHANGED') {
            const newStats = service.getAccessControlStats();
            setAccessControlStats(newStats);
            setRealTimeData(prev => ({
              ...prev,
              isEmployeeLoginEnabled: update.enabled !== false
            }));
          }
          
          if (update.type === 'BULK_OPERATION_COMPLETED') {
            const newStats = service.getAccessControlStats();
            setAccessControlStats(newStats);
            showNotification(`Bulk ${update.operation} completed for ${update.affectedCount} employees`, 'success');
          }
          
          // Update audit log
          const newAudit = service.getAuditLog();
          setAuditLog(newAudit);
        });
        
      } catch (error) {
        console.error('Error initializing employee access service:', error);
        showNotification('Error loading employee access control', 'error');
      }
    };
    
    initEmployeeAccessService();
  }, []);

  // Initialize Admin Data Storage Service
  useEffect(() => {
    const initAdminDataService = async () => {
      try {
        const { adminDataStorageService: service } = await import('../services/adminDataStorageService.js');
        setAdminDataService(service);
        
        // Initialize with sample data for demonstration
        initializeSampleData();
        
        // Load dashboard data
        const dashboard = service.getAdminDashboardData();
        setDashboardData(dashboard);
        setDataInsights(dashboard.recentInsights || []);
        setBusinessIntelligence({
          predictions: dashboard.predictions || [],
          recommendations: dashboard.recommendations || []
        });
        
        // Setup real-time data updates
        const updateInterval = setInterval(() => {
          const updatedDashboard = service.getAdminDashboardData();
          setDashboardData(updatedDashboard);
          setDataInsights(updatedDashboard.recentInsights || []);
          setBusinessIntelligence({
            predictions: updatedDashboard.predictions || [],
            recommendations: updatedDashboard.recommendations || []
          });
        }, showDataDashboard ? 5000 : 30000); // Update every 5 seconds when dashboard is open, otherwise 30 seconds
        
        // Store interval ID for cleanup
        const intervalId = updateInterval;
        
        return () => {
          clearInterval(intervalId);
          console.log('🧹 Cleaned up data service interval');
        };
        
      } catch (error) {
        console.error('Error initializing admin data service:', error);
        showNotification('Error loading admin data system', 'error');
        setDataLoading(false);
        
        // Set fallback data with proper structure
        setDashboardData({
          systemHealth: { 
            totalRecords: 0, 
            dataQuality: 85, 
            performance: 75,
            uptime: 85,
            responseTime: 100,
            dataFreshness: 90
          },
          dataCategories: [
            { name: 'inventory_data', count: 0, lastUpdated: new Date().toISOString() },
            { name: 'user_behavior', count: 0, lastUpdated: new Date().toISOString() },
            { name: 'business_metrics', count: 0, lastUpdated: new Date().toISOString() }
          ],
          realTimeMetrics: { activeUsers: 0, currentSales: 0, conversionRate: "0.0" },
          recentInsights: []
        });
      }
    };
    
    initAdminDataService();
  }, []);

  // Stable Data Center Management - Enhanced with error handling and data validation
  useEffect(() => {
    if (!showDataDashboard || !adminDataService) return;

    let dashboardInterval;
    
    const updateDashboardData = () => {
      try {
        setDataLoading(true);
        console.log('🔄 Refreshing real-time dashboard data...');
        
        // Get fresh data with error handling
        const freshData = adminDataService.getAdminDashboardData();
        
        // Validate data before setting
        if (freshData && typeof freshData === 'object') {
          setDashboardData(prev => ({
            ...prev,
            ...freshData,
            systemHealth: {
              totalRecords: freshData.systemHealth?.totalRecords || prev.systemHealth?.totalRecords || 0,
              dataQuality: freshData.systemHealth?.dataQuality || prev.systemHealth?.dataQuality || 85,
              performance: freshData.systemHealth?.performance || prev.systemHealth?.performance || 75
            },
            realTimeMetrics: {
              activeUsers: freshData.realTimeMetrics?.activeUsers || Math.floor(Math.random() * 50) + 25,
              currentSales: freshData.realTimeMetrics?.currentSales || Math.floor(Math.random() * 10000) + 5000,
              conversionRate: freshData.realTimeMetrics?.conversionRate || (Math.random() * 5 + 2).toFixed(1)
            }
          }));
          
          setDataInsights(freshData.recentInsights || []);
          setBusinessIntelligence({
            predictions: freshData.predictions || [],
            recommendations: freshData.recommendations || []
          });
          
          // Update real-time metrics display
          setRealTimeData(prev => ({
            ...prev,
            activeUsers: freshData.realTimeMetrics?.activeUsers || prev.activeUsers,
            todaysOrders: prev.todaysOrders + Math.floor(Math.random() * 3),
            dailyRevenue: prev.dailyRevenue + Math.floor(Math.random() * 1000),
            systemHealth: Math.max(85 + Math.floor(Math.random() * 15), 85)
          }));
          
          console.log('✅ Dashboard data updated successfully');
        }
        
      } catch (error) {
        console.error('❌ Error updating dashboard data:', error);
        showNotification('Data refresh error - using cached data', 'warning');
      } finally {
        setDataLoading(false);
      }
    };

    // Initial data load when dashboard opens
    updateDashboardData();
    
    // Set up high-frequency updates for active data dashboard
    dashboardInterval = setInterval(updateDashboardData, 5000); // Update every 5 seconds

    return () => {
      if (dashboardInterval) {
        clearInterval(dashboardInterval);
      }
    };
  }, [showDataDashboard, adminDataService]);

  // Initialize sample data for demonstration
  const initializeSampleData = () => {
    // Sample inventory data
    const sampleProducts = [
      { id: 1, name: 'iPhone 15 Pro', category: 'Electronics', price: 999, stock: 50, status: 'active', lastUpdated: new Date().toISOString() },
      { id: 2, name: 'Samsung Galaxy S24', category: 'Electronics', price: 899, stock: 30, status: 'active', lastUpdated: new Date().toISOString() },
      { id: 3, name: 'MacBook Pro M3', category: 'Electronics', price: 1999, stock: 25, status: 'active', lastUpdated: new Date().toISOString() },
      { id: 4, name: 'Dell XPS 13', category: 'Electronics', price: 1299, stock: 40, status: 'active', lastUpdated: new Date().toISOString() },
      { id: 5, name: 'iPad Air', category: 'Electronics', price: 599, stock: 60, status: 'active', lastUpdated: new Date().toISOString() },
      { id: 6, name: 'AirPods Pro', category: 'Electronics', price: 249, stock: 100, status: 'active', lastUpdated: new Date().toISOString() }
    ];
    
    // Sample employee data
    const sampleEmployees = [
      { id: 1, name: 'John Smith', department: 'Sales', role: 'Manager', status: 'active', lastLogin: new Date().toISOString() },
      { id: 2, name: 'Sarah Johnson', department: 'IT', role: 'Developer', status: 'active', lastLogin: new Date(Date.now() - 3600000).toISOString() },
      { id: 3, name: 'Mike Davis', department: 'Marketing', role: 'Specialist', status: 'active', lastLogin: new Date(Date.now() - 7200000).toISOString() },
      { id: 4, name: 'Lisa Wilson', department: 'HR', role: 'Coordinator', status: 'inactive', lastLogin: new Date(Date.now() - 86400000).toISOString() },
      { id: 5, name: 'David Brown', department: 'Finance', role: 'Analyst', status: 'active', lastLogin: new Date(Date.now() - 1800000).toISOString() }
    ];
    
    // Sample portal configuration
    const samplePortalConfig = {
      companyName: 'FareDeal Electronics',
      adminPortal: 'Admin Command Center',
      managerPortal: 'Management Hub',
      cashierPortal: 'Point of Sale',
      primaryColor: '#4F46E5',
      secondaryColor: '#7C3AED',
      lastUpdated: new Date().toISOString()
    };
    
    // Store sample data in localStorage if not already present
    if (!localStorage.getItem('inventory_products')) {
      localStorage.setItem('inventory_products', JSON.stringify(sampleProducts));
    }
    
    if (!localStorage.getItem('employee_access_control')) {
      localStorage.setItem('employee_access_control', JSON.stringify({
        employees: sampleEmployees,
        auditLog: [
          { action: 'login', employee: 'John Smith', timestamp: new Date().toISOString(), status: 'success' },
          { action: 'access_granted', employee: 'Sarah Johnson', timestamp: new Date(Date.now() - 1800000).toISOString(), status: 'success' },
          { action: 'logout', employee: 'Mike Davis', timestamp: new Date(Date.now() - 3600000).toISOString(), status: 'success' }
        ]
      }));
    }
    
    if (!localStorage.getItem('portal_configuration')) {
      localStorage.setItem('portal_configuration', JSON.stringify(samplePortalConfig));
      localStorage.setItem('portal_config_history', JSON.stringify([
        { action: 'update_theme', timestamp: new Date(Date.now() - 86400000).toISOString(), changes: { primaryColor: '#4F46E5' } },
        { action: 'update_branding', timestamp: new Date(Date.now() - 172800000).toISOString(), changes: { companyName: 'FareDeal Electronics' } }
      ]));
    }
    
    console.log('✅ Sample data initialized for real data demonstration');
  };

  // Real-time functional controls - Enhanced with service integration
  const toggleEmployeeLogin = async () => {
    if (!employeeAccessService) {
      showNotification('Employee access service not available', 'error');
      return;
    }
    
    try {
      setLoading(true);
      setAccessControlLoading(true);
      
      const result = await employeeAccessService.toggleGlobalEmployeeAccess();
      
      setRealTimeData(prev => ({
        ...prev,
        isEmployeeLoginEnabled: result.globalEmployeeAccess
      }));
      
      showNotification(
        `Global employee access ${result.globalEmployeeAccess ? 'enabled' : 'disabled'} successfully`, 
        result.globalEmployeeAccess ? 'success' : 'warning'
      );

      // Send real-time update via WebSocket
      if (wsConnection && wsConnection.readyState === 1) {
        wsConnection.send(JSON.stringify({
          type: 'EMPLOYEE_LOGIN_TOGGLE',
          enabled: result.globalEmployeeAccess,
          timestamp: new Date().toISOString()
        }));
      }
      
    } catch (error) {
      showNotification('Failed to toggle employee login', 'error');
    } finally {
      setLoading(false);
      setAccessControlLoading(false);
    }
  };

  // Show detailed employee control modal
  const showEmployeeControlInterface = () => {
    if (employeeAccessService) {
      const employees = employeeAccessService.getEmployeeList();
      const stats = employeeAccessService.getAccessControlStats();
      const audit = employeeAccessService.getAuditLog();
      
      setEmployeeList(employees);
      setAccessControlStats(stats);
      setAuditLog(audit);
      setShowEmployeeControlModal(true);
    }
  };

  // Toggle individual employee access
  const toggleIndividualEmployeeAccess = async (employeeId, currentStatus) => {
    if (!employeeAccessService) return;
    
    try {
      setAccessControlLoading(true);
      const newStatus = currentStatus === 'active' ? 'disabled' : 'active';
      
      await employeeAccessService.toggleEmployeeAccess(employeeId, newStatus);
      
      // Update local employee list
      setEmployeeList(prev => prev.map(emp => 
        emp.id === employeeId 
          ? { ...emp, status: newStatus }
          : emp
      ));
      
      showNotification(`Employee access ${newStatus === 'active' ? 'enabled' : 'disabled'}`, 'success');
    } catch (error) {
      showNotification('Failed to update employee access', 'error');
    } finally {
      setAccessControlLoading(false);
    }
  };

  // Perform bulk employee operations
  const performEmployeeBulkOperation = async (operation) => {
    if (!employeeAccessService || selectedEmployees.length === 0) {
      showNotification('Please select employees first', 'warning');
      return;
    }
    
    try {
      setAccessControlLoading(true);
      
      const result = await employeeAccessService.performBulkOperation(operation, selectedEmployees);
      
      // Update local employee list
      setEmployeeList(prev => prev.map(emp => 
        selectedEmployees.includes(emp.id)
          ? { ...emp, status: operation === 'enable' ? 'active' : 'disabled' }
          : emp
      ));
      
      setSelectedEmployees([]);
      showNotification(`Bulk ${operation} completed for ${result.affectedCount} employees`, 'success');
    } catch (error) {
      showNotification(`Failed to perform bulk ${operation}`, 'error');
    } finally {
      setAccessControlLoading(false);
    }
  };

  const toggleManagerLogin = async () => {
    try {
      setLoading(true);
      
      // Simulate API call to toggle manager login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newStatus = !realTimeData.isManagerLoginEnabled;
      setRealTimeData(prev => ({
        ...prev,
        isManagerLoginEnabled: newStatus
      }));
      
      showNotification(
        `Manager login ${newStatus ? 'enabled' : 'disabled'} successfully`, 
        newStatus ? 'success' : 'warning'
      );

      // Send real-time update via WebSocket
      if (wsConnection && wsConnection.readyState === 1) {
        wsConnection.send(JSON.stringify({
          type: 'MANAGER_LOGIN_TOGGLE',
          enabled: newStatus,
          timestamp: new Date().toISOString()
        }));
      }
      
    } catch (error) {
      showNotification('Failed to toggle manager login', 'error');
    } finally {
      setLoading(false);
    }
  };

  const performBulkAccountAction = async (action) => {
    try {
      setLoading(true);
      showNotification(`Performing bulk ${action} operation...`, 'info');
      
      // Simulate bulk operation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const affectedCount = Math.floor(Math.random() * 50 + 10);
      showNotification(`Bulk ${action} completed for ${affectedCount} accounts`, 'success');
      
      // Update statistics
      setRealTimeData(prev => ({
        ...prev,
        employeeLogins: action === 'enable' ? prev.employeeLogins + affectedCount : prev.employeeLogins,
        activeSessions: action === 'disable' ? Math.max(0, prev.activeSessions - affectedCount) : prev.activeSessions
      }));

      // Send real-time update
      if (wsConnection && wsConnection.readyState === 1) {
        wsConnection.send(JSON.stringify({
          type: 'BULK_ACCOUNT_ACTION',
          action,
          affectedCount,
          timestamp: new Date().toISOString()
        }));
      }
      
    } catch (error) {
      showNotification(`Failed to perform bulk ${action}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const viewAccessAuditLog = () => {
    showNotification('Opening access audit log...', 'info');
    
    // Simulate opening audit log with real data
    const auditData = {
      totalLogins: realTimeData.employeeLogins,
      failedAttempts: realTimeData.failedAttempts,
      activeSessions: realTimeData.activeSessions,
      lastActivity: new Date().toLocaleString()
    };
    
    alert(`Access Audit Log:\n\nTotal Logins Today: ${auditData.totalLogins}\nFailed Attempts: ${auditData.failedAttempts}\nActive Sessions: ${auditData.activeSessions}\nLast Activity: ${auditData.lastActivity}`);
  };

  const performSystemAction = async (action, description) => {
    try {
      setLoading(true);
      showNotification(`${description} in progress...`, 'info');
      
      // Simulate system action
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update relevant metrics based on action
      if (action === 'backup') {
        setRealTimeData(prev => ({
          ...prev,
          systemServices: prev.systemServices.map(service => 
            service.name === 'Backup Service' 
              ? { ...service, uptime: 100 }
              : service
          )
        }));
      } else if (action === 'security_scan') {
        setRealTimeData(prev => ({
          ...prev,
          failedAttempts: Math.max(0, prev.failedAttempts - 1)
        }));
      }
      
      showNotification(`${description} completed successfully!`, 'success');

      // Send real-time update
      if (wsConnection && wsConnection.readyState === 1) {
        wsConnection.send(JSON.stringify({
          type: 'SYSTEM_ACTION',
          action,
          description,
          timestamp: new Date().toISOString()
        }));
      }
      
    } catch (error) {
      showNotification(`Failed to ${description.toLowerCase()}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const forcePasswordReset = async () => {
    if (!window.confirm('Are you sure you want to reset passwords for all employees and managers? This will force them to create new passwords on next login.')) {
      return;
    }
    
    await performSystemAction('password_reset', 'Force password reset');
    showNotification('All employee and manager passwords have been reset', 'warning');
  };

  // Portal Configuration Functions - Real API Integration
  const openPortalConfiguration = async () => {
    try {
      setConfigLoading(true);
      
      // Load latest configuration from server
      const response = await portalConfigService.getPortalConfiguration();
      
      if (response.success) {
        setPortalConfig(response.data);
        setConfigForm({ ...response.data });
      } else {
        showNotification('Failed to load latest configuration', 'warning');
        setConfigForm({ ...portalConfig });
      }
      
      // Load configuration history
      const historyResponse = await portalConfigService.getConfigurationHistory();
      if (historyResponse.success) {
        setConfigHistory(historyResponse.data);
      }
      
      setShowPortalConfig(true);
      showNotification('Portal configuration center opened', 'info');
      
    } catch (error) {
      showNotification('Failed to open configuration center', 'error');
      setConfigForm({ ...portalConfig });
      setShowPortalConfig(true);
    } finally {
      setConfigLoading(false);
    }
  };

  const updatePortalConfiguration = async () => {
    try {
      setConfigLoading(true);
      showNotification('Validating and updating portal configurations...', 'info');

      // Use real portal configuration service
      const response = await portalConfigService.updatePortalConfiguration(configForm);

      if (response.success) {
        // Update local state with server response
        setPortalConfig(response.data);
        
        // Send real-time update via WebSocket
        if (wsConnection && wsConnection.readyState === 1) {
          wsConnection.send(JSON.stringify({
            type: 'PORTAL_CONFIG_UPDATE',
            config: response.data,
            timestamp: new Date().toISOString(),
            affectedPortals: response.affectedPortals
          }));
        }

        showNotification('Portal configurations updated successfully!', 'success');
        
        // Show affected portals
        if (response.affectedPortals && response.affectedPortals.length > 0) {
          setTimeout(() => {
            showNotification(`Changes applied to ${response.affectedPortals.length} portals: ${response.affectedPortals.join(', ')}`, 'success');
          }, 1500);
        }
        
        setShowPortalConfig(false);
        
        // Reload configuration history
        loadConfigurationHistory();
        
      } else {
        showNotification(`Update failed: ${response.error}`, 'error');
      }

    } catch (error) {
      console.error('Portal configuration update error:', error);
      showNotification('Failed to update portal configuration', 'error');
    } finally {
      setConfigLoading(false);
    }
  };

  const resetPortalConfiguration = async () => {
    if (!window.confirm('Are you sure you want to reset all portal names to default? This will affect all users immediately and cannot be undone.')) {
      return;
    }

    try {
      setConfigLoading(true);
      showNotification('Resetting portal configuration to default values...', 'info');

      // Use real portal configuration service
      const response = await portalConfigService.resetPortalConfiguration();

      if (response.success) {
        setPortalConfig(response.data);
        setConfigForm(response.data);

        // Send real-time update
        if (wsConnection && wsConnection.readyState === 1) {
          wsConnection.send(JSON.stringify({
            type: 'PORTAL_CONFIG_RESET',
            config: response.data,
            timestamp: new Date().toISOString()
          }));
        }

        showNotification('Portal configurations reset to default successfully', 'success');
        
        // Reload configuration history
        loadConfigurationHistory();
        
      } else {
        showNotification(`Reset failed: ${response.error}`, 'error');
      }

    } catch (error) {
      console.error('Portal configuration reset error:', error);
      showNotification('Failed to reset configuration', 'error');
    } finally {
      setConfigLoading(false);
    }
  };

  const previewPortalChanges = () => {
    const changedPortals = Object.keys(configForm).filter(key => 
      configForm[key] !== portalConfig[key] && configForm[key] !== undefined
    );
    
    if (changedPortals.length === 0) {
      showNotification('No changes to preview', 'info');
      return;
    }

    const changes = changedPortals.map(key => 
      `• ${key.replace(/([A-Z])/g, ' $1').trim()}: "${portalConfig[key]}" → "${configForm[key]}"`
    ).join('\n');
    
    const impactMessage = `These changes will:\n- Affect all ${changedPortals.length} portal(s) immediately\n- Be visible to all users\n- Update navigation and branding\n- Be broadcasted in real-time`;
    
    alert(`📋 Preview Changes:\n\n${changes}\n\n⚠️ Impact Assessment:\n${impactMessage}`);
  };

  // Load configuration history
  const loadConfigurationHistory = async () => {
    try {
      const response = await portalConfigService.getConfigurationHistory();
      if (response.success) {
        setConfigHistory(response.data);
      }
    } catch (error) {
      console.error('Failed to load configuration history:', error);
    }
  };

  // Setup real-time configuration updates
  const setupRealTimeConfigUpdates = () => {
    const cleanup = portalConfigService.setupRealTimeListener((updatedConfig) => {
      setPortalConfig(updatedConfig);
      showNotification('Portal configuration updated by another admin', 'info');
    });
    
    setRealTimeListener(cleanup);
  };

  const renderQuickAdminRegister = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all animate-scaleUp">
        {/* Header Section */}
        <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="relative flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="bg-white/20 p-2 rounded-lg">🚀</span>
                Quick Admin Setup
              </h3>
              <p className="text-blue-100">Create admin account with instant access</p>
            </div>
            <button 
              onClick={() => setShowQuickRegister(false)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <FiX className="h-6 w-6 text-white" />
            </button>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                label: 'Email',
                type: 'email',
                value: adminForm.email,
                placeholder: 'admin@faredeal.com',
                icon: '📧',
                onChange: (e) => setAdminForm({...adminForm, email: e.target.value})
              },
              {
                label: 'Password',
                type: 'text',
                value: adminForm.password,
                placeholder: 'FareAdmin2025!',
                icon: '🔒',
                onChange: (e) => setAdminForm({...adminForm, password: e.target.value})
              },
              {
                label: 'Full Name',
                type: 'text',
                value: adminForm.full_name,
                placeholder: 'Quick Admin',
                icon: '👤',
                onChange: (e) => setAdminForm({...adminForm, full_name: e.target.value})
              },
              {
                label: 'Phone',
                type: 'tel',
                value: adminForm.phone,
                placeholder: '+1234567890',
                icon: '📱',
                onChange: (e) => setAdminForm({...adminForm, phone: e.target.value})
              }
            ].map((field, index) => (
              <div key={index} className="group animate-fadeInUp" style={{ animationDelay: `${index * 100}ms` }}>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <span className="text-lg">{field.icon}</span>
                  {field.label}
                  <span className="text-xs text-gray-500">(optional)</span>
                </label>
                <div className="relative">
                  <input
                    type={field.type}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={field.placeholder}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm group-hover:border-blue-500"
                  />
                  <div className="absolute inset-0 border border-blue-500/0 rounded-lg group-hover:border-blue-500/20 pointer-events-none transition-all duration-300"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
            {[
              { icon: '🔑', label: 'No Verification', color: 'blue' },
              { icon: '📝', label: 'Auto-fill Ready', color: 'green' },
              { icon: '🗄️', label: 'DB Integration', color: 'purple' },
              { icon: '🚀', label: 'Instant Access', color: 'yellow' },
              { icon: '⚡', label: 'Full Permissions', color: 'red' },
              { icon: '🛡️', label: 'Secure Setup', color: 'indigo' }
            ].map((feature, index) => (
              <div 
                key={index}
                className={`bg-${feature.color}-50 p-3 rounded-xl flex items-center gap-3 transform hover:scale-105 transition-all duration-300 animate-fadeInUp`}
                style={{ animationDelay: `${(index + 4) * 100}ms` }}
              >
                <span className="text-2xl">{feature.icon}</span>
                <span className={`text-sm font-medium text-${feature.color}-700`}>{feature.label}</span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={createQuickAdmin}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FiRefreshCw className="h-5 w-5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <span className="text-lg">🚀</span>
                  Create Admin & Login
                </>
              )}
            </button>
            <button
              onClick={() => setShowQuickRegister(false)}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Enhanced Master Dashboard Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-bold mb-3 flex items-center">
              <span className="mr-4 text-5xl">🎯</span>
              Master Admin Dashboard
            </h2>
            <p className="text-blue-100 text-lg mb-4">Complete system oversight and operational control</p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-blue-200">All Systems Operational</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiDatabase className="h-5 w-5 text-purple-300" />
                <span className="text-purple-200">Real-time Data</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiShield className="h-5 w-5 text-pink-300" />
                <span className="text-pink-200">Maximum Security</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-6xl font-bold">∞</div>
            <div className="text-blue-200 text-xl">Admin Power</div>
            <div className="text-blue-300 text-sm">Unlimited Access</div>
          </div>
        </div>
      </div>

      {/* Quick Access to All Sections */}
      <div className="bg-white rounded-2xl shadow-2xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="mr-3 text-3xl">🚀</span>
          Quick Access Hub - All Sections
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { id: 'inventory', label: 'Inventory', icon: '📦', color: 'emerald', stats: '6 Products' },
            { id: 'orders', label: 'Orders', icon: '📋', color: 'orange', stats: '2,847 Orders' },
            { id: 'payments', label: 'Payments', icon: '💳', color: 'green', stats: '$127K Revenue' },
            { id: 'suppliers', label: 'Suppliers', icon: '🏭', color: 'purple', stats: '24 Suppliers' },
            { id: 'users', label: 'Users', icon: '👥', color: 'blue', stats: '1,234 Users' },
            { id: 'analytics', label: 'Analytics', icon: '📈', color: 'pink', stats: '+22% Growth' },
            { id: 'operations', label: 'Operations', icon: '⚙️', color: 'gray', stats: '99.9% Uptime' },
            { id: 'settings', label: 'Settings', icon: '🛠️', color: 'indigo', stats: 'Configuration' },
            { id: 'security', label: 'Security', icon: '🛡️', color: 'red', stats: 'Protected' },
            { id: 'monitoring', label: 'Monitoring', icon: '📡', color: 'yellow', stats: 'Live Data' }
          ].map((section, index) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`bg-gradient-to-br from-${section.color}-50 to-${section.color}-100 hover:from-${section.color}-100 hover:to-${section.color}-200 p-6 rounded-xl border-2 border-${section.color}-200 hover:border-${section.color}-400 transform hover:scale-105 transition-all duration-300 text-center animate-fadeInUp`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-4xl mb-3">{section.icon}</div>
              <div className={`text-${section.color}-900 font-bold text-lg mb-1`}>{section.label}</div>
              <div className={`text-${section.color}-700 text-sm`}>{section.stats}</div>
              <div className={`mt-2 w-full h-1 bg-${section.color}-300 rounded-full`}>
                <div className={`h-full bg-${section.color}-600 rounded-full transition-all duration-1000`} style={{ width: '75%' }}></div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Employee & Manager Sign-in Control Center */}
      <div className="bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-3xl font-bold mb-3 flex items-center">
              <span className="mr-4 text-4xl">🔐</span>
              Employee & Manager Access Control
            </h3>
            <p className="text-cyan-100 text-lg">Complete control over employee and manager authentication</p>
          </div>
          <div className="flex space-x-4">
            <div className="bg-white/20 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold">156</div>
              <div className="text-cyan-200 text-sm">Active Employees</div>
            </div>
            <div className="bg-white/20 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold">24</div>
              <div className="text-blue-200 text-sm">Active Managers</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Employee Login Control',
              description: 'Enable/disable employee access',
              icon: '👨‍💼',
              action: showEmployeeControlInterface,
              status: realTimeData.isEmployeeLoginEnabled ? 'enabled' : 'disabled',
              count: `${accessControlStats.activeEmployees || realTimeData.activeUsers} Active`
            },
            {
              title: 'Manager Login Control',
              description: 'Enable/disable manager access',
              icon: '👔',
              action: toggleManagerLogin,
              status: realTimeData.isManagerLoginEnabled ? 'enabled' : 'disabled',
              count: '24 Active'
            },
            {
              title: 'Bulk Account Actions',
              description: 'Mass enable/disable accounts',
              icon: '⚡',
              action: () => {
                const action = window.confirm('Enable (OK) or Disable (Cancel) accounts?') ? 'enable' : 'disable';
                performBulkAccountAction(action);
              },
              status: 'ready',
              count: 'Mass Actions'
            },
            {
              title: 'Access Audit Log',
              description: 'View all login attempts',
              icon: '📋',
              action: viewAccessAuditLog,
              status: 'active',
              count: 'Live Tracking'
            }
          ].map((control, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="text-4xl mb-4">{control.icon}</div>
              <h4 className="text-xl font-bold mb-2">{control.title}</h4>
              <p className="text-cyan-100 text-sm mb-4">{control.description}</p>
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  control.status === 'enabled' ? 'bg-green-500/20 text-green-300' :
                  control.status === 'ready' ? 'bg-blue-500/20 text-blue-300' :
                  'bg-purple-500/20 text-purple-300'
                }`}>
                  {control.status}
                </span>
                <span className="text-white/80 text-xs">{control.count}</span>
              </div>
              <button
                onClick={control.action}
                className="w-full bg-white/20 hover:bg-white/30 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
              >
                Access Control
              </button>
            </div>
          ))}
        </div>

        {/* Advanced Access Controls */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h4 className="text-xl font-bold mb-4 flex items-center">
              <span className="mr-3 text-2xl">🎛️</span>
              Advanced Controls
            </h4>
            <div className="space-y-3">
              {[
                { 
                  action: 'Force Password Reset', 
                  icon: '🔑', 
                  description: 'Reset all employee passwords',
                  onClick: forcePasswordReset
                },
                { 
                  action: 'Session Management', 
                  icon: '⏱️', 
                  description: 'Control active sessions',
                  onClick: () => {
                    showNotification(`Managing ${realTimeData.activeSessions} active sessions...`, 'info');
                    setTimeout(() => showNotification('Session management completed', 'success'), 2000);
                  }
                },
                { 
                  action: 'Role Assignment', 
                  icon: '👤', 
                  description: 'Modify user roles and permissions',
                  onClick: () => {
                    const roles = ['Employee', 'Manager', 'Supervisor'];
                    showNotification(`Role assignment system opened - ${roles.length} roles available`, 'info');
                  }
                },
                { 
                  action: 'Account Lockout', 
                  icon: '🔒', 
                  description: 'Lock/unlock specific accounts',
                  onClick: () => {
                    const action = window.confirm('Lock (OK) or Unlock (Cancel) accounts?') ? 'lock' : 'unlock';
                    showNotification(`Account ${action} operation initiated...`, 'warning');
                    setTimeout(() => showNotification(`Account ${action} completed`, 'success'), 1500);
                  }
                }
              ].map((item, index) => (
                <button
                  key={index}
                  onClick={item.onClick}
                  className="w-full bg-white/5 hover:bg-white/15 p-4 rounded-lg text-left transition-all duration-300 flex items-center"
                >
                  <span className="text-2xl mr-4">{item.icon}</span>
                  <div>
                    <div className="font-semibold">{item.action}</div>
                    <div className="text-cyan-200 text-sm">{item.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h4 className="text-xl font-bold mb-4 flex items-center">
              <span className="mr-3 text-2xl">📊</span>
              Access Statistics
            </h4>
            <div className="space-y-4">
              {[
                { label: 'Today\'s Logins', value: realTimeData.employeeLogins.toString(), change: '+12%', type: 'employees' },
                { label: 'Failed Attempts', value: realTimeData.failedAttempts.toString(), change: '-67%', type: 'security' },
                { label: 'Active Sessions', value: realTimeData.activeSessions.toString(), change: '+5%', type: 'live' },
                { label: 'Manager Access', value: realTimeData.managerAccess.toString(), change: '+3%', type: 'managers' }
              ].map((stat, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <div className="font-medium">{stat.label}</div>
                    <div className="text-cyan-200 text-sm">{stat.type}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className={`text-sm ${stat.change.startsWith('+') ? 'text-green-300' : 'text-red-300'}`}>
                      {stat.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats with Enhanced Animations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            title: 'Total Users', 
            value: realTimeData.activeUsers + 1145, // Total includes inactive users
            icon: FiUsers, 
            color: 'from-blue-500 to-blue-600',
            animation: 'animate-fadeInUp delay-100'
          },
          { 
            title: 'Active Sessions', 
            value: realTimeData.activeSessions, 
            icon: FiActivity, 
            color: 'from-green-500 to-green-600',
            animation: 'animate-fadeInUp delay-200'
          },
          { 
            title: 'System Load', 
            value: `${realTimeData.systemLoad}%`, 
            icon: FiCpu, 
            color: 'from-purple-500 to-purple-600',
            animation: 'animate-fadeInUp delay-300'
          },
          { 
            title: 'Memory Usage', 
            value: `${realTimeData.memoryUsage}%`, 
            icon: FiShield, 
            color: 'from-yellow-500 to-red-600',
            animation: 'animate-fadeInUp delay-400'
          }
        ].map((stat, index) => (
          <div 
            key={index} 
            className={`${stat.animation} transform hover:scale-105 transition-all duration-500 container-glass rounded-xl p-6 shadow-lg hover:shadow-2xl group`}
          >
            <div className="flex items-center justify-between relative overflow-hidden">
              <div className="z-10">
                <p className="text-gray-600 text-sm font-medium mb-1 group-hover:text-blue-600 transition-colors duration-300">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                  {stat.value}
                </p>
                <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 mt-2 rounded-full" />
              </div>
              <div className={`p-4 rounded-xl bg-gradient-to-r ${stat.color} transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                <stat.icon className="h-8 w-8 text-white animate-pulse" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-xl" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Performance with Enhanced Animations */}
        <div className="container-glass rounded-xl p-6 shadow-lg transform hover:scale-[1.02] transition-all duration-500 animate-slideInRight">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg animate-pulse">
                <FiActivity className="h-6 w-6 text-blue-600" />
              </div>
              <span>System Performance</span>
            </h3>
            <button 
              onClick={loadSystemData}
              className="p-3 hover:bg-blue-50 rounded-lg transition-all duration-300 group"
            >
              <FiRefreshCw className="h-5 w-5 text-blue-600 group-hover:rotate-180 transition-transform duration-500" />
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/30 to-blue-100/30 rounded-lg animate-pulse" />
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={[
              { time: '00:00', cpu: 45, memory: 60, network: 30 },
              { time: '04:00', cpu: 35, memory: 55, network: 25 },
              { time: '08:00', cpu: 65, memory: 75, network: 60 },
              { time: '12:00', cpu: 85, memory: 85, network: 75 },
              { time: '16:00', cpu: 75, memory: 80, network: 65 },
              { time: '20:00', cpu: 55, memory: 70, network: 45 },
              { time: '23:59', cpu: 45, memory: 65, network: 35 }
            ]}>
              <defs>
                <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="memoryGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="networkGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="time" 
                stroke="#6B7280"
                tick={{ fill: '#6B7280' }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis 
                stroke="#6B7280"
                tick={{ fill: '#6B7280' }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="cpu" 
                stroke="#3B82F6" 
                fillOpacity={1} 
                fill="url(#cpuGradient)" 
                strokeWidth={2}
                name="CPU Usage"
              />
              <Area 
                type="monotone" 
                dataKey="memory" 
                stroke="#10B981" 
                fillOpacity={1} 
                fill="url(#memoryGradient)"
                strokeWidth={2}
                name="Memory Usage"
              />
              <Area 
                type="monotone" 
                dataKey="network" 
                stroke="#8B5CF6" 
                fillOpacity={1} 
                fill="url(#networkGradient)"
                strokeWidth={2}
                name="Network Load"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

        {/* Quick Actions with Enhanced Animations */}
        <div className="container-glass rounded-xl p-6 shadow-lg transform hover:scale-[1.02] transition-all duration-500 animate-slideInRight delay-200">
          <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-6 flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg animate-pulse">
              <FiZap className="h-6 w-6 text-blue-600" />
            </div>
            <span>Quick Actions</span>
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { 
                title: 'Add Admin',
                description: 'Create new admin account',
                icon: FiUserPlus,
                color: 'from-blue-500 to-blue-600',
                onClick: () => setShowQuickRegister(true),
                delay: 'delay-100'
              },
              { 
                title: 'Portal Names',
                description: 'Configure portal names',
                icon: FiSettings,
                color: 'from-indigo-500 to-purple-600',
                onClick: openPortalConfiguration,
                delay: 'delay-150'
              },
              { 
                title: 'System Backup',
                description: 'Backup system data',
                icon: FiDatabase,
                color: 'from-green-500 to-green-600',
                delay: 'delay-200'
              },
              { 
                title: 'Security Scan',
                description: 'Check system security',
                icon: FiShield,
                color: 'from-yellow-500 to-red-600',
                delay: 'delay-300'
              },
              { 
                title: 'Clear Cache',
                description: 'Optimize system performance',
                icon: FiRefreshCw,
                color: 'from-purple-500 to-purple-600',
                delay: 'delay-400'
              }
            ].map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className={`${action.delay} animate-fadeInUp p-6 rounded-xl bg-gradient-to-r ${action.color} text-white hover:shadow-2xl group relative overflow-hidden transition-all duration-500`}
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                <div className="relative flex flex-col items-center space-y-3">
                  <div className="p-3 bg-white/20 rounded-xl group-hover:scale-110 transform transition-transform duration-500">
                    <action.icon className="h-8 w-8" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-lg">{action.title}</p>
                    <p className="text-sm text-white/80">{action.description}</p>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full bg-white/20 transition-all duration-500" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {showQuickRegister && renderQuickAdminRegister()}

      {/* Dashboard Secondary Content */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* API Health */}
        <div className="container-glass rounded-xl p-6 shadow-lg transform hover:scale-[1.02] transition-all duration-500">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FiServer className="h-6 w-6 text-blue-600 animate-pulse" />
              </div>
              <span>API Health Status</span>
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Response Time', value: '45ms', trend: '↓ 5ms', up: true },
              { label: 'Success Rate', value: '99.9%', trend: '↑ 0.1%', up: true },
              { label: 'Error Rate', value: '0.1%', trend: '↓ 0.2%', up: true },
              { label: 'Throughput', value: '850/s', trend: '↑ 50/s', up: true }
            ].map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                <div className="text-sm text-gray-600 mb-1">{item.label}</div>
                <div className="text-2xl font-bold text-gray-900">{item.value}</div>
                <div className={`text-sm ${item.up ? 'text-green-600' : 'text-red-600'}`}>
                  {item.trend}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full w-[99.9%] bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transform origin-left scale-x-0 animate-widthExpand"></div>
            </div>
          </div>
        </div>

        {/* Recent System Logs */}
        <div className="container-glass rounded-xl p-6 shadow-lg transform hover:scale-[1.02] transition-all duration-500">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FiTerminal className="h-6 w-6 text-blue-600" />
              </div>
              <span>System Logs</span>
            </h3>
            <button className="p-2 hover:bg-blue-50 rounded-lg transition-all duration-300">
              <FiRefreshCw className="h-5 w-5 text-blue-600" />
            </button>
          </div>
          <div className="space-y-3">
            {[
              { type: 'info', message: 'System backup completed successfully', time: '2 mins ago' },
              { type: 'warning', message: 'High CPU usage detected', time: '5 mins ago' },
              { type: 'error', message: 'Failed login attempt', time: '10 mins ago' },
              { type: 'info', message: 'New user registration', time: '15 mins ago' }
            ].map((log, index) => (
              <div 
                key={index}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-300"
              >
                <div className={`w-2 h-2 rounded-full ${
                  log.type === 'info' ? 'bg-blue-500' :
                  log.type === 'warning' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-gray-900">{log.message}</p>
                  <p className="text-sm text-gray-500">{log.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comprehensive System Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Real-time System Status */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="mr-3 text-3xl">📡</span>
            Real-time System Overview
          </h3>
          {/* Advanced Admin Data Storage Dashboard */}
          <div className="mb-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <span className="bg-indigo-500 text-white p-3 rounded-xl">🏛️</span>
                  Admin Data Intelligence Center
                </h3>
                <p className="text-indigo-700 mt-2">Real-time business intelligence and comprehensive data analytics</p>
              </div>
              <button
                onClick={() => {
                  if (adminDataService) {
                    setDataLoading(true);
                    setShowDataDashboard(true);
                    showNotification('Loading Data Intelligence Center...', 'info');
                  } else {
                    showNotification('Data service not ready. Please wait...', 'warning');
                  }
                }}
                disabled={!adminDataService}
                className={`px-6 py-3 rounded-xl transition-all duration-300 font-medium flex items-center gap-2 ${
                  !adminDataService 
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:scale-105'
                }`}
              >
                <span className={`text-xl ${!adminDataService ? '⏳' : '🏛️'}`}>
                  {!adminDataService ? '⏳' : '🏛️'}
                </span>
                {!adminDataService ? 'Loading System...' : 'Open Data Intelligence Center'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { 
                  title: 'Data Records', 
                  value: dashboardData.systemHealth?.totalRecords || 0, 
                  icon: '📁',
                  color: 'blue',
                  description: 'Total stored records'
                },
                { 
                  title: 'Data Quality', 
                  value: `${dashboardData.systemHealth?.dataQuality || 95}%`, 
                  icon: '✨',
                  color: 'green',
                  description: 'Data integrity score'
                },
                { 
                  title: 'Active Insights', 
                  value: dataInsights.length || 0, 
                  icon: '🧠',
                  color: 'purple',
                  description: 'Generated insights'
                },
                { 
                  title: 'System Performance', 
                  value: `${dashboardData.systemHealth?.performance || 87}%`, 
                  icon: '⚡',
                  color: 'orange',
                  description: 'Performance score'
                }
              ].map((metric, index) => (
                <div key={index} className={`bg-white p-4 rounded-lg border-l-4 border-${metric.color}-500 hover:shadow-lg transition-shadow`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{metric.icon}</span>
                    <div className={`text-2xl font-bold text-${metric.color}-600`}>{metric.value}</div>
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm">{metric.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">{metric.description}</p>
                </div>
              ))}
            </div>

            {/* Quick Insights Preview */}
            {dataInsights.length > 0 && (
              <div className="mt-6 p-4 bg-white/60 rounded-lg border border-indigo-200">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span>💡</span>
                  Latest Business Insights
                </h4>
                <div className="space-y-2">
                  {dataInsights.slice(0, 3).map((insight, index) => (
                    <div key={index} className="text-sm flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${
                        insight.impact === 'high' ? 'bg-red-500' :
                        insight.impact === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}></span>
                      <span className="text-gray-700">{insight.title}</span>
                      <span className="text-xs text-gray-500">({insight.type})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { title: 'Orders Today', value: realTimeData.todaysOrders.toString(), icon: '📋', color: 'blue', status: 'active' },
              { title: 'Revenue Today', value: `$${(realTimeData.dailyRevenue / 1000).toFixed(1)}K`, icon: '💰', color: 'green', status: 'active' },
              { title: 'Active Users', value: (dashboardData.realTimeMetrics?.activeUsers || realTimeData.activeUsers).toString(), icon: '👥', color: 'purple', status: 'active' },
              { title: 'System Health', value: `${dashboardData.realTimeMetrics?.systemHealth?.uptime?.toFixed(1) || realTimeData.systemHealth}%`, icon: '❤️', color: 'red', status: 'healthy' }
            ].map((metric, index) => (
              <div key={index} className={`bg-gradient-to-br from-${metric.color}-50 to-${metric.color}-100 p-4 rounded-xl border border-${metric.color}-200`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{metric.icon}</span>
                  <div className={`w-2 h-2 rounded-full ${metric.status === 'active' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                </div>
                <div className={`text-${metric.color}-900 text-xs font-medium mb-1`}>{metric.title}</div>
                <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
              </div>
            ))}
          </div>

          {/* Live Activity Feed */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2 text-xl">🔔</span>
              Live Activity Feed
            </h4>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {realTimeData.recentActivities.length > 0 ? realTimeData.recentActivities.map((activity, index) => (
                <div key={index} className={`flex items-start space-x-3 p-3 rounded-lg ${
                  activity.severity === 'warning' ? 'bg-yellow-50 border-l-4 border-yellow-400' :
                  activity.severity === 'success' ? 'bg-green-50 border-l-4 border-green-400' :
                  'bg-blue-50 border-l-4 border-blue-400'
                }`}>
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.severity === 'warning' ? 'bg-yellow-500' :
                    activity.severity === 'success' ? 'bg-green-500' :
                    'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-gray-900 text-sm font-medium">{activity.message}</p>
                    <p className="text-gray-500 text-xs">{activity.time}</p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">🕒</div>
                  <p className="text-gray-500">Waiting for real-time activities...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Control Panel */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="mr-3 text-3xl">⚡</span>
            Quick Controls
          </h3>
          <div className="space-y-4">
            {[
              { 
                title: 'Emergency Stop', 
                icon: '🚨', 
                color: 'red', 
                action: () => {
                  if (window.confirm('Are you sure you want to initiate emergency stop? This will affect all users.')) {
                    performSystemAction('emergency_stop', 'Emergency system shutdown');
                  }
                }
              },
              { 
                title: 'System Backup', 
                icon: '💾', 
                color: 'blue', 
                action: () => performSystemAction('backup', 'System backup')
              },
              { 
                title: 'Employee Broadcast', 
                icon: '📢', 
                color: 'green', 
                action: () => {
                  const message = window.prompt('Enter broadcast message for all employees and managers:');
                  if (message) {
                    showNotification(`Broadcasting: "${message}" to all users`, 'info');
                    setTimeout(() => showNotification('Broadcast sent successfully', 'success'), 2000);
                  }
                }
              },
              { 
                title: 'Security Scan', 
                icon: '🔍', 
                color: 'purple', 
                action: () => performSystemAction('security_scan', 'Security vulnerability scan')
              },
              { 
                title: 'Performance Boost', 
                icon: '🚀', 
                color: 'yellow', 
                action: () => {
                  performSystemAction('performance_boost', 'Performance optimization');
                  setRealTimeData(prev => ({
                    ...prev,
                    systemLoad: Math.max(10, prev.systemLoad - 10)
                  }));
                }
              }
            ].map((control, index) => (
              <button
                key={index}
                onClick={control.action}
                className={`w-full bg-gradient-to-r from-${control.color}-500 to-${control.color}-600 hover:from-${control.color}-600 hover:to-${control.color}-700 text-white p-4 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-3`}
              >
                <span className="text-2xl">{control.icon}</span>
                <span className="font-semibold">{control.title}</span>
              </button>
            ))}
          </div>

          {/* System Status Indicators */}
          <div className="mt-8 space-y-3">
            <h4 className="text-lg font-bold text-gray-900 flex items-center">
              <span className="mr-2 text-xl">📊</span>
              System Status
            </h4>
            {realTimeData.systemServices.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${service.status === 'online' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                  <span className="font-medium text-gray-900">{service.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-green-600">{service.uptime.toFixed(1)}%</div>
                  <div className="text-xs text-gray-500">uptime</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            title: 'Total Users',
            value: systemData.analytics?.totalUsers || 1234,
            icon: '�',
            color: 'blue',
            trend: '+12%',
            trendUp: true
          },
          {
            title: 'Daily Revenue',
            value: `$${systemData.analytics?.dailyRevenue || '4.2K'}`,
            icon: '💰',
            color: 'green',
            trend: '+8%',
            trendUp: true
          },
          {
            title: 'Active Orders',
            value: systemData.analytics?.activeOrders || 142,
            icon: '📋',
            color: 'yellow',
            trend: '+15%',
            trendUp: true
          },
          {
            title: 'Growth Rate',
            value: `${systemData.analytics?.growthRate || 22}%`,
            icon: '📈',
            color: 'purple',
            trend: '+5%',
            trendUp: true
          }
        ].map((stat, index) => (
          <div
            key={index}
            className={`bg-${stat.color}-50 rounded-2xl p-6 transform hover:scale-105 transition-all duration-300 group relative overflow-hidden animate-fadeInUp`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            
            {/* Animated Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-r from-${stat.color}-500/10 to-transparent animate-shimmer`}></div>
            
            <div className="relative">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-${stat.color}-100 rounded-xl group-hover:scale-110 transform transition-all duration-300`}>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <div className={`flex items-center px-2 py-1 rounded-full text-sm ${
                  stat.trendUp ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
                }`}>
                  <span>{stat.trendUp ? '↑' : '↓'}</span>
                  <span className="ml-1">{stat.trend}</span>
                </div>
              </div>

              {/* Content */}
              <div>
                <h3 className={`text-${stat.color}-900 text-sm font-medium mb-1`}>{stat.title}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-${stat.color}-500 rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}
                    style={{ width: '75%' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Recent Activities */}
      <div className="bg-white rounded-2xl shadow-lg p-6 animate-fadeInUp" style={{ animationDelay: '400ms' }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-xl">📋</span>
            </div>
            Recent Activities
          </h3>
          <button className="p-2 hover:bg-purple-50 rounded-lg transition-colors">
            <FiRefreshCw className="h-5 w-5 text-purple-600" />
          </button>
        </div>

        <div className="space-y-4">
          {systemData.analytics?.recentActivities?.map((activity, index) => (
            <div 
              key={index}
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors animate-fadeInUp"
              style={{ animationDelay: `${(index + 5) * 100}ms` }}
            >
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <div className="flex-1">
                <p className="text-gray-900 font-medium">{activity.description}</p>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <FiMoreVertical className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          )) || (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">🕒</div>
              <p className="text-gray-500">No recent activities to show</p>
              <button className="mt-4 px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                Refresh Activities
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderUserManagement = () => (
    <div className="space-y-8">
      {/* User Management Header */}
      <div className="container-glass rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
            <p className="text-gray-600">Manage system users and permissions</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => handleBulkAction('activate')}
              disabled={selectedUsers.length === 0}
              className={`px-4 py-2 rounded-lg font-medium flex items-center space-x-2 ${
                selectedUsers.length === 0
                  ? 'bg-gray-100 text-gray-400'
                  : 'bg-green-500 text-white hover:bg-green-600'
              } transition-colors duration-300`}
            >
              <FiUserCheck className="h-5 w-5" />
              <span>Activate Selected</span>
            </button>
            <button
              onClick={() => handleBulkAction('deactivate')}
              disabled={selectedUsers.length === 0}
              className={`px-4 py-2 rounded-lg font-medium flex items-center space-x-2 ${
                selectedUsers.length === 0
                  ? 'bg-gray-100 text-gray-400'
                  : 'bg-yellow-500 text-white hover:bg-yellow-600'
              } transition-colors duration-300`}
            >
              <FiUserCheck className="h-5 w-5" />
              <span>Deactivate Selected</span>
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              disabled={selectedUsers.length === 0}
              className={`px-4 py-2 rounded-lg font-medium flex items-center space-x-2 ${
                selectedUsers.length === 0
                  ? 'bg-gray-100 text-gray-400'
                  : 'bg-red-500 text-white hover:bg-red-600'
              } transition-colors duration-300`}
            >
              <FiTrash2 className="h-5 w-5" />
              <span>Delete Selected</span>
            </button>
          </div>
        </div>
      </div>

      {/* User Tables */}
      {['customers', 'employees', 'managers', 'suppliers', 'admins'].map(userType => (
        <div key={userType} className="container-glass rounded-xl overflow-hidden shadow-lg">
          <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">
                {userType.charAt(0).toUpperCase() + userType.slice(1)}
              </h3>
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 rounded-lg px-3 py-1 text-sm text-white">
                  {systemData.users[userType]?.length || 0} users
                </div>
                <button className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-300">
                  <FiFilter className="h-5 w-5 text-white" />
                </button>
                <button className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-300">
                  <FiDownload className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {systemData.users[userType]?.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-300">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.some(u => u.id === user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers([...selectedUsers, { id: user.id, type: userType }]);
                          } else {
                            setSelectedUsers(selectedUsers.filter(u => u.id !== user.id));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                            {(user.full_name || user.name || '').charAt(0)}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{user.full_name || user.name}</div>
                          <div className="text-sm text-gray-500">{userType}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-900">{user.email}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        user.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleUserAction('activate', userType, user.id)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors duration-300"
                          title="Activate"
                        >
                          <FiCheckCircle className={`h-5 w-5 ${user.is_active ? 'text-gray-400' : 'text-green-600'}`} />
                        </button>
                        <button
                          onClick={() => handleUserAction('deactivate', userType, user.id)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors duration-300"
                          title="Deactivate"
                        >
                          <FiXCircle className={`h-5 w-5 ${!user.is_active ? 'text-gray-400' : 'text-yellow-600'}`} />
                        </button>
                        <button
                          onClick={() => handleUserAction('delete', userType, user.id)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors duration-300"
                          title="Delete"
                        >
                          <FiTrash2 className="h-5 w-5 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) || (
                  <tr>
                    <td colSpan="5" className="p-4 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ))}
      

    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-8">
      {/* System Settings Header */}
      <div className="container-glass rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">System Configuration</h2>
            <p className="text-gray-600">Configure system-wide settings, portal names, and preferences</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={openPortalConfiguration}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 flex items-center space-x-2 transform hover:scale-105"
            >
              <span className="text-lg">🏢</span>
              <span>Portal Names</span>
            </button>
            <button
              onClick={loadSystemData}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center space-x-2"
            >
              <FiRefreshCw className="h-5 w-5" />
              <span>Refresh Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Portal Configuration Quick Access */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-3xl font-bold mb-3 flex items-center">
              <span className="mr-4 text-4xl">🏢</span>
              Portal Name Management
            </h3>
            <p className="text-indigo-100 text-lg mb-4">Customize portal names and system branding across the entire application</p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-indigo-200">Real-time Updates</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-purple-300">6 Portals</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-pink-300">Instant Broadcasting</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <button
              onClick={openPortalConfiguration}
              className="bg-white/20 hover:bg-white/30 text-white py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-3"
            >
              <span className="text-2xl">⚙️</span>
              <span>Configure Now</span>
            </button>
          </div>
        </div>

        {/* Current Portal Names Display */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(portalConfig).slice(0, 6).map(([key, value], index) => (
            <div key={key} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="text-sm text-indigo-200 uppercase tracking-wide font-medium mb-1">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </div>
              <div className="text-white font-bold text-lg">{value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Settings */}
        <div className="container-glass rounded-xl p-6 shadow-lg">
          <div className="flex items-center space-x-2 mb-6">
            <FiSettings className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">General Settings</h3>
          </div>
          
          <div className="space-y-6">
            <div className="setting-item">
              <label className="block text-sm font-medium text-gray-700 mb-2">System Name</label>
              <div className="flex">
                <input
                  type="text"
                  value={systemData.settings?.systemName || 'FAREDEAL'}
                  readOnly
                  className="flex-1 p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                />
                <button className="ml-2 p-2 text-gray-400 hover:text-gray-600">
                  <FiEdit className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="setting-item">
              <label className="block text-sm font-medium text-gray-700 mb-2">Environment</label>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Production
                </span>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <FiEdit className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="setting-item">
              <label className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Maintenance Mode</span>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  systemData.settings?.maintenanceMode
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {systemData.settings?.maintenanceMode ? 'Enabled' : 'Disabled'}
                </div>
              </label>
              <div className="mt-2 flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={systemData.settings?.maintenanceMode || false}
                    readOnly
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-5 w-5"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Enable maintenance mode
                  </span>
                </label>
                <button className="ml-2 p-2 text-gray-400 hover:text-gray-600">
                  <FiEdit className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="container-glass rounded-xl p-6 shadow-lg">
          <div className="flex items-center space-x-2 mb-6">
            <FiShield className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">Security Settings</h3>
          </div>
          
          <div className="space-y-6">
            <div className="setting-item">
              <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout</label>
              <div className="flex">
                <input
                  type="number"
                  value={systemData.settings?.sessionTimeout || 30}
                  readOnly
                  className="flex-1 p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                  min="1"
                  max="240"
                />
                <span className="ml-2 flex items-center text-gray-500">minutes</span>
                <button className="ml-2 p-2 text-gray-400 hover:text-gray-600">
                  <FiEdit className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="setting-item">
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
              <div className="flex">
                <input
                  type="number"
                  value={systemData.settings?.maxLoginAttempts || 3}
                  readOnly
                  className="flex-1 p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                  min="1"
                  max="10"
                />
                <span className="ml-2 flex items-center text-gray-500">attempts</span>
                <button className="ml-2 p-2 text-gray-400 hover:text-gray-600">
                  <FiEdit className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="setting-item">
              <label className="block text-sm font-medium text-gray-700 mb-2">Two-Factor Authentication</label>
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={systemData.settings?.twoFactorEnabled || false}
                    readOnly
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-5 w-5"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Require 2FA for admin accounts
                  </span>
                </label>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <FiEdit className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Settings */}
        <div className="container-glass rounded-xl p-6 shadow-lg">
          <div className="flex items-center space-x-2 mb-6">
            <FiZap className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">Performance Settings</h3>
          </div>
          
          <div className="space-y-6">
            <div className="setting-item">
              <label className="block text-sm font-medium text-gray-700 mb-2">Cache Duration</label>
              <div className="flex">
                <input
                  type="number"
                  value={systemData.settings?.cacheDuration || 60}
                  readOnly
                  className="flex-1 p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                />
                <span className="ml-2 flex items-center text-gray-500">minutes</span>
                <button className="ml-2 p-2 text-gray-400 hover:text-gray-600">
                  <FiEdit className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="setting-item">
              <label className="block text-sm font-medium text-gray-700 mb-2">Request Rate Limit</label>
              <div className="flex">
                <input
                  type="number"
                  value={systemData.settings?.rateLimit || 100}
                  readOnly
                  className="flex-1 p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                />
                <span className="ml-2 flex items-center text-gray-500">requests/minute</span>
                <button className="ml-2 p-2 text-gray-400 hover:text-gray-600">
                  <FiEdit className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Integration Settings */}
        <div className="container-glass rounded-xl p-6 shadow-lg">
          <div className="flex items-center space-x-2 mb-6">
            <FiGlobe className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">Integration Settings</h3>
          </div>
          
          <div className="space-y-6">
            <div className="setting-item">
              <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
              <div className="flex">
                <input
                  type="password"
                  value="••••••••••••••••"
                  readOnly
                  className="flex-1 p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                />
                <button className="ml-2 p-2 text-gray-400 hover:text-gray-600">
                  <FiEye className="h-5 w-5" />
                </button>
                <button className="ml-2 p-2 text-gray-400 hover:text-gray-600">
                  <FiRotateCw className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="setting-item">
              <label className="block text-sm font-medium text-gray-700 mb-2">Webhook URL</label>
              <div className="flex">
                <input
                  type="text"
                  value={systemData.settings?.webhookUrl || 'https://api.faredeal.ug/webhooks'}
                  readOnly
                  className="flex-1 p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                />
                <button className="ml-2 p-2 text-gray-400 hover:text-gray-600">
                  <FiEdit className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInventoryControl = () => (
    <div className="space-y-8">
      {/* Admin Inventory Control Header */}
      <div className="bg-gradient-to-r from-emerald-500 via-blue-600 to-purple-700 rounded-2xl p-8 text-white shadow-2xl animate-fadeInUp">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-3 flex items-center">
              <span className="mr-4 text-4xl">🏭</span>
              Master Inventory Control
            </h2>
            <p className="text-emerald-100 text-lg">Complete administrative control over all inventory operations</p>
            <div className="flex items-center mt-4 space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-emerald-200">System Active</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiDatabase className="h-5 w-5 text-blue-300" />
                <span className="text-blue-200">Real-time Sync</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiShield className="h-5 w-5 text-purple-300" />
                <span className="text-purple-200">Admin Privileges</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold">∞</div>
            <div className="text-emerald-200 text-lg">Full Access</div>
            <div className="text-emerald-300 text-sm">All Operations</div>
          </div>
        </div>
      </div>

      {/* Admin Analytics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Total Products',
            value: '156',
            change: '+12%',
            icon: '📦',
            color: 'blue',
            description: 'All system products'
          },
          {
            title: 'Low Stock Alerts',
            value: '8',
            change: '-5%',
            icon: '⚠️',
            color: 'yellow',
            description: 'Items need restocking'
          },
          {
            title: 'Monthly Orders',
            value: '2,847',
            change: '+23%',
            icon: '📈',
            color: 'green',
            description: 'Reorders processed'
          },
          {
            title: 'Value at Risk',
            value: '$45K',
            change: '-8%',
            icon: '💰',
            color: 'red',
            description: 'Potential loss value'
          }
        ].map((metric, index) => (
          <div 
            key={index}
            className={`bg-gradient-to-br from-${metric.color}-50 to-${metric.color}-100 rounded-2xl p-6 shadow-lg transform hover:scale-105 transition-all duration-500 animate-fadeInUp border-2 border-${metric.color}-200 hover:border-${metric.color}-400`}
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-${metric.color}-200 rounded-xl`}>
                <span className="text-3xl">{metric.icon}</span>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                metric.change.startsWith('+') ? 'bg-green-100 text-green-700' : 
                metric.change.startsWith('-') && metric.color !== 'red' ? 'bg-red-100 text-red-700' :
                'bg-green-100 text-green-700'
              }`}>
                {metric.change}
              </div>
            </div>
            <div>
              <h3 className={`text-${metric.color}-900 font-medium text-sm mb-1`}>{metric.title}</h3>
              <div className="text-3xl font-bold text-gray-900 mb-1">{metric.value}</div>
              <p className={`text-${metric.color}-700 text-sm`}>{metric.description}</p>
            </div>
            <div className="mt-4">
              <div className={`h-2 bg-${metric.color}-200 rounded-full`}>
                <div className={`h-full bg-${metric.color}-500 rounded-full transition-all duration-1000 transform origin-left`} style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Advanced Admin Controls */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-100">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 flex items-center">
              <span className="mr-3 text-3xl">🎛️</span>
              Advanced Admin Controls
            </h3>
            <p className="text-gray-600 mt-2">Exclusive administrative functions and system-wide operations</p>
          </div>
          <div className="flex space-x-3">
            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center space-x-2">
              <FiDownload className="h-5 w-5" />
              <span>Export All Data</span>
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center space-x-2">
              <FiUpload className="h-5 w-5" />
              <span>Bulk Import</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { title: 'Global Reorder', icon: '🔄', color: 'bg-blue-600 hover:bg-blue-700', description: 'Trigger system-wide reorders' },
            { title: 'Price Override', icon: '💲', color: 'bg-green-600 hover:bg-green-700', description: 'Modify all product prices' },
            { title: 'Supplier Audit', icon: '🔍', color: 'bg-purple-600 hover:bg-purple-700', description: 'Check all supplier status' },
            { title: 'Force Sync', icon: '⚡', color: 'bg-yellow-600 hover:bg-yellow-700', description: 'Sync all inventory data' },
            { title: 'Category Manager', icon: '📁', color: 'bg-indigo-600 hover:bg-indigo-700', description: 'Manage product categories' },
            { title: 'Alert System', icon: '🚨', color: 'bg-red-600 hover:bg-red-700', description: 'Configure alert thresholds' },
            { title: 'Backup System', icon: '💾', color: 'bg-gray-600 hover:bg-gray-700', description: 'Create inventory backups' },
            { title: 'Analytics Hub', icon: '📊', color: 'bg-pink-600 hover:bg-pink-700', description: 'Advanced data insights' }
          ].map((control, index) => (
            <button
              key={index}
              className={`${control.color} text-white p-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex flex-col items-center space-y-3 text-center animate-fadeInUp`}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => alert(`${control.title} functionality activated! This would trigger: ${control.description}`)}
            >
              <span className="text-3xl">{control.icon}</span>
              <div>
                <div className="font-semibold text-sm">{control.title}</div>
                <div className="text-xs text-white/80 mt-1">{control.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Product Inventory Interface */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-emerald-100">
        <div className="p-6 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-700 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold flex items-center">
                <span className="mr-3 text-3xl">📦</span>
                Complete Product Management
              </h3>
              <p className="text-emerald-100 mt-2">Full administrative access to all inventory functions</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 rounded-lg px-4 py-2 text-center">
                <div className="text-2xl font-bold">6</div>
                <div className="text-emerald-200 text-sm">Products</div>
              </div>
              <div className="bg-white/20 rounded-lg px-4 py-2 text-center">
                <div className="text-2xl font-bold">∞</div>
                <div className="text-blue-200 text-sm">Admin Rights</div>
              </div>
              <div className="bg-white/20 rounded-lg px-4 py-2 text-center">
                <div className="text-2xl font-bold">✓</div>
                <div className="text-purple-200 text-sm">Full Control</div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Product Interface */}
        <div className="p-0">
          <ProductInventoryInterface />
        </div>
      </div>

      {/* System-wide Inventory Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Inventory Trends */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <span className="mr-3 text-2xl">📈</span>
              Inventory Trends
            </h3>
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div className="space-y-4">
            {[
              { product: 'Premium Rice 25kg', trend: 'up', value: '+15%', color: 'green' },
              { product: 'Organic Beans 10kg', trend: 'up', value: '+8%', color: 'green' },
              { product: 'White Sugar 5kg', trend: 'down', value: '-3%', color: 'red' },
              { product: 'Cooking Oil 2L', trend: 'up', value: '+22%', color: 'green' },
              { product: 'Maize Flour 10kg', trend: 'stable', value: '0%', color: 'gray' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full bg-${item.color}-500`}></div>
                  <span className="font-medium text-gray-900">{item.product}</span>
                </div>
                <div className={`flex items-center space-x-2 text-${item.color}-600`}>
                  <span>{item.trend === 'up' ? '↗' : item.trend === 'down' ? '↘' : '→'}</span>
                  <span className="font-semibold">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Alerts */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-red-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <span className="mr-3 text-2xl">🚨</span>
              Critical Alerts
            </h3>
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">3 Active</span>
          </div>
          <div className="space-y-4">
            {[
              {
                type: 'Critical Stock',
                message: 'Cooking Oil 2L - Only 2 units remaining',
                time: '2 mins ago',
                severity: 'high',
                action: 'Reorder Now'
              },
              {
                type: 'Supplier Issue',
                message: 'Premium Rice supplier delayed delivery',
                time: '15 mins ago',
                severity: 'medium',
                action: 'Contact Supplier'
              },
              {
                type: 'Price Alert',
                message: 'Maize Flour price increased by 12%',
                time: '1 hour ago',
                severity: 'low',
                action: 'Update Prices'
              }
            ].map((alert, index) => (
              <div key={index} className={`p-4 rounded-xl border-l-4 ${
                alert.severity === 'high' ? 'border-red-500 bg-red-50' :
                alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                'border-blue-500 bg-blue-50'
              }`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">{alert.type}</h4>
                    <p className="text-gray-700 text-sm mt-1">{alert.message}</p>
                    <p className="text-gray-500 text-xs mt-2">{alert.time}</p>
                  </div>
                  <button className={`px-3 py-1 rounded-lg text-xs font-medium ${
                    alert.severity === 'high' ? 'bg-red-600 text-white' :
                    alert.severity === 'medium' ? 'bg-yellow-600 text-white' :
                    'bg-blue-600 text-white'
                  }`}>
                    {alert.action}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderOrderManagement = () => (
    <div className="space-y-8">
      {/* Order Management Header */}
      <div className="bg-gradient-to-r from-orange-500 via-red-600 to-pink-700 rounded-2xl p-8 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-3 flex items-center">
              <span className="mr-4 text-4xl">📋</span>
              Complete Order Management
            </h2>
            <p className="text-orange-100 text-lg">Full administrative control over all order operations and workflows</p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold">2,847</div>
            <div className="text-orange-200 text-lg">Total Orders</div>
          </div>
        </div>
      </div>

      {/* Order Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Today Orders', value: '142', icon: '📦', color: 'blue', trend: '+15%' },
          { title: 'Pending Orders', value: '23', icon: '⏳', color: 'yellow', trend: '-5%' },
          { title: 'Completed Orders', value: '2,689', icon: '✅', color: 'green', trend: '+8%' },
          { title: 'Revenue Today', value: '$12.4K', icon: '💰', color: 'purple', trend: '+22%' }
        ].map((stat, index) => (
          <div key={index} className={`bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100 rounded-2xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-${stat.color}-200 rounded-xl`}>
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${stat.trend.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {stat.trend}
              </span>
            </div>
            <h3 className={`text-${stat.color}-900 font-medium text-sm mb-1`}>{stat.title}</h3>
            <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Order Control Panel */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="mr-3 text-3xl">🎛️</span>
          Order Control Panel
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: 'Bulk Actions', icon: '🔄', action: 'Process multiple orders' },
            { title: 'Priority Queue', icon: '⚡', action: 'Manage urgent orders' },
            { title: 'Auto-Assignment', icon: '🤖', action: 'Automated order routing' },
            { title: 'Cancel Orders', icon: '❌', action: 'Mass cancellation tools' },
            { title: 'Refund Control', icon: '💸', action: 'Process refunds' },
            { title: 'Delivery Tracking', icon: '🚚', action: 'Monitor deliveries' },
            { title: 'Customer Alerts', icon: '📱', action: 'Send notifications' },
            { title: 'Order Analytics', icon: '📊', action: 'Generate reports' }
          ].map((control, index) => (
            <button key={index} className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-4 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-center">
              <div className="text-2xl mb-2">{control.icon}</div>
              <div className="font-semibold text-sm">{control.title}</div>
              <div className="text-xs text-white/80 mt-1">{control.action}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPaymentControl = () => (
    <div className="space-y-8">
      {/* Payment Control Header */}
      <div className="bg-gradient-to-r from-green-500 via-emerald-600 to-teal-700 rounded-2xl p-8 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-3 flex items-center">
              <span className="mr-4 text-4xl">💳</span>
              Payment System Control
            </h2>
            <p className="text-green-100 text-lg">Complete financial oversight and payment processing control</p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold">$127K</div>
            <div className="text-green-200 text-lg">Monthly Revenue</div>
          </div>
        </div>
      </div>

      {/* Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Daily Revenue', value: '$4.2K', icon: '📈', color: 'green', status: 'up' },
          { title: 'Pending Payments', value: '47', icon: '⏱️', color: 'yellow', status: 'stable' },
          { title: 'Failed Transactions', value: '3', icon: '❌', color: 'red', status: 'down' },
          { title: 'Success Rate', value: '99.2%', icon: '✅', color: 'blue', status: 'up' }
        ].map((metric, index) => (
          <div key={index} className={`bg-gradient-to-br from-${metric.color}-50 to-${metric.color}-100 rounded-2xl p-6 shadow-lg`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-${metric.color}-200 rounded-xl`}>
                <span className="text-2xl">{metric.icon}</span>
              </div>
              <div className={`w-3 h-3 rounded-full ${metric.status === 'up' ? 'bg-green-500' : metric.status === 'down' ? 'bg-red-500' : 'bg-yellow-500'} animate-pulse`}></div>
            </div>
            <h3 className={`text-${metric.color}-900 font-medium text-sm mb-1`}>{metric.title}</h3>
            <div className="text-3xl font-bold text-gray-900">{metric.value}</div>
          </div>
        ))}
      </div>

      {/* Payment Control Tools */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="mr-3 text-3xl">🏦</span>
          Financial Control Center
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {[
            { title: 'Process Refunds', icon: '💸', description: 'Handle customer refunds', color: 'blue' },
            { title: 'Payment Gateway', icon: '🔗', description: 'Manage payment providers', color: 'purple' },
            { title: 'Transaction Logs', icon: '📋', description: 'View all transactions', color: 'green' },
            { title: 'Fraud Detection', icon: '🛡️', description: 'Security monitoring', color: 'red' },
            { title: 'Revenue Reports', icon: '📊', description: 'Financial analytics', color: 'yellow' },
            { title: 'Tax Management', icon: '🧾', description: 'Handle tax calculations', color: 'indigo' }
          ].map((tool, index) => (
            <div key={index} className={`bg-gradient-to-br from-${tool.color}-50 to-${tool.color}-100 p-6 rounded-xl border-2 border-${tool.color}-200 hover:border-${tool.color}-400 transform hover:scale-105 transition-all duration-300`}>
              <div className="text-4xl mb-4">{tool.icon}</div>
              <h4 className={`text-${tool.color}-900 font-bold text-lg mb-2`}>{tool.title}</h4>
              <p className={`text-${tool.color}-700 text-sm`}>{tool.description}</p>
              <button className={`mt-4 w-full bg-${tool.color}-600 text-white py-2 rounded-lg hover:bg-${tool.color}-700 transition-colors`}>
                Access
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSupplierNetwork = () => (
    <div className="space-y-8">
      {/* Supplier Network Header */}
      <div className="bg-gradient-to-r from-purple-500 via-indigo-600 to-blue-700 rounded-2xl p-8 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-3 flex items-center">
              <span className="mr-4 text-4xl">🏭</span>
              Supplier Network Control
            </h2>
            <p className="text-purple-100 text-lg">Complete supplier management and supply chain oversight</p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold">24</div>
            <div className="text-purple-200 text-lg">Active Suppliers</div>
          </div>
        </div>
      </div>

      {/* Supplier Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Active Suppliers', value: '24', icon: '🏢', color: 'purple' },
          { title: 'Pending Orders', value: '156', icon: '📦', color: 'blue' },
          { title: 'On-Time Delivery', value: '94%', icon: '🚚', color: 'green' },
          { title: 'Quality Score', value: '4.8/5', icon: '⭐', color: 'yellow' }
        ].map((stat, index) => (
          <div key={index} className={`bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100 rounded-2xl p-6 shadow-lg`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-${stat.color}-200 rounded-xl`}>
                <span className="text-2xl">{stat.icon}</span>
              </div>
            </div>
            <h3 className={`text-${stat.color}-900 font-medium text-sm mb-1`}>{stat.title}</h3>
            <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Supplier Management Tools */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="mr-3 text-3xl">⚙️</span>
          Supplier Management Hub
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Supplier Performance',
              description: 'Monitor delivery times, quality ratings, and reliability metrics',
              icon: '📊',
              color: 'blue',
              metrics: ['On-time: 94%', 'Quality: 4.8/5', 'Reliability: 96%']
            },
            {
              title: 'Contract Management',
              description: 'Handle supplier agreements, pricing, and terms',
              icon: '📋',
              color: 'green',
              metrics: ['Active: 24', 'Expiring: 3', 'Renewals: 5']
            },
            {
              title: 'Supply Chain Analytics',
              description: 'Track costs, lead times, and optimization opportunities',
              icon: '🔍',
              color: 'purple',
              metrics: ['Cost Savings: 12%', 'Lead Time: -2 days', 'Efficiency: +15%']
            }
          ].map((section, index) => (
            <div key={index} className={`bg-gradient-to-br from-${section.color}-50 to-${section.color}-100 p-6 rounded-xl border-2 border-${section.color}-200`}>
              <div className="text-4xl mb-4">{section.icon}</div>
              <h4 className={`text-${section.color}-900 font-bold text-lg mb-3`}>{section.title}</h4>
              <p className={`text-${section.color}-700 text-sm mb-4`}>{section.description}</p>
              <div className="space-y-2">
                {section.metrics.map((metric, idx) => (
                  <div key={idx} className={`text-${section.color}-800 text-xs bg-white/50 px-2 py-1 rounded`}>
                    {metric}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBusinessAnalytics = () => (
    <div className="space-y-8">
      {/* Analytics Header */}
      <div className="bg-gradient-to-r from-pink-500 via-rose-600 to-red-700 rounded-2xl p-8 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-3 flex items-center">
              <span className="mr-4 text-4xl">📈</span>
              Business Intelligence Center
            </h2>
            <p className="text-pink-100 text-lg">Advanced analytics and business intelligence dashboard</p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold">+22%</div>
            <div className="text-pink-200 text-lg">Growth Rate</div>
          </div>
        </div>
      </div>

      {/* KPI Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Customer Growth', value: '+18%', icon: '👥', color: 'blue', period: 'This Month' },
          { title: 'Revenue Growth', value: '+22%', icon: '💰', color: 'green', period: 'This Quarter' },
          { title: 'Order Volume', value: '+15%', icon: '📦', color: 'purple', period: 'vs Last Month' },
          { title: 'Profit Margin', value: '24.5%', icon: '📊', color: 'yellow', period: 'Current' }
        ].map((kpi, index) => (
          <div key={index} className={`bg-gradient-to-br from-${kpi.color}-50 to-${kpi.color}-100 rounded-2xl p-6 shadow-lg`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-${kpi.color}-200 rounded-xl`}>
                <span className="text-2xl">{kpi.icon}</span>
              </div>
            </div>
            <h3 className={`text-${kpi.color}-900 font-medium text-sm mb-1`}>{kpi.title}</h3>
            <div className="text-3xl font-bold text-gray-900 mb-1">{kpi.value}</div>
            <div className={`text-${kpi.color}-700 text-xs`}>{kpi.period}</div>
          </div>
        ))}
      </div>

      {/* Analytics Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="mr-3 text-3xl">🎯</span>
            Performance Insights
          </h3>
          <div className="space-y-4">
            {[
              { metric: 'Customer Acquisition Cost', value: '$23.50', change: '-12%', good: true },
              { metric: 'Average Order Value', value: '$87.30', change: '+8%', good: true },
              { metric: 'Customer Lifetime Value', value: '$456', change: '+15%', good: true },
              { metric: 'Churn Rate', value: '2.3%', change: '-0.5%', good: true }
            ].map((insight, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50">
                <div>
                  <div className="font-medium text-gray-900">{insight.metric}</div>
                  <div className="text-2xl font-bold text-gray-900">{insight.value}</div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${insight.good ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {insight.change}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="mr-3 text-3xl">🔮</span>
            Predictive Analytics
          </h3>
          <div className="space-y-6">
            {[
              {
                title: 'Revenue Forecast',
                prediction: '$156K next month',
                confidence: '94% confidence',
                trend: 'up'
              },
              {
                title: 'Inventory Demand',
                prediction: '2,340 units needed',
                confidence: '87% confidence',
                trend: 'up'
              },
              {
                title: 'Customer Growth',
                prediction: '145 new customers',
                confidence: '91% confidence',
                trend: 'up'
              }
            ].map((forecast, index) => (
              <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                <h4 className="font-bold text-gray-900 mb-2">{forecast.title}</h4>
                <div className="text-lg font-semibold text-blue-600 mb-1">{forecast.prediction}</div>
                <div className="text-sm text-gray-600">{forecast.confidence}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSystemOperations = () => (
    <div className="space-y-8">
      {/* System Operations Header */}
      <div className="bg-gradient-to-r from-gray-700 via-gray-800 to-black rounded-2xl p-8 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-3 flex items-center">
              <span className="mr-4 text-4xl">⚙️</span>
              System Operations Command Center
            </h2>
            <p className="text-gray-300 text-lg">Complete system control and infrastructure management</p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold text-green-400">99.9%</div>
            <div className="text-gray-300 text-lg">System Uptime</div>
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'CPU Usage', value: '23%', icon: '🖥️', color: 'green', status: 'healthy' },
          { title: 'Memory Usage', value: '67%', icon: '💾', color: 'yellow', status: 'warning' },
          { title: 'Disk Space', value: '45%', icon: '💿', color: 'green', status: 'healthy' },
          { title: 'Network Load', value: '12%', icon: '🌐', color: 'green', status: 'healthy' }
        ].map((metric, index) => (
          <div key={index} className={`bg-gradient-to-br from-${metric.color}-50 to-${metric.color}-100 rounded-2xl p-6 shadow-lg`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-${metric.color}-200 rounded-xl`}>
                <span className="text-2xl">{metric.icon}</span>
              </div>
              <div className={`w-3 h-3 rounded-full ${metric.status === 'healthy' ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`}></div>
            </div>
            <h3 className={`text-${metric.color}-900 font-medium text-sm mb-1`}>{metric.title}</h3>
            <div className="text-3xl font-bold text-gray-900">{metric.value}</div>
          </div>
        ))}
      </div>

      {/* Operations Control Panel */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="mr-3 text-3xl">🎛️</span>
          System Control Panel
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: 'System Restart', icon: '🔄', color: 'red', action: 'Restart Services' },
            { title: 'Database Backup', icon: '💾', color: 'blue', action: 'Create Backup' },
            { title: 'Clear Cache', icon: '🧹', color: 'green', action: 'Clear All Cache' },
            { title: 'Update System', icon: '⬆️', color: 'purple', action: 'Check Updates' },
            { title: 'Security Scan', icon: '🔒', color: 'yellow', action: 'Run Security Scan' },
            { title: 'Performance Test', icon: '⚡', color: 'indigo', action: 'Run Benchmark' },
            { title: 'Error Logs', icon: '📋', color: 'orange', action: 'View Error Logs' },
            { title: 'Maintenance Mode', icon: '🚧', color: 'gray', action: 'Toggle Maintenance' }
          ].map((control, index) => (
            <button
              key={index}
              className={`bg-${control.color}-600 hover:bg-${control.color}-700 text-white p-4 rounded-xl transition-all duration-300 transform hover:scale-105 text-center`}
              onClick={() => alert(`${control.action} activated! System operation in progress...`)}
            >
              <div className="text-2xl mb-2">{control.icon}</div>
              <div className="font-semibold text-sm">{control.title}</div>
              <div className="text-xs text-white/80 mt-1">{control.action}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // No auth checks for development mode

  // Notifications Component
  const NotificationCenter = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 rounded-lg shadow-lg border-l-4 backdrop-blur-sm transition-all duration-500 animate-slideInRight ${
            notification.type === 'success' ? 'bg-green-50/90 border-green-500 text-green-800' :
            notification.type === 'error' ? 'bg-red-50/90 border-red-500 text-red-800' :
            notification.type === 'warning' ? 'bg-yellow-50/90 border-yellow-500 text-yellow-800' :
            'bg-blue-50/90 border-blue-500 text-blue-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg">
                {notification.type === 'success' ? '✅' :
                 notification.type === 'error' ? '❌' :
                 notification.type === 'warning' ? '⚠️' : 'ℹ️'}
              </span>
              <div>
                <p className="font-medium">{notification.message}</p>
                <p className="text-xs opacity-75">{notification.timestamp}</p>
              </div>
            </div>
            <button
              onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  // Portal Configuration Modal Component
  const PortalConfigurationModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all animate-scaleUp">
        {/* Header Section */}
        <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="relative flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="text-3xl font-bold text-white flex items-center gap-3">
                <span className="bg-white/20 p-3 rounded-xl">🏢</span>
                Portal Configuration Center
              </h3>
              <p className="text-indigo-100">Customize all portal names and system branding in real-time</p>
            </div>
            <button 
              onClick={() => setShowPortalConfig(false)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <FiX className="h-6 w-6 text-white" />
            </button>
          </div>
        </div>

        {/* Configuration Notification */}
        {configNotification && (
          <div className={`mx-8 mt-6 p-4 rounded-xl flex items-center justify-between animate-fadeInUp ${
            configNotification.type === 'success' ? 'bg-green-50 border border-green-200' :
            configNotification.type === 'error' ? 'bg-red-50 border border-red-200' :
            'bg-blue-50 border border-blue-200'
          }`}>
            <div className="flex items-center space-x-3">
              <span className="text-2xl">
                {configNotification.type === 'success' ? '✅' : 
                 configNotification.type === 'error' ? '❌' : 'ℹ️'}
              </span>
              <span className={`font-medium ${
                configNotification.type === 'success' ? 'text-green-800' :
                configNotification.type === 'error' ? 'text-red-800' :
                'text-blue-800'
              }`}>
                {configNotification.message}
              </span>
            </div>
            <button 
              onClick={() => setConfigNotification(null)}
              className={`p-1 rounded-lg hover:bg-white/50 transition-colors ${
                configNotification.type === 'success' ? 'text-green-600' :
                configNotification.type === 'error' ? 'text-red-600' :
                'text-blue-600'
              }`}
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Configuration Form */}
        <div className="p-8 space-y-8">
          {/* System Branding Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
            <h4 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-3 text-3xl">🏷️</span>
              System Branding
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { key: 'systemName', label: 'System Name', placeholder: 'FAREDEAL', icon: '🚀' },
                { key: 'companyName', label: 'Company Name', placeholder: 'FareDeal Uganda', icon: '🏢' },
                { key: 'appTitle', label: 'App Title', placeholder: 'FareDeal Management System', icon: '📱' }
              ].map((field, index) => (
                <div key={field.key} className="group animate-fadeInUp" style={{ animationDelay: `${index * 100}ms` }}>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <span className="text-lg">{field.icon}</span>
                    {field.label}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={configForm[field.key] || ''}
                      onChange={(e) => setConfigForm({...configForm, [field.key]: e.target.value})}
                      placeholder={field.placeholder}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 bg-white/80 backdrop-blur-sm group-hover:border-indigo-400"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Portal Names Section */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
            <h4 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-3 text-3xl">🚪</span>
              Portal Names Configuration
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { key: 'adminPortal', label: 'Admin Portal', icon: '👑', color: 'red' },
                { key: 'employeePortal', label: 'Employee Portal', icon: '👨‍💼', color: 'blue' },
                { key: 'managerPortal', label: 'Manager Portal', icon: '👔', color: 'green' },
                { key: 'customerPortal', label: 'Customer Portal', icon: '🛍️', color: 'yellow' },
                { key: 'supplierPortal', label: 'Supplier Portal', icon: '🏭', color: 'purple' },
                { key: 'deliveryPortal', label: 'Delivery Portal', icon: '🚚', color: 'indigo' }
              ].map((portal, index) => (
                <div key={portal.key} className="group animate-fadeInUp" style={{ animationDelay: `${(index + 3) * 100}ms` }}>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <span className="text-lg">{portal.icon}</span>
                    {portal.label}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={configForm[portal.key] || ''}
                      onChange={(e) => setConfigForm({...configForm, [portal.key]: e.target.value})}
                      placeholder={portal.label}
                      className={`w-full p-3 border-2 border-${portal.color}-200 rounded-lg focus:ring-2 focus:ring-${portal.color}-500 focus:border-${portal.color}-500 transition-all duration-300 bg-white/80 backdrop-blur-sm group-hover:border-${portal.color}-400`}
                    />
                    <div className={`absolute inset-0 border-2 border-${portal.color}-500/0 rounded-lg group-hover:border-${portal.color}-500/20 pointer-events-none transition-all duration-300`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Preview & Configuration History */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Preview Changes */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-gray-200">
              <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-3 text-2xl">👀</span>
                Live Preview
              </h4>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {Object.entries(configForm).map(([key, value], index) => (
                  <div key={key} className={`p-3 rounded-lg border transition-all duration-300 ${
                    value !== portalConfig[key] ? 'bg-yellow-50 border-yellow-300 ring-1 ring-yellow-400' : 'bg-white border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                        <div className="font-semibold text-gray-900 truncate">{value || 'Not set'}</div>
                      </div>
                      {value !== portalConfig[key] && (
                        <div className="ml-2 flex items-center space-x-1">
                          <span className="text-xs text-yellow-600 font-medium">Modified</span>
                          <span className="text-yellow-500">✏️</span>
                        </div>
                      )}
                    </div>
                    {value !== portalConfig[key] && (
                      <div className="mt-2 text-xs text-gray-600 bg-white/60 p-2 rounded border-l-2 border-yellow-400">
                        <span className="font-medium">Previous:</span> {portalConfig[key]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Configuration History */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
              <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-3 text-2xl">📚</span>
                Recent Changes
                <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {configHistory.length} entries
                </span>
              </h4>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {configHistory.length > 0 ? configHistory.map((entry, index) => (
                  <div key={entry.id || index} className="bg-white/70 p-3 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-semibold text-gray-900">
                        Version {entry.version}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(entry.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 mb-1">
                      <span className="font-medium">Updated by:</span> {entry.updatedBy}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {entry.changes.map((change, changeIndex) => (
                        <span key={changeIndex} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {change.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">📝</div>
                    <p className="text-gray-500 text-sm">No configuration history available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Real-time Status */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-800 font-medium">Real-time Configuration Active</span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                  Version: {portalConfig.version}
                </span>
              </div>
              <div className="text-xs text-green-600">
                Last updated: {portalConfig.lastUpdated ? new Date(portalConfig.lastUpdated).toLocaleString() : 'Never'}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <button
              onClick={handleSaveConfiguration}
              disabled={!hasChanges || isConfigUpdating}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                hasChanges && !isConfigUpdating
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isConfigUpdating ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Saving Changes...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span className="mr-2">💾</span>
                  Save Configuration
                  {hasChanges && <span className="ml-2 bg-white/20 text-xs px-2 py-1 rounded-full">{Object.keys(configForm).filter(key => configForm[key] !== portalConfig[key]).length} changes</span>}
                </div>
              )}
            </button>
            
            <button
              onClick={() => {
                setConfigForm({ ...portalConfig });
                setConfigNotification({ type: 'info', message: 'Configuration reset to current values' });
              }}
              disabled={!hasChanges || isConfigUpdating}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                hasChanges && !isConfigUpdating
                  ? 'bg-gray-200 hover:bg-gray-300 text-gray-700 hover:scale-105'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              🔄 Reset Changes
            </button>
            
            <div className="flex space-x-2 flex-1">
              <button
                onClick={() => {
                  // Export current configuration
                  const configData = JSON.stringify(portalConfig, null, 2);
                  const blob = new Blob([configData], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `portal-config-${new Date().toISOString().split('T')[0]}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                  setConfigNotification({ type: 'success', message: 'Configuration exported successfully!' });
                }}
                disabled={isConfigUpdating}
                className="flex-1 py-3 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all duration-300 text-sm disabled:opacity-50"
              >
                📤 Export
              </button>
              
              <button
                onClick={() => setShowConfigModal(false)}
                className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                ❌ Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Employee Access Control Modal Component
  const EmployeeAccessControlModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-y-auto transform transition-all animate-scaleUp">
        {/* Header Section */}
        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="relative flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="text-3xl font-bold text-white flex items-center gap-3">
                <span className="bg-white/20 p-3 rounded-xl">👨‍💼</span>
                Employee Access Control Center
              </h3>
              <p className="text-blue-100">Manage employee login permissions and access control in real-time</p>
              <div className="flex items-center space-x-4 mt-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${accessControlStats.globalAccessEnabled ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                  <span className="text-blue-100 text-sm">
                    Global Access: {accessControlStats.globalAccessEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="text-blue-100 text-sm">
                  Version: 2.1.0
                </div>
              </div>
            </div>
            <button 
              onClick={() => setShowEmployeeControlModal(false)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <FiX className="h-6 w-6 text-white" />
            </button>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Quick Stats Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                title: 'Total Employees',
                value: accessControlStats.totalEmployees || 0,
                icon: '👥',
                color: 'blue',
                description: 'Registered employees'
              },
              {
                title: 'Active Access',
                value: accessControlStats.activeEmployees || 0,
                icon: '✅',
                color: 'green',
                description: 'Currently enabled'
              },
              {
                title: 'Disabled Access',
                value: accessControlStats.disabledEmployees || 0,
                icon: '❌',
                color: 'red',
                description: 'Access disabled'
              },
              {
                title: 'Recent Actions',
                value: accessControlStats.recentActions || 0,
                icon: '📊',
                color: 'purple',
                description: 'Last 24 hours'
              }
            ].map((stat, index) => (
              <div key={index} className={`bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100 p-6 rounded-xl border border-${stat.color}-200`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-3xl">{stat.icon}</div>
                  <div className={`text-2xl font-bold text-${stat.color}-700`}>{stat.value}</div>
                </div>
                <h4 className={`text-${stat.color}-800 font-semibold mb-1`}>{stat.title}</h4>
                <p className={`text-${stat.color}-600 text-sm`}>{stat.description}</p>
              </div>
            ))}
          </div>

          {/* Global Controls */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-gray-200">
            <h4 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-3 text-3xl">🎛️</span>
              Global Access Controls
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                onClick={toggleEmployeeLogin}
                disabled={accessControlLoading}
                className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                  accessControlStats.globalAccessEnabled
                    ? 'bg-red-50 border-red-200 hover:bg-red-100 text-red-700'
                    : 'bg-green-50 border-green-200 hover:bg-green-100 text-green-700'
                }`}
              >
                <div className="text-4xl mb-3">
                  {accessControlStats.globalAccessEnabled ? '🔒' : '🔓'}
                </div>
                <div className="text-lg font-semibold mb-2">
                  {accessControlStats.globalAccessEnabled ? 'Disable All Access' : 'Enable All Access'}
                </div>
                <div className="text-sm opacity-75">
                  {accessControlStats.globalAccessEnabled ? 'Block all employee logins' : 'Allow all employee logins'}
                </div>
              </button>
              
              <button
                onClick={() => performEmployeeBulkOperation('enable')}
                disabled={accessControlLoading || selectedEmployees.length === 0}
                className="p-6 rounded-xl border-2 bg-green-50 border-green-200 hover:bg-green-100 text-green-700 transition-all duration-300 disabled:opacity-50"
              >
                <div className="text-4xl mb-3">✅</div>
                <div className="text-lg font-semibold mb-2">Enable Selected</div>
                <div className="text-sm opacity-75">
                  {selectedEmployees.length} employees selected
                </div>
              </button>
              
              <button
                onClick={() => performEmployeeBulkOperation('disable')}
                disabled={accessControlLoading || selectedEmployees.length === 0}
                className="p-6 rounded-xl border-2 bg-red-50 border-red-200 hover:bg-red-100 text-red-700 transition-all duration-300 disabled:opacity-50"
              >
                <div className="text-4xl mb-3">❌</div>
                <div className="text-lg font-semibold mb-2">Disable Selected</div>
                <div className="text-sm opacity-75">
                  {selectedEmployees.length} employees selected
                </div>
              </button>
            </div>
          </div>

          {/* Employee List with Individual Controls */}
          <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h4 className="text-2xl font-bold text-gray-900 flex items-center">
                  <span className="mr-3 text-3xl">👨‍💼</span>
                  Individual Employee Controls
                </h4>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => {
                      if (selectedEmployees.length === employeeList.length) {
                        setSelectedEmployees([]);
                      } else {
                        setSelectedEmployees(employeeList.map(emp => emp.id));
                      }
                    }}
                    className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors text-sm font-medium"
                  >
                    {selectedEmployees.length === employeeList.length ? 'Deselect All' : 'Select All'}
                  </button>
                  <div className="text-sm text-gray-600">
                    {selectedEmployees.length} of {employeeList.length} selected
                  </div>
                </div>
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {employeeList.map((employee, index) => {
                const employeeStatus = employeeAccessService?.getEmployeeAccessStatus(employee.id) || employee.status;
                const isSelected = selectedEmployees.includes(employee.id);
                
                return (
                  <div key={employee.id} className={`p-6 border-b border-gray-100 hover:bg-gray-50 transition-colors ${isSelected ? 'bg-blue-50 border-blue-200' : ''}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedEmployees(prev => [...prev, employee.id]);
                            } else {
                              setSelectedEmployees(prev => prev.filter(id => id !== employee.id));
                            }
                          }}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {employee.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{employee.name}</div>
                          <div className="text-sm text-gray-600">{employee.email}</div>
                          <div className="text-xs text-gray-500">{employee.department}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            employeeStatus === 'active' ? 'bg-green-100 text-green-800' :
                            employeeStatus === 'disabled' ? 'bg-red-100 text-red-800' :
                            employeeStatus === 'disabled_globally' ? 'bg-orange-100 text-orange-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {employeeStatus === 'active' ? '✅ Active' :
                             employeeStatus === 'disabled' ? '❌ Disabled' :
                             employeeStatus === 'disabled_globally' ? '🔒 Globally Disabled' :
                             '⏳ Pending'}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {employee.lastLogin ? `Last: ${new Date(employee.lastLogin).toLocaleDateString()}` : 'Never logged in'}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => toggleIndividualEmployeeAccess(employee.id, employeeStatus)}
                          disabled={accessControlLoading || employeeStatus === 'disabled_globally'}
                          className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                            employeeStatus === 'active'
                              ? 'bg-red-500 hover:bg-red-600 text-white'
                              : 'bg-green-500 hover:bg-green-600 text-white'
                          }`}
                        >
                          {employeeStatus === 'active' ? 'Disable' : 'Enable'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Access Audit Log */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200">
            <h4 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-3 text-3xl">📋</span>
              Access Control Audit Log
              <span className="ml-3 text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                {auditLog.length} entries
              </span>
            </h4>
            <div className="max-h-64 overflow-y-auto space-y-3">
              {auditLog.length > 0 ? auditLog.slice(0, 10).map((entry, index) => (
                <div key={entry.id} className="bg-white/70 p-4 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">
                        {entry.action === 'GLOBAL_ACCESS_TOGGLE' ? '🌐' :
                         entry.action === 'INDIVIDUAL_ACCESS_TOGGLE' ? '👤' :
                         entry.action === 'BULK_OPERATION' ? '⚡' :
                         '📝'}
                      </span>
                      <div className="font-semibold text-gray-900">
                        {entry.action.replace(/_/g, ' ')}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(entry.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">By:</span> {entry.performedBy} 
                    {entry.details.affectedEmployees && (
                      <span className="ml-3">
                        <span className="font-medium">Affected:</span> {entry.details.affectedEmployees} employees
                      </span>
                    )}
                  </div>
                  {entry.details.employeeId && (
                    <div className="text-xs text-gray-500">
                      Employee ID: {entry.details.employeeId} | Status: {entry.details.status}
                    </div>
                  )}
                </div>
              )) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">📝</div>
                  <p className="text-gray-500">No audit log entries available</p>
                </div>
              )}
            </div>
          </div>

          {/* Export/Import Controls */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              onClick={() => {
                if (employeeAccessService) {
                  const config = employeeAccessService.exportConfiguration();
                  const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `employee-access-config-${new Date().toISOString().split('T')[0]}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                  showNotification('Employee access configuration exported successfully!', 'success');
                }
              }}
              disabled={accessControlLoading}
              className="flex-1 py-3 px-6 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>📤</span>
              Export Configuration
            </button>
            
            <button
              onClick={() => setShowEmployeeControlModal(false)}
              className="flex-1 py-3 px-6 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all duration-300"
            >
              ✖️ Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Admin Data Intelligence Dashboard Modal Component
  const AdminDataDashboardModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-y-auto transform transition-all animate-scaleUp">
        {/* Header Section */}
        <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="relative flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="text-3xl font-bold text-white flex items-center gap-3">
                <span className="bg-white/20 p-3 rounded-xl">🏛️</span>
                Admin Data Intelligence Center
              </h3>
              <p className="text-indigo-100">Comprehensive business intelligence and data analytics dashboard</p>
              <div className="flex items-center space-x-6 mt-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full animate-pulse ${
                    adminDataService && !dataLoading ? 'bg-green-400' : 'bg-yellow-400'
                  }`}></div>
                  <span className="text-indigo-100 text-sm">
                    {adminDataService && !dataLoading ? 'Real-time Data Active' : 'Connecting...'}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-indigo-100 text-sm">
                  <span>📊 Records: {dashboardData.systemHealth?.totalRecords || 0}</span>
                  <span>🏢 Products: {dashboardData.dataCategories?.find(cat => cat.name === 'inventory_data')?.count || 0}</span>
                  <span>👥 Employees: {dashboardData.dataCategories?.find(cat => cat.name === 'user_behavior')?.count || 0}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setShowDataDashboard(false)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <FiX className="h-6 w-6 text-white" />
            </button>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Loading State */}
          {dataLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <span className="text-lg text-gray-600">Loading real-time data...</span>
              </div>
            </div>
          ) : (
          <>
          {/* Executive Summary Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                title: 'Total Records',
                value: dashboardData.systemHealth?.totalRecords || 0,
                icon: '📊',
                color: 'blue',
                trend: '+12.5%',
                description: 'Data points collected'
              },
              {
                title: 'Data Quality Score',
                value: `${dashboardData.systemHealth?.dataQuality || 95}%`,
                icon: '✨',
                color: 'green',
                trend: '+2.1%',
                description: 'Data integrity rating'
              },
              {
                title: 'Business Insights',
                value: dataInsights.length || 0,
                icon: '🧠',
                color: 'purple',
                trend: '+8',
                description: 'Active insights generated'
              },
              {
                title: 'System Performance',
                value: `${dashboardData.systemHealth?.performance || 87}%`,
                icon: '⚡',
                color: 'orange',
                trend: '+3.2%',
                description: 'Overall system health'
              }
            ].map((metric, index) => (
              <div key={index} className={`bg-gradient-to-br from-${metric.color}-50 to-${metric.color}-100 p-6 rounded-xl border border-${metric.color}-200`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">{metric.icon}</div>
                  <div className={`text-sm font-semibold text-${metric.color}-600 bg-white/60 px-2 py-1 rounded`}>
                    {metric.trend}
                  </div>
                </div>
                <h4 className={`text-${metric.color}-800 font-semibold mb-2`}>{metric.title}</h4>
                <div className={`text-3xl font-bold text-${metric.color}-900 mb-1`}>{metric.value}</div>
                <p className={`text-${metric.color}-600 text-sm`}>{metric.description}</p>
              </div>
            ))}
          </div>

          {/* Data Categories Overview */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-gray-200">
            <h4 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-3 text-3xl">📂</span>
              Data Categories
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(dashboardData.dataCategories || []).map((category, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-lg">
                      {category.name === 'user_behavior' ? '👤' :
                       category.name === 'business_metrics' ? '📈' :
                       category.name === 'financial_data' ? '💰' :
                       category.name === 'inventory_data' ? '📦' :
                       category.name === 'performance' ? '⚡' :
                       '📊'}
                    </div>
                    <div className="text-lg font-bold text-indigo-600">{category.count}</div>
                  </div>
                  <h5 className="font-semibold text-gray-900 capitalize">
                    {category.name.replace(/_/g, ' ')}
                  </h5>
                  <p className="text-xs text-gray-500 mt-1">
                    Updated: {category.lastUpdated ? new Date(category.lastUpdated).toLocaleDateString() : 'Never'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Business Intelligence Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Insights */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200">
              <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-3 text-2xl">💡</span>
                Business Insights
                <span className="ml-2 text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                  {dataInsights.length} active
                </span>
              </h4>
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {dataInsights.length > 0 ? dataInsights.map((insight, index) => (
                  <div key={index} className="bg-white/70 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className={`w-3 h-3 rounded-full ${
                          insight.impact === 'high' ? 'bg-red-500' :
                          insight.impact === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}></span>
                        <div className="font-semibold text-gray-900">{insight.title}</div>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded ${
                        insight.impact === 'high' ? 'bg-red-100 text-red-700' :
                        insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {insight.impact}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{insight.type}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(insight.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">🔍</div>
                    <p className="text-gray-500">Generating business insights...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Predictions & Recommendations */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200">
              <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-3 text-2xl">🔮</span>
                Predictions & Recommendations
              </h4>
              
              {/* Predictions */}
              <div className="mb-6">
                <h5 className="font-semibold text-gray-800 mb-3">Predictive Analytics</h5>
                <div className="space-y-3">
                  {(businessIntelligence.predictions || []).map((prediction, index) => (
                    <div key={index} className="bg-white/70 p-3 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-gray-900">{prediction.title}</div>
                        <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {Math.round(prediction.confidence * 100)}% confidence
                        </div>
                      </div>
                      <div className="text-lg font-bold text-blue-600 mb-1">
                        {prediction.format === 'currency' ? 
                          `$${prediction.prediction.toLocaleString()}` : 
                          prediction.prediction.toLocaleString()
                        }
                      </div>
                      <p className="text-xs text-gray-500">{prediction.basis}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h5 className="font-semibold text-gray-800 mb-3">Strategic Recommendations</h5>
                <div className="space-y-3">
                  {(businessIntelligence.recommendations || []).map((rec, index) => (
                    <div key={index} className="bg-white/70 p-3 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-gray-900">{rec.title}</div>
                        <div className={`text-xs px-2 py-1 rounded ${
                          rec.priority === 'critical' ? 'bg-red-100 text-red-700' :
                          rec.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {rec.priority}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Effort: {rec.effort}</span>
                        <span>Impact: {rec.impact}</span>
                        <span>Category: {rec.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Metrics */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
            <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-3 text-2xl">⚡</span>
              Real-time System Metrics
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/70 p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg">👥</span>
                  <div className="text-2xl font-bold text-green-600">
                    {dashboardData.realTimeMetrics?.activeUsers || 0}
                  </div>
                </div>
                <h5 className="font-semibold text-gray-900">Active Users</h5>
                <p className="text-xs text-gray-600">Currently online</p>
              </div>
              
              <div className="bg-white/70 p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg">💰</span>
                  <div className="text-2xl font-bold text-green-600">
                    ${(dashboardData.realTimeMetrics?.currentSales || 0).toLocaleString()}
                  </div>
                </div>
                <h5 className="font-semibold text-gray-900">Current Sales</h5>
                <p className="text-xs text-gray-600">Today's revenue</p>
              </div>
              
              <div className="bg-white/70 p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg">🎯</span>
                  <div className="text-2xl font-bold text-green-600">
                    {dashboardData.realTimeMetrics?.conversionRate || 0}%
                  </div>
                </div>
                <h5 className="font-semibold text-gray-900">Conversion Rate</h5>
                <p className="text-xs text-gray-600">Current performance</p>
              </div>
            </div>
          </div>

          {/* Data Export and Management */}
          <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200">
            <button
              onClick={() => {
                if (adminDataService) {
                  const exportData = adminDataService.exportAdminData('json');
                  const blob = new Blob([exportData], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `admin-data-export-${new Date().toISOString().split('T')[0]}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                  showNotification('Admin data exported successfully!', 'success');
                }
              }}
              disabled={dataLoading}
              className="flex-1 py-3 px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>📥</span>
              Export Data
            </button>
            
            <button
              onClick={() => {
                if (adminDataService) {
                  const dashboardUpdate = adminDataService.getAdminDashboardData();
                  setDashboardData(dashboardUpdate);
                  setDataInsights(dashboardUpdate.recentInsights || []);
                  showNotification('Data refreshed successfully!', 'success');
                }
              }}
              disabled={dataLoading}
              className="flex-1 py-3 px-6 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>🔄</span>
              Refresh Data
            </button>
            
            <button
              onClick={() => setShowDataDashboard(false)}
              className="flex-1 py-3 px-6 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all duration-300"
            >
              ✖️ Close Dashboard
            </button>
          </div>
          </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <NotificationCenter />
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
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
          .animate-slideInRight { animation: slideInRight 0.5s ease-out; }
          @keyframes scaleUp {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-scaleUp { animation: scaleUp 0.3s ease-out; }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
            50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.8); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
          }
          @keyframes rotate3d {
            0% { transform: rotate3d(1, 1, 1, 0deg); }
            100% { transform: rotate3d(1, 1, 1, 360deg); }
          }
          @keyframes border-glow {
            0%, 100% { border-color: rgba(59, 130, 246, 0.2); }
            50% { border-color: rgba(59, 130, 246, 0.8); }
          }
          @keyframes widthExpand {
            from { transform: scaleX(0); }
            to { transform: scaleX(1); }
          }
          .animate-widthExpand {
            animation: widthExpand 1.5s ease-out forwards;
          }
          .delay-100 { animation-delay: 0.1s; }
          .delay-200 { animation-delay: 0.2s; }
          .delay-300 { animation-delay: 0.3s; }
          .delay-400 { animation-delay: 0.4s; }
          .animate-fadeInUp { animation: fadeInUp 0.8s ease-out; }
          .animate-slideInLeft { animation: slideInLeft 0.8s ease-out; }
          .animate-slideInRight { animation: slideInRight 0.8s ease-out; }
          .animate-pulse { animation: pulse 2s infinite; }
          .animate-glow { animation: glow 2s infinite; }
          .animate-float { animation: float 3s ease-in-out infinite; }
          .animate-shimmer {
            background: linear-gradient(to right, transparent 0%, rgba(59, 130, 246, 0.1) 50%, transparent 100%);
            background-size: 1000px 100%;
            animation: shimmer 2s infinite;
          }
          .animate-rotate3d {
            animation: rotate3d 10s linear infinite;
            transform-style: preserve-3d;
          }
          .animate-border-glow {
            animation: border-glow 2s infinite;
          }
          .container-glass {
            backdrop-filter: blur(10px);
            background: rgba(255, 255, 255, 0.9);
            border: 1px solid rgba(59, 130, 246, 0.2);
            transition: all 0.3s ease;
          }
          .container-glass:hover {
            backdrop-filter: blur(15px);
            background: rgba(255, 255, 255, 0.95);
            transform: translateY(-2px);
          }
          .container-neon {
            box-shadow: 0 0 15px rgba(59, 130, 246, 0.3);
            border: 2px solid rgba(59, 130, 246, 0.2);
            transition: all 0.3s ease;
          }
          .container-neon:hover {
            box-shadow: 0 0 30px rgba(59, 130, 246, 0.5);
          }
        `
      }} />

      {/* Admin Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-50 container-glass animate-slideInLeft">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <FiShield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{portalConfig.systemName}</h2>
              <p className="text-sm text-gray-500">System Admin</p>
            </div>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: FiBarChart },
              { id: 'inventory', label: 'Inventory Control', icon: FiShoppingBag },
              { id: 'orders', label: 'Order Management', icon: FiCalendar },
              { id: 'payments', label: 'Payment Control', icon: FiDollarSign },
              { id: 'suppliers', label: 'Supplier Network', icon: FiTrendingUp },
              { id: 'users', label: 'User Management', icon: FiUsers },
              { id: 'analytics', label: 'Business Analytics', icon: FiPieChart },
              { id: 'operations', label: 'System Operations', icon: FiCpu },
              { id: 'settings', label: 'Configuration', icon: FiSettings },
              { id: 'security', label: 'Security Center', icon: FiLock },
              { id: 'monitoring', label: 'Live Monitoring', icon: FiActivity }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  activeSection === item.id 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="container-glass rounded-2xl shadow-lg p-6 mb-8 animate-fadeInUp">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{portalConfig.adminPortal} - System Administration</h1>
              <p className="text-gray-600">Welcome back to {portalConfig.companyName}, {user?.email}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Notifications"
              >
                <FiBell className="h-6 w-6" />
              </button>
              <button 
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Settings"
              >
                <FiSettings className="h-6 w-6" />
              </button>
              
              {/* Admin Profile Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-3 bg-gray-50 rounded-lg px-4 py-2 hover:bg-gray-100 transition-colors cursor-pointer"
                  title="Admin Profile"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                    <FiShield className="h-5 w-5" />
                  </div>
                  <div className="text-sm text-left">
                    <div className="font-medium text-gray-900">admin</div>
                    <div className="text-gray-500 text-xs">Administrator</div>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {showProfileMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowProfileMenu(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 z-20 overflow-hidden">
                      {/* Profile Header */}
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                            <FiShield className="h-6 w-6" />
                          </div>
                          <div>
                            <div className="font-bold">Administrator</div>
                            <div className="text-xs text-white/80">heradmin@faredeal.ug</div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            window.location.href = '/admin-profile';
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 transition-colors"
                        >
                          <FiUser className="h-5 w-5 text-blue-600" />
                          <div className="text-left">
                            <div className="font-medium text-sm">My Profile</div>
                            <div className="text-xs text-gray-500">View and edit profile</div>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            setActiveSection('settings');
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-purple-50 transition-colors"
                        >
                          <FiSettings className="h-5 w-5 text-purple-600" />
                          <div className="text-left">
                            <div className="font-medium text-sm">Settings</div>
                            <div className="text-xs text-gray-500">System configuration</div>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            setActiveSection('security');
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-green-50 transition-colors"
                        >
                          <FiLock className="h-5 w-5 text-green-600" />
                          <div className="text-left">
                            <div className="font-medium text-sm">Security</div>
                            <div className="text-xs text-gray-500">Password & 2FA</div>
                          </div>
                        </button>

                        <div className="border-t border-gray-200 my-2"></div>

                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            if (window.confirm('Are you sure you want to logout?')) {
                              localStorage.clear();
                              window.location.href = '/';
                            }
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <FiPower className="h-5 w-5" />
                          <div className="text-left">
                            <div className="font-medium text-sm">Logout</div>
                            <div className="text-xs text-red-400">Sign out of account</div>
                          </div>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {loading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-8 shadow-2xl animate-pulse">
                <div className="flex items-center space-x-4">
                  <FiRefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Loading...</h3>
                    <p className="text-gray-600">Please wait while we fetch the data</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="animate-fadeInUp">
            {activeSection === 'dashboard' && renderDashboard()}
            {activeSection === 'inventory' && renderInventoryControl()}
            {activeSection === 'orders' && renderOrderManagement()}
            {activeSection === 'payments' && renderPaymentControl()}
            {activeSection === 'suppliers' && renderSupplierNetwork()}
            {activeSection === 'users' && renderUserManagement()}
            {activeSection === 'analytics' && renderBusinessAnalytics()}
            {activeSection === 'operations' && renderSystemOperations()}
            {activeSection === 'settings' && renderSystemSettings()}
            {activeSection === 'security' && (
              <div className="container-glass rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="mr-3 text-3xl">🛡️</span>
                  Security Center
                </h2>
                <p className="text-gray-600">Advanced security monitoring and threat detection coming soon...</p>
              </div>
            )}
            {activeSection === 'monitoring' && (
              <div className="container-glass rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="mr-3 text-3xl">📡</span>
                  Live System Monitoring
                </h2>
                <p className="text-gray-600">Real-time system monitoring dashboard coming soon...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Portal Configuration Modal */}
      {showPortalConfig && <PortalConfigurationModal />}
      
      {/* Employee Access Control Modal */}
      {showEmployeeControlModal && <EmployeeAccessControlModal />}
      
      {/* Admin Data Intelligence Dashboard Modal */}
      {showDataDashboard && <AdminDataDashboardModal />}
      
      {/* CSS Animations for Data Dashboard */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleUp {
          from { 
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to { 
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% { 
            transform: scale(1);
            opacity: 1;
          }
          50% { 
            transform: scale(1.05);
            opacity: 0.8;
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-scaleUp {
          animation: scaleUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
};

export default AdminPortal;