import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lcpscuitnlefuwgdlzuu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjcHNjdWl0bmxlZnV3Z2RsenV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0ODg5NjcsImV4cCI6MjA2NTA2NDk2N30.mXt4IZEgh3a-qvNgkLwoUkJEW3vUciDGaN2HotpnhOI'

export const supabase = createClient(supabaseUrl, supabaseKey)
