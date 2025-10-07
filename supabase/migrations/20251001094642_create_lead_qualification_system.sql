/*
  # Create Lead Qualification System for SAKKANAL ENERGY

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text) - Product name
      - `category` (text) - Product category (economique, standard, premium)
      - `description` (text) - Product description
      - `price` (numeric) - Product price
      - `technical_specs` (jsonb) - Technical specifications
      - `performance_data` (jsonb) - Performance metrics
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `scenarios`
      - `id` (uuid, primary key)
      - `name` (text) - Scenario name
      - `category` (text) - economique, standard, premium
      - `site_types` (text[]) - Compatible site types
      - `min_budget` (numeric) - Minimum budget
      - `max_budget` (numeric) - Maximum budget
      - `products` (jsonb) - Array of product IDs and quantities
      - `estimated_savings` (numeric) - Percentage of expected savings
      - `equipment_lifespan` (integer) - Years
      - `description` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `leads`
      - `id` (uuid, primary key)
      - `company_name` (text)
      - `contact_name` (text)
      - `email` (text)
      - `phone` (text)
      - `site_type` (text) - bureau, immeuble, usine, etc.
      - `electricity_bill` (numeric) - Monthly electricity bill
      - `installation_power` (numeric) - Power in kW
      - `zones_to_monitor` (text[])
      - `specific_needs` (text[])
      - `measurement_points` (integer)
      - `budget` (numeric)
      - `questionnaire_data` (jsonb) - Full questionnaire responses
      - `recommended_scenarios` (jsonb) - Array of scenario IDs with scores
      - `status` (text) - new, contacted, qualified, converted
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `lead_interactions`
      - `id` (uuid, primary key)
      - `lead_id` (uuid, foreign key)
      - `interaction_type` (text) - pdf_download, contact_request, quote_request
      - `notes` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Public access for products and scenarios (read-only)
    - Leads can be created by anyone (for form submission)
    - Only authenticated users can view and manage leads
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('economique', 'standard', 'premium')),
  description text NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  technical_specs jsonb DEFAULT '{}',
  performance_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create scenarios table
CREATE TABLE IF NOT EXISTS scenarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('economique', 'standard', 'premium')),
  site_types text[] NOT NULL DEFAULT '{}',
  min_budget numeric DEFAULT 0,
  max_budget numeric,
  products jsonb NOT NULL DEFAULT '[]',
  estimated_savings numeric NOT NULL CHECK (estimated_savings >= 0 AND estimated_savings <= 100),
  equipment_lifespan integer NOT NULL CHECK (equipment_lifespan > 0),
  description text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  contact_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  site_type text NOT NULL,
  electricity_bill numeric NOT NULL CHECK (electricity_bill >= 0),
  installation_power numeric CHECK (installation_power >= 0),
  zones_to_monitor text[] DEFAULT '{}',
  specific_needs text[] DEFAULT '{}',
  measurement_points integer CHECK (measurement_points >= 0),
  budget numeric CHECK (budget >= 0),
  questionnaire_data jsonb DEFAULT '{}',
  recommended_scenarios jsonb DEFAULT '[]',
  status text DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create lead_interactions table
CREATE TABLE IF NOT EXISTS lead_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  interaction_type text NOT NULL CHECK (interaction_type IN ('pdf_download', 'contact_request', 'quote_request')),
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_scenarios_category ON scenarios(category);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_lead_interactions_lead_id ON lead_interactions(lead_id);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_interactions ENABLE ROW LEVEL SECURITY;

-- Products policies (public read, authenticated write)
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage products"
  ON products FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Scenarios policies (public read, authenticated write)
CREATE POLICY "Anyone can view scenarios"
  ON scenarios FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage scenarios"
  ON scenarios FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Leads policies (anyone can create, authenticated can view/manage)
CREATE POLICY "Anyone can create leads"
  ON leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all leads"
  ON leads FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update leads"
  ON leads FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete leads"
  ON leads FOR DELETE
  TO authenticated
  USING (true);

-- Lead interactions policies
CREATE POLICY "Anyone can create lead interactions"
  ON lead_interactions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view lead interactions"
  ON lead_interactions FOR SELECT
  TO authenticated
  USING (true);

-- Insert sample products
INSERT INTO products (name, category, description, price, technical_specs, performance_data) VALUES
('Compteur Basic', 'economique', 'Compteur d''énergie de base pour une surveillance simple', 250, '{"precision": "1%", "communication": "RS485"}', '{"measurement_accuracy": "98%"}'),
('Compteur Smart', 'standard', 'Compteur intelligent avec connectivité IoT', 450, '{"precision": "0.5%", "communication": "WiFi/4G", "display": "LCD"}', '{"measurement_accuracy": "99.5%", "data_frequency": "1min"}'),
('Compteur Premium', 'premium', 'Compteur haute précision avec analytics avancés', 850, '{"precision": "0.2%", "communication": "WiFi/4G/LoRa", "display": "Couleur", "ai_enabled": true}', '{"measurement_accuracy": "99.9%", "data_frequency": "realtime", "predictive_analytics": true}'),
('Gateway IoT Basic', 'economique', 'Passerelle de communication basique', 180, '{"ports": 4, "protocol": "Modbus"}', '{"reliability": "95%"}'),
('Gateway IoT Pro', 'standard', 'Passerelle IoT avec connectivité cloud', 350, '{"ports": 8, "protocol": "Modbus/BACnet", "cloud": true}', '{"reliability": "99%", "cloud_sync": "5min"}'),
('Plateforme Sakkanal Starter', 'economique', 'Accès plateforme web - 1 an', 500, '{"users": 3, "sites": 1, "support": "email"}', '{"uptime": "99%"}'),
('Plateforme Sakkanal Business', 'standard', 'Accès plateforme web avancée - 1 an', 1200, '{"users": 10, "sites": 5, "support": "phone/email", "reports": "advanced"}', '{"uptime": "99.5%", "custom_dashboards": true}'),
('Plateforme Sakkanal Enterprise', 'premium', 'Solution complète avec IA - 1 an', 2500, '{"users": "unlimited", "sites": "unlimited", "support": "24/7", "reports": "custom", "ai": true}', '{"uptime": "99.9%", "custom_dashboards": true, "predictive_maintenance": true}')
ON CONFLICT DO NOTHING;

-- Insert sample scenarios
INSERT INTO scenarios (name, category, site_types, min_budget, max_budget, products, estimated_savings, equipment_lifespan, description) VALUES
('Solution Économique', 'economique', ARRAY['bureau', 'petit commerce'], 1000, 3000, '[{"product_id": "compteur_basic", "quantity": 3}, {"product_id": "gateway_basic", "quantity": 1}, {"product_id": "platform_starter", "quantity": 1}]', 15, 5, 'Solution d''entrée de gamme pour un suivi énergétique basique avec économies estimées à 15%'),
('Solution Standard', 'standard', ARRAY['immeuble', 'commerce', 'petit site industriel'], 3000, 8000, '[{"product_id": "compteur_smart", "quantity": 5}, {"product_id": "gateway_pro", "quantity": 1}, {"product_id": "platform_business", "quantity": 1}]', 25, 7, 'Solution intermédiaire avec IoT et monitoring temps réel pour 25% d''économies'),
('Solution Premium', 'premium', ARRAY['usine', 'grand immeuble', 'data center'], 8000, 25000, '[{"product_id": "compteur_premium", "quantity": 10}, {"product_id": "gateway_pro", "quantity": 2}, {"product_id": "platform_enterprise", "quantity": 1}]', 35, 10, 'Solution complète avec IA prédictive et analytics avancés pour 35% d''économies')
ON CONFLICT DO NOTHING;