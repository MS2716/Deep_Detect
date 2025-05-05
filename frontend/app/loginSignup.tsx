import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Text } from './_layout';
import { auth } from './config/firebase'; // Import the shared auth instance
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, User } from 'firebase/auth';

interface AuthScreenProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  isLogin: boolean;
  setIsLogin: (isLogin: boolean) => void;
  handleAuthentication: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ email, setEmail, password, setPassword, isLogin, setIsLogin, handleAuthentication }) => {
  return (
    <>
      <Text style={styles.welcomeText}>Welcome!</Text>
      <Text style={styles.subtitle}>Let's get you started</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor="#A0A0A0"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="password"
          placeholderTextColor="#A0A0A0"
          secureTextEntry
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleAuthentication} style={styles.button}>
            <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Sign Up'}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <Text style={styles.toggleText}>
          {isLogin ? (
            <>
              <Text style={styles.whiteText}>Don't have an account? </Text>
              <Text style={styles.blueText} onPress={() => setIsLogin(!isLogin)}>
                Sign Up
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.whiteText}>Already have an account? </Text>
              <Text style={styles.blueText} onPress={() => setIsLogin(!isLogin)}>
                Login
              </Text>
            </>
          )}
        </Text>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </View>
    </>
  );
};

interface AuthenticatedScreenProps {
  user: { email: string | null };
  handleAuthentication: () => void;
}

const AuthenticatedScreen: React.FC<AuthenticatedScreenProps> = ({ user, handleAuthentication }) => {
  return (
    <>
      <Text style={styles.welcomeText}>Welcome!</Text>
      <Text style={styles.subtitle}>Let's get you started</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.emailText}>{user.email}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleAuthentication} style={styles.button}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default function LoginSignup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<null | User>(null);
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        router.replace('/(tabs)');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleAuthentication = async () => {
    try {
      if (user) {
        await signOut(auth);
        console.log('User logged out successfully!');
      } else {
        if (isLogin) {
          await signInWithEmailAndPassword(auth, email, password);
          console.log('User signed in successfully!');
        } else {
          await createUserWithEmailAndPassword(auth, email, password);
          console.log('User created successfully!');
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Authentication error:', error.message);
      } else {
        console.error('Authentication error:', error);
      }
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={require('../assets/images/LOGO.png')}
          style={styles.neonImage}
          resizeMode="contain"
        />
        {user ? (
          <AuthenticatedScreen user={user} handleAuthentication={handleAuthentication} />
        ) : (
          <AuthScreen
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            isLogin={isLogin}
            setIsLogin={setIsLogin}
            handleAuthentication={handleAuthentication}
          />
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#09011E',
  },
  neonImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 36,
    fontFamily: 'Trispace-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Trispace-Light',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    width: '95%',
    backgroundColor: 'rgba(42, 42, 74, 0.4)',
    borderRadius: 10,
    padding: 30,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#2A2A4A',
    color: '#FFFFFF',
    borderWidth: 0,
    marginBottom: 16,
    padding: 18,
    borderRadius: 8,
    fontFamily: 'Trispace-Regular',
  },
  buttonContainer: {
    width: '60%',
    alignSelf: 'center', // Center the button within the inputContainer
  },
  button: {
    backgroundColor: '#4B39EF',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    minHeight: 10,
    marginTop: 5,
  },
  buttonText: {
    fontFamily: 'Trispace-Bold',
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 3,
  },
  bottomContainer: {
    marginTop: 20,
  },
  toggleText: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 18,
  },
  whiteText: {
    color: '#FFFFFF',
  },
  blueText: {
    color: '#4B39EF',
  },
  forgotPasswordText: {
    color: '#4B39EF',
    textAlign: 'center',
    fontSize: 18,
  },
  emailText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
});