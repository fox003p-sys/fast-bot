# 🚀 **Руководство по сборке и запуску FastBot**

**Версия**: 1.0.0  
**Последнее обновление**: 2025-01-15  
**Expo SDK**: 57.0.9  
**Статус**: ✅ **Все проверки пройдены (21/21)**

---

## 📋 **Содержание**

1. [🔧 Подготовка окружения](#1-подготовка-окружения)
2. [⚡ Быстрый запуск (Expo Go)](#2-быстрый-запуск-expo-go)
3. [📱 Запуск на Android](#3-запуск-на-android)
4. [🍎 Запуск на iOS](#4-запуск-на-ios)
5. [🏗️ Сборка для разработки (Development Build)](#5-сборка-для-разработки-development-build)
6. [📦 Сборка для продакшена (Production Build)](#6-сборка-для-продакшена-production-build)
7. [⚙️ Настройка переменных окружения](#7-настройка-переменных-окружения)
8. [🔍 Устранение неполадок](#8-устранение-неполадок)
9. [📊 Проверка анти-детекта](#9-проверка-анти-детекта)

---

## 1. 🔧 Подготовка окружения

### Требования

| Инструмент | Версия | Ссылка |
|-----------|--------|--------|
| **Node.js** | 18.x или 20.x | [Скачать](https://nodejs.org/) |
| **npm** | 9.x или выше | Входит в Node.js |
| **Expo CLI** | Последняя | `npm install -g expo-cli` |
| **Git** | Последняя | [Скачать](https://git-scm.com/) |
| **Android Studio** | Для Android | [Скачать](https://developer.android.com/studio) |
| **Xcode** | Для iOS (Mac) | App Store |

### Установка зависимостей

```bash
# Клонировать репозиторий (если не клонирован)
git clone https://github.com/fox003p-sys/fast-bot.git
cd fast-bot

# Установить все зависимости
npm install

# Проверить конфигурацию
npx expo-doctor
```

✅ **Ожидаемый результат**: `21/21 checks passed. No issues detected!`

---

## 2. ⚡ Быстрый запуск (Expo Go)

**Самый быстрый способ протестировать приложение**

### Шаг 1: Запустить сервер разработки

```bash
# Запустить с очисткой кэша
npx expo start --clear

# Или на конкретном порту (если 19000 занят)
npx expo start --clear --port 19001
```

### Шаг 2: Открыть в Expo Go

1. **Установите Expo Go** на ваше устройство:
   - [Android (Google Play)](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [iOS (App Store)](https://apps.apple.com/app/expo-go/id982107779)

2. **Откройте Expo Go** на телефоне

3. **Сканьте QR-код** в терминале или введите URL вручную

4. **Готово!** 🎉 Приложение запустится на вашем устройстве

### Альтернатива: Web версия

```bash
# Запустить в браузере
npx expo start --web
```

Откройте [http://localhost:19006](http://localhost:19006) в браузере

---

## 3. 📱 Запуск на Android

### Вариант A: Через Expo Go (рекомендуется для тестирования)

```bash
# Запустить на Android через Expo Go
npx expo start --android
```

### Вариант B: Нативная сборка

```bash
# Убедитесь, что Android Studio установлен и настроен
npx expo run:android
```

#### Требования для нативной сборки:
- Android Studio установлен
- Android SDK (API 34)
- Android Emulator или физическое устройство с USB Debugging

#### Настройка эмулятора:

```bash
# Создать эмулятор (если не существует)
android create avd -n Pixel_5_API_34 -t "android-34" --device "pixel_5"

# Запустить эмулятор
emulator -avd Pixel_5_API_34 &

# Запустить приложение
npx expo run:android
```

### Вариант C: На физическое устройство

1. Включите **USB Debugging** на телефоне
2. Подключите телефон через USB
3. Выполните:

```bash
# Проверить, что устройство обнаружено
adb devices

# Запустить приложение
npx expo run:android
```

---

## 4. 🍎 Запуск на iOS

**Только для Mac**

### Вариант A: Через Expo Go (рекомендуется)

```bash
npx expo start --ios
```

### Вариант B: Нативная сборка (Simulator)

```bash
# Убедитесь, что Xcode установлен
npx expo run:ios
```

#### Требования:
- Mac с macOS 12+ 
- Xcode 14.3+
- Command Line Tools установлены

#### Настройка симулятора:

```bash
# Установить необходимые инструменты
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
sudo xcodebuild -runFirstLaunch

# Создать симулятор (через Xcode или)
xcrun simctl list devices  # Посмотреть доступные
xcrun simctl create "iPhone 15" "iPhone 15" "iOS 17.2"

# Запустить приложение
npx expo run:ios --simulator "iPhone 15"
```

### Вариант C: На физическое устройство

1. Подключите iPhone через USB
2. Включите **Developer Mode** в настройках iPhone
3. Выполните:

```bash
npx expo run:ios --device
```

---

## 5. 🏗️ Сборка для разработки (Development Build)

**Для тестирования с нативным кодом (например, если нужно использовать native modules)**

### Шаг 1: Установить EAS CLI

```bash
npm install -g eas-cli
```

### Шаг 2: Авторизоваться в Expo

```bash
npx eas login
```

### Шаг 3: Создать development build

```bash
# Для Android
npx eas build --profile development --platform android

# Для iOS
npx eas build --profile development --platform ios

# Для обеих платформ
npx eas build --profile development --platform all
```

### Шаг 4: Установить сборку

После завершения сборки (обычно 10-30 минут):

```bash
# Для Android - скачать APK
npx eas build:download --platform android

# Установить на устройство
adb install fast-bot-development.apk

# Для iOS - скачать IPA
npx eas build:download --platform ios
```

### Шаг 5: Запустить development сервер

```bash
npx expo start --dev-client
```

---

## 6. 📦 Сборка для продакшена (Production Build)

**Для публикации в App Store / Google Play**

### Шаг 1: Настроить EAS

```bash
# Инициализировать EAS (если не настроен)
npx eas build:init
```

Ответьте на вопросы:
- **Project name**: FastBot
- **Which platforms**: android, ios
- **Profile**: production

### Шаг 2: Настроить credentials

```bash
# Настроить учетные данные для Android
npx eas credentials:android

# Настроить учетные данные для iOS
npx eas credentials:ios
```

Следуйте инструкциям для настройки:
- **Android**: Keystore, Google Play Console
- **iOS**: Apple Developer Account, App Store Connect

### Шаг 3: Собрать приложение

```bash
# Для Android
npx eas build --profile production --platform android

# Для iOS
npx eas build --profile production --platform ios

# Для обеих платформ
npx eas build --profile production --platform all
```

### Шаг 4: Загрузить в магазины

```bash
# Для Google Play
npx eas submit --platform android

# Для App Store
npx eas submit --platform ios
```

---

## 7. ⚙️ Настройка переменных окружения

### Создать файл .env

```bash
cp .env.example .env
```

### Редактировать .env

```env
# VKSerfing API
API_BASE_URL=https://vkserfing.com/api

# Настройки разработки
NODE_ENV=development

# Для отладки
REACT_NATIVE_PACKAGER_HOSTNAME=localhost
```

### Переменные для продакшена

```env
API_BASE_URL=https://vkserfing.com/api
NODE_ENV=production
```

---

## 8. 🔍 Устранение неполадок

### 🔴 Ошибка: Port already in use

```bash
# Найти и убить процесс, использующий порт
lsof -i :19000
kill -9 <PID>

# Или запустить на другом порту
npx expo start --port 19001
```

### 🔴 Ошибка: Unable to resolve module

```bash
# Очистить кэш Metro
npx expo start --clear

# Удалить node_modules и переустановить
rm -rf node_modules package-lock.json
npm install
```

### 🔴 Ошибка: No Android device found

```bash
# Проверить подключенные устройства
adb devices

# Запустить эмулятор
emulator -avd <AVD_NAME> &
```

### 🔴 Ошибка: iOS Simulator not available

```bash
# Убедитесь, что Xcode установлен
xcode-select --install

# Открыть Xcode и принять лицензию
sudo xcodebuild -license accept
```

### 🔴 Ошибка: Hermes V1 regression

```bash
# Мы уже обновили до SDK 57, но если что:
npx expo install expo@^57.0.9 --fix
```

### 🔴 Ошибка: Missing peer dependency

```bash
npm install --legacy-peer-deps
```

### 🔴 Приложение не запускается в Expo Go

```bash
# Проверить expo-doctor
npx expo-doctor

# Обновить Expo CLI
npm install -g expo-cli

# Очистить кэш
npx expo start --clear
```

### 🟡 Предупреждение: Remote debugging is in a background tab

Это нормально. Чтобы убрать:
```bash
# Запустить без отладки
npx expo start --no-dev
```

---

## 9. 📊 Проверка анти-детекта

После запуска приложения **обязательно проверьте работу анти-детекта**:

### Проверка в консоли

```javascript
// В любом компоненте или через expo-dev-client
import { 
  getHumanFingerprint, 
  generateHumanComment,
  humanDelay 
} from './src/utils/antiDetection';

// Пример проверки
console.log('Fingerprint:', getHumanFingerprint());
console.log('Comment:', generateHumanComment());
```

### Проверка заголовков API

Все запросы к API автоматически получают:
- Случайный User-Agent
- Случайный Accept-Language (включая ru-RU)
- DNT заголовок
- Connection: keep-alive

### Проверка задержек

В BotScreen все действия выполняются с человекоподобными задержками:
- Задержки между действиями: 500-3000мс
- Время чтения: зависит от длины текста
- Время принятия решения: 500-3000мс
- Время реакции: 100-400мс

---

## 📝 Чек-лист перед сборкой

- [ ] ✅ `npx expo-doctor` проходит все проверки
- [ ] ✅ Node.js 18+ установлен
- [ ] ✅ npm 9+ установлен
- [ ] ✅ Android Studio / Xcode настроены (для нативной сборки)
- [ ] ✅ Устройство подключено или эмулятор запущен
- [ ] ✅ Файл .env настроен
- [ ] ✅ Все зависимости установлены (`npm install`)
- [ ] ✅ Кэш очищен (`npx expo start --clear`)

---

## 🎯 Быстрые команды

| Действие | Команда |
|---------|---------|
| Запустить dev сервер | `npx expo start --clear` |
| Запустить на Android | `npx expo run:android` |
| Запустить на iOS | `npx expo run:ios` |
| Запустить в браузере | `npx expo start --web` |
| Проверить конфигурацию | `npx expo-doctor` |
| Очистить кэш | `npx expo start --clear` |
| Собрать dev build (Android) | `npx eas build --profile development --platform android` |
| Собрать prod build (Android) | `npx eas build --profile production --platform android` |

---

## 📚 Полезные ресурсы

- [Expo Documentation](https://docs.expo.dev/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [React Native Documentation](https://reactnative.dev/)
- [Troubleshooting Expo](https://docs.expo.dev/workflow/frequently-asked-questions/)

---

## 🚀 Готово!

Теперь вы можете:
1. ✅ **Быстро протестировать** через Expo Go
2. ✅ **Запустить на Android/iOS** эмуляторе или устройстве
3. ✅ **Собрать development build** для тестирования с нативным кодом
4. ✅ **Собрать production build** для публикации в магазинах

**Приложение полностью готово к сборке и запуску!** 🎉

---

## 💡 Советы

1. **Для быстрого тестирования** используйте Expo Go
2. **Для тестирования анти-детекта** запускайте на реальном устройстве
3. **Для production** используйте EAS Build
4. **Все настройки анти-детекта уже интегрированы** и будут работать автоматически

---

**Удачи с FastBot!** 🚀
