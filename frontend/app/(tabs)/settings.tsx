import { View, TouchableOpacity, Switch, StyleSheet, Image } from 'react-native';
import { Text } from '../_layout';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { auth } from '../config/firebase';

export default function Settings() {
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const [isSwitchModesEnabled, setIsSwitchModesEnabled] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const user = auth.currentUser;
  const userName = user?.email?.split('@')[0] || 'User';

  const togglePrivacyPolicy = () => {
    setShowPrivacyPolicy(!showPrivacyPolicy);
  };

  if (showPrivacyPolicy) {
    return (
      <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          source={require('../../assets/images/user.png')} // Replace with your user icon image
          style={styles.userIcon}
          resizeMode="contain"
        />
        <Text style={styles.greetingText}>Hi! {userName}</Text>
      </View>
        <TouchableOpacity style={styles.backButton} onPress={togglePrivacyPolicy}>
          <Image 
            source={require('../../assets/images/arrow_left.png')} 
            style={{ height: 15, width: 15, marginRight: 10 }} 
            resizeMode="contain" 
          />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.resultBox}>
          <Text style={{textAlign: 'center',fontSize: 24, fontFamily: 'Trispace-Bold', color: '#FFFFFF', marginBottom: 20,}}>Privacy Policy</Text>
          <Text style={styles.resultText}>
            This is our privacy policy. We take your privacy seriously and are committed to protecting your personal information.{'\n\n'}
            Your data is secure with us and we do not share it with third parties.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          source={require('../../assets/images/user.png')} // Replace with your user icon image
          style={styles.userIcon}
          resizeMode="contain"
        />
        <Text style={styles.greetingText}>Hi! {userName}</Text>
      </View>
      <Text style={styles.sectionTitle}>Settings</Text>
      <View style={[styles.settingsItem, { paddingTop: 10 }]}>
        <Image
          source={require('../../assets/images/notification.png')} // Replace with your upload icon image
          style={{ width: 34, height: 34 }}
          resizeMode="contain"
        />
        <Text style={styles.settingsText}>Notification</Text>
        <TouchableOpacity onPress={() => setIsNotificationEnabled(!isNotificationEnabled)}>
          <MaterialCommunityIcons 
            name={isNotificationEnabled ? "toggle-switch" : "toggle-switch-off"}
            size={60}
            color={isNotificationEnabled ? '#FFFFFF' : '#FFFFFF'} 
          />
        </TouchableOpacity>
      </View>
      <View style={[styles.settingsItem, { paddingTop: 8 }]}>
        <Ionicons name="sunny-outline" size={34} color="#3A334E" />
        <Text style={styles.settingsText}>Switch Modes</Text>
        <TouchableOpacity onPress={() => setIsSwitchModesEnabled(!isSwitchModesEnabled)}>
          <MaterialCommunityIcons 
            name={isSwitchModesEnabled ? "toggle-switch" : "toggle-switch-off"}
            size={60}
            color={isSwitchModesEnabled ? '#FFFFFF' : '#FFFFFF'} 
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity 
        style={[styles.settingsItem, { paddingBottom: 25 }]}
        onPress={togglePrivacyPolicy}
      >
        <Ionicons name="document-text-outline" size={34} color="#3A334E" />
        <Text style={styles.settingsText}>Privacy Policy</Text>
        <Image
          source={require('../../assets/images/arrow.png')}
          style={{ width: 20, height: 20 }}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09011E',
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1332', // Dark container background
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    height: 81,
  },
  userIcon: {
    width: 50,
    height: 50,
  },
  greetingText: {
    fontSize: 28,
    fontFamily: 'Trispace-Bold',
    color: '#FFFFFF',
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Trispace-Bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'left',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#1A1332',
    borderBottomWidth: 1,
    padding: 15,
    borderWidth: 0,
    marginBottom: 10,
  },
  settingsText: {
    flex: 1,
    fontSize: 20,
    fontFamily: 'Trispace-Regular',
    color: '#FFFFFF',
    marginLeft: 10,
  },
  backButton: {
    backgroundColor: '#1A1332', 
    borderRadius: 10, 
    paddingVertical: 12, 
    paddingHorizontal: 20, 
    marginBottom: 20, 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: -5
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Trispace-Regular',
  },
  resultBox: {
    backgroundColor: '#1A1332',
    borderRadius: 10,
    padding: 20,
  },
  resultText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Trispace-Regular',
    lineHeight: 24,
    textAlign: 'center',
  },
});