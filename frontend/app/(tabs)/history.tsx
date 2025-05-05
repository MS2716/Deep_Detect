import { View, TouchableOpacity, FlatList, StyleSheet, Image, ActivityIndicator, Text as RNText } from 'react-native';
import { Text } from '../_layout';
import { useState, useEffect } from 'react';
import { Video } from 'expo-av';
import { auth } from '../config/firebase';

export default function History() {
  const [historyData, setHistoryData] = useState([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const user = auth.currentUser;
  const userName = user?.email?.split('@')[0] || 'User';

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('http://192.168.0.102:8000/media/');
        const json = await response.json();
        setHistoryData(json);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (selectedItem) {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Image
            source={require('../../assets/images/user.png')}
            style={styles.userIcon}
            resizeMode="contain"
          />
          <Text style={styles.greetingText}>Hi! {userName}</Text>
        </View>

        <TouchableOpacity style={styles.backButton} onPress={() => setSelectedItem(null)}>
          <Image source={require('../../assets/images/arrow_left.png')} style={{height: 15, width: 15, marginRight: 10}} resizeMode="contain" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.videoContainer}>
        <Video
          source={{ uri: selectedItem.file }}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode="contain"
          shouldPlay
          style={styles.videoPlayer}
        />
        </View>

        <View style={styles.detailContainer}>
  <Text style={styles.resultHeading}>Result</Text>

  <Text style={styles.historyName}>ID:</Text>
  <Text style={styles.historyConclusion}>{selectedItem.id}</Text>

  <Text style={styles.historyName}>Filename:</Text>
  <Text style={styles.historyConclusion}>{selectedItem.file.split('/').pop()}</Text>

  <Text style={styles.historyName}>Status:</Text>
  <Text style={styles.historyConclusion}>
    {selectedItem.is_fake === null ? 'Processing...' : selectedItem.is_fake ? 'Fake' : 'Real'}
  </Text>

  <Text style={styles.historyName}>Uploaded At:</Text>
  <Text style={styles.historyConclusion}>
    {new Date(selectedItem.uploaded_at).toLocaleString()}
  </Text>
</View>

      </View>
    );
  }

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.historyItem} onPress={() => setSelectedItem(item)}>
      <Image
        source={require('../../assets/images/Face_Time.png')}
        style={{ width: 70, height: 70 }}
        resizeMode="contain"
      />
      <View style={styles.historyTextContainer}>
        <Text style={styles.historyName}>File: {item.file.split('/').pop()}</Text>
        <Text style={styles.historyConclusion}>
          {item.is_fake === null ? 'Processing...' : item.is_fake ? 'Fake' : 'Real'}
        </Text>
      </View>
      <Image
        source={require('../../assets/images/Go_Next_Animated_3D.png')}
        style={{ width: 50, height: 34 }}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          source={require('../../assets/images/user.png')}
          style={styles.userIcon}
          resizeMode="contain"
        />
        <Text style={styles.greetingText}>Hi! {userName}</Text>
      </View>

      <Text style={styles.sectionTitle}>History</Text>

      <View style={styles.listWrapper}>
        <FlatList
          data={historyData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09011E',
    padding: 20,
    paddingBottom: 100, // Add extra padding for tab bar
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#09011E',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1332',
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
  },
  listWrapper: {
    flex: 1,
    marginBottom: 20,
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: 0, // Add padding to ensure last items are visible
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1332',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    height: 85,
  },
  historyTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  historyName: {
    fontSize: 18,
    fontFamily: 'Trispace-Medium',
    color: '#FFFFFF',
  },
  historyConclusion: {
    fontSize: 16,
    fontFamily: 'Trispace-Regular',
    color: '#A0A0A0',
  },
  videoPlayer: {
    width: '100%',
    height: 200,
  },
  videoContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#1A1332',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
    marginTop: -5,
  },
  detailContainer: {
    backgroundColor: '#1A1332',
    borderRadius: 15,
    padding: 20,
    paddingTop: 10,
    alignItems: 'flex-start',
    marginTop: -5,
  },
  backButton: {
    backgroundColor: '#1A1332', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 20, marginBottom: 20, flexDirection: 'row', alignItems: 'center',marginTop: -5
  },
  backButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Trispace-Bold',
    fontSize: 18,
  },
  resultHeading: {
  fontSize: 22,
  fontFamily: 'Trispace-Bold',
  color: '#FFFFFF',
  alignSelf: 'center',
  marginBottom: 5,
},

});
