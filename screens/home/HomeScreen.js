import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>FAST BOT</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Баланс:</Text>
        <Text style={styles.value}>0.00 ₽</Text>
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
  value: { fontSize: 26, fontWeight: "bold" },
  button: { backgroundColor: "#007AFF", padding: 15, borderRadius: 10 },
  buttonText: { color: "#fff", textAlign: "center", fontSize: 18 }
});
