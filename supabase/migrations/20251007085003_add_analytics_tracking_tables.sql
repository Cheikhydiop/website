/*
  # Add Analytics Tracking Tables

  1. New Tables
    - `page_visits`
      - `id` (uuid, primary key)
      - `visitor_id` (text) - Anonymous visitor identifier
      - `page_path` (text) - Page URL path
      - `referrer` (text) - Source referrer
      - `user_agent` (text) - Browser user agent
      - `session_id` (text) - Session identifier
      - `created_at` (timestamptz)
    
    - `unique_visitors`
      - `id` (uuid, primary key)
      - `visitor_id` (text, unique) - Anonymous visitor identifier
      - `first_visit` (timestamptz) - First visit timestamp
      - `last_visit` (timestamptz) - Last visit timestamp
      - `visit_count` (integer) - Total visits count
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `crm_integrations`
      - `id` (uuid, primary key)
      - `name` (text) - CRM name (HubSpot, Salesforce, etc.)
      - `webhook_url` (text) - Webhook endpoint URL
      - `api_key_encrypted` (text) - Encrypted API key
      - `is_active` (boolean) - Integration status
      - `sync_frequency` (text) - sync interval (realtime, hourly, daily)
      - `last_sync` (timestamptz) - Last sync timestamp
      - `config` (jsonb) - Additional configuration
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `lead_segments`
      - `id` (uuid, primary key)
      - `name` (text) - Segment name
      - `description` (text) - Segment description
      - `criteria` (jsonb) - Segmentation criteria
      - `lead_count` (integer) - Number of leads in segment
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Public insert for page_visits and unique_visitors (for tracking)
    - Authenticated users can view all analytics data
    - Only authenticated users can manage CRM integrations and segments

  3. Indexes
    - Index on visitor_id for page_visits
    - Index on page_path for page_visits
    - Index on created_at for page_visits
    - Unique index on visitor_id for unique_visitors
*/

-- Create page_visits table
CREATE TABLE IF NOT EXISTS page_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id text NOT NULL,
  page_path text NOT NULL,
  referrer text DEFAULT 'direct',
  user_agent text,
  session_id text,
  created_at timestamptz DEFAULT now()
);

-- Create unique_visitors table
CREATE TABLE IF NOT EXISTS unique_visitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id text UNIQUE NOT NULL,
  first_visit timestamptz DEFAULT now(),
  last_visit timestamptz DEFAULT now(),
  visit_count integer DEFAULT 1 CHECK (visit_count >= 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create crm_integrations table
CREATE TABLE IF NOT EXISTS crm_integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  webhook_url text,
  api_key_encrypted text,
  is_active boolean DEFAULT false,
  sync_frequency text DEFAULT 'realtime' CHECK (sync_frequency IN ('realtime', 'hourly', 'daily')),
  last_sync timestamptz,
  config jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create lead_segments table
CREATE TABLE IF NOT EXISTS lead_segments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  criteria jsonb NOT NULL DEFAULT '{}',
  lead_count integer DEFAULT 0 CHECK (lead_count >= 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_page_visits_visitor_id ON page_visits(visitor_id);
CREATE INDEX IF NOT EXISTS idx_page_visits_page_path ON page_visits(page_path);
CREATE INDEX IF NOT EXISTS idx_page_visits_created_at ON page_visits(created_at);
CREATE INDEX IF NOT EXISTS idx_unique_visitors_visitor_id ON unique_visitors(visitor_id);
CREATE INDEX IF NOT EXISTS idx_crm_integrations_is_active ON crm_integrations(is_active);
CREATE INDEX IF NOT EXISTS idx_lead_segments_name ON lead_segments(name);

-- Enable RLS
ALTER TABLE page_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE unique_visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_segments ENABLE ROW LEVEL SECURITY;

-- Page visits policies (public insert for tracking)
CREATE POLICY "Anyone can insert page visits"
  ON page_visits FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view page visits"
  ON page_visits FOR SELECT
  TO authenticated
  USING (true);

-- Unique visitors policies
CREATE POLICY "Anyone can insert unique visitors"
  ON unique_visitors FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update unique visitors"
  ON unique_visitors FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view unique visitors"
  ON unique_visitors FOR SELECT
  TO authenticated
  USING (true);

-- CRM integrations policies (authenticated only)
CREATE POLICY "Authenticated users can view CRM integrations"
  ON crm_integrations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert CRM integrations"
  ON crm_integrations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update CRM integrations"
  ON crm_integrations FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete CRM integrations"
  ON crm_integrations FOR DELETE
  TO authenticated
  USING (true);

-- Lead segments policies (authenticated only)
CREATE POLICY "Authenticated users can view lead segments"
  ON lead_segments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert lead segments"
  ON lead_segments FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update lead segments"
  ON lead_segments FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete lead segments"
  ON lead_segments FOR DELETE
  TO authenticated
  USING (true);

-- Insert default segments
INSERT INTO lead_segments (name, description, criteria, lead_count) VALUES
('Leads Chauds', 'Leads avec forte probabilité de conversion', '{"min_score": 70, "status": ["contacted", "qualified"]}', 0),
('Leads Dormants', 'Leads inactifs depuis plus de 30 jours', '{"inactive_days": 30, "status": ["new", "contacted"]}', 0),
('Budget Élevé', 'Leads avec budget supérieur à 10M FCFA', '{"min_budget": 10000000}', 0),
('Industriels', 'Sites industriels et usines', '{"site_types": ["usine", "petit site industriel"]}', 0)
ON CONFLICT DO NOTHING;