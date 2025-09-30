// Travel Enhancements JavaScript
// Handles the enhanced travel expense calculation functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize travel method dropdown functionality
    initializeTravelMethodDropdown();
    
    // Initialize travel calculation logic
    initializeTravelCalculations();
});

function initializeTravelMethodDropdown() {
    const travelMethodSelect = document.getElementById('travelMethod');
    const travelAssessedGroup = document.getElementById('travelAssessedGroup');
    const travelKmGroup = document.getElementById('travelKmGroup');
    
    if (travelMethodSelect) {
        travelMethodSelect.addEventListener('change', function() {
            const selectedMethod = this.value;
            
            if (selectedMethod === 'assessed') {
                // Show travel assessed input, hide km input
                if (travelAssessedGroup) travelAssessedGroup.style.display = 'block';
                if (travelKmGroup) travelKmGroup.style.display = 'none';
                
                // Clear km input when switching to assessed
                const businessKmInput = document.getElementById('businessKm');
                if (businessKmInput) businessKmInput.value = '';
            } else if (selectedMethod === 'km') {
                // Show km input, hide travel assessed input
                if (travelAssessedGroup) travelAssessedGroup.style.display = 'none';
                if (travelKmGroup) travelKmGroup.style.display = 'block';
                
                // Clear assessed input when switching to km
                const travelAssessedInput = document.getElementById('travelAssessed');
                if (travelAssessedInput) travelAssessedInput.value = '';
            }
            
            // Recalculate when method changes
            updateTravelCalculation();
        });
        
        // Initialize display based on default selection
        travelMethodSelect.dispatchEvent(new Event('change'));
    }
}

function initializeTravelCalculations() {
    // Add event listeners to all travel-related inputs
    const travelInputs = [
        'travelAssessed',
        'businessKm', 
        'otherTravelExpenses'
    ];
    
    travelInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', updateTravelCalculation);
            input.addEventListener('change', updateTravelCalculation);
        }
    });
}

function updateTravelCalculation() {
    const travelMethod = document.getElementById('travelMethod')?.value || 'assessed';
    let totalTravelExpenses = 0;
    
    if (travelMethod === 'assessed') {
        // Use travel assessed amount
        const travelAssessed = parseFloat(document.getElementById('travelAssessed')?.value || 0);
        totalTravelExpenses += travelAssessed;
    } else if (travelMethod === 'km') {
        // Calculate based on business kilometres
        const businessKm = parseFloat(document.getElementById('businessKm')?.value || 0);
        // SARS 2025 rate: R4.20 per km for the first 20,000 km, R2.95 thereafter
        const kmRate1 = 4.20; // First 20,000 km
        const kmRate2 = 2.95; // Above 20,000 km
        const threshold = 20000;
        
        if (businessKm <= threshold) {
            totalTravelExpenses += businessKm * kmRate1;
        } else {
            totalTravelExpenses += (threshold * kmRate1) + ((businessKm - threshold) * kmRate2);
        }
    }
    
    // Add other actual travel expenses
    const otherTravelExpenses = parseFloat(document.getElementById('otherTravelExpenses')?.value || 0);
    totalTravelExpenses += otherTravelExpenses;
    
    // Update the hidden businessTravel field for backward compatibility
    const businessTravelInput = document.getElementById('businessTravel');
    if (businessTravelInput) {
        businessTravelInput.value = totalTravelExpenses.toFixed(2);
    }
    
    // Trigger main calculation update if the function exists
    if (typeof updateCalculation === 'function') {
        updateCalculation();
    }
    
    return totalTravelExpenses;
}

// Export function for use in other scripts
window.updateTravelCalculation = updateTravelCalculation;

