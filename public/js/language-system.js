// Comprehensive Language System for TaxEasy ZA 2025
// Handles all multilingual functionality including UI, tooltips, FAQ, and e-filing

class LanguageSystem {
    constructor() {
        this.currentLanguage = 'en';
        this.translations = {};
        this.tooltipTranslations = {};
        this.isInitialized = false;
        
        // Bind methods
        this.init = this.init.bind(this);
        this.loadTranslations = this.loadTranslations.bind(this);
        this.changeLanguage = this.changeLanguage.bind(this);
        this.translate = this.translate.bind(this);
        this.applyTranslations = this.applyTranslations.bind(this);
    }

    async init() {
        console.log('Initializing Language System...');
        
        // Get saved language or default to English
        this.currentLanguage = localStorage.getItem('selectedLanguage') || 'en';
        
        // Load initial translations
        await this.loadTranslations(this.currentLanguage);
        
        // Set up language selector
        this.setupLanguageSelector();
        
        // Apply initial translations
        this.applyTranslations();
        
        // Set up mutation observer for dynamic content
        this.setupMutationObserver();
        
        this.isInitialized = true;
        console.log('Language System initialized successfully');
        
        // Dispatch initialization event
        document.dispatchEvent(new CustomEvent('languageSystemReady', {
            detail: { language: this.currentLanguage }
        }));
    }

    async loadTranslations(language) {
        try {
            console.log(`Loading translations for: ${language}`);
            
            // Use the global translations object from translations.js
            if (window.translations && window.translations[language]) {
                this.translations[language] = window.translations[language];
                console.log(`Translations loaded successfully for: ${language}`);
            } else {
                console.warn(`Translations not found for ${language}, using English fallback`);
                if (language !== 'en' && window.translations && window.translations['en']) {
                    this.translations[language] = window.translations['en'];
                } else {
                    console.error('No translations available');
                }
            }
        } catch (error) {
            console.error(`Error loading translations for ${language}:`, error);
            // Fallback to English if available
            if (language !== 'en' && window.translations && window.translations['en']) {
                this.translations[language] = window.translations['en'];
            }
        }
    }

    setupLanguageSelector() {
        const selector = document.getElementById('language-select');
        if (selector) {
            // Set current language
            selector.value = this.currentLanguage;
            
            // Add change listener
            selector.addEventListener('change', async (e) => {
                const newLanguage = e.target.value;
                await this.changeLanguage(newLanguage);
            });
        }
    }

    async changeLanguage(newLanguage) {
        if (newLanguage === this.currentLanguage) return;
        
        console.log(`Changing language from ${this.currentLanguage} to ${newLanguage}`);
        
        // Load new translations if not already loaded
        if (!this.translations[newLanguage]) {
            await this.loadTranslations(newLanguage);
        }
        
        // Update current language
        this.currentLanguage = newLanguage;
        
        // Save to localStorage
        localStorage.setItem('selectedLanguage', newLanguage);
        
        // Apply new translations
        this.applyTranslations();
        
        // Update tooltips
        this.updateTooltips();
        
        // Dispatch language change event
        document.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: newLanguage }
        }));
        
        console.log(`Language changed to: ${newLanguage}`);
    }

    translate(key, fallback = '') {
        const translations = this.translations[this.currentLanguage];
        if (translations && translations[key]) {
            return translations[key];
        }
        
        // Try English fallback
        const englishTranslations = this.translations['en'];
        if (englishTranslations && englishTranslations[key]) {
            return englishTranslations[key];
        }
        
        return fallback || key;
    }

    translateTooltip(key, fallback = '') {
        const tooltips = this.tooltipTranslations[this.currentLanguage];
        if (tooltips && tooltips[key]) {
            return tooltips[key];
        }
        
        // Try English fallback
        const englishTooltips = this.tooltipTranslations['en'];
        if (englishTooltips && englishTooltips[key]) {
            return englishTooltips[key];
        }
        
        return fallback || key;
    }

    applyTranslations() {
        // Translate elements with data-translate attribute
        const elementsToTranslate = document.querySelectorAll('[data-translate]');
        elementsToTranslate.forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = this.translate(key);
            if (translation && translation !== key) {
                // Special handling for option elements
                if (element.tagName.toLowerCase() === 'option') {
                    element.textContent = translation;
                    element.innerText = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });

        // Translate placeholders
        const elementsWithPlaceholders = document.querySelectorAll('[data-translate-placeholder]');
        elementsWithPlaceholders.forEach(element => {
            const key = element.getAttribute('data-translate-placeholder');
            const translation = this.translate(key);
            if (translation && translation !== key) {
                element.placeholder = translation;
            }
        });

        // Translate titles
        const elementsWithTitles = document.querySelectorAll('[data-translate-title]');
        elementsWithTitles.forEach(element => {
            const key = element.getAttribute('data-translate-title');
            const translation = this.translate(key);
            if (translation && translation !== key) {
                element.title = translation;
            }
        });

        // Force refresh of select elements to ensure options are visible
        const selectElements = document.querySelectorAll('select');
        selectElements.forEach(select => {
            // Trigger a refresh of the select element
            const currentValue = select.value;
            select.style.display = 'none';
            select.offsetHeight; // Force reflow
            select.style.display = '';
            select.value = currentValue;
        });
    }

    updateTooltips() {
        // Update tooltip content
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        tooltipElements.forEach(element => {
            const tooltipKey = element.getAttribute('data-tooltip');
            const tooltipText = this.translateTooltip(tooltipKey);
            
            // Update tooltip text span if it exists
            const tooltipTextSpan = element.querySelector('.tooltip-text');
            if (tooltipTextSpan && tooltipText && tooltipText !== tooltipKey) {
                tooltipTextSpan.textContent = tooltipText;
            }
        });
    }

    setupMutationObserver() {
        // Watch for dynamically added content
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Apply translations to new elements
                            const elementsToTranslate = node.querySelectorAll('[data-translate]');
                            elementsToTranslate.forEach(element => {
                                const key = element.getAttribute('data-translate');
                                const translation = this.translate(key);
                                if (translation && translation !== key) {
                                    element.textContent = translation;
                                }
                            });
                            
                            // Update tooltips for new elements
                            const tooltipElements = node.querySelectorAll('[data-tooltip]');
                            tooltipElements.forEach(element => {
                                const tooltipKey = element.getAttribute('data-tooltip');
                                const tooltipText = this.translateTooltip(tooltipKey);
                                const tooltipTextSpan = element.querySelector('.tooltip-text');
                                if (tooltipTextSpan && tooltipText && tooltipText !== tooltipKey) {
                                    tooltipTextSpan.textContent = tooltipText;
                                }
                            });
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Public API methods
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    isReady() {
        return this.isInitialized;
    }

    // Helper method to get language-specific URLs
    getLocalizedUrl(basePath, extension = '.html') {
        if (this.currentLanguage === 'en') {
            return `${basePath}${extension}`;
        }
        return `${basePath}_${this.currentLanguage}${extension}`;
    }
}

// Create global instance
window.languageSystem = new LanguageSystem();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.languageSystem.init();
    });
} else {
    window.languageSystem.init();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LanguageSystem;
}

