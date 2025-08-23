// Load polyfills first
const { TextEncoder, TextDecoder } = require('text-encoding');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Configure JSDOM after polyfills
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

// Setup DOM environment
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
const { document } = dom.window;
global.document = document;

// Mock translations
const mockTranslations = {
  en: JSON.parse(fs.readFileSync(path.join(__dirname, '../translations/en.json'), 'utf8')),
  af: {
    welcome_title: "Welkom by TaxEasy_ZA!",
    welcome_intro: "Hierdie professionele belastingberekenaar sal jou help..."
  }
};

// Mock fetch
global.fetch = jest.fn((url) => ({
  json: () => Promise.resolve(mockTranslations[url.split('_').pop().replace('.json', '')] || {})
}));

// Mock translate function
const mockTranslate = jest.fn((key, lang) => {
  const translations = mockTranslations[lang] || mockTranslations.en;
  return translations[key] || `MISSING:${key}`;
});

// Import module functions
const {
  applyTranslations,
  updateEFilingGuideLink,
  loadFAQContent,
  toggleFaq,
  updateWelcomeMessage,
  loadEFilingGuide
} = require('../js/language-handler');

describe('Language Handler Tests', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="welcomeTitle" data-translate="welcome_title"></div>
      <input data-placeholder-key="id_passport_placeholder">
      <a id="efilingBtn"></a>
      <div id="faqContent"></div>
    `;
  });

  test('Applies translations to DOM elements', () => {
      applyTranslations('en');
    expect(document.getElementById('welcomeTitle').textContent)
      .toBe(mockTranslations.en.welcome_title);
  });

  test('Updates eFiling guide link', () => {
    languageHandler.updateEFilingGuideLink('af');
    expect(document.getElementById('efilingBtn').href)
      .toContain('efiling-guide_af.html');
  });

  test('Loads FAQ content', async () => {
    await languageHandler.loadFAQContent();
    expect(document.getElementById('faqContent').innerHTML)
      .toContain('faq-item');
  });

  test('Updates dynamic DOM elements', () => {
    // Add new element after initial load
    const newElement = document.createElement('div');
    newElement.setAttribute('data-translate', 'footer_text');
    document.body.appendChild(newElement);
    
    languageHandler.applyTranslations('en');
    expect(newElement.textContent).toBe(mockTranslations.en.footer_text);
  });

  test('Initializes translations on DOMContentLoaded', async () => {
    const dom = new JSDOM(`<!DOCTYPE html>
      <html>
        <body>
          <div id="welcomeTitle" data-translate="welcome_title"></div>
          <select id="langSelect"><option value="en"></option></select>
        </body>
      </html>`);
    
    const { document: newDoc, window: newWindow } = dom.window;
    global.document = newDoc;
    
    await newWindow.document.dispatchEvent(new newWindow.Event('DOMContentLoaded'));
    await new Promise(resolve => setTimeout(resolve, 50));
    
    expect(newDoc.getElementById('welcomeTitle').textContent)
      .toBe(mockTranslations.en.welcome_title);
  });

  test('Toggles FAQ visibility correctly', () => {
    // Add FAQ item to DOM
    document.body.innerHTML += `
      <div class="faq-item">
        <div class="faq-answer" id="faq-answer-0"></div>
      </div>
    `;
    
    languageHandler.toggleFaq(0);
    expect(document.getElementById('faq-answer-0').classList.contains('open')).toBe(true);
    
    languageHandler.toggleFaq(0);
    expect(document.getElementById('faq-answer-0').classList.contains('open')).toBe(false);
  });
});