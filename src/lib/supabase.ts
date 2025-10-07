import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Product = {
  id: string;
  name: string;
  category: 'economique' | 'standard' | 'premium';
  description: string;
  price: number;
  technical_specs: Record<string, any>;
  performance_data: Record<string, any>;
  created_at: string;
  updated_at: string;
};

export type Scenario = {
  id: string;
  name: string;
  category: 'economique' | 'standard' | 'premium';
  site_types: string[];
  min_budget: number;
  max_budget: number | null;
  products: any[];
  estimated_savings: number;
  equipment_lifespan: number;
  description: string;
  created_at: string;
  updated_at: string;
};

export type Lead = {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  site_type: string;
  electricity_bill: number;
  installation_power: number | null;
  zones_to_monitor: string[];
  specific_needs: string[];
  measurement_points: number | null;
  budget: number | null;
  questionnaire_data: Record<string, any>;
  recommended_scenarios: any[];
  status: 'new' | 'contacted' | 'qualified' | 'converted';
  created_at: string;
  updated_at: string;
};

export type LeadInteraction = {
  id: string;
  lead_id: string;
  interaction_type: 'pdf_download' | 'contact_request' | 'quote_request';
  notes: string;
  created_at: string;
};




