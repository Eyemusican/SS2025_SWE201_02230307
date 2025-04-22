

// app/App.tsx
// import 'react-native-url-polyfill/auto'
// import React, { useState, useEffect } from 'react'
// import { View, Text, StyleSheet, Button } from 'react-native'
// import { supabase } from '../lib/supabase'
// import Auth from '../components/Auth'
// import MagicLinkAuth from '../components/MagicLinkAuth'

// export default function App() {
//   const [session, setSession] = useState<any>(null)
//   const [useMagicLink, setUseMagicLink] = useState(false) // toggle state

//   useEffect(() => {
//     // load any existing session
//     supabase.auth.getSession()
//       .then(({ data: { session } }) => setSession(session))

//     const {
//       data: { subscription }
//     } = supabase.auth.onAuthStateChange((_event, newSession) => {
//       setSession(newSession)
//     })

//     return () => {
//       subscription.unsubscribe()
//     }
//   }, [])

//   return (
//     <View style={styles.container}>
//       {session ? (
//         <Text style={styles.text}>You're logged in with ID: {session.user.id}</Text>
//       ) : (
//         <>
//           <Button
//             title={useMagicLink ? 'Use Email & Password' : 'Use Magic Link'}
//             onPress={() => setUseMagicLink(!useMagicLink)}
//           />
//           {useMagicLink ? <MagicLinkAuth /> : <Auth />}
//         </>
//       )}
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 12,
//     marginTop: 40,
//   },
//   text: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// })

import 'react-native-url-polyfill/auto'
import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native'
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

  return (
    <ScrollView style={styles.container}>
      {session ? (
        <View style={styles.loggedInContainer}>
          <Text style={styles.text}>You're logged in with ID: {session.user.id}</Text>
          <Button title="Sign Out" onPress={handleSignOut} />
        </View>
      ) : (
        <>
          <View style={styles.authToggle}>
            <Button
              title="Email"
              onPress={() => switchAuthMethod('email')}
              color={!useMagicLink && !usePhoneAuth && !useSocialAuth ? '#0066cc' : undefined}
            />
            <Button
              title="Magic"
              onPress={() => switchAuthMethod('magic')}
              color={useMagicLink ? '#0066cc' : undefined}
            />
            <Button
              title="Phone"
              onPress={() => switchAuthMethod('phone')}
              color={usePhoneAuth ? '#0066cc' : undefined}
            />
            <Button
              title="Social"
              onPress={() => switchAuthMethod('social')}
              color={useSocialAuth ? '#0066cc' : undefined}
            />
          </View>
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
  authToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
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