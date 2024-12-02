import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { ref, update, getDatabase } from 'firebase/database';
import { UserContext } from './UserContext';
import { useNavigation } from '@react-navigation/native';

const UpdateInfo = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, setUser } = useContext(UserContext); // Access current user and update function
  const database = getDatabase();
  const nav = useNavigation(); 

  const handleUpdate = async () => {
    try {
      if (password.length < 7) {
        alert('Password must be at least 7 characters long.');
        return;
      }

      // Reference to the current user's data in the database
      const userRef = ref(database, `users/${user.id}`);

      // Update the user's email and password
      await update(userRef, {
        email: email || user.email, // Retain the old value if no new value is provided
        password: password || user.password, // Retain the old value if no new value is provided
      });

      // Update the user context with the new values
      setUser({ ...user, email: email || user.email, password: password || user.password });
      nav.navigate('Login');

      alert('Information updated successfully!');
    } catch (error) {
      console.error('Error updating information:', error);
      alert('An error occurred while updating your information.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Update Information</Text>

      <TextInput
        placeholder="New Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="New Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <Button title="Update Information" onPress={handleUpdate} color="#2196F3" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 20,
    borderRadius: 5,
  },
});

export default UpdateInfo;
