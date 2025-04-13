import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import Auth from './components/Auth'
import { Button } from '@rneui/themed'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {session && session.user ? (
        <View style={styles.profileContainer}>
          <Text style={styles.title}>User Profile</Text>
          <Text style={styles.profileText}>Email: {session.user.email}</Text>
          <Text style={styles.profileText}>User ID: {session.user.id}</Text>
          <Text style={styles.profileText}>
            Phone: {session.user.phone || 'Not provided'}
          </Text>
          <Text style={styles.profileText}>
            Auth Provider: {session.user.app_metadata?.provider || 'Email'}
          </Text>
          <Button
            title="Sign Out"
            onPress={() => supabase.auth.signOut()}
            containerStyle={styles.signOutButton}
          />
        </View>
      ) : (
        <Auth />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  profileContainer: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  profileText: {
    fontSize: 16,
    marginBottom: 10,
  },
  signOutButton: {
    marginTop: 20,
  },
})