import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import * as SecureStore from "expo-secure-store";
import { setToken } from "../../api/vkserfingApi";

export default function LoginScreen({ navigation }) {
  const [token, setTokenInput] = useState("");
  const [loading, setLoading] = useState(true);

  // Автоматический вход, если токен сохранён
  useEffect(() => {
    async function checkSavedToken() {
      const saved = await SecureStore.getItemAsync("token");
      if (saved) {
        setToken(saved);
        navigation.replace("Main");
      } else {
        setLoading(false);
      }
    }
    checkSavedToken();
  }, []);

  const handleLogin = async () => {
    if (token.length < 5) return;

    await SecureStore.setItemAsync("token", token);
    setToken(token);

    navigation.replace("Main");
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FAST BOT</Text>

      <TextInput
        style={styles.input}
        placeholder="Введите токен"
        value={token}
        onChangeText={setTokenInput}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Войти</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}>Регистрация</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 32, fontWeight: "bold", textAlign: "center", marginBottom: 40 },
  input: { borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 20 },
  button: { backgroundColor: "#007AFF", padding: 15, borderRadius: 10 },
  buttonText: { color: "#fff", textAlign: "center", fontSize: 18 },
  link: { marginTop: 20, textAlign: "center", color: "#007AFF" }
});
