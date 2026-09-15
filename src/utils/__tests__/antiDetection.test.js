/**
 * Unit tests for anti-detection utilities
 */

describe('Anti-Detection Utilities', () => {
  // Mock Math.random for consistent testing
  const originalRandom = Math.random;
  
  beforeEach(() => {
    Math.random = jest.fn(() => 0.5);
  });
  
  afterEach(() => {
    Math.random = originalRandom;
  });

  describe('humanDelay', () => {
    it('should return delay within specified bounds', () => {
      const delay = humanDelay(100, 1000);
      expect(delay).toBeGreaterThanOrEqual(100);
      expect(delay).toBeLessThanOrEqual(1000);
    });

    it('should use default bounds when not specified', () => {
      const delay = humanDelay();
      expect(delay).toBeGreaterThanOrEqual(500);
      expect(delay).toBeLessThanOrEqual(3000);
    });

    it('should respect minimum bound', () => {
      const delay = humanDelay(1000, 2000);
      expect(delay).toBeGreaterThanOrEqual(1000);
    });

    it('should respect maximum bound', () => {
      const delay = humanDelay(100, 500);
      expect(delay).toBeLessThanOrEqual(500);
    });
  });

  describe('getRandomViewport', () => {
    it('should return valid viewport dimensions', () => {
      const viewport = getRandomViewport();
      expect(viewport).toHaveProperty('width');
      expect(viewport).toHaveProperty('height');
      expect(viewport).toHaveProperty('devicePixelRatio');
      expect(viewport).toHaveProperty('colorDepth');
      expect(viewport).toHaveProperty('deviceMemory');
      expect(viewport).toHaveProperty('hardwareConcurrency');
    });

    it('should return positive values', () => {
      const viewport = getRandomViewport();
      expect(viewport.width).toBeGreaterThan(0);
      expect(viewport.height).toBeGreaterThan(0);
      expect(viewport.devicePixelRatio).toBeGreaterThan(0);
      expect(viewport.colorDepth).toBeGreaterThan(0);
    });
  });

  describe('getHumanFingerprint', () => {
    it('should return complete fingerprint object', () => {
      const fingerprint = getHumanFingerprint();
      expect(fingerprint).toHaveProperty('userAgent');
      expect(fingerprint).toHaveProperty('language');
      expect(fingerprint).toHaveProperty('timezone');
      expect(fingerprint).toHaveProperty('platform');
      expect(fingerprint).toHaveProperty('doNotTrack');
      expect(fingerprint).toHaveProperty('webglRenderer');
      expect(fingerprint).toHaveProperty('webglVendor');
      expect(fingerprint).toHaveProperty('cpuCores');
      expect(fingerprint).toHaveProperty('screenResolution');
    });

    it('should include Russian language options', () => {
      // Test multiple calls to check for Russian language
      let hasRussian = false;
      for (let i = 0; i < 10; i++) {
        const fingerprint = getHumanFingerprint();
        if (fingerprint.language.includes('ru')) {
          hasRussian = true;
          break;
        }
      }
      expect(hasRussian).toBe(true);
    });

    it('should include Russian timezone options', () => {
      let hasRussianTZ = false;
      for (let i = 0; i < 10; i++) {
        const fingerprint = getHumanFingerprint();
        if (fingerprint.timezone.includes('Europe/Moscow') || 
            fingerprint.timezone.includes('Europe/Kiev') ||
            fingerprint.timezone.includes('Europe/Minsk')) {
          hasRussianTZ = true;
          break;
        }
      }
      expect(hasRussianTZ).toBe(true);
    });

    it('should have valid user agent strings', () => {
      const fingerprint = getHumanFingerprint();
      expect(fingerprint.userAgent).toContain('Mozilla');
      expect(typeof fingerprint.userAgent).toBe('string');
      expect(fingerprint.userAgent.length).toBeGreaterThan(20);
    });
  });

  describe('getHumanCoordinates', () => {
    it('should return coordinates within container bounds', () => {
      const containerWidth = 1000;
      const containerHeight = 800;
      
      const coords = getHumanCoordinates(containerWidth, containerHeight);
      expect(coords.x).toBeGreaterThanOrEqual(0);
      expect(coords.x).toBeLessThanOrEqual(containerWidth);
      expect(coords.y).toBeGreaterThanOrEqual(0);
      expect(coords.y).toBeLessThanOrEqual(containerHeight);
    });

    it('should avoid exact center', () => {
      const containerWidth = 1000;
      const containerHeight = 800;
      
      // Run multiple times to ensure it's not always center
      let alwaysCenter = true;
      for (let i = 0; i < 10; i++) {
        const coords = getHumanCoordinates(containerWidth, containerHeight);
        if (coords.x !== 500 || coords.y !== 400) {
          alwaysCenter = false;
          break;
        }
      }
      expect(alwaysCenter).toBe(false);
    });

    it('should avoid edges', () => {
      const containerWidth = 1000;
      const containerHeight = 800;
      
      const coords = getHumanCoordinates(containerWidth, containerHeight);
      // Should be between 20-80% of dimensions
      expect(coords.x).toBeGreaterThan(containerWidth * 0.2);
      expect(coords.x).toBeLessThan(containerWidth * 0.8);
      expect(coords.y).toBeGreaterThan(containerHeight * 0.2);
      expect(coords.y).toBeLessThan(containerHeight * 0.8);
    });
  });

  describe('humanTiming', () => {
    it('should calculate reading time correctly', () => {
      const textLength = 100; // ~20 words
      const readingTime = humanTiming.readingTime(textLength);
      // At 150-250 wpm, 20 words should take ~4.8-8 seconds
      expect(readingTime).toBeGreaterThan(4000);
      expect(readingTime).toBeLessThan(10000);
    });

    it('should generate action delay within bounds', () => {
      const delay = humanTiming.actionDelay(1000, 5000);
      expect(delay).toBeGreaterThanOrEqual(1000);
      expect(delay).toBeLessThanOrEqual(5000);
    });

    it('should generate reaction time in human range', () => {
      const reactionTime = humanTiming.reactionTime();
      expect(reactionTime).toBeGreaterThanOrEqual(100);
      expect(reactionTime).toBeLessThanOrEqual(400);
    });

    it('should generate decision time in human range', () => {
      const decisionTime = humanTiming.decisionTime();
      expect(decisionTime).toBeGreaterThanOrEqual(500);
      expect(decisionTime).toBeLessThanOrEqual(3000);
    });
  });

  describe('humanBehavior', () => {
    it('should return boolean for scrollBeforeAction', () => {
      const result = humanBehavior.scrollBeforeAction();
      expect(typeof result).toBe('boolean');
    });

    it('should return boolean for hoverBeforeClick', () => {
      const result = humanBehavior.hoverBeforeClick();
      expect(typeof result).toBe('boolean');
    });

    it('should return boolean for makeMistake', () => {
      const result = humanBehavior.makeMistake();
      expect(typeof result).toBe('boolean');
    });

    it('should return boolean for correctMistake', () => {
      const result = humanBehavior.correctMistake();
      expect(typeof result).toBe('boolean');
    });

    it('should return boolean for pauseToThink', () => {
      const result = humanBehavior.pauseToThink();
      expect(typeof result).toBe('boolean');
    });
  });

  describe('generateHumanComment', () => {
    it('should generate comment with minimum length', () => {
      const comment = generateHumanComment({ minLength: 10, maxLength: 100 });
      expect(comment.length).toBeGreaterThanOrEqual(10);
    });

    it('should generate comment with maximum length constraint', () => {
      const comment = generateHumanComment({ minLength: 5, maxLength: 50 });
      expect(comment.length).toBeLessThanOrEqual(50);
    });

    it('should capitalize first letter', () => {
      const comment = generateHumanComment({ minLength: 10, maxLength: 100 });
      expect(comment.charAt(0)).toMatch(/[A-ZА-Я]/);
    });

    it('should include emoji when requested', () => {
      let hasEmoji = false;
      for (let i = 0; i < 10; i++) {
        const comment = generateHumanComment({ 
          minLength: 10, 
          maxLength: 100, 
          includeEmoji: true 
        });
        // Check for common emoji patterns
        if (/[\uD83C-\uDBFF\uDC00-\uDFFF]|[\u2700-\u27BF]|[\u2190-\u21FF]|[\u2B00-\u2BFF]/.test(comment)) {
          hasEmoji = true;
          break;
        }
      }
      expect(hasEmoji).toBe(true);
    });

    it('should generate Russian text', () => {
      const comment = generateHumanComment({ minLength: 10, maxLength: 100 });
      // Check for Cyrillic characters
      expect(/[а-яА-Я]/.test(comment)).toBe(true);
    });

    it('should generate different comment types', () => {
      const comments = new Set();
      for (let i = 0; i < 20; i++) {
        comments.add(generateHumanComment({ minLength: 10, maxLength: 100, includeEmoji: false }));
      }
      // Should have at least some variety
      expect(comments.size).toBeGreaterThan(1);
    });
  });

  describe('simulateMouseMovement', () => {
    it('should return valid movement pattern', () => {
      const pattern = simulateMouseMovement();
      expect(pattern).toHaveProperty('x');
      expect(pattern).toHaveProperty('y');
      expect(pattern).toHaveProperty('duration');
    });

    it('should return array for x and y coordinates', () => {
      const pattern = simulateMouseMovement();
      expect(Array.isArray(pattern.x)).toBe(true);
      expect(Array.isArray(pattern.y)).toBe(true);
    });

    it('should have positive duration', () => {
      const pattern = simulateMouseMovement();
      expect(pattern.duration).toBeGreaterThan(0);
    });
  });

  describe('simulateScrolling', () => {
    it('should call onScroll callback', async () => {
      const mockOnScroll = jest.fn();
      await simulateScrolling(mockOnScroll, { 
        minScrolls: 1, 
        maxScrolls: 3,
        minDelay: 10,
        maxDelay: 50 
      });
      expect(mockOnScroll).toHaveBeenCalled();
    });

    it('should scroll multiple times within bounds', async () => {
      const mockOnScroll = jest.fn();
      await simulateScrolling(mockOnScroll, { 
        minScrolls: 2, 
        maxScrolls: 5,
        minDelay: 1,
        maxDelay: 10 
      });
      const callCount = mockOnScroll.mock.calls.length;
      expect(callCount).toBeGreaterThanOrEqual(2);
      expect(callCount).toBeLessThanOrEqual(5);
    });
  });

  describe('humanClick', () => {
    it('should call onClick callback for down and up', async () => {
      const mockOnClick = jest.fn();
      await humanClick(mockOnClick, { 
        minDelayBefore: 10, 
        maxDelayBefore: 50,
        clickDuration: 10 
      });
      expect(mockOnClick).toHaveBeenCalledTimes(2);
      expect(mockOnClick).toHaveBeenCalledWith('down');
      expect(mockOnClick).toHaveBeenCalledWith('up');
    });

    it('should call down before up', async () => {
      const calls = [];
      await humanClick((action) => calls.push(action), { 
        minDelayBefore: 10, 
        maxDelayBefore: 50,
        clickDuration: 10 
      });
      expect(calls).toEqual(['down', 'up']);
    });
  });

  describe('antiDetectionMiddleware', () => {
    it('should add User-Agent header', () => {
      const config = { headers: {} };
      const result = antiDetectionMiddleware(config);
      expect(result.headers['User-Agent']).toBeDefined();
      expect(result.headers['User-Agent']).toContain('Mozilla');
    });

    it('should add Accept-Language header', () => {
      const config = { headers: {} };
      const result = antiDetectionMiddleware(config);
      expect(result.headers['Accept-Language']).toBeDefined();
    });

    it('should add DNT header', () => {
      const config = { headers: {} };
      const result = antiDetectionMiddleware(config);
      expect(result.headers['DNT']).toBeDefined();
    });

    it('should preserve existing headers', () => {
      const config = { 
        headers: { 
          'Content-Type': 'application/json',
          'X-Custom': 'value' 
        } 
      };
      const result = antiDetectionMiddleware(config);
      expect(result.headers['Content-Type']).toBe('application/json');
      expect(result.headers['X-Custom']).toBe('value');
    });

    it('should add connection headers', () => {
      const config = { headers: {} };
      const result = antiDetectionMiddleware(config);
      expect(result.headers['Connection']).toBe('keep-alive');
      expect(result.headers['Accept-Encoding']).toBe('gzip, deflate, br');
    });
  });

  describe('getDeviceSettings', () => {
    it('should return device settings object', () => {
      const settings = getDeviceSettings();
      expect(settings).toHaveProperty('deviceType');
      expect(settings).toHaveProperty('os');
      expect(settings).toHaveProperty('model');
      expect(settings).toHaveProperty('isPhysicalDevice');
      expect(settings).toHaveProperty('baseDelay');
      expect(settings).toHaveProperty('maxDelay');
    });
  });
});
