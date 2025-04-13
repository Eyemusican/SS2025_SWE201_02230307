import { useEffect, useState, useCallback } from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import Entypo from '@expo/vector-icons/Entypo';

SplashScreen.preventAutoHideAsync();

export default function SplashScreenComponent() {
  const router = useRouter();
  const pathname = usePathname();
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync(Entypo.font);
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(() => {
    if (appIsReady && pathname === '/') { // Only navigate from the splash screen
      SplashScreen.hideAsync();
      setTimeout(() => {
        router.push('/sign_in'); // Navigate to sign-in page
      }, 4000); // Show splash screen for 4 seconds
    }
  }, [appIsReady, router, pathname]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <Image
        source={require('../../assets/images/image.png')}
        style={styles.logo}
      />
      <Text style={styles.text}>gojek</Text>
      <View style={styles.bottomTextContainer}>
        <Text style={styles.subtitle}>from</Text>
        <Text style={styles.company}>goto</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  text: {
    fontSize: 45,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 40,
  },
  bottomTextContainer: {
    position: 'absolute',
    bottom: 30,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
  },
  company: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2EAD33',
  },
});
