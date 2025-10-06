-- Create database schema for FareDeal POS System
-- This file creates all necessary tables, functions, and policies

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types/enums
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'employee', 'customer');
CREATE TYPE order_status AS ENUM ('pending', 'processing', 'completed', 'cancelled', 'refunded');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded', 'partial');
CREATE TYPE payment_method AS ENUM ('cash', 'card', 'mobile', 'bank_transfer', 'credit');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create exec_sql function for database initialization
CREATE OR REPLACE FUNCTION exec_sql(sql_query text)
RETURNS void AS $$
BEGIN
    EXECUTE sql_query;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Users table (extends auth.users)
CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    email varchar(255) UNIQUE NOT NULL,
    full_name varchar(255),
    phone varchar(20),
    role user_role DEFAULT 'customer',
    avatar_url text,
    is_active boolean DEFAULT true,
    employee_id varchar(20) UNIQUE,
    department varchar(100),
    hire_date date,
    salary decimal(10,2),
    commission_rate decimal(5,2) DEFAULT 0,
    last_login_at timestamptz,
    metadata jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku varchar(100) UNIQUE NOT NULL,
    name varchar(255) NOT NULL,
    description text,
    category varchar(100),
    brand varchar(100),
    unit_price decimal(10,2) NOT NULL CHECK (unit_price >= 0),
    cost_price decimal(10,2) CHECK (cost_price >= 0),
    weight decimal(8,2),
    dimensions jsonb, -- {length, width, height, unit}
    barcode varchar(50) UNIQUE,
    qr_code varchar(255),
    tax_rate decimal(5,2) DEFAULT 0,
    is_active boolean DEFAULT true,
    is_featured boolean DEFAULT false,
    tags text[],
    images text[],
    metadata jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    created_by uuid REFERENCES users(id)
);

-- Inventory table
CREATE TABLE IF NOT EXISTS inventory (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    location varchar(100) DEFAULT 'main_store',
    quantity_on_hand integer NOT NULL DEFAULT 0 CHECK (quantity_on_hand >= 0),
    quantity_reserved integer DEFAULT 0 CHECK (quantity_reserved >= 0),
    reorder_point integer DEFAULT 10,
    max_stock_level integer DEFAULT 1000,
    last_restock_date date,
    last_count_date date,
    supplier_info jsonb,
    notes text,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, location)
);

-- Customers table (separate from users for non-auth customers)
CREATE TABLE IF NOT EXISTS customers (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES users(id) ON DELETE SET NULL,
    customer_number varchar(50) UNIQUE,
    full_name varchar(255) NOT NULL,
    email varchar(255),
    phone varchar(20),
    address jsonb,
    date_of_birth date,
    gender varchar(20),
    loyalty_points integer DEFAULT 0,
    total_spent decimal(12,2) DEFAULT 0,
    visit_count integer DEFAULT 0,
    last_visit_date date,
    preferred_contact varchar(20) DEFAULT 'email',
    tags text[],
    notes text,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number varchar(50) UNIQUE NOT NULL,
    customer_id uuid REFERENCES customers(id),
    employee_id uuid REFERENCES users(id),
    order_type varchar(50) DEFAULT 'in_store', -- in_store, takeaway, delivery, online
    status order_status DEFAULT 'pending',
    payment_status payment_status DEFAULT 'pending',
    
    -- Totals
    subtotal decimal(12,2) NOT NULL CHECK (subtotal >= 0),
    tax_amount decimal(12,2) DEFAULT 0 CHECK (tax_amount >= 0),
    discount_amount decimal(12,2) DEFAULT 0 CHECK (discount_amount >= 0),
    total_amount decimal(12,2) NOT NULL CHECK (total_amount >= 0),
    
    -- Payment info
    payment_method payment_method,
    payment_reference varchar(255),
    change_given decimal(10,2) DEFAULT 0,
    
    -- Order details
    order_date timestamptz DEFAULT CURRENT_TIMESTAMP,
    delivery_date timestamptz,
    delivery_address jsonb,
    notes text,
    metadata jsonb DEFAULT '{}',
    
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id uuid NOT NULL REFERENCES products(id),
    quantity integer NOT NULL CHECK (quantity > 0),
    unit_price decimal(10,2) NOT NULL CHECK (unit_price >= 0),
    total_price decimal(12,2) NOT NULL CHECK (total_price >= 0),
    discount_amount decimal(10,2) DEFAULT 0 CHECK (discount_amount >= 0),
    tax_amount decimal(10,2) DEFAULT 0 CHECK (tax_amount >= 0),
    notes text,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_code varchar(50) UNIQUE NOT NULL,
    company_name varchar(255) NOT NULL,
    contact_person varchar(255),
    email varchar(255),
    phone varchar(20),
    address jsonb,
    payment_terms varchar(100),
    credit_limit decimal(12,2),
    tax_id varchar(50),
    bank_details jsonb,
    is_active boolean DEFAULT true,
    rating decimal(3,2) CHECK (rating >= 0 AND rating <= 5),
    notes text,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Product suppliers junction table
CREATE TABLE IF NOT EXISTS product_suppliers (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    supplier_id uuid NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
    supplier_sku varchar(100),
    cost_price decimal(10,2),
    lead_time_days integer,
    minimum_order_quantity integer DEFAULT 1,
    is_preferred boolean DEFAULT false,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, supplier_id)
);

-- Sales analytics view
CREATE OR REPLACE VIEW sales_analytics AS
SELECT 
    DATE(o.order_date) as sale_date,
    COUNT(o.id) as orders_count,
    SUM(o.total_amount) as total_revenue,
    AVG(o.total_amount) as avg_order_value,
    SUM(oi.quantity) as items_sold,
    COUNT(DISTINCT o.customer_id) as unique_customers
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
WHERE o.status = 'completed'
GROUP BY DATE(o.order_date);

-- Product performance view
CREATE OR REPLACE VIEW product_performance AS
SELECT 
    p.id,
    p.name,
    p.sku,
    p.category,
    COALESCE(SUM(oi.quantity), 0) as total_sold,
    COALESCE(SUM(oi.total_price), 0) as total_revenue,
    COALESCE(AVG(oi.unit_price), 0) as avg_price,
    i.quantity_on_hand,
    i.reorder_point
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN orders o ON oi.order_id = o.id AND o.status = 'completed'
LEFT JOIN inventory i ON p.id = i.product_id
GROUP BY p.id, p.name, p.sku, p.category, i.quantity_on_hand, i.reorder_point;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_auth_id ON users(auth_id);

CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);

CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_employee ON orders(employee_id);
CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(order_date);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);

CREATE INDEX IF NOT EXISTS idx_inventory_product ON inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_customers_number ON customers(customer_number);
CREATE INDEX IF NOT EXISTS idx_customers_user ON customers(user_id);

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_order_items_updated_at BEFORE UPDATE ON order_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON inventory
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Users policies
CREATE POLICY users_select_policy ON users
    FOR SELECT USING (
        auth.uid() = auth_id OR 
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.auth_id = auth.uid() 
            AND u.role IN ('admin', 'manager')
        )
    );

CREATE POLICY users_insert_policy ON users
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.auth_id = auth.uid() 
            AND u.role IN ('admin', 'manager')
        )
    );

CREATE POLICY users_update_policy ON users
    FOR UPDATE USING (
        auth.uid() = auth_id OR 
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.auth_id = auth.uid() 
            AND u.role IN ('admin', 'manager')
        )
    );

-- Products policies (public read, admin/manager write)
CREATE POLICY products_select_policy ON products
    FOR SELECT USING (is_active = true OR EXISTS (
        SELECT 1 FROM users u 
        WHERE u.auth_id = auth.uid() 
        AND u.role IN ('admin', 'manager', 'employee')
    ));

CREATE POLICY products_insert_policy ON products
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.auth_id = auth.uid() 
            AND u.role IN ('admin', 'manager')
        )
    );

CREATE POLICY products_update_policy ON products
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.auth_id = auth.uid() 
            AND u.role IN ('admin', 'manager')
        )
    );

-- Orders policies
CREATE POLICY orders_select_policy ON orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.auth_id = auth.uid() 
            AND u.role IN ('admin', 'manager', 'employee')
        ) OR
        EXISTS (
            SELECT 1 FROM customers c 
            WHERE c.id = customer_id 
            AND c.user_id IN (
                SELECT id FROM users WHERE auth_id = auth.uid()
            )
        )
    );

CREATE POLICY orders_insert_policy ON orders
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.auth_id = auth.uid() 
            AND u.role IN ('admin', 'manager', 'employee')
        )
    );

CREATE POLICY orders_update_policy ON orders
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.auth_id = auth.uid() 
            AND u.role IN ('admin', 'manager', 'employee')
        )
    );

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- Notify PostgREST to reload schema
NOTIFY pgrst, 'reload schema';

-- Success message
SELECT 'Database schema created successfully' as message;