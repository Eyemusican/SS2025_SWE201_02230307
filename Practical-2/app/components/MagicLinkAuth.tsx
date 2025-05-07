import React, { useState } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import { Button, Input } from '@rneui/themed'
import { supabase } from '../lib/supabase'

export default function MagicLinkAuth() {
  const [email, setEmail] = useState('') // stores user email input
  const [loading, setLoading] = useState(false) // handles loading state

  // function to send the magic link
  const sendMagicLink = async () => {
    setLoading(true)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true, // allow auto-signup if user doesn't exist
        emailRedirectTo: 'yourapp://login-callback', 
      },
    })

    if (error) {
      Alert.alert('Error', error.message)
    } else {
      Alert.alert('Success', 'Check your email for the login link.')
    }

    setLoading(false)
  }

  return (
    <View style={styles.container}>
      <Input
        label="Email"
        leftIcon={{ type: 'font-awesome', name: 'envelope' }}
        onChangeText={(text) => setEmail(text)}
        value={email}
        placeholder="email@address.com"
        autoCapitalize={'none'}
      />
      <Button
        title={loading ? 'Sending...' : 'Send Magic Link'}
        onPress={sendMagicLink}
        disabled={loading}
        containerStyle={styles.button}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  button: {
    marginTop: 20,
  },
})
