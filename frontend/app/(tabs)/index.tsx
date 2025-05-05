import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
import { Text } from '../_layout';
import * as DocumentPicker from 'expo-document-picker';
import { auth } from '../config/firebase';
import config from '../config/config'; // your config file

export default function Home() {
  const user = auth.currentUser;
  const userName = user?.email?.split('@')[0] || 'User';
  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const pickMedia = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'video/*', 'audio/*'],
        copyToCacheDirectory: true,
      });

      if (result.assets && result.assets.length > 0) {
        setSelectedFile(result.assets[0]);
      }
    } catch (error) {
      console.log('Document Picker Error:', error);
    }
  };

  const submitFile = async () => {
    if (!selectedFile) {
      Alert.alert('No file selected', 'Please select a file to upload.');
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('file', {
      uri: selectedFile.uri,
      type: selectedFile.mimeType || 'application/octet-stream',
      name: selectedFile.name || 'upload'
    });

    try {
      const response = await fetch(config.API_URL, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        let detectionText = data.is_fake ? 'Deepfake_Detected' : 'Real_Content';
        // let accuracyText = data.accuracy ? data.accuracy : 'N/A';
        setResult(`ID: ${data.id}\n\nDetection: ${detectionText}`);
      } else {
        console.log('Error Response:', data);
        Alert.alert('Upload failed', 'Server rejected the file.');
      }
    } catch (error) {
      console.error('Upload Error:', error);
      Alert.alert('Network Error', 'Unable to connect to server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setSelectedFile(null);
    setResult(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image source={require('../../assets/images/user.png')} style={styles.userIcon} resizeMode="contain" />
        <Text style={styles.greetingText}>Hi! {userName}</Text>
      </View>

      {result ? (
        <>
          <TouchableOpacity style={styles.backButton} onPress={reset}>
            <Image source={require('../../assets/images/arrow_left.png')} style={{ height: 15, width: 15, marginRight: 10 }} resizeMode="contain" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <View style={styles.resultBox}>
            <Text style={styles.resultText}>{result}</Text>
          </View>
        </>
      ) : (
        <>
          <TouchableOpacity style={styles.uploadButton} onPress={pickMedia}>
            <Image source={require('../../assets/images/Upload.png')} style={styles.uploadIcon} resizeMode="contain" />
            <Text style={styles.uploadText}>
              {selectedFile ? selectedFile.name : 'Upload media'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.submitButton} onPress={submitFile} disabled={isSubmitting}>
            {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Submit</Text>}
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#09011E', padding: 20 },
  headerContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1332', borderRadius: 10, padding: 15, marginBottom: 40, height: 81 },
  userIcon: { width: 50, height: 50 },
  greetingText: { fontSize: 28, fontFamily: 'Trispace-Bold', color: '#FFFFFF', marginLeft: 10 },
  backButton: { backgroundColor: '#1A1332', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 20, marginBottom: 20, flexDirection: 'row', alignItems: 'center', marginTop: -20 },
  backIcon: { width: 15, height: 15, marginRight: 10 },
  backText: { color: '#FFFFFF', fontSize: 18 },
  uploadButton: { backgroundColor: '#1A1332', borderRadius: 30, width: 340, height: 230, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 20 },
  uploadIcon: { width: 90, height: 90 },
  uploadText: { fontSize: 22, fontFamily: 'Trispace-Regular', color: '#FFFFFF', marginTop: 20, textAlign: 'center' },
  submitButton: { backgroundColor: '#4B39EF', height: 46, paddingHorizontal: 40, borderRadius: 25, justifyContent: 'center', alignSelf: 'center' },
  submitText: { fontSize: 20, fontFamily: 'Trispace-Medium', color: '#FFFFFF', textAlign: 'center' },
  resultBox: { backgroundColor: '#1A1332', padding: 20, borderRadius: 20, width: '100%', alignSelf: 'center', height: 350 },
  resultText: { color: '#FFFFFF', fontSize: 18, textAlign: 'left' },
});
