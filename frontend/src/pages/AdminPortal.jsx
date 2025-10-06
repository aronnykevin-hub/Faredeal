import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { adminService } from '../services/adminService';
import { notificationService } from '../services/notificationService';
import { 
  FiUsers, FiShield, FiSettings, FiBarChart, FiActivity,
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
  const [adminForm, setAdminForm] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: ''
  });
  // Mock admin user for development
  const user = {
    id: 1,
    name: "System Admin",
    role: "admin",
    email: "admin"
  };

  useEffect(() => {
    loadSystemData();
  }, []);

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
      {/* Quick Stats with Enhanced Animations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            title: 'Total Users', 
            value: systemData.analytics?.totalUsers || 0, 
            icon: FiUsers, 
            color: 'from-blue-500 to-blue-600',
            animation: 'animate-fadeInUp delay-100'
          },
          { 
            title: 'Active Sessions', 
            value: systemData.analytics?.activeSessions || 0, 
            icon: FiActivity, 
            color: 'from-green-500 to-green-600',
            animation: 'animate-fadeInUp delay-200'
          },
          { 
            title: 'System Load', 
            value: `${systemData.analytics?.systemLoad || 0}%`, 
            icon: FiCpu, 
            color: 'from-purple-500 to-purple-600',
            animation: 'animate-fadeInUp delay-300'
          },
          { 
            title: 'Security Score', 
            value: `${systemData.analytics?.securityScore || 0}/100`, 
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

      {/* Enhanced Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            title: 'Total Users',
            value: systemData.analytics?.totalUsers || 0,
            icon: '👥',
            color: 'blue',
            trend: '+12%',
            trendUp: true
          },
          {
            title: 'Active Sessions',
            value: systemData.analytics?.activeSessions || 0,
            icon: '📊',
            color: 'green',
            trend: '+5%',
            trendUp: true
          },
          {
            title: 'Revenue',
            value: `$${systemData.analytics?.totalRevenue || 0}`,
            icon: '💰',
            color: 'yellow',
            trend: '+8%',
            trendUp: true
          },
          {
            title: 'Growth Rate',
            value: `${systemData.analytics?.growthRate || 0}%`,
            icon: '📈',
            color: 'purple',
            trend: '+15%',
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
            <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
            <p className="text-gray-600">Configure system-wide settings and preferences</p>
          </div>
          <button
            onClick={loadSystemData}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center space-x-2"
          >
            <FiRefreshCw className="h-5 w-5" />
            <span>Refresh Settings</span>
          </button>
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

  // No auth checks for development mode

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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
              <h2 className="text-xl font-bold text-gray-900">FAREDEAL</h2>
              <p className="text-sm text-gray-500">System Admin</p>
            </div>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: FiBarChart },
              { id: 'users', label: 'User Management', icon: FiUsers },
              { id: 'settings', label: 'System Settings', icon: FiSettings },
              { id: 'security', label: 'Security', icon: FiLock },
              { id: 'monitoring', label: 'Monitoring', icon: FiActivity },
              { id: 'reports', label: 'Reports', icon: FiPieChart }
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
              <h1 className="text-3xl font-bold text-gray-900">System Administration</h1>
              <p className="text-gray-600">Welcome back, {user?.email}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <FiBell className="h-6 w-6" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <FiSettings className="h-6 w-6" />
              </button>
              <div className="flex items-center space-x-3 bg-gray-50 rounded-lg px-4 py-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                  <FiShield className="h-5 w-5" />
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-900">{user?.email}</div>
                  <div className="text-gray-500">Administrator</div>
                </div>
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
            {activeSection === 'users' && renderUserManagement()}
            {activeSection === 'settings' && renderSystemSettings()}
            {activeSection === 'reports' && (
              <div className="container-glass rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">System Reports</h2>
                <p className="text-gray-600">Advanced reporting features coming soon...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;