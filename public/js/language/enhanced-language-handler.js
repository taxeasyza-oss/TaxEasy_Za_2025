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
    const selector = document.getElementById('languageSelector') || this.createLanguageSelector();
    selector.addEventListener('change', (e) => {
      this.switchLanguage(e.target.value);
    });
  }
  
  createLanguageSelector() {
    const selector = document.createElement('select');
    selector.id = 'languageSelector';
    selector.style.cssText = 'position: fixed; top: 10px; right: 10px; z-index: 1000; padding: 5px;';
    
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
  
  switchLanguage(lang) {
    localStorage.setItem('tax_lang', lang);
    location.reload();
  }
  
  loadTranslations() {
    // Basic translations loaded via script tags in index.html
    console.log('Language system initialized');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.languageSystem = new EnhancedLanguageSystem();
});
