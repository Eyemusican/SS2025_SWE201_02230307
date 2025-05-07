// components/SocialAuth.tsx
import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { supabase } from '../lib/supabase'
import { Provider } from '@supabase/supabase-js'

export default function SocialAuth() {
  const [loading, setLoading] = useState(false)

  const handleSocialLogin = async (provider: Provider) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: 'yourapp://auth-callback',
        }
      })

      if (error) {
        Alert.alert('Error', error.message)
      }
    } catch (error) {
      console.error('Social login error:', error)
      Alert.alert('Error', 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Continue with</Text>
      
      <View style={styles.socialButtonsContainer}>
        <TouchableOpacity 
          style={[styles.socialButton, styles.googleButton]}
          onPress={() => handleSocialLogin('google')}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Google</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.socialButtonsContainer}>
        <TouchableOpacity 
          style={[styles.socialButton, styles.facebookButton]}
          onPress={() => handleSocialLogin('facebook')}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Facebook</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  socialButtonsContainer: {
    marginBottom: 12,
  },
  socialButton: {
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  googleButton: {
    backgroundColor: '#DB4437',
  },
  facebookButton: {
    backgroundColor: '#4267B2',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
})