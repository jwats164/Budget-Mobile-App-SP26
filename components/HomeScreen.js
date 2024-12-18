import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from './UserContext'; // Import UserContext

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user } = useContext(UserContext); // Access the logged-in user

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Welcome, {user?.username || 'Guest'}!</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.settingsButton}>
          <Image
            source={require('../assets/SettingsIcon.png')} // Ensure the path is correct
            style={styles.settingsIcon}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        onPress={() => navigation.navigate('Manual')} 
        style={styles.button}
      >
        <Text style={styles.buttonText}>Enter Manual Values</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => navigation.navigate('Graphs')} 
        style={styles.button}
      >
        <Text style={styles.buttonText}>View Graphs</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  settingsButton: {
    padding: 10,
  },
  settingsIcon: {
    width: 24,
    height: 24,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
