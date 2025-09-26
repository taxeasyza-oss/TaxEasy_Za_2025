# TaxEasy ZA 2025 - Promotional Code System Documentation

## Overview

The promotional code system has been implemented to allow testing access to premium PDF reports without requiring PayFast payment processing. This system is designed for testing purposes and can be easily disabled for production deployment.

## Features

The promotional code system provides the following functionality:

- **One-time use promotional codes**: Each code can only be used once and is marked as used after successful validation
- **Bypass payment processing**: Valid promotional codes allow users to download professional PDF reports without payment
- **Feature flag control**: The entire system can be enabled or disabled via configuration
- **Preservation-compliant implementation**: All changes follow the strict preservation guidelines using injection-only workflow

## Implementation Details

### Configuration (public/js/config.js)

The promotional code system is configured in the `config.js` file with the following structure:

```javascript
window.TaxEasyConfig.promoCodes = {
    enabled: true,  // Set to false to disable the feature
    codes: [
        { code: 'unique-uuid-code', used: false, description: 'Tester Code 001' },
        // ... 100 total codes
    ]
};
```

### User Interface (public/index.html)

The promotional code UI elements are added to the Professional Report section and include:

- A "Have a promotional code?" link that toggles the promotional code input section
- An input field for entering promotional codes
- An "Apply" button to validate the entered code
- A message area for displaying validation results

### Validation Logic (public/js/patches.js)

The validation system includes:

- Code validation against the configured promotional codes
- One-time use enforcement (codes are marked as used after successful validation)
- UI updates when a valid code is applied
- Bypass of PayFast payment processing for valid codes
- Direct PDF generation for promotional code users

### Styling (public/css/overrides.css)

Custom CSS styles provide:

- Responsive design for promotional code elements
- Success and error message styling
- Dark mode support
- Mobile-friendly layout

## Available Promotional Codes

The system includes 100 unique promotional codes for testing purposes. Each code is a UUID4 string and can be used only once. Here are the first 10 codes for reference:

1. `5d4468e1-f386-4cd9-bf75-52a83da2911a` - Tester Code 001
2. `6f69dd23-ec36-4387-a1fc-8f1d14c88392` - Tester Code 002
3. `0c601819-a854-4163-b1bb-f43b51c34e3d` - Tester Code 003
4. `1fae01a0-7349-4c8b-bbdb-a4bb60a5c8a0` - Tester Code 004
5. `2606663e-a265-4740-bb79-2b27ddc47ed3` - Tester Code 005
6. `8940a5ed-b057-4f3a-8571-ca61033c4f6c` - Tester Code 006
7. `5890b58b-fbd1-49d6-82e4-1fa23820adcb` - Tester Code 007
8. `de4b306f-d2f9-4aee-b8c3-0298f76549d1` - Tester Code 008
9. `14a8dcd1-92db-4618-a2bd-0be3ae64ad46` - Tester Code 009
10. `b8077a6d-028e-4bdb-86a9-87b32f9dfedc` - Tester Code 010

For the complete list of all 100 codes, refer to the `public/js/config.js` file.

## Usage Instructions

### For Testing

1. Navigate to the TaxEasy application and complete the tax calculation wizard
2. Reach the Summary step (Step 5) where report options are displayed
3. In the Professional Report section, look for the "Have a promotional code?" link
4. Click the link to reveal the promotional code input section
5. Enter one of the available promotional codes
6. Click "Apply" to validate the code
7. If valid, the "Purchase Professional Report" button will change to "Download Professional Report (FREE)"
8. Click the button to generate and download the professional PDF report

### For Production Deployment

To disable the promotional code system for production:

1. Open `public/js/config.js`
2. Set `window.TaxEasyConfig.promoCodes.enabled = false`
3. The promotional code UI elements will not appear, and the system will use normal PayFast processing

## Technical Notes

### Preservation Compliance

All promotional code system changes follow the preservation guidelines:

- No existing code was modified
- All changes are implemented through injection-only workflow
- Feature flags allow easy enabling/disabling
- Clear markers indicate promotional code sections in all files

### Security Considerations

- Promotional codes are stored client-side for testing purposes only
- In a production environment, code validation should be performed server-side
- The current implementation is suitable for testing and demonstration purposes
- Consider implementing server-side validation and code management for production use

### Browser Compatibility

The promotional code system is compatible with:

- Modern browsers supporting ES6+ JavaScript features
- Mobile browsers with touch support
- Browsers with JavaScript enabled (required for the main application)

## Troubleshooting

### Promotional Code UI Not Visible

If the promotional code elements are not visible:

1. Check that `window.TaxEasyConfig.promoCodes.enabled` is set to `true`
2. Verify that all JavaScript files are loading correctly
3. Check the browser console for any JavaScript errors
4. Ensure you are on the Summary step (Step 5) of the wizard

### Code Validation Issues

If promotional codes are not validating:

1. Verify the code is entered correctly (case-sensitive)
2. Check that the code has not been used previously
3. Ensure the promotional code system is enabled in the configuration
4. Check the browser console for validation errors

### PDF Generation Issues

If PDF generation fails with promotional codes:

1. Verify that the main PDF generation system is working
2. Check that the `generateClientSidePDF` function is available
3. Ensure all required JavaScript libraries are loaded
4. Check the browser console for PDF generation errors

## Support

For technical support or questions about the promotional code system, refer to the main application documentation or contact the development team.



## UI Update: Modal-Based Promotional Code Entry

To address visibility issues and improve user experience, the promotional code entry has been refactored to use a modal dialog. This approach isolates the promotional code interface from existing layout conflicts and ensures consistent display across different sections of the application.

### How it Works:

1.  **Accessing the Modal:** A link titled "Have a promotional code?" is available at the bottom of the page. Clicking this link will open the promotional code entry modal.
2.  **Entering the Code:** Users can enter their promotional code into the input field within the modal.
3.  **Applying the Code:** Clicking the "Apply" button or pressing Enter will validate the code. A success or error message will be displayed within the modal.
4.  **Payment Bypass:** If a valid promotional code is successfully applied, the PayFast payment process for professional reports will be bypassed, allowing the user to generate the report directly.
5.  **Closing the Modal:** The modal can be closed by clicking the "X" button, clicking outside the modal, or successfully applying a code.

### Implementation Details:

*   **HTML Structure:** The modal dialog is defined in `public/index.html` with IDs such as `promoCodeModal`, `promoCodeInput`, `applyPromoCode`, and `promoCodeMessage`.
*   **CSS Styling:** Styling for the modal, including its overlay, positioning, and responsiveness, is handled in `public/css/overrides.css`.
*   **JavaScript Logic:** The `public/js/patches.js` file contains the JavaScript functions responsible for:
    *   Initializing the modal and attaching event listeners.
    *   Displaying and hiding the modal.
    *   Handling promotional code input and validation.
    *   Updating the UI based on code application status.
    *   Bypassing the PayFast payment flow upon successful code validation.

