/**
 * Browser automation utilities with anti-detection
 * These functions help simulate human-like browser interactions
 */

import { humanDelay, getHumanCoordinates, humanTiming, humanBehavior } from './antiDetection';

/**
 * Simulate page scroll with human-like behavior
 */
export const simulatePageScroll = async (scrollY, options = {}) => {
  const {
    minDuration = 500,
    maxDuration = 2000,
    steps = 10,
  } = options;

  const startY = 0;
  const distance = scrollY - startY;
  const duration = Math.random() * (maxDuration - minDuration) + minDuration;
  const stepDuration = duration / steps;
  const stepDistance = distance / steps;

  // Simulate scrolling with easing (humans don't scroll at constant speed)
  for (let i = 0; i < steps; i++) {
    const easeOut = 1 - Math.pow(1 - (i / steps), 3);
    const currentScroll = startY + (distance * easeOut);
    
    // In a real browser, you would use: window.scrollTo(0, currentScroll)
    // For now, we'll just simulate the delay
    await new Promise(resolve => setTimeout(resolve, stepDuration));
  }

  // Final scroll position
  return scrollY;
};

/**
 * Simulate mouse movement to an element
 */
export const simulateMouseMoveToElement = async (element, options = {}) => {
  const {
    minDuration = 300,
    maxDuration = 1000,
  } = options;

  // Get element position (in real implementation, use element.getBoundingClientRect())
  const rect = {
    x: Math.random() * 1000,
    y: Math.random() * 2000,
    width: 100,
    height: 50,
  };

  // Get human-like coordinates within the element
  const targetCoords = getHumanCoordinates(rect.width, rect.height);
  const targetX = rect.x + targetCoords.x;
  const targetY = rect.y + targetCoords.y;

  // Simulate mouse movement with bezier curve for natural path
  const duration = Math.random() * (maxDuration - minDuration) + minDuration;
  const controlPoint1 = {
    x: rect.x / 2,
    y: rect.y / 2,
  };
  const controlPoint2 = {
    x: (rect.x + targetX) / 2,
    y: (rect.y + targetY) / 2,
  };

  // In a real implementation, you would animate the mouse cursor
  // along the bezier curve. Here we just simulate the delay.
  await new Promise(resolve => setTimeout(resolve, duration));

  return { x: targetX, y: targetY };
};

/**
 * Simulate click on an element with human-like behavior
 */
export const simulateClick = async (element, options = {}) => {
  const {
    hoverBeforeClick = true,
    clickDuration = 100,
  } = options;

  // Simulate mouse movement to element
  await simulateMouseMoveToElement(element, options);

  // Sometimes humans hover before clicking
  if (hoverBeforeClick && humanBehavior.hoverBeforeClick()) {
    await humanDelay(100, 500);
  }

  // Mouse down
  // In real implementation: dispatch mouse down event
  await new Promise(resolve => setTimeout(resolve, 10));

  // Wait for click duration
  await new Promise(resolve => setTimeout(resolve, clickDuration));

  // Mouse up
  // In real implementation: dispatch mouse up event
  await new Promise(resolve => setTimeout(resolve, 10));

  // Sometimes humans have a small delay after clicking
  await humanDelay(50, 200);
};

/**
 * Simulate typing text with human-like behavior
 */
export const simulateTyping = async (text, inputElement, options = {}) => {
  const {
    minCharDelay = 50,
    maxCharDelay = 200,
    typoProbability = 0.02,
    backspaceProbability = 0.05,
    pauseProbability = 0.1,
  } = options;

  let currentText = '';

  for (let i = 0; i < text.length; i++) {
    // Random delay between characters
    const delay = Math.random() * (maxCharDelay - minCharDelay) + minCharDelay;
    await new Promise(resolve => setTimeout(resolve, delay));

    // Simulate typing
    currentText += text[i];
    // In real implementation: inputElement.value = currentText;
    // inputElement.dispatchEvent(new Event('input', { bubbles: true }));

    // Random pause
    if (Math.random() < pauseProbability) {
      const pauseDuration = Math.random() * 2000;
      await new Promise(resolve => setTimeout(resolve, pauseDuration));
    }

    // Simulate typo and correction
    if (Math.random() < typoProbability && i > 0) {
      const wrongChar = String.fromCharCode(
        text.charCodeAt(i) + (Math.random() < 0.5 ? 1 : -1)
      );
      currentText = currentText.slice(0, -1) + wrongChar;
      // Update input
      await new Promise(resolve => setTimeout(resolve, 100));

      // Backspace
      currentText = currentText.slice(0, -1);
      // Update input
      await new Promise(resolve => setTimeout(resolve, 100));

      // Retype correct character
      currentText += text[i];
      // Update input
    }

    // Simulate backspace
    if (Math.random() < backspaceProbability && i > 0) {
      currentText = currentText.slice(0, -1);
      // Update input
      await new Promise(resolve => setTimeout(resolve, 100));

      currentText += text[i];
      // Update input
    }
  }

  return currentText;
};

/**
 * Simulate form submission with human-like behavior
 */
export const simulateFormSubmit = async (formData, submitHandler, options = {}) => {
  const {
    readFormTime = 1000,
    fillFieldDelay = 500,
  } = options;

  // Simulate reading the form
  await humanDelay(readFormTime, readFormTime * 2);

  // Simulate filling each field
  for (const [fieldName, value] of Object.entries(formData)) {
    // Focus field
    await humanDelay(100, 300);

    // Type value
    await simulateTyping(value, null, options);

    // Move to next field
    await humanDelay(fillFieldDelay, fillFieldDelay * 2);
  }

  // Simulate reviewing the form
  await humanDelay(500, 1500);

  // Sometimes humans hesitate before submitting
  if (Math.random() < 0.3) {
    await humanDelay(1000, 3000);
  }

  // Submit
  await submitHandler();

  // Wait for submission to complete
  await humanDelay(500, 2000);
};

/**
 * Simulate page navigation
 */
export const simulateNavigation = async (url, options = {}) => {
  const {
    minDelay = 500,
    maxDelay = 2000,
  } = options;

  // Simulate mouse movement to a link
  await humanDelay(minDelay, maxDelay);

  // Click the link
  await simulateClick(null, options);

  // Wait for page to load
  await humanDelay(1000, 3000);

  return url;
};

/**
 * Simulate reading content on a page
 */
export const simulateReading = async (content, options = {}) => {
  const {
    wordsPerMinute = 200,
  } = options;

  // Count words
  const wordCount = content.split(/\s+/).length;
  const readingTime = (wordCount / wordsPerMinute) * 60 * 1000;

  // Add some randomness
  const actualTime = readingTime * (0.8 + Math.random() * 0.4);

  // Simulate reading with occasional pauses
  const pauseCount = Math.floor(wordCount / 20);
  const baseDelay = actualTime / pauseCount;

  for (let i = 0; i < pauseCount; i++) {
    await humanDelay(baseDelay * 0.8, baseDelay * 1.2);
  }

  return { wordCount, readingTime: actualTime };
};

/**
 * Simulate social media interaction pattern
 */
export const simulateSocialInteraction = async (options = {}) => {
  const {
    minActions = 1,
    maxActions = 5,
  } = options;

  const actionCount = Math.floor(
    Math.random() * (maxActions - minActions) + minActions
  );

  const possibleActions = [
    { type: 'like', probability: 0.4 },
    { type: 'comment', probability: 0.2 },
    { type: 'share', probability: 0.1 },
    { type: 'scroll', probability: 0.3 },
  ];

  for (let i = 0; i < actionCount; i++) {
    // Choose action based on probability
    const random = Math.random();
    let actionType = 'scroll';
    let cumulativeProbability = 0;

    for (const action of possibleActions) {
      cumulativeProbability += action.probability;
      if (random <= cumulativeProbability) {
        actionType = action.type;
        break;
      }
    }

    // Perform action
    switch (actionType) {
      case 'like':
        await simulateClick(null, { hoverBeforeClick: true });
        break;
      case 'comment':
        await simulateTyping('Отличный пост!', null);
        await simulateClick(null, { hoverBeforeClick: true });
        break;
      case 'share':
        await simulateClick(null, { hoverBeforeClick: true });
        break;
      case 'scroll':
        await simulatePageScroll(Math.random() * 1000);
        break;
    }

    // Wait between actions
    await humanDelay(1000, 5000);
  }
};

/**
 * Generate random human-like behavior pattern
 */
export const generateBehaviorPattern = () => {
  const patterns = [
    // Quick interaction
    {
      name: 'quick',
      actions: ['scroll', 'click'],
      totalDuration: 5000,
    },
    // Detailed reading
    {
      name: 'reader',
      actions: ['scroll', 'read', 'scroll', 'click'],
      totalDuration: 15000,
    },
    // Active participant
    {
      name: 'active',
      actions: ['scroll', 'like', 'comment', 'scroll'],
      totalDuration: 20000,
    },
    // Casual browser
    {
      name: 'casual',
      actions: ['scroll', 'scroll', 'click', 'scroll'],
      totalDuration: 10000,
    },
  ];

  return patterns[Math.floor(Math.random() * patterns.length)];
};

/**
 * Simulate complete user session with anti-detection
 */
export const simulateUserSession = async (tasks, options = {}) => {
  const {
    minSessionDuration = 60000, // 1 minute
    maxSessionDuration = 600000, // 10 minutes
  } = options;

  const sessionDuration = Math.random() * 
    (maxSessionDuration - minSessionDuration) + minSessionDuration;
  
  const startTime = Date.now();
  const behaviorPattern = generateBehaviorPattern();

  console.log(`Starting ${behaviorPattern.name} session (${Math.round(sessionDuration/1000)}s)`);

  for (const actionType of behaviorPattern.actions) {
    // Check if session time is up
    if (Date.now() - startTime > sessionDuration) {
      console.log('Session ended naturally');
      break;
    }

    // Find task of this type
    const task = tasks.find(t => t.type === actionType);
    if (!task) continue;

    // Perform action
    switch (actionType) {
      case 'like':
        console.log('Performing like action');
        await simulateClick(null, { hoverBeforeClick: true });
        break;
      case 'comment':
        console.log('Performing comment action');
        await simulateTyping('Отличный пост!', null);
        await simulateClick(null, { hoverBeforeClick: true });
        break;
      case 'scroll':
        console.log('Performing scroll action');
        await simulatePageScroll(Math.random() * 2000);
        break;
      case 'read':
        console.log('Performing read action');
        await simulateReading('Lorem ipsum dolor sit amet...', {
          wordsPerMinute: 150 + Math.random() * 100,
        });
        break;
    }

    // Random delay between actions
    await humanDelay(2000, 8000);
  }

  console.log('Session completed');
};

export default {
  simulatePageScroll,
  simulateMouseMoveToElement,
  simulateClick,
  simulateTyping,
  simulateFormSubmit,
  simulateNavigation,
  simulateReading,
  simulateSocialInteraction,
  generateBehaviorPattern,
  simulateUserSession,
};
