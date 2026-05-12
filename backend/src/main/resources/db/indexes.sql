-- Index on order_date for faster date range queries
CREATE INDEX IF NOT EXISTS idx_orders_order_date
    ON customer_orders(order_date DESC);

-- Index on user_id in orders for faster user order lookups
CREATE INDEX IF NOT EXISTS idx_orders_user_id
    ON customer_orders(user_id);

-- Index on total_price for price filtering
CREATE INDEX IF NOT EXISTS idx_orders_total_price
    ON customer_orders(total_price);

-- Index on status in order_status table
CREATE INDEX IF NOT EXISTS idx_order_status_status
    ON order_status(status);

-- Index on email in users for faster login lookups
CREATE INDEX IF NOT EXISTS idx_users_email
    ON users(email);

-- Index on product name for search
CREATE INDEX IF NOT EXISTS idx_products_name
    ON products(name);