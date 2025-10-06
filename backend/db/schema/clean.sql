-- Clean database script
-- This script removes all tables, functions, and policies
-- Use with caution - this will delete ALL data

-- Drop all policies first
DROP POLICY IF EXISTS users_select_policy ON users;
DROP POLICY IF EXISTS users_insert_policy ON users;
DROP POLICY IF EXISTS users_update_policy ON users;
DROP POLICY IF EXISTS users_delete_policy ON users;

DROP POLICY IF EXISTS products_select_policy ON products;
DROP POLICY IF EXISTS products_insert_policy ON products;
DROP POLICY IF EXISTS products_update_policy ON products;
DROP POLICY IF EXISTS products_delete_policy ON products;

DROP POLICY IF EXISTS orders_select_policy ON orders;
DROP POLICY IF EXISTS orders_insert_policy ON orders;
DROP POLICY IF EXISTS orders_update_policy ON orders;
DROP POLICY IF EXISTS orders_delete_policy ON orders;

DROP POLICY IF EXISTS order_items_select_policy ON order_items;
DROP POLICY IF EXISTS order_items_insert_policy ON order_items;
DROP POLICY IF EXISTS order_items_update_policy ON order_items;
DROP POLICY IF EXISTS order_items_delete_policy ON order_items;

DROP POLICY IF EXISTS inventory_select_policy ON inventory;
DROP POLICY IF EXISTS inventory_insert_policy ON inventory;
DROP POLICY IF EXISTS inventory_update_policy ON inventory;
DROP POLICY IF EXISTS inventory_delete_policy ON inventory;

-- Drop triggers
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
DROP TRIGGER IF EXISTS update_order_items_updated_at ON order_items;
DROP TRIGGER IF EXISTS update_inventory_updated_at ON inventory;

-- Drop functions
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP FUNCTION IF EXISTS exec_sql(text);

-- Drop tables (in reverse dependency order)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop custom types/enums
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS order_status CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;

-- Drop extensions (be careful with this in production)
-- DROP EXTENSION IF EXISTS "uuid-ossp";
-- DROP EXTENSION IF EXISTS "pgcrypto";

-- Reset sequences (optional)
-- ALTER SEQUENCE IF EXISTS users_id_seq RESTART WITH 1;
-- ALTER SEQUENCE IF EXISTS products_id_seq RESTART WITH 1;
-- ALTER SEQUENCE IF EXISTS orders_id_seq RESTART WITH 1;

-- Clear auth users if needed (use with extreme caution)
-- DELETE FROM auth.users;

NOTIFY pgrst, 'reload schema';

SELECT 'Database cleaned successfully' as message;