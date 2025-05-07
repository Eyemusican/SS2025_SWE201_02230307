import { Platform } from 'react-native'
import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ntoeyrlnovukknrzwvoz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50b2V5cmxub3Z1a2tucnp3dm96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwMjYzOTgsImV4cCI6MjA1NjYwMjM5OH0.RnU_05exstQFIImDcTMJSuLLbb6gPGqIuvT_cgBaMGs'

// Check if we're in a browser-like environment
const isBrowser = typeof window !== 'undefined'

// Define auth options with the correct type
const authOptions: any = {
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: Platform.OS === 'web',
}

// Conditional import for AsyncStorage
let AsyncStorage: any = undefined
if (Platform.OS !== 'web' && isBrowser) {
  // Only import AsyncStorage when not on web
  try {
    AsyncStorage = require('@react-native-async-storage/async-storage').default
    authOptions.storage = AsyncStorage
  } catch (error) {
    console.warn('Failed to load AsyncStorage', error)
  }
}

// Create the client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: authOptions,
})

// Setup session refresh only in client environments
if (isBrowser && Platform.OS !== 'web') {
  const { AppState } = require('react-native')
  AppState.addEventListener('change', (state: string) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh()
    } else {
      supabase.auth.stopAutoRefresh()
    }
  })
}