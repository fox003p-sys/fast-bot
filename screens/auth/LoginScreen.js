import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function LoginScreen({ navigation }) {
  const [token, setToken] = useState("");

  const handleLogin = () => {
    if (token.length > 5) {
      navigation.replace("Main");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FAST BOT</Text>

      <TextInput
        style={styles.input}
        placeholder="Введите токен"
        value={token}
        onChangeText={setToken}
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
