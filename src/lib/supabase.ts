import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://totysquuiptozseywbmp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvdHlzcXV1aXB0b3pzZXl3Ym1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5NTU1ODEsImV4cCI6MjA4ODUzMTU4MX0.OSBwnOYyUW1b2vQZCIP2d-sVPhDEvqC87o7T2jmwQaA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
