// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://tkisbswjbzaffwzfaali.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRraXNic3dqYnphZmZ3emZhYWxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyMzQzODgsImV4cCI6MjA1NTgxMDM4OH0.-vjoS2lrHkvdW7Z9ZONbCv-bDcp_i-SdW8bP-W4aw94";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);