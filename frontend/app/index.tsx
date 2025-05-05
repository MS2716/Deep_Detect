import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text } from './_layout';
import { auth } from './config/firebase'; // Import the shared auth instance
import { onAuthStateChanged } from 'firebase/auth';

SplashScreen.preventAutoHideAsync();

export default function Splash() {
  const router = useRouter();
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is logged in
        setIsAuthenticated(true);
        router.replace('/(tabs)'); // Navigate to tab navigator
        SplashScreen.hideAsync();
      } else {
        // User is not logged in, proceed with splash screen logic
        setIsAuthenticated(false);
        checkFirstLaunch();
      }
    });

    const checkFirstLaunch = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem('hasLaunched');
        if (hasLaunched === null) {
          setIsFirstLaunch(true);
          await AsyncStorage.setItem('hasLaunched', 'true');
        } else {
          setIsFirstLaunch(false);
          router.replace('/loginSignup');
        }
      } catch (error) {
        console.error('Error checking first launch:', error);
        setIsFirstLaunch(true);
      } finally {
        await SplashScreen.hideAsync();
      }
    };

    return () => unsubscribe(); // Cleanup the auth listener
  }, [router]);

  const handlePress = () => {
    router.replace('/loginSignup');
  };

  // Wait until both authentication state and first launch state are determined
  if (isAuthenticated === null || (isAuthenticated === false && isFirstLaunch === null)) {
    return null;
  }

  // If the user is authenticated, don't render the splash screen (already navigated)
  if (isAuthenticated) {
    return null;
  }

  // If it's not the first launch and the user is not authenticated, navigate to login/signup
  if (!isFirstLaunch) {
    return null;
  }

  // Show the splash screen for the first launch if the user is not authenticated
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/Splash.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>DeepDetect</Text>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>Let's Go</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09011E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '80%',
    height: '60%',
  },
  title: {
    fontSize: 40,
    fontFamily: 'Trispace-Bold',
    color: '#FFFFFF',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#1C0742',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#6266A3',
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Trispace-Medium',
    color: '#FFFFFF',
  },
});