import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
    navigation.navigate('WebAuth', { mode: 'register' });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#00d4ff" />
          <Text style={styles.backButtonText}>Назад</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Регистрация</Text>
        <Text style={styles.subtitle}>Создайте аккаунт в FastBot</Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Ionicons name="person" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Имя пользователя"
              placeholderTextColor="#999"
              value={username}
              onChangeText={setUsername}
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Ionicons name="mail" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Ionicons name="lock-closed" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Пароль"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Ionicons name="lock-closed" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Подтвердите пароль"
              placeholderTextColor="#999"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              editable={!loading}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Зарегистрироваться</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Login')} disabled={loading}>
          <Text style={styles.link}>Уже есть аккаунт? Войти</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('WebAuth', { mode: 'register' })} disabled={loading}>
          <Text style={styles.link}>Зарегистрироваться через сайт</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    padding: 8,
  },
  backButtonText: {
    color: '#00d4ff',
    fontSize: 16,
    marginLeft: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00d4ff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 40,
  },
  form: {
    marginBottom: 20,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  inputIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  input: {
    backgroundColor: '#0f0f1e',
    borderRadius: 8,
    padding: 12,
    paddingLeft: 40,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#333',
    flex: 1,
  },
  button: {
    backgroundColor: '#00d4ff',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  link: {
    color: '#00d4ff',
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginTop: 16,
  },
});

export default RegisterScreen;
