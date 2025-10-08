# FAREDEAL DATABASE DEPLOYMENT GUIDE
**Complete Multi-Portal System**  
**Created: October 8, 2025**

---

## 📋 OVERVIEW

This deployment creates a comprehensive database structure for FAREDEAL POS System with **4 complete portals**:

1. **Admin Portal** - System administration and oversight
2. **Manager Portal** - Team management and operations
3. **Cashier Portal** - POS transactions and sales
4. **Supplier Portal** - Procurement and supplier management

---

## 🗄️ DATABASE STATISTICS

- **Total Tables**: 43
- **Total Indexes**: 50+
- **Dashboard Views**: 3
- **RLS Policies**: 6+
- **Sample Data**: 5 Ugandan suppliers

---

## 🚀 DEPLOYMENT INSTRUCTIONS

### Step 1: Access Supabase
1. Go to [https://supabase.com](https://supabase.com)
2. Log in to your account
3. Select your **FAREDEAL** project
4. Click on **SQL Editor** in the left sidebar

### Step 2: Deploy Database
1. Open the file: `backend/database/COMPLETE_DEPLOYMENT.sql`
2. **Copy the ENTIRE file contents** (Ctrl+A, Ctrl+C)
3. **Paste** into Supabase SQL Editor
4. Click **"Run"** button (or press Ctrl+Enter)
5. **Wait for completion** (approximately 1-2 minutes)

### Step 3: Verify Deployment
1. Go to **"Table Editor"** in Supabase
2. You should see all 43 tables listed
3. Check for these key tables:
   - `admin_activity_log`
   - `manager_teams`
   - `cashier_profiles`
   - `supplier_profiles`

### Step 4: Test Dashboard Views
Run these queries to verify views:

```sql
-- Test Manager Dashboard
SELECT * FROM manager_dashboard_overview;

-- Test Cashier Dashboard
SELECT * FROM cashier_dashboard_overview;

-- Test Supplier Dashboard
SELECT * FROM supplier_dashboard_overview;
```

---

## 📊 PORTAL BREAKDOWN

### 1️⃣ ADMIN PORTAL (8 tables)
**Purpose**: System-wide administration and monitoring

**Tables**:
- `admin_activity_log` - Admin actions tracking
- `admin_dashboard_metrics` - Daily system metrics
- `admin_notifications` - System notifications
- `admin_system_config` - Configuration management
- `admin_employee_access` - Access control
- `admin_payment_audit` - Payment auditing
- `admin_system_health` - System health monitoring
- `admin_error_logs` - Error tracking

**Key Features**:
- Complete system oversight
- Real-time health monitoring
- Comprehensive audit trails
- Configuration management
- Error tracking and logging

---

### 2️⃣ MANAGER PORTAL (11 tables)
**Purpose**: Team management and operational oversight

**Tables**:
- `manager_activity_log` - Manager actions
- `manager_daily_reports` - Daily operational reports
- `manager_teams` - Team structure
- `manager_team_members` - Team member assignments
- `manager_employee_schedules` - Staff scheduling
- `manager_employee_attendance` - Attendance tracking
- `manager_stock_requests` - Inventory requests
- `manager_sales_analysis` - Sales analytics
- `manager_customer_complaints` - Complaint management
- `manager_alerts` - Manager notifications
- `manager_performance_metrics` - Performance tracking

**Key Features**:
- Team management and scheduling
- Attendance tracking
- Stock request management
- Sales analysis and reporting
- Customer complaint handling
- Performance metrics

---

### 3️⃣ CASHIER PORTAL (7 tables)
**Purpose**: Point-of-Sale operations and transactions

**Tables**:
- `cashier_profiles` - Cashier information and authorization
- `cashier_shifts` - Shift management with cash reconciliation
- `cashier_transactions` - All POS transactions
- `cashier_drawer_operations` - Cash drawer management
- `cashier_returns` - Returns and refunds
- `cashier_alerts` - Cashier notifications
- `cashier_activity_log` - Activity tracking

**Key Features**:
- Complete POS transaction processing
- Shift management with opening/closing cash
- Cash drawer operations (drop, cash-in, cash-out)
- Return and refund processing
- Multiple payment methods (Cash, Mobile Money, Card)
- Transaction voiding and corrections
- Performance tracking

**Payment Methods Supported**:
- Cash (UGX)
- Mobile Money (MTN, Airtel)
- Credit/Debit Cards (Visa, Mastercard)
- Credit accounts
- Mixed payments

---

### 4️⃣ SUPPLIER PORTAL (10 tables)
**Purpose**: Procurement and supplier relationship management

**Tables**:
- `supplier_profiles` - Supplier information
- `supplier_products` - Supplier product catalog
- `purchase_orders` - Purchase order management
- `supplier_deliveries` - Delivery tracking and quality checks
- `supplier_invoices` - Invoice management
- `supplier_payments` - Payment tracking
- `supplier_performance` - Performance evaluations
- `supplier_communications` - Communication logs
- `supplier_alerts` - Supplier notifications
- `supplier_activity_log` - Activity tracking

**Key Features**:
- Comprehensive supplier management
- Product catalog management
- Purchase order workflow
- Delivery tracking and quality control
- Invoice and payment management
- Supplier performance evaluation
- Communication tracking

**Sample Suppliers Included** (Uganda):
1. Coca-Cola Uganda Limited
2. Century Bottling Company (Pepsi)
3. Nile Breweries Limited
4. Mukwano Industries Ltd
5. Pearl Dairy Farms

---

## 🔐 SECURITY FEATURES

### Row Level Security (RLS)
All tables have RLS enabled with policies:

1. **Admin Access**: Admins can view all data
2. **Manager Access**: Managers can view their own teams and data
3. **Cashier Access**: Cashiers can view their own transactions
4. **Procurement Access**: Procurement staff can view supplier data

### Activity Logging
Every portal has comprehensive activity logging for:
- Audit trails
- Compliance
- Security monitoring
- Performance analysis

---

## 📈 DASHBOARD VIEWS

### 1. Manager Dashboard Overview
```sql
SELECT * FROM manager_dashboard_overview;
```
Shows:
- Total teams and members
- Daily reports status
- Pending stock requests
- Open complaints
- Unread alerts

### 2. Cashier Dashboard Overview
```sql
SELECT * FROM cashier_dashboard_overview;
```
Shows:
- Current shift information
- Today's transactions and sales
- Performance ratings
- Unread alerts

### 3. Supplier Dashboard Overview
```sql
SELECT * FROM supplier_dashboard_overview;
```
Shows:
- Supplier ratings and status
- Pending orders
- Unpaid invoices
- Outstanding balances
- Unread alerts

---

## 🔧 BACKEND API ENDPOINTS

### Manager Portal
- `GET /api/manager/dashboard` - Dashboard overview
- `GET /api/manager/team` - Team management
- `GET /api/manager/schedules` - Employee schedules
- `POST /api/manager/daily-report` - Submit daily report
- `GET /api/manager/sales/analysis` - Sales analysis

### Cashier Portal
- `GET /api/cashier/:id/dashboard` - Cashier dashboard
- `POST /api/cashier/:id/shift/open` - Open shift
- `PUT /api/cashier/:id/shift/:shiftId/close` - Close shift
- `POST /api/cashier/:id/transaction` - Process transaction
- `POST /api/cashier/:id/return` - Process return
- `POST /api/cashier/:id/drawer/:operation` - Drawer operations

### Supplier Portal
- `GET /api/suppliers` - List all suppliers
- `POST /api/suppliers` - Create supplier
- `GET /api/purchase-orders` - List purchase orders
- `POST /api/purchase-orders` - Create PO
- `GET /api/supplier-invoices` - List invoices
- `POST /api/supplier-payments` - Record payment

---

## 📦 FRONTEND SERVICES

### Service Files Created:
1. **`frontend/src/services/managerService.js`** - Manager portal operations
2. **`frontend/src/services/cashierService.js`** - Cashier POS operations
3. **`frontend/src/services/supplierService.js`** - Supplier management

All services include:
- API request handling
- Caching mechanisms
- Error handling
- Activity logging
- Utility methods

---

## 🧪 TESTING CHECKLIST

### After Deployment:

- [ ] Verify all 43 tables created
- [ ] Test 3 dashboard views
- [ ] Check sample supplier data (5 records)
- [ ] Verify RLS policies active
- [ ] Test backend API endpoints
- [ ] Verify frontend services connect
- [ ] Test manager portal functionality
- [ ] Test cashier POS operations
- [ ] Test supplier management
- [ ] Check activity logging

---

## 📁 FILE LOCATIONS

### Database Schemas:
- `backend/database/admin-schema.sql`
- `backend/database/manager-schema.sql`
- `backend/database/cashier-schema.sql`
- `backend/database/supplier-schema.sql`
- **`backend/database/COMPLETE_DEPLOYMENT.sql`** ⭐ (Use this!)

### Backend:
- `backend/src/index.js` - All API endpoints (3,127 lines)

### Frontend Services:
- `frontend/src/services/managerService.js`
- `frontend/src/services/cashierService.js`
- `frontend/src/services/supplierService.js`

---

## 🌍 UGANDA-SPECIFIC FEATURES

### Currency:
- All amounts in **UGX** (Ugandan Shillings)
- No decimal places for currency

### Mobile Money Integration:
- **MTN Mobile Money**
- **Airtel Money**
- Phone number format: +256-XXX-XXXXXX

### Sample Suppliers:
All major Ugandan suppliers included:
- Beverages (Coca-Cola, Pepsi, Nile Breweries)
- FMCG (Mukwano Industries)
- Dairy (Pearl Dairy Farms)

### Tax Rate:
- Standard VAT: **18%**

---

## ⚡ PERFORMANCE OPTIMIZATIONS

### Indexes Created (50+):
- All foreign keys indexed
- Date columns indexed for reporting
- Status columns indexed for filtering
- Search columns (names, codes, numbers) indexed

### Views for Fast Access:
- Pre-calculated dashboard metrics
- Optimized JOIN queries
- Cached aggregations

---

## 🆘 TROUBLESHOOTING

### Issue: Tables not created
**Solution**: Check for errors in SQL Editor output. Run each section separately if needed.

### Issue: RLS blocking access
**Solution**: Temporarily disable RLS during testing:
```sql
ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;
```

### Issue: Foreign key errors
**Solution**: Ensure `users` table exists before running deployment.

### Issue: Duplicate key errors on re-run
**Solution**: Tables use `IF NOT EXISTS`, sample data uses `ON CONFLICT DO NOTHING`. Safe to re-run.

---

## 📞 SUPPORT

For issues or questions:
1. Check Supabase dashboard logs
2. Review backend server console output
3. Test API endpoints with Postman/Thunder Client
4. Check browser console for frontend errors

---

## ✅ SUCCESS CRITERIA

Deployment is successful when:
1. ✅ All 43 tables visible in Table Editor
2. ✅ 3 dashboard views return data
3. ✅ 5 sample suppliers exist
4. ✅ Backend server starts without errors
5. ✅ API endpoints respond correctly
6. ✅ Frontend services can fetch data

---

## 🎉 NEXT STEPS

After successful deployment:

1. **Start Backend Server**:
   ```bash
   cd backend
   node src/index.js
   ```

2. **Start Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Create Test Users** (if needed):
   - Admin user
   - Manager user
   - Cashier users
   - Procurement user

4. **Test Each Portal**:
   - Login as different user types
   - Test core functionality
   - Verify data flow

5. **Customize**:
   - Adjust business rules
   - Modify tax rates
   - Add more suppliers
   - Configure system settings

---

## 📊 SYSTEM ARCHITECTURE

```
┌─────────────────────────────────────────────┐
│           FAREDEAL POS SYSTEM               │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │  Admin   │  │ Manager  │  │ Cashier  │ │
│  │  Portal  │  │  Portal  │  │  Portal  │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘ │
│       │             │              │        │
│  ┌────┴─────────────┴──────────────┴─────┐ │
│  │                                        │ │
│  │        Backend API (Express.js)       │ │
│  │         Port 3001 - v2.0.0            │ │
│  │                                        │ │
│  └────────────────┬───────────────────────┘ │
│                   │                          │
│  ┌────────────────┴───────────────────────┐ │
│  │                                        │ │
│  │    Supabase PostgreSQL Database       │ │
│  │         43 Tables + Views             │ │
│  │                                        │ │
│  └────────────────────────────────────────┘ │
│                                             │
│  ┌──────────┐                               │
│  │ Supplier │  External Portal              │
│  │  Portal  │  (Procurement)                │
│  └──────────┘                               │
│                                             │
└─────────────────────────────────────────────┘
```

---

**🎯 DEPLOYMENT FILE**: `backend/database/COMPLETE_DEPLOYMENT.sql`

**📝 Total Lines**: 1,000+ lines of SQL

**⏱️ Estimated Time**: 1-2 minutes to execute

**✨ Ready to Deploy!**

---

*Document Version: 1.0*  
*Last Updated: October 8, 2025*  
*Business: FAREDEAL - Uganda*
