import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://lxrchfhiubkpqzlbzhbk.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4cmNoZmhpdWJrcHF6bGJ6aGJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzMDk3OTksImV4cCI6MjEwNjg4NTc5OX0.oJigBaoKxMqKBUFo5vDNY7vWrdlKXsPkofX3rYZjuPU"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)