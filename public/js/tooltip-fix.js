// Simple Tooltip Fix for TaxEasy ZA 2025
// This script adds working tooltip functionality to all tooltip icons

(function() {
    'use strict';
    
    // Tooltip texts for each field
    const tooltipTexts = {
        'full_name_tooltip': 'Enter your full legal name as it appears on your ID document or passport',
        'id_number_tooltip': 'Enter your South African ID number or passport number for identification',
        'age_group_tooltip': 'Select your age group to determine the correct tax brackets and rebates',
        'occupation_tooltip': 'Select your primary occupation for tax calculation purposes',
        'email_tooltip': 'Enter your email address to receive your tax calculation report'
    };
    
    function initializeTooltips() {
        // Find all tooltip icons
        const tooltipIcons = document.querySelectorAll('.tooltip-icon');
        
        tooltipIcons.forEach(icon => {
            // Add tooltip text as data attribute
            const tooltipKey = icon.getAttribute('data-tooltip');
            if (tooltipKey && tooltipTexts[tooltipKey]) {
                icon.setAttribute('data-tooltip-text', tooltipTexts[tooltipKey]);
            }
            
            // Add event listeners
            icon.addEventListener('mouseenter', showTooltip);
            icon.addEventListener('mouseleave', hideTooltip);
            icon.addEventListener('focus', showTooltip);
            icon.addEventListener('blur', hideTooltip);
        });
    }
    
    function showTooltip(event) {
        const icon = event.target;
        const tooltipText = icon.getAttribute('data-tooltip-text');
        
        if (!tooltipText) return;
        
        // Remove any existing tooltip
        removeExistingTooltip();
        
        // Create tooltip element
        const tooltip = document.createElement('div');
        tooltip.className = 'simple-tooltip';
        tooltip.textContent = tooltipText;
        tooltip.style.cssText = `
            position: absolute;
            background: #333;
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 14px;
            line-height: 1.4;
            max-width: 250px;
            z-index: 10000;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            word-wrap: break-word;
        `;
        
        // Position tooltip
        const rect = icon.getBoundingClientRect();
        tooltip.style.left = (rect.left + rect.width / 2 - 125) + 'px';
        tooltip.style.top = (rect.top - 40) + 'px';
        
        // Add to document
        document.body.appendChild(tooltip);
        
        // Show tooltip with animation
        setTimeout(() => {
            tooltip.style.opacity = '1';
        }, 10);
        
        // Store reference for cleanup
        icon._tooltip = tooltip;
    }
    
    function hideTooltip(event) {
        const icon = event.target;
        if (icon._tooltip) {
            icon._tooltip.style.opacity = '0';
            setTimeout(() => {
                if (icon._tooltip && icon._tooltip.parentNode) {
                    icon._tooltip.parentNode.removeChild(icon._tooltip);
                }
                icon._tooltip = null;
            }, 300);
        }
    }
    
    function removeExistingTooltip() {
        const existingTooltips = document.querySelectorAll('.simple-tooltip');
        existingTooltips.forEach(tooltip => {
            if (tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
            }
        });
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeTooltips);
    } else {
        initializeTooltips();
    }
    
    // Re-initialize when language changes
    document.addEventListener('languageChanged', initializeTooltips);
    
    console.log('Simple tooltip fix loaded');
})();

