-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: reservations
CREATE TABLE IF NOT EXISTS reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    guests_count INTEGER NOT NULL,
    lounge_preference TEXT CHECK (lounge_preference IN ('Breakfast', 'Beef', 'Chicken', 'Pizza', 'Pasta', 'Drinks')),
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: web_orders
CREATE TABLE IF NOT EXISTS web_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    order_items JSONB NOT NULL, -- Array of objects: { item_name, category, quantity, unit_price_le }
    total_price NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'processing',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE web_orders ENABLE ROW LEVEL SECURITY;

-- Create policies for public insert (to allow clients to submit reservations/orders)
CREATE POLICY "Allow public insert to reservations" 
ON reservations FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Allow public insert to web_orders" 
ON web_orders FOR INSERT 
TO public 
WITH CHECK (true);

-- Create policies for read (optional/admin access, default deny for public read unless authenticated)
CREATE POLICY "Allow authenticated read reservations"
ON reservations FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated read web_orders"
ON web_orders FOR SELECT
TO authenticated
USING (true);
