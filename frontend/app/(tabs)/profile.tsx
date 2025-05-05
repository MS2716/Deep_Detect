import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text } from '../_layout';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../config/firebase';
import { router } from 'expo-router';

export default function Profile() {
  const user = auth.currentUser;
  const userName = user?.email?.split('@')[0] || 'User'; // Extract username from email
  const email = user?.email || 'user@example.com';

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.replace('/loginSignup');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>PROFILE</Text>
      <Image
          source={require('../../assets/images/profileicon.png')} // Replace with your user icon image
          style={{marginBottom: 10 , marginTop: 10}}
          resizeMode="contain"
        />
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <View style={styles.labelRow}>
            <Ionicons name="person-outline" size={24} color="#A0A0A0" />
            <Text style={styles.infoLabel}>USERNAME</Text>
          </View>
          <Text style={styles.infoValue}>{userName.toUpperCase()}</Text>
        </View>
        <View style={styles.infoItem}>
          <View style={styles.labelRow}>
            <Ionicons name="mail-outline" size={24} color="#A0A0A0" />
            <Text style={styles.infoLabel}>EMAIL</Text>
          </View>
          <Text style={styles.infoValue}>{email}</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
        <Text style={styles.logoutText}>LOGOUT</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09011E',
    padding: 20,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Trispace-Bold',
    color: '#FFFFFF',
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: '#1A1332',
    width: '100%',
    textAlign: 'center',
    height: 81,
    lineHeight: 81, // Center text vertically
  },
  profileIcon: {
    marginBottom: 20,
  },
  infoContainer: {
    width: '100%',
    
  },
  infoItem: {
    padding: 15,
    marginBottom: 10,
    borderWidth: 0,
    borderBottomWidth: 3,
    borderBottomColor: '#1A1332',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 16,
    fontFamily: 'Trispace-Regular',
    color: '#A0A0A0',
    marginLeft: 10,
  },
  infoValue: {
    fontSize: 22,
    fontFamily: 'Trispace-Medium',
    color: '#FFFFFF',
    paddingLeft: 34, // To align with the text above
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1332',
    padding: 15,
    borderRadius: 10,
    marginTop: 5,
    width: '100%',
    justifyContent: 'center',
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Trispace-Medium',
    marginLeft: 10,
  },
});