/**
 * Anti-detection utilities for VK bot
 * These functions help make bot actions appear more human-like
 */

import * as Device from 'expo-device';
import * as Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Generate realistic human-like delays between actions
 * Uses exponential distribution to simulate natural human behavior
 */
export const humanDelay = (minMs = 500, maxMs = 3000) => {
  // Exponential distribution for more natural delays
  const lambda = 1 / ((minMs + maxMs) / 2);
  const exponentialDelay = -Math.log(1 - Math.random()) / lambda;
  
  // Add some randomness
  const randomFactor = 0.5 + Math.random();
  const delay = exponentialDelay * randomFactor;
  
  // Ensure delay is within bounds
  return Math.min(Math.max(delay, minMs), maxMs);
};

/**
 * Generate random mouse movement pattern
 * Simulates human cursor movement
 */
export const simulateMouseMovement = () => {
  const patterns = [
    // Quick straight line
    { x: [0, 100], y: [0, 0], duration: 200 },
    // Diagonal movement
    { x: [0, 80], y: [0, 60], duration: 300 },
    // Curved movement (bezier-like)
    { x: [0, 50, 100], y: [0, 20, 0], duration: 400 },
    // Slow precise movement
    { x: [0, 100], y: [0, 0], duration: 500 },
    // Wandering movement
    { x: [0, 20, 40, 60, 80, 100], y: [0, 10, 5, 15, 10, 0], duration: 600 },
  ];
  
  return patterns[Math.floor(Math.random() * patterns.length)];
};

/**
 * Generate human-like typing pattern
 * Simulates natural typing with pauses and mistakes
 */
export const humanTyping = async (text, onCharTyped, options = {}) => {
  const {
    minCharDelay = 50,
    maxCharDelay = 200,
    typoProbability = 0.02,
    backspaceProbability = 0.05,
    pauseProbability = 0.1,
    maxPauseDuration = 2000,
  } = options;

  let currentText = '';
  
  for (let i = 0; i < text.length; i++) {
    // Random delay between characters
    const delay = Math.random() * (maxCharDelay - minCharDelay) + minCharDelay;
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Simulate typing
    currentText += text[i];
    if (onCharTyped) onCharTyped(currentText);
    
    // Random pause (sometimes humans pause to think)
    if (Math.random() < pauseProbability) {
      const pauseDuration = Math.random() * maxPauseDuration;
      await new Promise(resolve => setTimeout(resolve, pauseDuration));
    }
    
    // Simulate typo and correction
    if (Math.random() < typoProbability && i > 0) {
      // Add wrong character
      const wrongChar = String.fromCharCode(
        text.charCodeAt(i) + (Math.random() < 0.5 ? 1 : -1)
      );
      currentText = currentText.slice(0, -1) + wrongChar;
      if (onCharTyped) onCharTyped(currentText);
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Backspace
      currentText = currentText.slice(0, -1);
      if (onCharTyped) onCharTyped(currentText);
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Retype correct character
      currentText += text[i];
      if (onCharTyped) onCharTyped(currentText);
    }
    
    // Simulate backspace (human sometimes deletes and retypes)
    if (Math.random() < backspaceProbability && i > 0) {
      currentText = currentText.slice(0, -1);
      if (onCharTyped) onCharTyped(currentText);
      await new Promise(resolve => setTimeout(resolve, 100));
      
      currentText += text[i];
      if (onCharTyped) onCharTyped(currentText);
    }
  }
  
  return currentText;
};

/**
 * Generate human-like scrolling behavior
 */
export const simulateScrolling = async (onScroll, options = {}) => {
  const {
    minScrolls = 1,
    maxScrolls = 5,
    minDelay = 100,
    maxDelay = 500,
    scrollAmount = 100,
  } = options;

  const scrollCount = Math.floor(
    Math.random() * (maxScrolls - minScrolls) + minScrolls
  );
  
  for (let i = 0; i < scrollCount; i++) {
    const delay = Math.random() * (maxDelay - minDelay) + minDelay;
    await new Promise(resolve => setTimeout(resolve, delay));
    
    const direction = Math.random() < 0.5 ? 1 : -1;
    const amount = scrollAmount * (0.5 + Math.random());
    
    if (onScroll) onScroll(direction * amount);
  }
};

/**
 * Generate realistic click pattern
 */
export const humanClick = async (onClick, options = {}) => {
  const {
    minDelayBefore = 100,
    maxDelayBefore = 500,
    clickDuration = 100,
  } = options;

  // Delay before click (human reaction time)
  const delay = Math.random() * (maxDelayBefore - minDelayBefore) + minDelayBefore;
  await new Promise(resolve => setTimeout(resolve, delay));
  
  // Mouse down
  if (onClick) onClick('down');
  
  // Click duration
  await new Promise(resolve => setTimeout(resolve, clickDuration));
  
  // Mouse up
  if (onClick) onClick('up');
};

/**
 * Generate human-like viewport dimensions
 * Helps avoid detection based on viewport fingerprinting
 */
export const getRandomViewport = () => {
  const commonResolutions = [
    { width: 1920, height: 1080 },  // Full HD
    { width: 1366, height: 768 },   // Common laptop
    { width: 1440, height: 900 },   // Widescreen
    { width: 1600, height: 900 },   // HD+
    { width: 1280, height: 720 },   // HD
    { width: 1680, height: 1050 }, // WSXGA+
  ];
  
  const resolution = commonResolutions[
    Math.floor(Math.random() * commonResolutions.length)
  ];
  
  // Add device pixel ratio variation
  const devicePixelRatio = [1, 1.25, 1.5, 2, 2.5, 3][
    Math.floor(Math.random() * 6)
  ];
  
  return {
    width: resolution.width,
    height: resolution.height,
    devicePixelRatio,
    colorDepth: 24,
    deviceMemory: [4, 8, 16, 32][Math.floor(Math.random() * 4)],
    hardwareConcurrency: [2, 4, 6, 8][Math.floor(Math.random() * 4)],
  };
};

/**
 * Generate human-like browser fingerprint
 */
export const getHumanFingerprint = () => {
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Safari/605.1.15',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  ];
  
  const languages = [
    'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
    'en-US,en;q=0.9',
    'ru-RU,ru;q=0.9,en;q=0.8',
    'en-GB,en;q=0.9',
  ];
  
  const timezones = [
    'Europe/Moscow',
    'Europe/Kiev',
    'Europe/Minsk',
    'Asia/Yekaterinburg',
    'Asia/Novosibirsk',
  ];
  
  const platforms = ['Windows', 'Macintosh', 'Linux'];
  
  return {
    userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
    language: languages[Math.floor(Math.random() * languages.length)],
    timezone: timezones[Math.floor(Math.random() * timezones.length)],
    platform: platforms[Math.floor(Math.random() * platforms.length)],
    doNotTrack: Math.random() < 0.3 ? '1' : '0',
    webglRenderer: 'ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 Direct3D11 vs_5_0 ps_5_0)',
    webglVendor: 'Google Inc. (NVIDIA)',
    cpuCores: [2, 4, 6, 8, 12, 16][Math.floor(Math.random() * 6)],
    screenResolution: getRandomViewport(),
  };
};

/**
 * Generate human-like mouse coordinates within a container
 */
export const getHumanCoordinates = (containerWidth, containerHeight) => {
  // Humans don't click exactly in the center
  const xRatio = 0.2 + Math.random() * 0.6; // 20-80% of width
  const yRatio = 0.2 + Math.random() * 0.6; // 20-80% of height
  
  return {
    x: Math.floor(containerWidth * xRatio),
    y: Math.floor(containerHeight * yRatio),
  };
};

/**
 * Generate human-like timing for actions
 * Simulates thinking time, reaction time, etc.
 */
export const humanTiming = {
  // Time to read and understand content
  readingTime: (textLength) => {
    const words = textLength / 5; // Average word length
    const wordsPerMinute = 150 + Math.random() * 100; // 150-250 wpm
    return (words / wordsPerMinute) * 60 * 1000; // in ms
  },
  
  // Time between actions
  actionDelay: (minMs = 1000, maxMs = 5000) => {
    return Math.random() * (maxMs - minMs) + minMs;
  },
  
  // Reaction time to visual stimuli
  reactionTime: () => {
    // Human reaction time: 100-400ms
    return 100 + Math.random() * 300;
  },
  
  // Time to make a decision
  decisionTime: () => {
    // 500ms to 3 seconds to make a simple decision
    return 500 + Math.random() * 2500;
  },
};

/**
 * Generate human-like behavior patterns
 */
export const humanBehavior = {
  // Probability of scrolling before interacting
  scrollBeforeAction: () => Math.random() < 0.7,
  
  // Probability of hovering over element before clicking
  hoverBeforeClick: () => Math.random() < 0.8,
  
  // Probability of making a mistake
  makeMistake: () => Math.random() < 0.05,
  
  // Probability of correcting a mistake
  correctMistake: () => Math.random() < 0.9,
  
  // Probability of pausing to think
  pauseToThink: () => Math.random() < 0.2,
};

/**
 * Generate human-like session pattern
 * Simulates a complete user session
 */
export const simulateHumanSession = async (actions, options = {}) => {
  const {
    minSessionDuration = 30000, // 30 seconds
    maxSessionDuration = 300000, // 5 minutes
  } = options;

  const sessionDuration = Math.random() * 
    (maxSessionDuration - minSessionDuration) + minSessionDuration;
  
  const startTime = Date.now();
  
  for (const action of actions) {
    // Check if session time is up
    if (Date.now() - startTime > sessionDuration) {
      console.log('Session ended naturally');
      break;
    }
    
    // Execute action with human-like timing
    await action();
    
    // Random delay between actions
    const delay = humanDelay(1000, 5000);
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Random chance to end session early
    if (Math.random() < 0.05) {
      console.log('Session ended early');
      break;
    }
  }
};

/**
 * Generate human-like comment text
 * Creates comments that look like they were written by a real person
 */
export const generateHumanComment = (options = {}) => {
  const {
    minLength = 10,
    maxLength = 100,
    includeEmoji = true,
  } = options;

  const positivePhrases = [
    'Отличный пост!',
    'Спасибо за информацию!',
    'Очень интересно!',
    'Класс!',
    'Супер!',
    'Понравилось!',
    'Отлично!',
    'Замечательно!',
    'Прекрасно!',
    'Великолепно!',
  ];

  const neutralPhrases = [
    'Интересная мысль.',
    'Спасибо за публикацию.',
    'Подумаю об этом.',
    'Возьму на заметку.',
    'Полезная информация.',
    'Согласен.',
    'Верное наблюдение.',
  ];

  const questions = [
    'А вы как думаете?',
    'Как вам?',
    'Кто согласен?',
    'А у вас так же?',
    'Что скажете?',
  ];

  const emojis = ['👍', '❤️', '😊', '😃', '😎', '👌', '🔥', '✨', '💯'];

  const fillers = [
    'В общем, ',
    'Лично я думаю, что ',
    'Мне кажется, что ',
    'На мой взгляд, ',
    'Я считаю, что ',
  ];

  // Choose comment type
  const commentTypes = [
    () => positivePhrases[Math.floor(Math.random() * positivePhrases.length)],
    () => neutralPhrases[Math.floor(Math.random() * neutralPhrases.length)],
    () => questions[Math.floor(Math.random() * questions.length)],
    () => fillers[Math.floor(Math.random() * fillers.length)] + 
         positivePhrases[Math.floor(Math.random() * positivePhrases.length)],
  ];

  let comment = commentTypes[Math.floor(Math.random() * commentTypes.length)]();

  // Add emoji if requested
  if (includeEmoji && Math.random() < 0.7) {
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    comment += ' ' + emoji;
  }

  // Add some random characters to make it more natural
  if (Math.random() < 0.3) {
    const extra = ['!!', '!!!', '...', '..', '!', '?', '??'][Math.floor(Math.random() * 7)];
    comment += extra;
  }

  // Ensure minimum length
  while (comment.length < minLength && comment.length < maxLength) {
    const additions = [' Очень', ' Очень ', ' Просто ', ' Просто', ' На самом деле'];
    comment = additions[Math.floor(Math.random() * additions.length)] + comment;
  }

  // Truncate if too long
  if (comment.length > maxLength) {
    comment = comment.substring(0, maxLength);
  }

  // Capitalize first letter
  comment = comment.charAt(0).toUpperCase() + comment.slice(1);

  return comment;
};

/**
 * Get device-specific anti-detection settings
 */
export const getDeviceSettings = () => {
  const deviceType = Device.deviceType || 'handset';
  const os = Platform.OS || 'ios';
  const model = Device.modelName || 'Unknown';
  
  return {
    deviceType,
    os,
    model,
    isPhysicalDevice: Device.isDevice,
    // Use device-specific delays
    baseDelay: deviceType === 'tablet' ? 1500 : 1000,
    maxDelay: deviceType === 'tablet' ? 4000 : 3000,
  };
};

/**
 * Anti-detection middleware for API requests
 * Adds human-like headers and behavior to requests
 */
export const antiDetectionMiddleware = (config) => {
  const fingerprint = getHumanFingerprint();
  
  // Add human-like headers
  config.headers = {
    ...config.headers,
    'User-Agent': fingerprint.userAgent,
    'Accept-Language': fingerprint.language,
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'DNT': fingerprint.doNotTrack,
    'Upgrade-Insecure-Requests': '1',
  };
  
  return config;
};

export default {
  humanDelay,
  simulateMouseMovement,
  humanTyping,
  simulateScrolling,
  humanClick,
  getRandomViewport,
  getHumanFingerprint,
  getHumanCoordinates,
  humanTiming,
  humanBehavior,
  simulateHumanSession,
  generateHumanComment,
  getDeviceSettings,
  antiDetectionMiddleware,
};
