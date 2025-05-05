import { Tabs } from 'expo-router';
import { Image, View, StyleSheet } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4B39EF',
        tabBarInactiveTintColor: '#FFFFFF',
        tabBarStyle: {
          backgroundColor: '#1A1332', // Semi-transparent dark background
          borderTopWidth: 0,
          borderRadius: 10, // Rounded corners
          position: 'absolute', // Elevate the tab bar
          bottom: 20, // Space from the bottom
          left: 20, // Space from the left
          right: 20, // Space from the right
          height: 81, // Height of the tab bar
          paddingBottom: 10, // Adjust padding for label positioning
          paddingTop: 13, // Adjust padding for icon positioning
          elevation: 5, // Shadow for Android
          shadowColor: '#000', // Shadow for iOS
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          marginLeft: 20, // Space from the left
          marginRight: 20, // Space from the right
        },
        tabBarLabelStyle: {
          fontFamily: 'Trispace-Regular',
          fontSize: 12,
          marginBottom: 5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../../assets/images/home.png')} // Replace with your Home icon image
              style={[
                styles.tabIcon,
                { tintColor: focused ? '#4B39EF' : '#FFFFFF' },
              ]}
              resizeMode="contain"
            />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          tabBarLabel: 'History',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../../assets/images/history.png')} // Replace with your History icon image
              style={[
                styles.tabIcon,
                { tintColor: focused ? '#4B39EF' : '#FFFFFF' },
              ]}
              resizeMode="contain"
            />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../../assets/images/settings.png')} // Replace with your Settings icon image
              style={[
                styles.tabIcon,
                { tintColor: focused ? '#4B39EF' : '#FFFFFF' },
              ]}
              resizeMode="contain"
            />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../../assets/images/profile.png')} // Replace with your Profile icon image
              style={[
                styles.tabIcon,
                { tintColor: focused ? '#4B39EF' : '#FFFFFF' },
              ]}
              resizeMode="contain"
            />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    width: 24,
    height: 24,
  },
});