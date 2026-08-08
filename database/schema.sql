-- Bellepros Restaurant App - Database Schema
-- Multi-tenant architecture with location-based isolation

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS & AUTHENTICATION
-- ============================================

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  preferred_language VARCHAR(2) DEFAULT 'en', -- 'en' or 'fr'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User addresses
CREATE TABLE user_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  label VARCHAR(50), -- 'Home', 'Work', etc.
  street_address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  province VARCHAR(2) DEFAULT 'QC',
  postal_code VARCHAR(10) NOT NULL,
  country VARCHAR(2) DEFAULT 'CA',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- LOCATIONS & FRANCHISE MANAGEMENT
-- ============================================

CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,

  -- Address
  street_address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  province VARCHAR(2) DEFAULT 'QC',
  postal_code VARCHAR(10) NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),

  -- Contact
  phone VARCHAR(20),
  email VARCHAR(255),

  -- Operations
  timezone VARCHAR(50) DEFAULT 'America/Toronto',
  delivery_radius_km DECIMAL(5, 2) DEFAULT 5.00,

  -- POS Configuration
  pos_type VARCHAR(20), -- 'lightspeed' or 'clover'
  pos_config JSONB, -- Encrypted credentials and settings

  -- Business hours (JSON array of objects)
  hours JSONB, -- [{day: 0, open: '09:00', close: '21:00', closed: false}, ...]

  -- Settings
  is_active BOOLEAN DEFAULT TRUE,
  accepts_pickup BOOLEAN DEFAULT TRUE,
  accepts_delivery BOOLEAN DEFAULT TRUE,
  accepts_dine_in BOOLEAN DEFAULT TRUE,

  -- Fees
  delivery_fee DECIMAL(10, 2) DEFAULT 0.00,
  tax_rate DECIMAL(5, 4) DEFAULT 0.14975, -- QC tax: 14.975%

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- MENU MANAGEMENT
-- ============================================

CREATE TABLE menus (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
  pos_menu_id VARCHAR(100), -- External POS menu ID
  name VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  last_synced_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE menu_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_id UUID REFERENCES menus(id) ON DELETE CASCADE,
  pos_category_id VARCHAR(100),
  name VARCHAR(255) NOT NULL,
  name_fr VARCHAR(255),
  description TEXT,
  description_fr TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES menu_categories(id) ON DELETE CASCADE,
  pos_item_id VARCHAR(100),

  -- Item details
  name VARCHAR(255) NOT NULL,
  name_fr VARCHAR(255),
  description TEXT,
  description_fr TEXT,

  -- Pricing
  price DECIMAL(10, 2) NOT NULL,

  -- Images
  image_url TEXT,
  thumbnail_url TEXT,

  -- Availability
  is_available BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,

  -- Nutrition & Allergens (JSON)
  nutrition_info JSONB,
  allergens TEXT[],

  -- Loyalty eligibility
  loyalty_points_enabled BOOLEAN DEFAULT TRUE,

  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Menu item modifiers (extras, customizations)
CREATE TABLE menu_item_modifiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
  pos_modifier_id VARCHAR(100),

  name VARCHAR(255) NOT NULL,
  name_fr VARCHAR(255),

  -- Modifier group (e.g., "Size", "Toppings", "Sauce")
  group_name VARCHAR(100),
  group_name_fr VARCHAR(100),

  -- Pricing
  price_adjustment DECIMAL(10, 2) DEFAULT 0.00,

  -- Constraints
  is_required BOOLEAN DEFAULT FALSE,
  min_selection INTEGER DEFAULT 0,
  max_selection INTEGER,

  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ORDERS
-- ============================================

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(20) UNIQUE NOT NULL, -- Human-readable order number

  -- Relations
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  location_id UUID REFERENCES locations(id) ON DELETE RESTRICT,

  -- Order type
  order_type VARCHAR(20) NOT NULL, -- 'pickup', 'delivery', 'dine_in'

  -- Customer info (for guest orders)
  guest_name VARCHAR(255),
  guest_email VARCHAR(255),
  guest_phone VARCHAR(20),

  -- Delivery details
  delivery_address_id UUID REFERENCES user_addresses(id) ON DELETE SET NULL,
  delivery_address_snapshot JSONB, -- Snapshot in case address is deleted
  delivery_instructions TEXT,

  -- Pickup details
  scheduled_for TIMESTAMP WITH TIME ZONE,

  -- Dine-in details
  table_number VARCHAR(20),

  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  -- Status flow: pending -> confirmed -> preparing -> ready -> completed / cancelled

  -- Pricing
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) NOT NULL,
  delivery_fee DECIMAL(10, 2) DEFAULT 0.00,
  tip DECIMAL(10, 2) DEFAULT 0.00,
  discount DECIMAL(10, 2) DEFAULT 0.00,
  total DECIMAL(10, 2) NOT NULL,

  -- Payment
  payment_status VARCHAR(20) DEFAULT 'pending', -- pending, paid, refunded
  payment_intent_id VARCHAR(255), -- Stripe payment intent ID

  -- Loyalty
  loyalty_points_earned INTEGER DEFAULT 0,
  loyalty_points_redeemed INTEGER DEFAULT 0,

  -- POS integration
  pos_order_id VARCHAR(100), -- External POS order ID
  sent_to_pos_at TIMESTAMP WITH TIME ZONE,

  -- Delivery integration
  delivery_provider VARCHAR(20), -- 'doordash', 'uber', null
  delivery_tracking_id VARCHAR(255),
  delivery_status VARCHAR(50),

  -- Special instructions
  special_instructions TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confirmed_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE RESTRICT,

  -- Item snapshot (in case menu changes)
  item_name VARCHAR(255) NOT NULL,
  item_price DECIMAL(10, 2) NOT NULL,

  quantity INTEGER NOT NULL DEFAULT 1,

  -- Selected modifiers (JSONB array)
  modifiers JSONB, -- [{id, name, price}, ...]

  -- Special instructions for this item
  special_instructions TEXT,

  -- Calculated price
  subtotal DECIMAL(10, 2) NOT NULL,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- LOYALTY & REWARDS
-- ============================================

CREATE TABLE loyalty_programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE,

  name VARCHAR(255) NOT NULL,
  name_fr VARCHAR(255),
  program_type VARCHAR(20) NOT NULL, -- 'points', 'punch_card', 'tiered'

  -- Points configuration
  points_per_dollar DECIMAL(5, 2), -- e.g., 1.00 = 1 point per $1

  -- Punch card configuration
  punch_card_target INTEGER, -- Buy X items
  punch_eligible_items UUID[], -- Array of menu_item_id

  -- Tiered configuration
  tiers JSONB, -- [{name: 'Bronze', threshold: 0, multiplier: 1.0}, ...]

  -- Expiration
  points_expire_days INTEGER, -- null = never expires

  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE loyalty_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE,

  points_balance INTEGER DEFAULT 0,

  -- Tiered programs
  current_tier VARCHAR(50),
  lifetime_spend DECIMAL(10, 2) DEFAULT 0.00,

  -- Punch card programs
  punch_count INTEGER DEFAULT 0,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id, location_id)
);

CREATE TABLE loyalty_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  loyalty_account_id UUID REFERENCES loyalty_accounts(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,

  transaction_type VARCHAR(20) NOT NULL, -- 'earned', 'redeemed', 'expired', 'adjusted'
  points_change INTEGER NOT NULL, -- Positive for earned, negative for redeemed

  description TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
  loyalty_program_id UUID REFERENCES loyalty_programs(id) ON DELETE CASCADE,

  name VARCHAR(255) NOT NULL,
  name_fr VARCHAR(255),
  description TEXT,
  description_fr TEXT,

  reward_type VARCHAR(20) NOT NULL, -- 'discount_percent', 'discount_fixed', 'free_item'

  -- Points cost
  points_cost INTEGER NOT NULL,

  -- Reward value
  discount_value DECIMAL(10, 2), -- For discount rewards
  free_item_id UUID REFERENCES menu_items(id), -- For free item rewards

  -- Constraints
  min_order_value DECIMAL(10, 2), -- Minimum order to apply

  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- PROMO CODES
-- ============================================

CREATE TABLE promo_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE,

  code VARCHAR(50) UNIQUE NOT NULL,

  discount_type VARCHAR(20) NOT NULL, -- 'percent', 'fixed'
  discount_value DECIMAL(10, 2) NOT NULL,

  -- Constraints
  min_order_value DECIMAL(10, 2),
  max_discount DECIMAL(10, 2),

  -- Usage limits
  usage_limit INTEGER, -- Total uses allowed (null = unlimited)
  usage_count INTEGER DEFAULT 0,
  per_user_limit INTEGER, -- Uses per user (null = unlimited)

  -- Validity
  valid_from TIMESTAMP WITH TIME ZONE,
  valid_to TIMESTAMP WITH TIME ZONE,

  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE promo_code_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  promo_code_id UUID REFERENCES promo_codes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,

  discount_applied DECIMAL(10, 2) NOT NULL,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(promo_code_id, order_id)
);

-- ============================================
-- SAVED PAYMENT METHODS
-- ============================================

CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  stripe_payment_method_id VARCHAR(255) UNIQUE NOT NULL,

  -- Card details (last 4, brand)
  card_brand VARCHAR(20),
  card_last4 VARCHAR(4),
  card_exp_month INTEGER,
  card_exp_year INTEGER,

  is_default BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- NOTIFICATIONS
-- ============================================

CREATE TABLE push_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  token VARCHAR(255) UNIQUE NOT NULL,
  platform VARCHAR(10) NOT NULL, -- 'ios', 'android', 'web'

  is_active BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,

  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,

  notification_type VARCHAR(50), -- 'order_update', 'promotion', 'loyalty', etc.

  data JSONB, -- Additional data payload

  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,

  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);

-- Addresses
CREATE INDEX idx_user_addresses_user_id ON user_addresses(user_id);

-- Locations
CREATE INDEX idx_locations_slug ON locations(slug);
CREATE INDEX idx_locations_is_active ON locations(is_active);

-- Menus
CREATE INDEX idx_menus_location_id ON menus(location_id);
CREATE INDEX idx_menu_categories_menu_id ON menu_categories(menu_id);
CREATE INDEX idx_menu_items_category_id ON menu_items(category_id);
CREATE INDEX idx_menu_items_is_available ON menu_items(is_available);
CREATE INDEX idx_menu_item_modifiers_item_id ON menu_item_modifiers(menu_item_id);

-- Orders
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_location_id ON orders(location_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- Loyalty
CREATE INDEX idx_loyalty_accounts_user_id ON loyalty_accounts(user_id);
CREATE INDEX idx_loyalty_accounts_location_id ON loyalty_accounts(location_id);
CREATE INDEX idx_loyalty_transactions_account_id ON loyalty_transactions(loyalty_account_id);
CREATE INDEX idx_loyalty_transactions_order_id ON loyalty_transactions(order_id);

-- Promo codes
CREATE INDEX idx_promo_codes_code ON promo_codes(code);
CREATE INDEX idx_promo_codes_location_id ON promo_codes(location_id);
CREATE INDEX idx_promo_code_usage_user_id ON promo_code_usage(user_id);

-- Notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_push_tokens_user_id ON push_tokens(user_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_code_usage ENABLE ROW LEVEL SECURITY;

-- Users can only read/update their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- User addresses
CREATE POLICY "Users can view own addresses" ON user_addresses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own addresses" ON user_addresses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own addresses" ON user_addresses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own addresses" ON user_addresses FOR DELETE USING (auth.uid() = user_id);

-- Orders
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Order items (accessible through orders)
CREATE POLICY "Users can view own order items" ON order_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));

-- Loyalty accounts
CREATE POLICY "Users can view own loyalty" ON loyalty_accounts FOR SELECT USING (auth.uid() = user_id);

-- Payment methods
CREATE POLICY "Users can view own payment methods" ON payment_methods FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own payment methods" ON payment_methods FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own payment methods" ON payment_methods FOR DELETE USING (auth.uid() = user_id);

-- Public read access for menu data
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_item_modifiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active locations" ON locations FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view menus" ON menus FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view categories" ON menu_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view menu items" ON menu_items FOR SELECT USING (is_available = true);
CREATE POLICY "Public can view modifiers" ON menu_item_modifiers FOR SELECT USING (true);
CREATE POLICY "Public can view rewards" ON rewards FOR SELECT USING (is_active = true);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menus_updated_at BEFORE UPDATE ON menus
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_loyalty_accounts_updated_at BEFORE UPDATE ON loyalty_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(nextval('order_number_seq')::TEXT, 4, '0');
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE SEQUENCE order_number_seq;

CREATE TRIGGER set_order_number BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- ============================================
-- SAMPLE DATA (for development)
-- ============================================

-- Insert Laval location
INSERT INTO locations (
  name, slug, street_address, city, province, postal_code,
  phone, email, timezone, delivery_radius_km,
  pos_type, hours, is_active
) VALUES (
  'Bellepros Laval', 'bellepros-laval',
  '1234 Boulevard Saint-Martin O', 'Laval', 'QC', 'H7S 1N5',
  '450-555-1234', 'laval@bellepros.com', 'America/Toronto', 8.0,
  'lightspeed',
  '[
    {"day": 0, "open": "11:00", "close": "21:00", "closed": false},
    {"day": 1, "open": "11:00", "close": "21:00", "closed": false},
    {"day": 2, "open": "11:00", "close": "21:00", "closed": false},
    {"day": 3, "open": "11:00", "close": "21:00", "closed": false},
    {"day": 4, "open": "11:00", "close": "22:00", "closed": false},
    {"day": 5, "open": "11:00", "close": "22:00", "closed": false},
    {"day": 6, "open": "11:00", "close": "21:00", "closed": false}
  ]'::jsonb,
  true
);
