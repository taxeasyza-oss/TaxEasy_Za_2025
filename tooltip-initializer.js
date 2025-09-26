// Tooltip Initializer - Adds tooltip icons to all fields with data-tooltip attributes
// This ensures all tooltips are properly displayed and functional

class TooltipInitializer {
    constructor() {
        this.tooltipContainer = null;
        this.currentTooltip = null;
        this.initialized = false;
    }

    initialize() {
        if (this.initialized) return;
        
        console.log('Initializing tooltip system...');
        
        // Create tooltip container
        this.createTooltipContainer();
        
        // Add tooltip icons to all fields with data-tooltip attributes
        this.addTooltipIcons();
        
        // Setup event listeners
        this.setupEventListeners();
        
        this.initialized = true;
        console.log('Tooltip system initialized successfully');
    }

    createTooltipContainer() {
        if (this.tooltipContainer) return;
        
        this.tooltipContainer = document.createElement('div');
        this.tooltipContainer.id = 'dynamic-tooltip';
        this.tooltipContainer.className = 'dynamic-tooltip';
        this.tooltipContainer.style.cssText = `
            position: absolute;
            background: #333;
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 14px;
            line-height: 1.4;
            max-width: 280px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
            word-wrap: break-word;
        `;
        
        // Add arrow
        const arrow = document.createElement('div');
        arrow.style.cssText = `
            position: absolute;
            top: 100%;
            left: 50%;
            margin-left: -5px;
            width: 0;
            height: 0;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-top: 5px solid #333;
        `;
        this.tooltipContainer.appendChild(arrow);
        
        document.body.appendChild(this.tooltipContainer);
    }

    addTooltipIcons() {
        // Find all elements with data-tooltip attributes
        const elementsWithTooltips = document.querySelectorAll('[data-tooltip]');
        
        elementsWithTooltips.forEach(element => {
            // Find the associated label
            let label = null;
            
            if (element.id) {
                label = document.querySelector(`label[for="${element.id}"]`);
            }
            
            if (!label) {
                // Look for parent label
                label = element.closest('label');
            }
            
            if (!label) {
                // Look for sibling label
                label = element.parentElement?.querySelector('label');
            }
            
            if (label && !label.querySelector('.tooltip-icon')) {
                // Create tooltip icon
                const tooltipIcon = document.createElement('span');
                tooltipIcon.className = 'tooltip-icon';
                tooltipIcon.innerHTML = ' ❓';
                tooltipIcon.style.cssText = `
                    cursor: pointer;
                    margin-left: 5px;
                    color: #A3FF00;
                    font-size: 14px;
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    text-align: center;
                    line-height: 16px;
                    border-radius: 50%;
                    background: rgba(163, 255, 0, 0.1);
                    border: 1px solid #A3FF00;
                `;
                tooltipIcon.dataset.tooltip = element.dataset.tooltip;
                
                // Add the icon to the label
                label.appendChild(tooltipIcon);
            }
        });
    }

    setupEventListeners() {
        // Handle tooltip icon hover
        document.addEventListener('mouseover', (e) => {
            if (e.target.classList.contains('tooltip-icon')) {
                this.showTooltip(e.target, e.target.dataset.tooltip);
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.classList.contains('tooltip-icon')) {
                this.hideTooltip();
            }
        });

        // Handle language changes
        document.addEventListener('languageChanged', () => {
            this.hideTooltip();
        });
    }

    showTooltip(element, tooltipKey) {
        if (!tooltipKey || !this.tooltipContainer) return;

        // Get current language
        const currentLang = localStorage.getItem('selectedLanguage') || 'en';
        
        // Get tooltip text from translations
        let tooltipText = '';
        if (window.translations && window.translations[currentLang]) {
            tooltipText = window.translations[currentLang][tooltipKey] || tooltipKey;
        } else {
            tooltipText = tooltipKey;
        }

        // Set tooltip content
        this.tooltipContainer.firstChild.textContent = tooltipText;

        // Position tooltip
        const rect = element.getBoundingClientRect();
        const tooltipRect = this.tooltipContainer.getBoundingClientRect();
        
        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        let top = rect.top - tooltipRect.height - 10;

        // Adjust if tooltip goes off screen
        if (left < 10) left = 10;
        if (left + tooltipRect.width > window.innerWidth - 10) {
            left = window.innerWidth - tooltipRect.width - 10;
        }
        if (top < 10) {
            top = rect.bottom + 10;
        }

        this.tooltipContainer.style.left = left + 'px';
        this.tooltipContainer.style.top = top + 'px';
        this.tooltipContainer.style.opacity = '1';
    }

    hideTooltip() {
        if (this.tooltipContainer) {
            this.tooltipContainer.style.opacity = '0';
        }
    }

    // Reinitialize tooltips (useful after dynamic content changes)
    reinitialize() {
        this.addTooltipIcons();
    }
}

// Create global instance
window.tooltipInitializer = new TooltipInitializer();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.tooltipInitializer.initialize();
});

// Also initialize after language changes
document.addEventListener('languageChanged', () => {
    setTimeout(() => {
        window.tooltipInitializer.reinitialize();
    }, 100);
});

