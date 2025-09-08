// js/language/enhanced-language-handler.js
class EnhancedLanguageSystem {
  constructor() {
    this.currentLanguage = localStorage.getItem('tax_lang') || 'en';
    this.init();
  }
  
  async init() {
    this.setupLanguageSelector();
    this.loadTranslations();
  }
  
  setupLanguageSelector() {
    const selector = document.getElementById('langSelect') || this.createLanguageSelector();
    selector.addEventListener('change', (e) => {
      this.switchLanguage(e.target.value);
    });
  }
  
  createLanguageSelector() {
    // Use existing selector if present in DOM
    const existingSelector = document.getElementById('langSelect');
    if (existingSelector) return existingSelector;
    
    const selector = document.createElement('select');
    selector.id = 'langSelect';
    selector.className = 'language-selector';
    
    const languages = [
      { code: 'en', name: 'English' },
      { code: 'af', name: 'Afrikaans' },
      { code: 'zu', name: 'Zulu' },
      { code: 'xh', name: 'Xhosa' },
      { code: 'st', name: 'Sotho' }
    ];
    
    languages.forEach(lang => {
      const option = document.createElement('option');
      option.value = lang.code;
      option.textContent = lang.name;
      selector.appendChild(option);
    });
    
    document.body.appendChild(selector);
    return selector;
  }
  
  async switchLanguage(lang) {
    this.currentLanguage = lang;
    localStorage.setItem('tax_lang', lang);
    await this.loadTranslations();
    this.applyTranslations();
  }
  
  async loadTranslations() {
    try {
      const response = await fetch(`/locales/${this.currentLanguage}.json`);
      this.translations = await response.json();
    } catch (error) {
      console.error('Failed to load translations:', error);
      this.translations = {};
    }
  }

  applyTranslations() {
    // Translate elements with data-translate attributes
    try {
      // Translate main content
      document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.dataset.translate;
        const translation = this.getNestedTranslation(key);
        if (translation) {
          el.textContent = translation;
          el.style.display = ''; // Ensure element is visible
        }
      });

      // Translate tooltips
      document.querySelectorAll('[data-tooltip]').forEach(el => {
        const key = el.dataset.tooltip;
        const translation = this.getNestedTranslation(`tooltips.${key}`);
        if (translation) {
          el.title = translation;
          el.dataset.bsToggle = 'tooltip'; // Initialize Bootstrap tooltips
          new bootstrap.Tooltip(el); // Refresh tooltip instance
        }
      });
    } catch (error) {
      console.error('Translation application error:', error);
    }
  }

  getNestedTranslation(key) {
    return key.split('.').reduce((obj, k) => (obj || {})[k], this.translations) || key;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.languageSystem = new EnhancedLanguageSystem();
});
