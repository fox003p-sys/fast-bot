import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { getBalance } from "../../api/vkserfingApi"; // путь под твой проект

export default function HomeScreen() {
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getBalance();
        setBalance(data.balance ?? 0);
      } catch (e) {
        console.log("Ошибка загрузки баланса:", e);
        setBalance(0);
      }
    }

    load();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FAST BOT</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Баланс:</Text>
        <Text style={styles.value}>
          {balance === null ? "..." : `${balance} ₽`}
        </Text>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Начать выполнение заданий</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  card: {
    padding: 20,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    marginBottom: 20
  },
  label: { fontSize: 18 },
  value: { fontSize: 26, fontWeight
