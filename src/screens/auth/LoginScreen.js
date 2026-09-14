import React, { useState, useContext } from 'react';
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
import AuthContext from '../../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
      return;
    }

    setLoading(true);
    const result = await signIn(username, password);
    setLoading(false);

    if (!result.success) {
      Alert.alert('Ошибка входа', result.error || 'Произошла неизвестная ошибка');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>FastBot</Text>
        <Text style={styles.subtitle}>Бот для VKSerfing</Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Ionicons name="person" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Имя пользователя или Email"
              placeholderTextColor="#999"
              value={username}
              onChangeText={setUsername}
              editable={!loading}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Ionicons name="lock-closed" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Пароль"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              editable={!loading}
            />
            <TouchableOpacity 
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons 
                name={showPassword ? 'eye-off' : 'eye'} 
                size={20} 
                color="#666" 
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Войти</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.forgotButton}
            onPress={() => Alert.alert('Восстановление пароля', 'Обратитесь в поддержку VKSerfing')}
          >
            <Text style={styles.forgotText}>Забыли пароль?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <TouchableOpacity onPress={() => navigation.navigate('Register')} disabled={loading}>
          <Text style={styles.link}>Нет аккаунта? Зарегистрироваться</Text>
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
    marginBottom: 16,
  },
  inputIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
  },
  input: {
    backgroundColor: '#0f0f1e',
    borderRadius: 8,
    padding: 12,
    paddingLeft: 40,
    paddingRight: 40,
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
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  forgotButton: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  forgotText: {
    color: '#00d4ff',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 20,
    width: '80%',
    alignSelf: 'center',
  },
  link: {
    color: '#00d4ff',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
