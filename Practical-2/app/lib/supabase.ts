import { AppState, Platform } from 'react-native'
import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'

// Only import AsyncStorage for native platforms
let AsyncStorage: any = undefined
if (Platform.OS !== 'web') {
  AsyncStorage = require('@react-native-async-storage/async-storage').default
}

const supabaseUrl = 'https://ntoeyrlnovukknrzwvoz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50b2V5cmxub3Z1a2tucnp3dm96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwMjYzOTgsImV4cCI6MjA1NjYwMjM5OH0.RnU_05exstQFIImDcTMJSuLLbb6gPGqIuvT_cgBaMGs'

// Conditionally pass AsyncStorage
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === 'web',
  },
})

// Auto refresh session only for native platforms
if (Platform.OS !== 'web' || typeof window !== 'undefined') {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
}
