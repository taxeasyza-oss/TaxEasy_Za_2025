// TaxEasy_ZA 2025 - Tooltip System
// Provides comprehensive tooltip functionality with multilingual support

// Tooltip system configuration
const TOOLTIP_CONFIG = {
    showDelay: 500,     // Delay before showing tooltip (ms)
    hideDelay: 100,     // Delay before hiding tooltip (ms)
    fadeSpeed: 200,     // Fade animation speed (ms)
    maxWidth: 300,      // Maximum tooltip width (px)
    offset: 10          // Distance from cursor/element (px)
};

// Tooltip container and state
let tooltipContainer = null;
let currentTooltip = null;
let showTimeout = null;
let hideTimeout = null;

// Initialize tooltip system
window.initializeTooltipSystem = function() {
    console.log('Initializing tooltip system...');
    
    // Create tooltip container
    window.createTooltipContainer();
    
    // Setup tooltip event listeners
    window.setupTooltipListeners();
    
    // Initialize tooltips for existing elements
    window.initializeTooltips();
    
    console.log('Tooltip system initialized successfully');
};

// Create tooltip container element
window.createTooltipContainer = function() {
    if (tooltipContainer) return;
    
    tooltipContainer = document.createElement('div');
    tooltipContainer.id = 'tooltip-container';
    tooltipContainer.className = 'tooltip-container';
    tooltipContainer.style.cssText = `
        position: absolute;
        z-index: 10000;
        pointer-events: none;
        opacity: 0;
        transition: opacity ${TOOLTIP_CONFIG.fadeSpeed}ms ease-in-out;
        background: #333;
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 14px;
        line-height: 1.4;
        max-width: ${TOOLTIP_CONFIG.maxWidth}px;
        word-wrap: break-word;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        font-family: 'Open Sans', sans-serif;
    `;
    
    document.body.appendChild(tooltipContainer);
};

// Setup global tooltip event listeners
window.setupTooltipListeners = function() {
    // Mouse events for desktop
    document.addEventListener('mouseover', window.handleTooltipMouseOver);
    document.addEventListener('mouseout', window.handleTooltipMouseOut);
    document.addEventListener('mousemove', window.handleTooltipMouseMove);
    
    // Touch events for mobile
    document.addEventListener('touchstart', window.handleTooltipTouchStart);
    document.addEventListener('touchend', window.handleTooltipTouchEnd);
    
    // Hide tooltip when scrolling
    document.addEventListener('scroll', window.hideTooltip, true);
    
    // Hide tooltip when window loses focus
    window.addEventListener('blur', window.hideTooltip);
};

// Handle mouse over events
window.handleTooltipMouseOver = function(event) {
    const element = event.target.closest('[data-tooltip], [title]');
    if (!element) return;
    
    // Clear any existing hide timeout
    if (hideTimeout) {
        clearTimeout(hideTimeout);
        hideTimeout = null;
    }
    
    // Don't show tooltip if it's already showing for this element
    if (currentTooltip === element) return;
    
    // Hide current tooltip if showing for different element
    if (currentTooltip) {
        window.hideTooltip();
    }
    
    // Set up show timeout
    showTimeout = setTimeout(() => {
        window.showTooltip(element, event);
    }, TOOLTIP_CONFIG.showDelay);
};

// Handle mouse out events
window.handleTooltipMouseOut = function(event) {
    const element = event.target.closest('[data-tooltip], [title]');
    if (!element || element !== currentTooltip) return;
    
    // Clear show timeout if tooltip hasn't been shown yet
    if (showTimeout) {
        clearTimeout(showTimeout);
        showTimeout = null;
    }
    
    // Set up hide timeout
    hideTimeout = setTimeout(() => {
        window.hideTooltip();
    }, TOOLTIP_CONFIG.hideDelay);
};

// Handle mouse move events for tooltip positioning
window.handleTooltipMouseMove = function(event) {
    if (!currentTooltip || !tooltipContainer || tooltipContainer.style.opacity === '0') return;
    
    window.positionTooltip(event.clientX, event.clientY);
};

// Handle touch start for mobile
window.handleTooltipTouchStart = function(event) {
    const element = event.target.closest('[data-tooltip], [title]');
    if (!element) return;
    
    // Show tooltip immediately on touch
    window.showTooltip(element, event.touches[0]);
    
    // Hide tooltip after 3 seconds on mobile
    setTimeout(() => {
        if (currentTooltip === element) {
            window.hideTooltip();
        }
    }, 3000);
};

// Handle touch end for mobile
window.handleTooltipTouchEnd = function(event) {
    // Hide tooltip when touch ends (with delay)
    setTimeout(() => {
        window.hideTooltip();
    }, 1000);
};

// Show tooltip for element
window.showTooltip = function(element, event) {
    if (!tooltipContainer) return;
    
    const tooltipText = window.getTooltipText(element);
    if (!tooltipText) return;
    
    // Set tooltip content
    tooltipContainer.innerHTML = tooltipText;
    
    // Position tooltip
    const x = event.clientX || event.pageX || 0;
    const y = event.clientY || event.pageY || 0;
    window.positionTooltip(x, y);
    
    // Show tooltip
    tooltipContainer.style.opacity = '1';
    currentTooltip = element;
    
    console.log('Tooltip shown for element:', element);
};

// Hide tooltip
window.hideTooltip = function() {
    if (!tooltipContainer) return;
    
    tooltipContainer.style.opacity = '0';
    currentTooltip = null;
    
    // Clear timeouts
    if (showTimeout) {
        clearTimeout(showTimeout);
        showTimeout = null;
    }
    if (hideTimeout) {
        clearTimeout(hideTimeout);
        hideTimeout = null;
    }
};

// Get tooltip text for element
window.getTooltipText = function(element) {
    // Check for data-tooltip attribute first (translated)
    const tooltipKey = element.getAttribute('data-tooltip');
    if (tooltipKey && typeof window.translate === 'function') {
        const translatedText = window.translate(tooltipKey);
        if (translatedText && translatedText !== tooltipKey) {
            return translatedText;
        }
    }
    
    // Fallback to title attribute
    const titleText = element.getAttribute('title');
    if (titleText) {
        // Remove title attribute to prevent browser default tooltip
        element.setAttribute('data-original-title', titleText);
        element.removeAttribute('title');
        return titleText;
    }
    
    // Check for data-original-title (previously moved from title)
    const originalTitle = element.getAttribute('data-original-title');
    if (originalTitle) {
        return originalTitle;
    }
    
    return null;
};

// Position tooltip relative to cursor/element
window.positionTooltip = function(x, y) {
    if (!tooltipContainer) return;
    
    const tooltip = tooltipContainer;
    const tooltipRect = tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let left = x + TOOLTIP_CONFIG.offset;
    let top = y + TOOLTIP_CONFIG.offset;
    
    // Adjust horizontal position if tooltip would go off-screen
    if (left + tooltipRect.width > viewportWidth) {
        left = x - tooltipRect.width - TOOLTIP_CONFIG.offset;
    }
    
    // Adjust vertical position if tooltip would go off-screen
    if (top + tooltipRect.height > viewportHeight) {
        top = y - tooltipRect.height - TOOLTIP_CONFIG.offset;
    }
    
    // Ensure tooltip doesn't go off the left or top edge
    left = Math.max(TOOLTIP_CONFIG.offset, left);
    top = Math.max(TOOLTIP_CONFIG.offset, top);
    
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
};

// Initialize tooltips for existing elements
window.initializeTooltips = function() {
    // Find all elements with tooltip attributes
    const tooltipElements = document.querySelectorAll('[data-tooltip], [title]');
    
    tooltipElements.forEach(element => {
        // Ensure element has proper attributes for tooltip system
        if (element.hasAttribute('title') && !element.hasAttribute('data-tooltip')) {
            // Move title to data-original-title to prevent browser default
            const title = element.getAttribute('title');
            element.setAttribute('data-original-title', title);
            element.removeAttribute('title');
        }
    });
    
    console.log(`Initialized tooltips for ${tooltipElements.length} elements`);
};

// Update tooltips when language changes
window.updateTooltips = function() {
    // Re-initialize tooltips to update translations
    window.initializeTooltips();
    
    // Hide current tooltip if showing to force refresh
    if (currentTooltip) {
        window.hideTooltip();
    }
    
    console.log('Tooltips updated for language change');
};

// Add tooltip to element programmatically
window.addTooltip = function(element, tooltipKey) {
    if (!element) return;
    
    element.setAttribute('data-tooltip', tooltipKey);
    console.log(`Tooltip added to element:`, element, `with key: ${tooltipKey}`);
};

// Remove tooltip from element
window.removeTooltip = function(element) {
    if (!element) return;
    
    element.removeAttribute('data-tooltip');
    element.removeAttribute('data-original-title');
    element.removeAttribute('title');
    
    if (currentTooltip === element) {
        window.hideTooltip();
    }
    
    console.log('Tooltip removed from element:', element);
};

// Enhanced tooltip for form validation
window.showValidationTooltip = function(element, message) {
    if (!element || !tooltipContainer) return;
    
    // Create validation-specific styling
    const originalStyle = tooltipContainer.style.cssText;
    tooltipContainer.style.cssText = originalStyle.replace('background: #333', 'background: #dc3545');
    
    // Set validation message
    tooltipContainer.innerHTML = message;
    
    // Position near the element
    const rect = element.getBoundingClientRect();
    window.positionTooltip(rect.right, rect.top);
    
    // Show tooltip
    tooltipContainer.style.opacity = '1';
    currentTooltip = element;
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        window.hideTooltip();
        // Restore original styling
        tooltipContainer.style.cssText = originalStyle;
    }, 3000);
};

// Initialize tooltip system when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initializeTooltipSystem);
} else {
    window.initializeTooltipSystem();
}

console.log('Tooltip system loaded');

