import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { Text as RNText, TextProps } from 'react-native';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Custom Text component to apply Trispace font globally
const Text: React.FC<TextProps> = ({ style, ...props }) => {
  return <RNText {...props} style={[style, { fontFamily: 'Trispace-Regular' }]} />;
};

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'Trispace-Regular': require('../assets/fonts/static/Trispace-Regular.ttf'),
    'Trispace-Bold': require('../assets/fonts/static/Trispace-Bold.ttf'),
    'Trispace-ExtraBold': require('../assets/fonts/static/Trispace-ExtraBold.ttf'),
    'Trispace-Light': require('../assets/fonts/static/Trispace-Light.ttf'),
    'Trispace-ExtraLight': require('../assets/fonts/static/Trispace-ExtraLight.ttf'),
    'Trispace-Medium': require('../assets/fonts/static/Trispace-Medium.ttf'),
    'Trispace-Thin': require('../assets/fonts/static/Trispace-Thin.ttf'),
    'Trispace-SemiBold': require('../assets/fonts/static/Trispace-SemiBold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide the splash screen once fonts are loaded or if there's an error
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    // Return null to keep the splash screen visible while fonts are loading
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false, // Hide headers globally (can be overridden per screen)
        contentStyle: { backgroundColor: '#09011E' }, // Set global background color
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="loginsignup" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

// Export the custom Text component to use throughout the app
export { Text };