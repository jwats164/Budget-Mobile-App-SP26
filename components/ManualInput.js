import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ref, update, get, getDatabase } from 'firebase/database';
import { UserContext } from './UserContext';
import CategoryDropdown from './CategoryDropdown';

const HomeScreen = () => {
  const [income, setIncome] = useState('');
  const [expense, setExpense] = useState('');
  const [category, setCategory] = useState(null);
  const [data, setData] = useState({ incomes: [0], expenses: [0], categories: [] });
  const { user } = useContext(UserContext);
  const database = getDatabase();

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const snapshot = await get(ref(database, `users/${user.id}`));
      if (snapshot.exists()) {
        const userData = snapshot.val();
        setData({
          incomes: [userData.income || 0],
          expenses: [userData.expenses || 0],
          categories: userData.categories || [],
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleAddIncome = async () => {
    if (income) {
      const newIncome = parseFloat(income);
      setData(prevData => ({
        ...prevData,
        incomes: [...prevData.incomes, newIncome],
      }));

      // Update Firebase
      await update(ref(database, `users/${user.id}`), {
        income: getTotal(data.incomes) + newIncome,
        savings: getTotal(data.incomes) + newIncome - getTotal(data.expenses),
      });

      setIncome('');
    }
  };

  const handleAddExpense = async () => {
    if (expense && category) {
      const newExpense = parseFloat(expense);
      setData(prevData => ({
        ...prevData,
        expenses: [...prevData.expenses, newExpense],
        categories: [...prevData.categories, category],
      }));

      // Update Firebase
      await update(ref(database, `users/${user.id}`), {
        expenses: getTotal(data.expenses) + newExpense,
        savings: getTotal(data.incomes) - (getTotal(data.expenses) + newExpense),
      });

      setExpense('');
      setCategory(null);
    }
  };

  const getTotal = (arr) => arr.reduce((total, num) => total + num, 0);

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Funds</Text>
      </View>

      <TextInput
        placeholder="Enter Monthly Income Amount"
        keyboardType="numeric"
        value={income}
        onChangeText={setIncome}
        style={styles.input}
      />
      <TouchableOpacity onPress={handleAddIncome} style={styles.button}>
        <Text style={styles.buttonText}>Add Income</Text>
      </TouchableOpacity>

      <TextInput
        placeholder="Enter Monthly Expense Amount"
        keyboardType="numeric"
        value={expense}
        onChangeText={setExpense}
        style={styles.input}
      />

      <CategoryDropdown category={category} setCategory={setCategory} />

      <TouchableOpacity onPress={handleAddExpense} style={styles.button}>
        <Text style={styles.buttonText}>Add Expense</Text>
      </TouchableOpacity>

      {/* Updated to display dynamic data from Firebase */}
      <Text style={styles.summary}>Total Income: ${getTotal(data.incomes)}</Text>
      <Text style={styles.summary}>Total Expenses: ${getTotal(data.expenses)}</Text>
      <Text style={styles.summary}>Savings: ${getTotal(data.incomes) - getTotal(data.expenses)}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 20,
    borderRadius: 5,
  },
  summary: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default HomeScreen;
