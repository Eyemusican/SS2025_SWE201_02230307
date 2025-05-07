import { AppState, Platform } from 'react-native'
import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://ntoeyrlnovukknrzwvoz.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50b2V5cmxub3Z1a2tucnp3dm96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwMjYzOTgsImV4cCI6MjA1NjYwMjM5OH0.RnU_05exstQFIImDcTMJSuLLbb6gPGqIuvT_cgBaMGs"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

// Handling AppState for React Native and Web
if (Platform.OS === 'android' || Platform.OS === 'ios') {
  // For mobile (React Native)
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh()
    } else {
      supabase.auth.stopAutoRefresh()
    }
  })
} else {
  // For web, use visibilitychange event
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      supabase.auth.stopAutoRefresh()
    } else {
      supabase.auth.startAutoRefresh()
    }
  })
}


