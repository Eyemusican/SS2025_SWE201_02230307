import 'react-native-url-polyfill/auto'
import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Button, ScrollView, TouchableOpacity, Modal } from 'react-native'
import { supabase } from '../lib/supabase'
import Auth from '../components/Auth'
import MagicLinkAuth from '../components/MagicLinkAuth'
import PhoneAuth from '../components/PhoneAuth'
import SocialAuth from '../components/SocialAuth'

export default function App() {
  const [session, setSession] = useState<any>(null)
  const [useMagicLink, setUseMagicLink] = useState(false)
  const [usePhoneAuth, setUsePhoneAuth] = useState(false)
  const [useSocialAuth, setUseSocialAuth] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    // load any existing session
    supabase.auth.getSession()
      .then(({ data: { session } }) => setSession(session))

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Function to handle authentication method switching
  const switchAuthMethod = (method: 'email' | 'magic' | 'phone' | 'social') => {
    if (method === 'email') {
      setUseMagicLink(false)
      setUsePhoneAuth(false)
      setUseSocialAuth(false)
    } else if (method === 'magic') {
      setUseMagicLink(true)
      setUsePhoneAuth(false)
      setUseSocialAuth(false)
    } else if (method === 'phone') {
      setUseMagicLink(false)
      setUsePhoneAuth(true)
      setUseSocialAuth(false)
    } else if (method === 'social') {
      setUseMagicLink(false)
      setUsePhoneAuth(false)
      setUseSocialAuth(true)
    }
    setShowAuthModal(false)
  }

  // Function to render the appropriate auth component
  const renderAuthComponent = () => {
    if (usePhoneAuth) {
      return <PhoneAuth />
    } else if (useMagicLink) {
      return <MagicLinkAuth />
    } else if (useSocialAuth) {
      return <SocialAuth />
    } else {
      return <Auth />
    }
  }

  // Function to sign out
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) console.error('Error signing out:', error.message)
  }

  const getCurrentAuthName = () => {
    if (usePhoneAuth) return 'Phone Auth'
    if (useMagicLink) return 'Magic Link'
    if (useSocialAuth) return 'Social Auth'
    return 'Email Auth'
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header with Auth Selection Button */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome</Text>
        <TouchableOpacity 
          style={styles.authSelectorButton}
          onPress={() => setShowAuthModal(true)}
        >
          <Text style={styles.authSelectorButtonText}>{getCurrentAuthName()}</Text>
        </TouchableOpacity>
      </View>

      {/* Auth Method Modal */}
      <Modal
        transparent={true}
        visible={showAuthModal}
        animationType="slide"
        onRequestClose={() => setShowAuthModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Authentication Method</Text>
            
            <TouchableOpacity 
              style={[styles.authOption, !useMagicLink && !usePhoneAuth && !useSocialAuth && styles.selectedAuthOption]}
              onPress={() => switchAuthMethod('email')}
            >
              <Text style={styles.authOptionText}>Email & Password</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.authOption, useMagicLink && styles.selectedAuthOption]}
              onPress={() => switchAuthMethod('magic')}
            >
              <Text style={styles.authOptionText}>Magic Link</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.authOption, usePhoneAuth && styles.selectedAuthOption]}
              onPress={() => switchAuthMethod('phone')}
            >
              <Text style={styles.authOptionText}>Phone Authentication</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.authOption, useSocialAuth && styles.selectedAuthOption]}
              onPress={() => switchAuthMethod('social')}
            >
              <Text style={styles.authOptionText}>Social Login</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowAuthModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Main Content */}
      {session ? (
        <View style={styles.loggedInContainer}>
          <Text style={styles.text}>You're logged in with ID: {session.user.id}</Text>
          <Button title="Sign Out" onPress={handleSignOut} />
        </View>
      ) : (
        <>
          {renderAuthComponent()}
        </>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    marginTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  authSelectorButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    elevation: 2,
  },
  authSelectorButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '80%',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  authOption: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
  },
  selectedAuthOption: {
    backgroundColor: '#e3f2fd',
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  authOptionText: {
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#ccc',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    fontWeight: 'bold',
  },
  loggedInContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
})