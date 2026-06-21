import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { getBalance } from "../../api/vkserfingApi";
import { startAutoWorker, stopAutoWorker } from "../../services/autoWorker";

export default function HomeScreen() {
  const [balance, setBalance] = useState(null);
  const [status, setStatus] = useState("Ожидание");
  const [running, setRunning] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getBalance();
      setBalance(data.balance ?? 0);
    }
    load();
  }, []);

  const toggleAuto = () => {
    if (running) {
      stopAutoWorker();
      setRunning(false);
      setStatus("Остановлено");
    } else {
      setRunning(true);
      startAutoWorker(setStatus);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FAST BOT</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Баланс:</Text>
        <Text style={styles.value}>
          {balance === null ? "..." : `${balance} ₽`}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Статус:</Text>
        <Text style={styles.value}>{status}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={toggleAuto}>
        <Text style={styles.buttonText}>
          {running ? "Остановить" : "Автовыполнение"}
        </Text>
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
  value: { fontSize: 22, fontWeight: "bold" },
  button: { backgroundColor: "#007AFF", padding: 15, borderRadius: 10 },
  buttonText: { color: "#fff", textAlign: "center", fontSize: 18 }
});
