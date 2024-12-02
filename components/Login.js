import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { ref, get, getDatabase } from 'firebase/database';
import { UserContext } from './UserContext'; // Import the context

const Login = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const database = getDatabase();
  const { setUser } = useContext(UserContext); // Access context to save user

  const handleLogin = async () => {
    try {
      const usersRef = ref(database, 'users');
      const snapshot = await get(usersRef);

      if (snapshot.exists()) {
        const users = snapshot.val();
        let loggedInUser = null;

        // Search for a matching username and password
        for (const userId in users) {
          const user = users[userId];
          if (user.username === username && user.password === password) {
            loggedInUser = { id: userId, ...user };
            break;
          }
        }

        if (loggedInUser) {
          setUser(loggedInUser); // Save user to context
          alert('Login successful!');
          navigation.navigate('Home'); // Navigate to Home screen
        } else {
          alert('Invalid username or password');
        }
      } else {
        alert('No users found in the database');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('An error occurred during login.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Login Page</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      <Button title="Log In" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
});

export default Login;
