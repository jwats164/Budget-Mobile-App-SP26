import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { ref, get, getDatabase } from 'firebase/database';
import { UserContext } from './UserContext';

const screenWidth = Dimensions.get('window').width;

const GraphsScreen = () => {
  const { user } = useContext(UserContext); // Access the logged-in user's data
  const [data, setData] = useState({ incomes: [0], expenses: [0], categories: [] });
  const database = getDatabase();

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const userRef = ref(database, `users/${user.id}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const userData = snapshot.val();
        setData({
          incomes: [userData.income || 0],
          expenses: [userData.expenses || 0],
          categories: userData.categories || ['No Category'],
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const totalIncome = data.incomes.reduce((total, num) => total + num, 0);
  const totalExpenses = data.expenses.reduce((total, num) => total + num, 0);
  const totalSavings = totalIncome - totalExpenses;

  // Pie chart data including expenses and savings
  const pieData = [
    {
      name: 'Expenses',
      amount: totalExpenses,
      color: '#FF4500',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Savings',
      amount: totalSavings,
      color: '#32CD32',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
  ];

  const barData = {
    labels: ['Income', 'Spending', 'Savings'],
    datasets: [
      {
        data: [totalIncome, totalExpenses, totalSavings],
      },
    ],
  };

  function getRandomColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Income vs Expenses</Text>
      <PieChart
        data={pieData}
        width={screenWidth - 16}
        height={220}
        chartConfig={chartConfig}
        accessor="amount"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />

      <Text style={styles.header}>Income, Spending, and Savings</Text>
      <BarChart
        data={barData}
        width={screenWidth - 16}
        height={220}
        chartConfig={chartConfig}
        fromZero // Ensures the bar chart starts at zero
      />
    </ScrollView>
  );
};

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2,
  decimalPlaces: 2,
  barPercentage: 0.5,
  fromZero: true, // Ensures the bar graph starts at 0
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default GraphsScreen;
