-- Seed data for FareDeal POS System
-- This file populates the database with initial test data

-- Insert sample categories and products
INSERT INTO products (sku, name, description, category, brand, unit_price, cost_price, barcode, is_active, is_featured) VALUES
('FOOD001', 'White Bread Loaf', 'Fresh white bread, 800g', 'Bakery', 'Fresh Bakery', 2500, 1500, '1234567890001', true, true),
('FOOD002', 'Whole Wheat Bread', 'Nutritious whole wheat bread, 800g', 'Bakery', 'Fresh Bakery', 3000, 2000, '1234567890002', true, false),
('BEVG001', 'Coca Cola 500ml', 'Refreshing cola drink', 'Beverages', 'Coca Cola', 1500, 1000, '1234567890003', true, true),
('BEVG002', 'Pepsi 500ml', 'Cola soft drink', 'Beverages', 'Pepsi', 1500, 1000, '1234567890004', true, false),
('BEVG003', 'Water Bottle 1L', 'Pure drinking water', 'Beverages', 'Pure Water Co', 800, 500, '1234567890005', true, false),
('DAIRY001', 'Fresh Milk 1L', 'Fresh cow milk', 'Dairy', 'Farm Fresh', 2200, 1700, '1234567890006', true, true),
('DAIRY002', 'Cheese Block 200g', 'Cheddar cheese', 'Dairy', 'Dairy Best', 4500, 3200, '1234567890007', true, false),
('SNACK001', 'Potato Chips', 'Crispy potato chips, 150g', 'Snacks', 'Crispy Co', 1200, 800, '1234567890008', true, true),
('SNACK002', 'Chocolate Bar', 'Milk chocolate bar, 100g', 'Snacks', 'Sweet Treats', 2000, 1300, '1234567890009', true, true),
('FRUIT001', 'Bananas per kg', 'Fresh ripe bananas', 'Fruits', 'Local Farm', 3000, 2000, '1234567890010', true, false),
('FRUIT002', 'Apples per kg', 'Red apples', 'Fruits', 'Local Farm', 4000, 2800, '1234567890011', true, false),
('MEAT001', 'Chicken Breast 1kg', 'Fresh chicken breast', 'Meat', 'Fresh Meat Co', 8000, 6000, '1234567890012', true, true),
('MEAT002', 'Ground Beef 1kg', 'Fresh ground beef', 'Meat', 'Fresh Meat Co', 12000, 9000, '1234567890013', true, false),
('CLEAN001', 'Dish Soap 500ml', 'Liquid dish soap', 'Cleaning', 'Clean Pro', 1800, 1200, '1234567890014', true, false),
('CLEAN002', 'Laundry Detergent 1kg', 'Powder laundry detergent', 'Cleaning', 'Clean Pro', 3500, 2500, '1234567890015', true, false);

-- Insert inventory for products
INSERT INTO inventory (product_id, quantity_on_hand, reorder_point, max_stock_level) 
SELECT 
    id, 
    FLOOR(RANDOM() * 100) + 20 as quantity_on_hand,
    10 as reorder_point,
    200 as max_stock_level
FROM products;

-- Insert sample users (these will need to be created via Supabase Auth first)
-- This is just sample data structure
INSERT INTO users (id, email, full_name, role, employee_id, department, is_active) VALUES
(uuid_generate_v4(), 'admin@faredeal.com', 'System Administrator', 'admin', 'EMP001', 'Management', true),
(uuid_generate_v4(), 'manager@faredeal.com', 'Store Manager', 'manager', 'EMP002', 'Operations', true),
(uuid_generate_v4(), 'cashier1@faredeal.com', 'John Cashier', 'employee', 'EMP003', 'Sales', true),
(uuid_generate_v4(), 'cashier2@faredeal.com', 'Jane Cashier', 'employee', 'EMP004', 'Sales', true);

-- Insert sample customers
INSERT INTO customers (customer_number, full_name, email, phone, loyalty_points, total_spent, visit_count) VALUES
('CUST001', 'John Doe', 'john.doe@email.com', '+256700123456', 150, 45000, 12),
('CUST002', 'Mary Smith', 'mary.smith@email.com', '+256700234567', 300, 89000, 25),
('CUST003', 'Peter Johnson', 'peter.j@email.com', '+256700345678', 75, 23000, 8),
('CUST004', 'Sarah Wilson', 'sarah.w@email.com', '+256700456789', 220, 67000, 18),
('CUST005', 'Michael Brown', 'michael.b@email.com', '+256700567890', 180, 54000, 15);

-- Insert sample suppliers
INSERT INTO suppliers (supplier_code, company_name, contact_person, email, phone, payment_terms, is_active) VALUES
('SUP001', 'Fresh Foods Wholesale Ltd', 'James Mugisha', 'james@freshfoods.co.ug', '+256701123456', 'Net 30', true),
('SUP002', 'Beverage Distributors Uganda', 'Grace Namukasa', 'grace@bevdist.co.ug', '+256702234567', 'Net 15', true),
('SUP003', 'Dairy Products Co-op', 'Robert Kizza', 'robert@dairyco-op.ug', '+256703345678', 'Net 30', true),
('SUP004', 'Cleaning Supplies Ltd', 'Alice Nakato', 'alice@cleaningsupplies.ug', '+256704456789', 'Net 45', true),
('SUP005', 'Local Farmers Association', 'David Ssali', 'david@localfarmers.ug', '+256705567890', 'Cash on Delivery', true);

-- Link products to suppliers
INSERT INTO product_suppliers (product_id, supplier_id, supplier_sku, cost_price, lead_time_days, minimum_order_quantity, is_preferred)
SELECT 
    p.id,
    s.id,
    'SUP-' || p.sku,
    p.cost_price,
    CASE 
        WHEN p.category IN ('Fruits', 'Dairy', 'Meat') THEN 1
        WHEN p.category IN ('Bakery', 'Beverages') THEN 2
        ELSE 7
    END as lead_time_days,
    CASE 
        WHEN p.category IN ('Meat', 'Dairy') THEN 5
        WHEN p.category = 'Beverages' THEN 24
        ELSE 10
    END as minimum_order_quantity,
    true as is_preferred
FROM products p
CROSS JOIN suppliers s
WHERE 
    (p.category = 'Bakery' AND s.supplier_code = 'SUP001') OR
    (p.category = 'Beverages' AND s.supplier_code = 'SUP002') OR
    (p.category = 'Dairy' AND s.supplier_code = 'SUP003') OR
    (p.category = 'Cleaning' AND s.supplier_code = 'SUP004') OR
    (p.category IN ('Fruits', 'Meat', 'Snacks') AND s.supplier_code = 'SUP005');

-- Insert sample orders with realistic order numbers
DO $$ 
DECLARE
    sample_customer_id uuid;
    sample_employee_id uuid;
    order_record record;
    product_record record;
    order_counter integer := 1;
BEGIN
    -- Get sample customer and employee IDs
    SELECT id INTO sample_customer_id FROM customers LIMIT 1;
    SELECT id INTO sample_employee_id FROM users WHERE role = 'employee' LIMIT 1;
    
    -- Create 10 sample orders
    FOR i IN 1..10 LOOP
        INSERT INTO orders (
            order_number, 
            customer_id, 
            employee_id, 
            order_type, 
            status, 
            payment_status,
            subtotal, 
            tax_amount, 
            total_amount, 
            payment_method,
            order_date
        ) VALUES (
            'ORD' || LPAD(i::text, 6, '0'),
            (SELECT id FROM customers ORDER BY RANDOM() LIMIT 1),
            (SELECT id FROM users WHERE role IN ('employee', 'manager') ORDER BY RANDOM() LIMIT 1),
            (ARRAY['in_store', 'takeaway'])[floor(random() * 2) + 1],
            'completed',
            'paid',
            0, -- Will be updated after inserting items
            0, -- Will be calculated
            0, -- Will be calculated
            (ARRAY['cash', 'card', 'mobile'])[floor(random() * 3) + 1],
            CURRENT_TIMESTAMP - (random() * interval '30 days')
        ) RETURNING id, order_number INTO order_record;
        
        -- Add 2-5 random items to each order
        DECLARE
            item_count integer := floor(random() * 4) + 2;
            order_subtotal decimal := 0;
        BEGIN
            FOR j IN 1..item_count LOOP
                SELECT * INTO product_record FROM products ORDER BY RANDOM() LIMIT 1;
                DECLARE
                    item_quantity integer := floor(random() * 3) + 1;
                    item_price decimal := product_record.unit_price;
                    item_total decimal := item_quantity * item_price;
                BEGIN
                    INSERT INTO order_items (
                        order_id, 
                        product_id, 
                        quantity, 
                        unit_price, 
                        total_price
                    ) VALUES (
                        order_record.id,
                        product_record.id,
                        item_quantity,
                        item_price,
                        item_total
                    );
                    
                    order_subtotal := order_subtotal + item_total;
                END;
            END LOOP;
            
            -- Update order totals
            DECLARE
                tax_amt decimal := order_subtotal * 0.18; -- 18% tax
                total_amt decimal := order_subtotal + tax_amt;
            BEGIN
                UPDATE orders 
                SET 
                    subtotal = order_subtotal,
                    tax_amount = tax_amt,
                    total_amount = total_amt
                WHERE id = order_record.id;
            END;
        END;
    END LOOP;
END $$;

-- Update customer statistics based on orders
UPDATE customers 
SET 
    total_spent = COALESCE((
        SELECT SUM(o.total_amount) 
        FROM orders o 
        WHERE o.customer_id = customers.id 
        AND o.status = 'completed'
    ), 0),
    visit_count = COALESCE((
        SELECT COUNT(*) 
        FROM orders o 
        WHERE o.customer_id = customers.id
    ), 0),
    last_visit_date = (
        SELECT MAX(DATE(o.order_date))
        FROM orders o 
        WHERE o.customer_id = customers.id
    );

-- Update loyalty points (1 point per 1000 UGX spent)
UPDATE customers 
SET loyalty_points = FLOOR(total_spent / 1000);

-- Success message
SELECT 'Sample data inserted successfully' as message,
       (SELECT COUNT(*) FROM products) as products_count,
       (SELECT COUNT(*) FROM customers) as customers_count,
       (SELECT COUNT(*) FROM orders) as orders_count,
       (SELECT COUNT(*) FROM order_items) as order_items_count;