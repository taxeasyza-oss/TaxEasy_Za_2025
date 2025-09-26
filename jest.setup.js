// Jest setup file for TaxEasy ZA 2025

// Mock DOM APIs that might not be available in test environment
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;

// Mock fetch API
global.fetch = jest.fn();

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock MutationObserver
global.MutationObserver = class MutationObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
};

// Mock Service Worker
Object.defineProperty(navigator, 'serviceWorker', {
  value: {
    register: jest.fn(() => Promise.resolve()),
    ready: Promise.resolve(),
    controller: null,
  },
  writable: true,
});

// Mock geolocation
Object.defineProperty(navigator, 'geolocation', {
  value: {
    getCurrentPosition: jest.fn(),
    watchPosition: jest.fn(),
  },
  writable: true,
});

// Custom matchers for tax calculations
expect.extend({
  toBeWithinCents(received, expected) {
    const pass = Math.abs(received - expected) <= 0.01;
    if (pass) {
      return {
        message: () => `expected ${received} not to be within 1 cent of ${expected}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be within 1 cent of ${expected}`,
        pass: false,
      };
    }
  },
  
  toBeValidTaxAmount(received) {
    const pass = typeof received === 'number' && received >= 0 && Number.isFinite(received);
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid tax amount`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid tax amount (non-negative finite number)`,
        pass: false,
      };
    }
  }
});

// Global test utilities
global.testUtils = {
  // Helper to create mock tax calculation data
  createMockTaxData: (overrides = {}) => ({
    income: 100000,
    age: 30,
    paye: 0,
    provisional: 0,
    medicalMonths: 0,
    dependants: 0,
    retirementContrib: 0,
    ...overrides
  }),
  
  // Helper to wait for async operations
  waitFor: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  
  // Helper to trigger DOM events
  triggerEvent: (element, eventType, eventData = {}) => {
    const event = new Event(eventType, { bubbles: true });
    Object.assign(event, eventData);
    element.dispatchEvent(event);
  }
};

// Console error suppression for expected errors in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

