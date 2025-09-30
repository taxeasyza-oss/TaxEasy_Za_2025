/**
 * TaxEasy ZA 2025 - Configuration File
 * 
 * IMPORTANT: This file contains configuration settings and API endpoints.
 * You MUST update the following sections before deployment:
 * 
 * 1. PayFast Configuration - Add your merchant credentials
 * 2. Environment Settings - Set production URLs
 * 3. Feature Flags - Enable/disable features as needed
 */

window.TaxEasyConfig = {
    // ===========================================
    // PAYFAST CONFIGURATION
    // ===========================================
    // TODO: UPDATE THESE VALUES WITH YOUR PAYFAST CREDENTIALS
    payfast: {
        // Sandbox Configuration (for testing)
        sandbox: {
            merchantId: 'YOUR_SANDBOX_MERCHANT_ID',        // TODO: Replace with your sandbox merchant ID
            merchantKey: 'YOUR_SANDBOX_MERCHANT_KEY',      // TODO: Replace with your sandbox merchant key
            passphrase: 'YOUR_SANDBOX_PASSPHRASE',         // TODO: Replace with your sandbox passphrase
            url: 'https://sandbox.payfast.co.za/eng/process',
            returnUrl: window.location.origin + '/payment-success.html',
            cancelUrl: window.location.origin + '/payment-cancelled.html',
            notifyUrl: window.location.origin + '/api/payfast-itn'  // TODO: Implement ITN endpoint
        },
        
        // Production Configuration (for live payments)
        production: {
            merchantId: 'YOUR_LIVE_MERCHANT_ID',           // TODO: Replace with your live merchant ID
            merchantKey: 'YOUR_LIVE_MERCHANT_KEY',         // TODO: Replace with your live merchant key
            passphrase: 'YOUR_LIVE_PASSPHRASE',            // TODO: Replace with your live passphrase
            url: 'https://www.payfast.co.za/eng/process',
            returnUrl: window.location.origin + '/payment-success.html',
            cancelUrl: window.location.origin + '/payment-cancelled.html',
            notifyUrl: window.location.origin + '/api/payfast-itn'  // TODO: Implement ITN endpoint
        }
    },

    // ===========================================
    // PDF GENERATION CONFIGURATION
    // ===========================================
    // TODO: IMPLEMENT PDF GENERATION ENDPOINT
    pdf: {
        // Backend endpoint for PDF generation
        generateUrl: '/api/generate-pdf',                  // TODO: Implement this endpoint
        
        // PDF configuration
        settings: {
            format: 'A4',
            orientation: 'portrait',
            margin: {
                top: '20mm',
                right: '15mm',
                bottom: '20mm',
                left: '15mm'
            }
        }
    },

    // ===========================================
    // ENVIRONMENT CONFIGURATION
    // ===========================================
    environment: {
        // Current environment - change to 'production' for live deployment
        current: 'development',                            // TODO: Change to 'production' for live site
        
        // API base URLs
        apiBaseUrl: {
            development: 'http://localhost:3000/api',
            production: 'https://your-domain.com/api'      // TODO: Replace with your production API URL
        },
        
        // Frontend URLs
        frontendUrl: {
            development: 'http://localhost:8080',
            production: 'https://your-domain.com'          // TODO: Replace with your production domain
        }
    },

    // ===========================================
    // FEATURE FLAGS
    // ===========================================
    features: {
        // PayFast integration
        payfast: {
            enabled: true,
            useSandbox: true                               // TODO: Set to false for production
        },
        
        // PDF generation
        pdfGeneration: {
            enabled: true,
            requirePayment: true                           // Set to false for free PDF downloads
        },
        
        // POPIA compliance
        popia: {
            enabled: true,
            strictMode: true,                              // Enforce all POPIA requirements
            dataRetentionDays: 30
        },
        
        // Analytics and tracking
        analytics: {
            enabled: false,                                // TODO: Enable if you want analytics
            googleAnalytics: {
                enabled: false,
                trackingId: 'GA_TRACKING_ID',              // TODO: Add your GA tracking ID
                anonymizeIp: true                          // Required for POPIA compliance
            }
        },
        
        // Development features
        development: {
            debugMode: true,                               // TODO: Set to false for production
            showTestData: true,                            // TODO: Set to false for production
            bypassPayment: false                           // TODO: Keep false for production
        },

        // Promotional codes
        promoCodes: {
            enabled: true                                  // TODO: Set to false for production
        }
    },

    // ===========================================
    // PRICING CONFIGURATION
    // ===========================================
    pricing: {
        pdfReport: {
            amount: 14900,                                 // Amount in cents (R149.00)
            currency: 'ZAR',
            description: 'Professional Tax Report 2025',
            vatIncluded: true
        }
    },

    // ===========================================
    // SARS INTEGRATION
    // ===========================================
    sars: {
        // SARS eFiling URLs for different languages
        efilingUrls: {
            en: 'https://www.sarsefiling.co.za',
            af: 'https://www.sarsefiling.co.za',
            zu: 'https://www.sarsefiling.co.za',
            xh: 'https://www.sarsefiling.co.za',
            st: 'https://www.sarsefiling.co.za'
        },
        
        // SARS contact information
        contactInfo: {
            phone: '0800 00 7277',
            email: 'info@sars.gov.za',
            website: 'https://www.sars.gov.za'
        }
    },

    // ===========================================
    // SECURITY CONFIGURATION
    // ===========================================
    security: {
        // HTTPS enforcement
        enforceHttps: true,                                // TODO: Ensure this is true for production
        
        // Content Security Policy
        csp: {
            enabled: true,
            reportOnly: false                              // Set to true for testing, false for enforcement
        },
        
        // Rate limiting (if implemented)
        rateLimit: {
            enabled: true,
            maxRequests: 100,
            windowMs: 900000                               // 15 minutes
        }
    },

    // ===========================================
    // LOCALIZATION
    // ===========================================
    localization: {
        defaultLanguage: 'en',
        supportedLanguages: ['en', 'af', 'zu', 'xh', 'st'],
        fallbackLanguage: 'en'
    }
};

// ===========================================
// HELPER FUNCTIONS
// ===========================================

/**
 * Get current environment configuration
 */
window.TaxEasyConfig.getCurrentEnvironment = function() {
    return this.environment.current;
};

/**
 * Get API base URL for current environment
 */
window.TaxEasyConfig.getApiBaseUrl = function() {
    return this.environment.apiBaseUrl[this.environment.current];
};

/**
 * Get PayFast configuration for current environment
 */
window.TaxEasyConfig.getPayFastConfig = function() {
    return this.features.payfast.useSandbox ? 
        this.payfast.sandbox : 
        this.payfast.production;
};

/**
 * Check if feature is enabled
 */
window.TaxEasyConfig.isFeatureEnabled = function(featurePath) {
    const keys = featurePath.split('.');
    let current = this.features;
    
    for (const key of keys) {
        if (current[key] === undefined) return false;
        current = current[key];
    }
    
    return current === true;
};

/**
 * Validate configuration before use
 */
window.TaxEasyConfig.validate = function() {
    const errors = [];
    
    // Check PayFast configuration
    if (this.features.payfast.enabled) {
        const payfastConfig = this.getPayFastConfig();
        if (payfastConfig.merchantId.startsWith('YOUR_')) {
            errors.push('PayFast merchant ID not configured');
        }
        if (payfastConfig.merchantKey.startsWith('YOUR_')) {
            errors.push('PayFast merchant key not configured');
        }
    }
    
    // Check environment URLs
    if (this.environment.current === 'production') {
        if (this.environment.apiBaseUrl.production.includes('your-domain.com')) {
            errors.push('Production API URL not configured');
        }
        if (this.environment.frontendUrl.production.includes('your-domain.com')) {
            errors.push('Production frontend URL not configured');
        }
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
};

// ===========================================
// DEPLOYMENT CHECKLIST
// ===========================================
/*
BEFORE DEPLOYING TO PRODUCTION, ENSURE YOU HAVE:

1. ✅ Updated PayFast credentials (merchantId, merchantKey, passphrase)
2. ✅ Set environment.current to 'production'
3. ✅ Updated production URLs (apiBaseUrl, frontendUrl)
4. ✅ Set features.payfast.useSandbox to false
5. ✅ Set features.development.debugMode to false
6. ✅ Set features.development.showTestData to false
7. ✅ Implemented PDF generation endpoint (/api/generate-pdf)
8. ✅ Implemented PayFast ITN endpoint (/api/payfast-itn)
9. ✅ Configured SSL certificate for HTTPS
10. ✅ Tested all payment flows in sandbox environment

OPTIONAL CONFIGURATIONS:
- Enable Google Analytics if needed
- Configure custom domain URLs
- Set up monitoring and error tracking
- Configure email notifications
- Set up backup and recovery procedures
*/



// ===========================================
// BEGIN FIX-#PROMO-CODES promotional code system – DO NOT EDIT ABOVE
// ===========================================

/**
 * Promotional Code Configuration
 * 
 * This section manages promotional/testing codes that allow users to bypass
 * payment and access premium PDF reports for testing purposes.
 * 
 * IMPORTANT: 
 * - Set ENABLE_PROMO_CODES to false in production to disable this feature
 * - Generate unique codes for your testing team
 * - Codes are one-time use only (marked as used after first use)
 */
window.TaxEasyConfig.promoCodes = {
    // Feature flag to enable/disable promo code functionality
    enabled: true,                                         // TODO: Set to false for production
    
    // List of promotional codes for testing
    // Each code can be used only once
    codes: [
        { code: '5d4468e1-f386-4cd9-bf75-52a83da2911a', used: false, description: 'Tester Code 001' },
        { code: '6f69dd23-ec36-4387-a1fc-8f1d14c88392', used: false, description: 'Tester Code 002' },
        { code: '0c601819-a854-4163-b1bb-f43b51c34e3d', used: false, description: 'Tester Code 003' },
        { code: '1fae01a0-7349-4c8b-bbdb-a4bb60a5c8a0', used: false, description: 'Tester Code 004' },
        { code: '2606663e-a265-4740-bb79-2b27ddc47ed3', used: false, description: 'Tester Code 005' },
        { code: '8940a5ed-b057-4f3a-8571-ca61033c4f6c', used: false, description: 'Tester Code 006' },
        { code: '5890b58b-fbd1-49d6-82e4-1fa23820adcb', used: false, description: 'Tester Code 007' },
        { code: 'de4b306f-d2f9-4aee-b8c3-0298f76549d1', used: false, description: 'Tester Code 008' },
        { code: '14a8dcd1-92db-4618-a2bd-0be3ae64ad46', used: false, description: 'Tester Code 009' },
        { code: 'b8077a6d-028e-4bdb-86a9-87b32f9dfedc', used: false, description: 'Tester Code 010' },
        { code: 'c71ba5d4-e67a-4f5f-b152-000a2c629db9', used: false, description: 'Tester Code 011' },
        { code: '71ff084c-ba4a-4472-9306-4b3977de0ff4', used: false, description: 'Tester Code 012' },
        { code: 'c21587e8-f1c6-4b32-a450-80f84b10a233', used: false, description: 'Tester Code 013' },
        { code: '3bc9e2c8-1e01-4977-b24f-e4c09db2ba01', used: false, description: 'Tester Code 014' },
        { code: 'e3cb769c-e7ea-4b2b-a25e-aa0fa7ee91ab', used: false, description: 'Tester Code 015' },
        { code: 'f090a888-919c-40d2-b93e-6d815e11b063', used: false, description: 'Tester Code 016' },
        { code: 'a92584ef-5770-4c93-96a1-4a17528da144', used: false, description: 'Tester Code 017' },
        { code: 'ac3f69f8-b75a-47be-84db-e44eea0a891c', used: false, description: 'Tester Code 018' },
        { code: '58a6a0c9-0e80-480f-8ab0-378eb79dacf7', used: false, description: 'Tester Code 019' },
        { code: '9cd3e6a6-e1a6-4cd4-a532-fb62ee664b36', used: false, description: 'Tester Code 020' },
        { code: 'f71baaeb-a8b0-4b11-a2cd-9b4ce02320b3', used: false, description: 'Tester Code 021' },
        { code: '5961ea54-c313-416e-b695-f6df649d0252', used: false, description: 'Tester Code 022' },
        { code: '13a4bc0d-057d-46d2-9cc4-89db265f18f4', used: false, description: 'Tester Code 023' },
        { code: '938e50ac-cd87-41cf-afea-c12387196f1f', used: false, description: 'Tester Code 024' },
        { code: 'eb68b2e9-7552-4aeb-b263-e5bfcfe57b23', used: false, description: 'Tester Code 025' },
        { code: '27708bba-32ad-40a8-97f5-c17e031508ba', used: false, description: 'Tester Code 026' },
        { code: '235c7762-fc2b-4163-aed3-e5bcf32525c6', used: false, description: 'Tester Code 027' },
        { code: '15c1c82e-07a5-4fca-8a0b-b4d7fb2680e9', used: false, description: 'Tester Code 028' },
        { code: '75a766d1-4e8a-4200-96ab-f6938502e0ee', used: false, description: 'Tester Code 029' },
        { code: '86ddb4ec-036d-40e5-9c01-e0d6df2928a3', used: false, description: 'Tester Code 030' },
        { code: 'd2a5c600-a958-41e3-b568-7f4a2b37159b', used: false, description: 'Tester Code 031' },
        { code: 'e12aaf5e-f2b3-4654-bc92-9925b9fa40d1', used: false, description: 'Tester Code 032' },
        { code: '4d734ba9-52e8-4adf-b32c-ab01f68d0992', used: false, description: 'Tester Code 033' },
        { code: '2a0f88cc-5a0e-4bb7-829b-28b6c4e3886a', used: false, description: 'Tester Code 034' },
        { code: 'bdecc6e7-0ef3-43fa-83d9-e3b091474355', used: false, description: 'Tester Code 035' },
        { code: '3a40d314-9dc0-41ce-92c3-3c0e807a3dc5', used: false, description: 'Tester Code 036' },
        { code: '1c4f0658-ef47-4d55-8f53-481208b9dc7c', used: false, description: 'Tester Code 037' },
        { code: '0c50e8f6-67e0-4281-9c16-15f82f5ac597', used: false, description: 'Tester Code 038' },
        { code: '4bdd135d-7377-4794-850b-f6d582592c92', used: false, description: 'Tester Code 039' },
        { code: 'fe54442a-304a-42da-ba12-afb8f925923f', used: false, description: 'Tester Code 040' },
        { code: 'ec3a2390-afcf-452f-b726-adc788f51d0a', used: false, description: 'Tester Code 041' },
        { code: '0b077631-e267-4516-accc-2c58cb63866e', used: false, description: 'Tester Code 042' },
        { code: '3e6b24cc-c735-4f4f-b3a3-d0dd426df473', used: false, description: 'Tester Code 043' },
        { code: 'f8d6dbc4-ce07-48b5-a538-c8a6b52cb47a', used: false, description: 'Tester Code 044' },
        { code: '66e7818d-f851-477d-9064-707aec8ff548', used: false, description: 'Tester Code 045' },
        { code: 'a46cdb58-2995-4b05-9df1-9c917cdfabd0', used: false, description: 'Tester Code 046' },
        { code: '0287a43c-1ef9-4250-a4b8-56baffe0fc4a', used: false, description: 'Tester Code 047' },
        { code: '28808b84-b8c4-494c-878e-6719a8ea43ba', used: false, description: 'Tester Code 048' },
        { code: '4161a1c1-f1a6-4e2a-bf65-29ff1fdae55d', used: false, description: 'Tester Code 049' },
        { code: 'e3039b73-26f9-4654-a23e-362f1478fa41', used: false, description: 'Tester Code 050' },
        { code: 'c669fe57-9c1e-48b4-992d-e8f1ec31dc4b', used: false, description: 'Tester Code 051' },
        { code: '958ba7ac-c837-44be-9eeb-dedb1e4eabac', used: false, description: 'Tester Code 052' },
        { code: '42b863fa-dc29-4ebb-b1e0-a7f802658cd1', used: false, description: 'Tester Code 053' },
        { code: '69d9d3da-92ec-462a-8b84-64ed2c1a26e1', used: false, description: 'Tester Code 054' },
        { code: 'c0ec5874-3003-4a22-b7e0-9b364ba73533', used: false, description: 'Tester Code 055' },
        { code: '40e0cded-1546-46cc-9350-f4160f053ce1', used: false, description: 'Tester Code 056' },
        { code: '262c9cfd-1dbf-4edd-9fbf-7097045339f0', used: false, description: 'Tester Code 057' },
        { code: '83e123ef-f7d2-4b74-ac12-5c03f1e9cdc0', used: false, description: 'Tester Code 058' },
        { code: '7f5a755d-5cf9-4ce2-b278-3ced2040df63', used: false, description: 'Tester Code 059' },
        { code: '832f525c-81f9-4765-98cd-eb8f90c22e25', used: false, description: 'Tester Code 060' },
        { code: 'da9284e3-db1d-491e-9a07-5c9687e63417', used: false, description: 'Tester Code 061' },
        { code: '2af9179e-1198-4265-8cbc-d3f5234bf7cb', used: false, description: 'Tester Code 062' },
        { code: '0250619b-7fe4-4093-83be-a54649fc04ae', used: false, description: 'Tester Code 063' },
        { code: '5b2086a6-0734-4a51-adbd-294b9636c10c', used: false, description: 'Tester Code 064' },
        { code: '1bcfa1f9-c90b-417e-8600-3625acebbdfd', used: false, description: 'Tester Code 065' },
        { code: '18808a2c-28aa-492d-ad1e-b1641885de68', used: false, description: 'Tester Code 066' },
        { code: '72b51561-3208-4694-b1d8-06a820fccf81', used: false, description: 'Tester Code 067' },
        { code: 'fdfc2102-774e-4345-acb2-6ffc610f4ecd', used: false, description: 'Tester Code 068' },
        { code: '6c19d62c-f1ea-4e30-8bac-e4b2e4caf179', used: false, description: 'Tester Code 069' },
        { code: '581610cd-8fa0-4eee-951c-99bd88c93327', used: false, description: 'Tester Code 070' },
        { code: '548c7d36-46e7-455c-867c-5cbf00a67e89', used: false, description: 'Tester Code 071' },
        { code: '1e6c2381-d9aa-4a9a-a5db-b22b69378b73', used: false, description: 'Tester Code 072' },
        { code: '0ce611b6-6b14-4947-a54d-daa75733f4d4', used: false, description: 'Tester Code 073' },
        { code: '91be7c1f-7e20-4b40-9a51-5954ea7d3865', used: false, description: 'Tester Code 074' },
        { code: 'b36502de-7663-4553-b4da-2c53f9825c19', used: false, description: 'Tester Code 075' },
        { code: '3023b6ed-e441-4013-a507-ddf931ee059a', used: false, description: 'Tester Code 076' },
        { code: 'bd5c5e22-ffae-406e-8892-b61e0c8b3c02', used: false, description: 'Tester Code 077' },
        { code: '701f7e35-c292-487e-a0b3-f3bd7b675751', used: false, description: 'Tester Code 078' },
        { code: '0140f41a-bbac-4128-9477-882d8d20e110', used: false, description: 'Tester Code 079' },
        { code: '0c1cb34b-3847-4a71-a7eb-fb3c1ead2b04', used: false, description: 'Tester Code 080' },
        { code: '4f5db968-8d11-4447-9990-85c3d9905f0a', used: false, description: 'Tester Code 081' },
        { code: 'd6188148-05c7-446c-9fd9-018e980c90c7', used: false, description: 'Tester Code 082' },
        { code: 'dbd57e54-3b0a-466c-aa2e-4f9f34a4a0a8', used: false, description: 'Tester Code 083' },
        { code: '4c796d91-fb7d-46d2-82ac-ec5949f5a026', used: false, description: 'Tester Code 084' },
        { code: '5f3da7f3-2769-421c-aab1-5783184fa86b', used: false, description: 'Tester Code 085' },
        { code: 'dfc5dd0f-ac06-4474-b3dd-9da3530f9551', used: false, description: 'Tester Code 086' },
        { code: '88e17d42-b385-4381-8d94-a95b261926e1', used: false, description: 'Tester Code 087' },
        { code: '8d261288-9c05-48ec-98c4-85f4351c7e66', used: false, description: 'Tester Code 088' },
        { code: '716730c1-6079-4d4d-b687-c992c7b85638', used: false, description: 'Tester Code 089' },
        { code: '60eb2364-aa4b-45c3-ba91-949f594c636f', used: false, description: 'Tester Code 090' },
        { code: 'db5fda9b-1e5c-4841-a70b-8e049db50592', used: false, description: 'Tester Code 091' },
        { code: 'd75d004c-5fa2-4124-88b7-7e04c9785ffc', used: false, description: 'Tester Code 092' },
        { code: '5d221bd5-37f4-4218-abd6-7f4652ca9e0e', used: false, description: 'Tester Code 093' },
        { code: '1d951480-4a86-4e65-9f36-32cc0e9a16ea', used: false, description: 'Tester Code 094' },
        { code: '8a8af5a5-6056-47f3-8d85-2fdc4102afe4', used: false, description: 'Tester Code 095' },
        { code: '39d96262-44ab-48af-8111-bd2487bb379f', used: false, description: 'Tester Code 096' },
        { code: '511a9097-4597-4c27-b21a-d51f996ae9d6', used: false, description: 'Tester Code 097' },
        { code: 'c75e9d4d-8c09-44a6-b241-05ea12feb0ac', used: false, description: 'Tester Code 098' },
        { code: 'd8661af5-ce30-4112-86d7-4f6d789735e7', used: false, description: 'Tester Code 099' },
        { code: 'eebdca7d-f2e8-4db4-ab09-560ac4cb3869', used: false, description: 'Tester Code 100' }
    ],false, description: 'Tester Code 012' },
        { code: 'c21587e8-f1c6-4b32-a450-80f84b10a233', used: false, description: 'Tester Code 013' },
        { code: '3bc9e2c8-1e01-4977-b24f-e4c09db2ba01', used: false, description: 'Tester Code 014' },
        { code: 'e3cb769c-e7ea-4b2b-a25e-aa0fa7ee91ab', used: false, description: 'Tester Code 015' },
        { code: 'f090a888-919c-40d2-b93e-6d815e11b063', used: false, description: 'Tester Code 016' },
        { code: 'a92584ef-5770-4c93-96a1-4a17528da144', used: false, description: 'Tester Code 017' },
        { code: 'ac3f69f8-b75a-47be-84db-e44eea0a891c', used: false, description: 'Tester Code 018' },
        { code: '58a6a0c9-0e80-480f-8ab0-378eb79dacf7', used: false, description: 'Tester Code 019' },
        { code: '9cd3e6a6-e1a6-4cd4-a532-fb62ee664b36', used: false, description: 'Tester Code 020' },
        { code: 'f71baaeb-a8b0-4b11-a2cd-9b4ce02320b3', used: false, description: 'Tester Code 021' },
        { code: '5961ea54-c313-416e-b695-f6df649d0252', used: false, description: 'Tester Code 022' },
        { code: '13a4bc0d-057d-46d2-9cc4-89db265f18f4', used: false, description: 'Tester Code 023' },
        { code: '938e50ac-cd87-41cf-afea-c12387196f1f', used: false, description: 'Tester Code 024' },
        { code: 'eb68b2e9-7552-4aeb-b263-e5bfcfe57b23', used: false, description: 'Tester Code 025' },
        { code: '27708bba-32ad-40a8-97f5-c17e031508ba', used: false, description: 'Tester Code 026' },
        { code: '235c7762-fc2b-4163-aed3-e5bcf32525c6', used: false, description: 'Tester Code 027' },
        { code: '15c1c82e-07a5-4fca-8a0b-b4d7fb2680e9', used: false, description: 'Tester Code 028' },
        { code: '75a766d1-4e8a-4200-96ab-f6938502e0ee', used: false, description: 'Tester Code 029' },
        { code: '86ddb4ec-036d-40e5-9c01-e0d6df2928a3', used: false, description: 'Tester Code 030' },
        { code: 'd2a5c600-a958-41e3-b568-7f4a2b37159b', used: false, description: 'Tester Code 031' },
        { code: 'e12aaf5e-f2b3-4654-bc92-9925b9fa40d1', used: false, description: 'Tester Code 032' },
        { code: '4d734ba9-52e8-4adf-b32c-ab01f68d0992', used: false, description: 'Tester Code 033' },
        { code: '2a0f88cc-5a0e-4bb7-829b-28b6c4e3886a', used: false, description: 'Tester Code 034' },
        { code: 'bdecc6e7-0ef3-43fa-83d9-e3b091474355', used: false, description: 'Tester Code 035' },
        { code: '3a40d314-9dc0-41ce-92c3-3c0e807a3dc5', used: false, description: 'Tester Code 036' },
        { code: '1c4f0658-ef47-4d55-8f53-481208b9dc7c', used: false, description: 'Tester Code 037' },
        { code: '0c50e8f6-67e0-4281-9c16-15f82f5ac597', used: false, description: 'Tester Code 038' },
        { code: '4bdd135d-7377-4794-850b-f6d582592c92', used: false, description: 'Tester Code 039' },
        { code: 'fe54442a-304a-42da-ba12-afb8f925923f', used: false, description: 'Tester Code 040' },
        { code: 'ec3a2390-afcf-452f-b726-adc788f51d0a', used: false, description: 'Tester Code 041' },
        { code: '0b077631-e267-4516-accc-2c58cb63866e', used: false, description: 'Tester Code 042' },
        { code: '3e6b24cc-c735-4f4f-b3a3-d0dd426df473', used: false, description: 'Tester Code 043' },
        { code: 'f8d6dbc4-ce07-48b5-a538-c8a6b52cb47a', used: false, description: 'Tester Code 044' },
        { code: '66e7818d-f851-477d-9064-707aec8ff548', used: false, description: 'Tester Code 045' },
        { code: 'a46cdb58-2995-4b05-9df1-9c917cdfabd0', used: false, description: 'Tester Code 046' },
        { code: '0287a43c-1ef9-4250-a4b8-56baffe0fc4a', used: false, description: 'Tester Code 047' },
        { code: '28808b84-b8c4-494c-878e-6719a8ea43ba', used: false, description: 'Tester Code 048' },
        { code: '4161a1c1-f1a6-4e2a-bf65-29ff1fdae55d', used: false, description: 'Tester Code 049' },
        { code: 'e3039b73-26f9-4654-a23e-362f1478fa41', used: false, description: 'Tester Code 050' },
        { code: 'c669fe57-9c1e-48b4-992d-e8f1ec31dc4b', used: false, description: 'Tester Code 051' },
        { code: '958ba7ac-c837-44be-9eeb-dedb1e4eabac', used: false, description: 'Tester Code 052' },
        { code: '42b863fa-dc29-4ebb-b1e0-a7f802658cd1', used: false, description: 'Tester Code 053' },
        { code: '69d9d3da-92ec-462a-8b84-64ed2c1a26e1', used: false, description: 'Tester Code 054' },
        { code: 'c0ec5874-3003-4a22-b7e0-9b364ba73533', used: false, description: 'Tester Code 055' },
        { code: '40e0cded-1546-46cc-9350-f4160f053ce1', used: false, description: 'Tester Code 056' },
        { code: '262c9cfd-1dbf-4edd-9fbf-7097045339f0', used: false, description: 'Tester Code 057' },
        { code: '83e123ef-f7d2-4b74-ac12-5c03f1e9cdc0', used: false, description: 'Tester Code 058' },
        { code: '7f5a755d-5cf9-4ce2-b278-3ced2040df63', used: false, description: 'Tester Code 059' },
        { code: '832f525c-81f9-4765-98cd-eb8f90c22e25', used: false, description: 'Tester Code 060' },
        { code: 'da9284e3-db1d-491e-9a07-5c9687e63417', used: false, description: 'Tester Code 061' },
        { code: '2af9179e-1198-4265-8cbc-d3f5234bf7cb', used: false, description: 'Tester Code 062' },
        { code: '0250619b-7fe4-4093-83be-a54649fc04ae', used: false, description: 'Tester Code 063' },
        { code: '5b2086a6-0734-4a51-adbd-294b9636c10c', used: false, description: 'Tester Code 064' },
        { code: '1bcfa1f9-c90b-417e-8600-3625acebbdfd', used: false, description: 'Tester Code 065' },
        { code: '18808a2c-28aa-492d-ad1e-b1641885de68', used: false, description: 'Tester Code 066' },
        { code: '72b51561-3208-4694-b1d8-06a820fccf81', used: false, description: 'Tester Code 067' },
        { code: 'fdfc2102-774e-4345-acb2-6ffc610f4ecd', used: false, description: 'Tester Code 068' },
        { code: '6c19d62c-f1ea-4e30-8bac-e4b2e4caf179', used: false, description: 'Tester Code 069' },
        { code: '581610cd-8fa0-4eee-951c-99bd88c93327', used: false, description: 'Tester Code 070' },
        { code: '548c7d36-46e7-455c-867c-5cbf00a67e89', used: false, description: 'Tester Code 071' },
        { code: '1e6c2381-d9aa-4a9a-a5db-b22b69378b73', used: false, description: 'Tester Code 072' },
        { code: '0ce611b6-6b14-4947-a54d-daa75733f4d4', used: false, description: 'Tester Code 073' },
        { code: '91be7c1f-7e20-4b40-9a51-5954ea7d3865', used: false, description: 'Tester Code 074' },
        { code: 'b36502de-7663-4553-b4da-2c53f9825c19', used: false, description: 'Tester Code 075' },
        { code: '3023b6ed-e441-4013-a507-ddf931ee059a', used: false, description: 'Tester Code 076' },
        { code: 'bd5c5e22-ffae-406e-8892-b61e0c8b3c02', used: false, description: 'Tester Code 077' },
        { code: '701f7e35-c292-487e-a0b3-f3bd7b675751', used: false, description: 'Tester Code 078' },
        { code: '0140f41a-bbac-4128-9477-882d8d20e110', used: false, description: 'Tester Code 079' },
        { code: '0c1cb34b-3847-4a71-a7eb-fb3c1ead2b04', used: false, description: 'Tester Code 080' },
        { code: '4f5db968-8d11-4447-9990-85c3d9905f0a', used: false, description: 'Tester Code 081' },
        { code: 'd6188148-05c7-446c-9fd9-018e980c90c7', used: false, description: 'Tester Code 082' },
        { code: 'dbd57e54-3b0a-466c-aa2e-4f9f34a4a0a8', used: false, description: 'Tester Code 083' },
        { code: '4c796d91-fb7d-46d2-82ac-ec5949f5a026', used: false, description: 'Tester Code 084' },
        { code: '5f3da7f3-2769-421c-aab1-5783184fa86b', used: false, description: 'Tester Code 085' },
        { code: 'dfc5dd0f-ac06-4474-b3dd-9da3530f9551', used: false, description: 'Tester Code 086' },
        { code: '88e17d42-b385-4381-8d94-a95b261926e1', used: false, description: 'Tester Code 087' },
        { code: '8d261288-9c05-48ec-98c4-85f4351c7e66', used: false, description: 'Tester Code 088' },
        { code: '716730c1-6079-4d4d-b687-c992c7b85638', used: false, description: 'Tester Code 089' },
        { code: '60eb2364-aa4b-45c3-ba91-949f594c636f', used: false, description: 'Tester Code 090' },
        { code: 'db5fda9b-1e5c-4841-a70b-8e049db50592', used: false, description: 'Tester Code 091' },
        { code: 'd75d004c-5fa2-4124-88b7-7e04c9785ffc', used: false, description: 'Tester Code 092' },
        { code: '5d221bd5-37f4-4218-abd6-7f4652ca9e0e', used: false, description: 'Tester Code 093' },
        { code: '1d951480-4a86-4e65-9f36-32cc0e9a16ea', used: false, description: 'Tester Code 094' },
        { code: '8a8af5a5-6056-47f3-8d85-2fdc4102afe4', used: false, description: 'Tester Code 095' },
        { code: '39d96262-44ab-48af-8111-bd2487bb379f', used: false, description: 'Tester Code 096' },
        { code: '511a9097-4597-4c27-b21a-d51f996ae9d6', used: false, description: 'Tester Code 097' },
        { code: 'c75e9d4d-8c09-44a6-b241-05ea12feb0ac', used: false, description: 'Tester Code 098' },
        { code: 'd8661af5-ce30-4112-86d7-4f6d789735e7', used: false, description: 'Tester Code 099' },
        { code: 'eebdca7d-f2e8-4db4-ab09-560ac4cb3869', used: false, description: 'Tester Code 100' }
    ],false, description: 'Tester Code 012' },
        { code: 'c21587e8-f1c6-4b32-a450-80f84b10a233', used: false, description: 'Tester Code 013' },
        { code: '3bc9e2c8-1e01-4977-b24f-e4c09db2ba01', used: false, description: 'Tester Code 014' },
        { code: 'e3cb769c-e7ea-4b2b-a25e-aa0fa7ee91ab', used: false, description: 'Tester Code 015' },
        { code: 'f090a888-919c-40d2-b93e-6d815e11b063', used: false, description: 'Tester Code 016' },
        { code: 'a92584ef-5770-4c93-96a1-4a17528da144', used: false, description: 'Tester Code 017' },
        { code: 'ac3f69f8-b75a-47be-84db-e44eea0a891c', used: false, description: 'Tester Code 018' },
        { code: '58a6a0c9-0e80-480f-8ab0-378eb79dacf7', used: false, description: 'Tester Code 019' },
        { code: '9cd3e6a6-e1a6-4cd4-a532-fb62ee664b36', used: false, description: 'Tester Code 020' },
        { code: 'f71baaeb-a8b0-4b11-a2cd-9b4ce02320b3', used: false, description: 'Tester Code 021' },
        { code: '5961ea54-c313-416e-b695-f6df649d0252', used: false, description: 'Tester Code 022' },
        { code: '13a4bc0d-057d-46d2-9cc4-89db265f18f4', used: false, description: 'Tester Code 023' },
        { code: '938e50ac-cd87-41cf-afea-c12387196f1f', used: false, description: 'Tester Code 024' },
        { code: 'eb68b2e9-7552-4aeb-b263-e5bfcfe57b23', used: false, description: 'Tester Code 025' },
        { code: '27708bba-32ad-40a8-97f5-c17e031508ba', used: false, description: 'Tester Code 026' },
        { code: '235c7762-fc2b-4163-aed3-e5bcf32525c6', used: false, description: 'Tester Code 027' },
        { code: '15c1c82e-07a5-4fca-8a0b-b4d7fb2680e9', used: false, description: 'Tester Code 028' },
        { code: '75a766d1-4e8a-4200-96ab-f6938502e0ee', used: false, description: 'Tester Code 029' },
        { code: '86ddb4ec-036d-40e5-9c01-e0d6df2928a3', used: false, description: 'Tester Code 030' },
        { code: 'd2a5c600-a958-41e3-b568-7f4a2b37159b', used: false, description: 'Tester Code 031' },
        { code: 'e12aaf5e-f2b3-4654-bc92-9925b9fa40d1', used: false, description: 'Tester Code 032' },
        { code: '4d734ba9-52e8-4adf-b32c-ab01f68d0992', used: false, description: 'Tester Code 033' },
        { code: '2a0f88cc-5a0e-4bb7-829b-28b6c4e3886a', used: false, description: 'Tester Code 034' },
        { code: 'bdecc6e7-0ef3-43fa-83d9-e3b091474355', used: false, description: 'Tester Code 035' },
        { code: '3a40d314-9dc0-41ce-92c3-3c0e807a3dc5', used: false, description: 'Tester Code 036' },
        { code: '1c4f0658-ef47-4d55-8f53-481208b9dc7c', used: false, description: 'Tester Code 037' },
        { code: '0c50e8f6-67e0-4281-9c16-15f82f5ac597', used: false, description: 'Tester Code 038' },
        { code: '4bdd135d-7377-4794-850b-f6d582592c92', used: false, description: 'Tester Code 039' },
        { code: 'fe54442a-304a-42da-ba12-afb8f925923f', used: false, description: 'Tester Code 040' },
        { code: 'ec3a2390-afcf-452f-b726-adc788f51d0a', used: false, description: 'Tester Code 041' },
        { code: '0b077631-e267-4516-accc-2c58cb63866e', used: false, description: 'Tester Code 042' },
        { code: '3e6b24cc-c735-4f4f-b3a3-d0dd426df473', used: false, description: 'Tester Code 043' },
        { code: 'f8d6dbc4-ce07-48b5-a538-c8a6b52cb47a', used: false, description: 'Tester Code 044' },
        { code: '66e7818d-f851-477d-9064-707aec8ff548', used: false, description: 'Tester Code 045' },
        { code: 'a46cdb58-2995-4b05-9df1-9c917cdfabd0', used: false, description: 'Tester Code 046' },
        { code: '0287a43c-1ef9-4250-a4b8-56baffe0fc4a', used: false, description: 'Tester Code 047' },
        { code: '28808b84-b8c4-494c-878e-6719a8ea43ba', used: false, description: 'Tester Code 048' },
        { code: '4161a1c1-f1a6-4e2a-bf65-29ff1fdae55d', used: false, description: 'Tester Code 049' },
        { code: 'e3039b73-26f9-4654-a23e-362f1478fa41', used: false, description: 'Tester Code 050' },
        { code: 'c669fe57-9c1e-48b4-992d-e8f1ec31dc4b', used: false, description: 'Tester Code 051' },
        { code: '958ba7ac-c837-44be-9eeb-dedb1e4eabac', used: false, description: 'Tester Code 052' },
        { code: '42b863fa-dc29-4ebb-b1e0-a7f802658cd1', used: false, description: 'Tester Code 053' },
        { code: '69d9d3da-92ec-462a-8b84-64ed2c1a26e1', used: false, description: 'Tester Code 054' },
        { code: 'c0ec5874-3003-4a22-b7e0-9b364ba73533', used: false, description: 'Tester Code 055' },
        { code: '40e0cded-1546-46cc-9350-f4160f053ce1', used: false, description: 'Tester Code 056' },
        { code: '262c9cfd-1dbf-4edd-9fbf-7097045339f0', used: false, description: 'Tester Code 057' },
        { code: '83e123ef-f7d2-4b74-ac12-5c03f1e9cdc0', used: false, description: 'Tester Code 058' },
        { code: '7f5a755d-5cf9-4ce2-b278-3ced2040df63', used: false, description: 'Tester Code 059' },
        { code: '832f525c-81f9-4765-98cd-eb8f90c22e25', used: false, description: 'Tester Code 060' },
        { code: 'da9284e3-db1d-491e-9a07-5c9687e63417', used: false, description: 'Tester Code 061' },
        { code: '2af9179e-1198-4265-8cbc-d3f5234bf7cb', used: false, description: 'Tester Code 062' },
        { code: '0250619b-7fe4-4093-83be-a54649fc04ae', used: false, description: 'Tester Code 063' },
        { code: '5b2086a6-0734-4a51-adbd-294b9636c10c', used: false, description: 'Tester Code 064' },
        { code: '1bcfa1f9-c90b-417e-8600-3625acebbdfd', used: false, description: 'Tester Code 065' },
        { code: '18808a2c-28aa-492d-ad1e-b1641885de68', used: false, description: 'Tester Code 066' },
        { code: '72b51561-3208-4694-b1d8-06a820fccf81', used: false, description: 'Tester Code 067' },
        { code: 'fdfc2102-774e-4345-acb2-6ffc610f4ecd', used: false, description: 'Tester Code 068' },
        { code: '6c19d62c-f1ea-4e30-8bac-e4b2e4caf179', used: false, description: 'Tester Code 069' },
        { code: '581610cd-8fa0-4eee-951c-99bd88c93327', used: false, description: 'Tester Code 070' },
        { code: '548c7d36-46e7-455c-867c-5cbf00a67e89', used: false, description: 'Tester Code 071' },
        { code: '1e6c2381-d9aa-4a9a-a5db-b22b69378b73', used: false, description: 'Tester Code 072' },
        { code: '0ce611b6-6b14-4947-a54d-daa75733f4d4', used: false, description: 'Tester Code 073' },
        { code: '91be7c1f-7e20-4b40-9a51-5954ea7d3865', used: false, description: 'Tester Code 074' },
        { code: 'b36502de-7663-4553-b4da-2c53f9825c19', used: false, description: 'Tester Code 075' },
        { code: '3023b6ed-e441-4013-a507-ddf931ee059a', used: false, description: 'Tester Code 076' },
        { code: 'bd5c5e22-ffae-406e-8892-b61e0c8b3c02', used: false, description: 'Tester Code 077' },
        { code: '701f7e35-c292-487e-a0b3-f3bd7b675751', used: false, description: 'Tester Code 078' },
        { code: '0140f41a-bbac-4128-9477-882d8d20e110', used: false, description: 'Tester Code 079' },
        { code: '0c1cb34b-3847-4a71-a7eb-fb3c1ead2b04', used: false, description: 'Tester Code 080' },
        { code: '4f5db968-8d11-4447-9990-85c3d9905f0a', used: false, description: 'Tester Code 081' },
        { code: 'd6188148-05c7-446c-9fd9-018e980c90c7', used: false, description: 'Tester Code 082' },
        { code: 'dbd57e54-3b0a-466c-aa2e-4f9f34a4a0a8', used: false, description: 'Tester Code 083' },
        { code: '4c796d91-fb7d-46d2-82ac-ec5949f5a026', used: false, description: 'Tester Code 084' },
        { code: '5f3da7f3-2769-421c-aab1-5783184fa86b', used: false, description: 'Tester Code 085' },
        { code: 'dfc5dd0f-ac06-4474-b3dd-9da3530f9551', used: false, description: 'Tester Code 086' },
        { code: '88e17d42-b385-4381-8d94-a95b261926e1', used: false, description: 'Tester Code 087' },
        { code: '8d261288-9c05-48ec-98c4-85f4351c7e66', used: false, description: 'Tester Code 088' },
        { code: '716730c1-6079-4d4d-b687-c992c7b85638', used: false, description: 'Tester Code 089' },
        { code: '60eb2364-aa4b-45c3-ba91-949f594c636f', used: false, description: 'Tester Code 090' },
        { code: 'db5fda9b-1e5c-4841-a70b-8e049db50592', used: false, description: 'Tester Code 091' },
        { code: 'd75d004c-5fa2-4124-88b7-7e04c9785ffc', used: false, description: 'Tester Code 092' },
        { code: '5d221bd5-37f4-4218-abd6-7f4652ca9e0e', used: false, description: 'Tester Code 093' },
        { code: '1d951480-4a86-4e65-9f36-32cc0e9a16ea', used: false, description: 'Tester Code 094' },
        { code: '8a8af5a5-6056-47f3-8d85-2fdc4102afe4', used: false, description: 'Tester Code 095' },
        { code: '39d96262-44ab-48af-8111-bd2487bb379f', used: false, description: 'Tester Code 096' },
        { code: '511a9097-4597-4c27-b21a-d51f996ae9d6', used: false, description: 'Tester Code 097' },
        { code: 'c75e9d4d-8c09-44a6-b241-05ea12feb0ac', used: false, description: 'Tester Code 098' },
        { code: 'd8661af5-ce30-4112-86d7-4f6d789735e7', used: false, description: 'Tester Code 099' },
        { code: 'eebdca7d-f2e8-4db4-ab09-560ac4cb3869', used: false, description: 'Tester Code 100' }
    ],
    
    // Configuration options
    settings: {
        caseInsensitive: true,                             // Allow case-insensitive code entry
        trimWhitespace: true,                              // Automatically trim whitespace from codes
        maxAttempts: 3,                                    // Maximum failed attempts before lockout
        lockoutDuration: 300000                            // Lockout duration in milliseconds (5 minutes)
    }
};

/**
 * Validate a promotional code
 * @param {string} inputCode - The code entered by the user
 * @returns {object} Validation result with success status and message
 */
window.TaxEasyConfig.validatePromoCode = function(inputCode) {
    // Check if promo codes are enabled
    if (!this.promoCodes.enabled) {
        return {
            success: false,
            message: 'Promotional codes are not currently available.',
            code: 'FEATURE_DISABLED'
        };
    }
    
    // Sanitize input
    let cleanCode = inputCode;
    if (this.promoCodes.settings.trimWhitespace) {
        cleanCode = cleanCode.trim();
    }
    if (this.promoCodes.settings.caseInsensitive) {
        cleanCode = cleanCode.toUpperCase();
    }
    
    // Validate input
    if (!cleanCode || cleanCode.length === 0) {
        return {
            success: false,
            message: 'Please enter a promotional code.',
            code: 'EMPTY_CODE'
        };
    }
    
    // Find the code
    const codeEntry = this.promoCodes.codes.find(entry => {
        let entryCode = entry.code;
        if (this.promoCodes.settings.caseInsensitive) {
            entryCode = entryCode.toUpperCase();
        }
        return entryCode === cleanCode;
    });
    
    // Check if code exists
    if (!codeEntry) {
        return {
            success: false,
            message: 'Invalid promotional code. Please check your code and try again.',
            code: 'INVALID_CODE'
        };
    }
    
    // Check if code has been used
    if (codeEntry.used) {
        return {
            success: false,
            message: 'This promotional code has already been used.',
            code: 'CODE_USED'
        };
    }
    
    // Code is valid and unused
    return {
        success: true,
        message: 'Promotional code accepted! Generating your report...',
        code: 'CODE_VALID',
        codeEntry: codeEntry
    };
};

/**
 * Mark a promotional code as used
 * @param {string} inputCode - The code to mark as used
 * @returns {boolean} Success status
 */
window.TaxEasyConfig.markPromoCodeAsUsed = function(inputCode) {
    // Sanitize input (same as validation)
    let cleanCode = inputCode;
    if (this.promoCodes.settings.trimWhitespace) {
        cleanCode = cleanCode.trim();
    }
    if (this.promoCodes.settings.caseInsensitive) {
        cleanCode = cleanCode.toUpperCase();
    }
    
    // Find and mark the code as used
    const codeEntry = this.promoCodes.codes.find(entry => {
        let entryCode = entry.code;
        if (this.promoCodes.settings.caseInsensitive) {
            entryCode = entryCode.toUpperCase();
        }
        return entryCode === cleanCode;
    });
    
    if (codeEntry && !codeEntry.used) {
        codeEntry.used = true;
        codeEntry.usedAt = new Date().toISOString();
        
        // Store in localStorage for persistence across sessions
        try {
            const usedCodes = JSON.parse(localStorage.getItem('taxeasy_used_promo_codes') || '[]');
            usedCodes.push({
                code: codeEntry.code,
                usedAt: codeEntry.usedAt
            });
            localStorage.setItem('taxeasy_used_promo_codes', JSON.stringify(usedCodes));
        } catch (e) {
            console.warn('Could not save used promo code to localStorage:', e);
        }
        
        return true;
    }
    
    return false;
};

/**
 * Load used codes from localStorage on page load
 */
window.TaxEasyConfig.loadUsedPromoCodes = function() {
    try {
        const usedCodes = JSON.parse(localStorage.getItem('taxeasy_used_promo_codes') || '[]');
        
        // Mark codes as used based on localStorage data
        usedCodes.forEach(usedCodeData => {
            const codeEntry = this.promoCodes.codes.find(entry => entry.code === usedCodeData.code);
            if (codeEntry) {
                codeEntry.used = true;
                codeEntry.usedAt = usedCodeData.usedAt;
            }
        });
    } catch (e) {
        console.warn('Could not load used promo codes from localStorage:', e);
    }
};

/**
 * Get statistics about promo code usage
 * @returns {object} Usage statistics
 */
window.TaxEasyConfig.getPromoCodeStats = function() {
    const totalCodes = this.promoCodes.codes.length;
    const usedCodes = this.promoCodes.codes.filter(entry => entry.used).length;
    const availableCodes = totalCodes - usedCodes;
    
    return {
        total: totalCodes,
        used: usedCodes,
        available: availableCodes,
        usagePercentage: totalCodes > 0 ? Math.round((usedCodes / totalCodes) * 100) : 0
    };
};

// Load used codes when the configuration is loaded
if (typeof window !== 'undefined' && window.localStorage) {
    // Delay loading to ensure DOM is ready
    setTimeout(() => {
        window.TaxEasyConfig.loadUsedPromoCodes();
    }, 100);
}

// END FIX-#PROMO-CODES




// ===========================================
// BEGIN FIX-#PROMO-CODES promotional code system – DO NOT EDIT ABOVE
// ===========================================

/**
 * Promotional Code Configuration
 * 
 * This section manages promotional/testing codes that allow users to bypass
 * payment and access premium PDF reports for testing purposes.
 * 
 * IMPORTANT: 
 * - Set ENABLE_PROMO_CODES to false in production to disable this feature
 * - Generate unique codes for your testing team
 * - Codes are one-time use only (marked as used after first use)
 */
window.TaxEasyConfig.promoCodes = {
    // Feature flag to enable/disable promo code functionality
    enabled: true,                                         // TODO: Set to false for production
    
    // List of promotional codes for testing
    // Each code can be used only once
    codes: [
        { code: '5d4468e1-f386-4cd9-bf75-52a83da2911a', used: false, description: 'Tester Code 001' },
        { code: '6f69dd23-ec36-4387-a1fc-8f1d14c88392', used: false, description: 'Tester Code 002' },
        { code: '0c601819-a854-4163-b1bb-f43b51c34e3d', used: false, description: 'Tester Code 003' },
        { code: '1fae01a0-7349-4c8b-bbdb-a4bb60a5c8a0', used: false, description: 'Tester Code 004' },
        { code: '2606663e-a265-4740-bb79-2b27ddc47ed3', used: false, description: 'Tester Code 005' },
        { code: '8940a5ed-b057-4f3a-8571-ca61033c4f6c', used: false, description: 'Tester Code 006' },
        { code: '5890b58b-fbd1-49d6-82e4-1fa23820adcb', used: false, description: 'Tester Code 007' },
        { code: 'de4b306f-d2f9-4aee-b8c3-0298f76549d1', used: false, description: 'Tester Code 008' },
        { code: '14a8dcd1-92db-4618-a2bd-0be3ae64ad46', used: false, description: 'Tester Code 009' },
        { code: 'b8077a6d-028e-4bdb-86a9-87b32f9dfedc', used: false, description: 'Tester Code 010' },
        { code: 'c71ba5d4-e67a-4f5f-b152-000a2c629db9', used: false, description: 'Tester Code 011' },
        { code: '71ff084c-ba4a-4472-9306-4b3977de0ff4', used: false, description: 'Tester Code 012' },
        { code: 'c21587e8-f1c6-4b32-a450-80f84b10a233', used: false, description: 'Tester Code 013' },
        { code: '3bc9e2c8-1e01-4977-b24f-e4c09db2ba01', used: false, description: 'Tester Code 014' },
        { code: 'e3cb769c-e7ea-4b2b-a25e-aa0fa7ee91ab', used: false, description: 'Tester Code 015' },
        { code: 'f090a888-919c-40d2-b93e-6d815e11b063', used: false, description: 'Tester Code 016' },
        { code: 'a92584ef-5770-4c93-96a1-4a17528da144', used: false, description: 'Tester Code 017' },
        { code: 'ac3f69f8-b75a-47be-84db-e44eea0a891c', used: false, description: 'Tester Code 018' },
        { code: '58a6a0c9-0e80-480f-8ab0-378eb79dacf7', used: false, description: 'Tester Code 019' },
        { code: '9cd3e6a6-e1a6-4cd4-a532-fb62ee664b36', used: false, description: 'Tester Code 020' },
        { code: 'f71baaeb-a8b0-4b11-a2cd-9b4ce02320b3', used: false, description: 'Tester Code 021' },
        { code: '5961ea54-c313-416e-b695-f6df649d0252', used: false, description: 'Tester Code 022' },
        { code: '13a4bc0d-057d-46d2-9cc4-89db265f18f4', used: false, description: 'Tester Code 023' },
        { code: '938e50ac-cd87-41cf-afea-c12387196f1f', used: false, description: 'Tester Code 024' },
        { code: 'eb68b2e9-7552-4aeb-b263-e5bfcfe57b23', used: false, description: 'Tester Code 025' },
        { code: '27708bba-32ad-40a8-97f5-c17e031508ba', used: false, description: 'Tester Code 026' },
        { code: '235c7762-fc2b-4163-aed3-e5bcf32525c6', used: false, description: 'Tester Code 027' },
        { code: '15c1c82e-07a5-4fca-8a0b-b4d7fb2680e9', used: false, description: 'Tester Code 028' },
        { code: '75a766d1-4e8a-4200-96ab-f6938502e0ee', used: false, description: 'Tester Code 029' },
        { code: '86ddb4ec-036d-40e5-9c01-e0d6df2928a3', used: false, description: 'Tester Code 030' },
        { code: 'd2a5c600-a958-41e3-b568-7f4a2b37159b', used: false, description: 'Tester Code 031' },
        { code: 'e12aaf5e-f2b3-4654-bc92-9925b9fa40d1', used: false, description: 'Tester Code 032' },
        { code: '4d734ba9-52e8-4adf-b32c-ab01f68d0992', used: false, description: 'Tester Code 033' },
        { code: '2a0f88cc-5a0e-4bb7-829b-28b6c4e3886a', used: false, description: 'Tester Code 034' },
        { code: 'bdecc6e7-0ef3-43fa-83d9-e3b091474355', used: false, description: 'Tester Code 035' },
        { code: '3a40d314-9dc0-41ce-92c3-3c0e807a3dc5', used: false, description: 'Tester Code 036' },
        { code: '1c4f0658-ef47-4d55-8f53-481208b9dc7c', used: false, description: 'Tester Code 037' },
        { code: '0c50e8f6-67e0-4281-9c16-15f82f5ac597', used: false, description: 'Tester Code 038' },
        { code: '4bdd135d-7377-4794-850b-f6d582592c92', used: false, description: 'Tester Code 039' },
        { code: 'fe54442a-304a-42da-ba12-afb8f925923f', used: false, description: 'Tester Code 040' },
        { code: 'ec3a2390-afcf-452f-b726-adc788f51d0a', used: false, description: 'Tester Code 041' },
        { code: '0b077631-e267-4516-accc-2c58cb63866e', used: false, description: 'Tester Code 042' },
        { code: '3e6b24cc-c735-4f4f-b3a3-d0dd426df473', used: false, description: 'Tester Code 043' },
        { code: 'f8d6dbc4-ce07-48b5-a538-c8a6b52cb47a', used: false, description: 'Tester Code 044' },
        { code: '66e7818d-f851-477d-9064-707aec8ff548', used: false, description: 'Tester Code 045' },
        { code: 'a46cdb58-2995-4b05-9df1-9c917cdfabd0', used: false, description: 'Tester Code 046' },
        { code: '0287a43c-1ef9-4250-a4b8-56baffe0fc4a', used: false, description: 'Tester Code 047' },
        { code: '28808b84-b8c4-494c-878e-6719a8ea43ba', used: false, description: 'Tester Code 048' },
        { code: '4161a1c1-f1a6-4e2a-bf65-29ff1fdae55d', used: false, description: 'Tester Code 049' },
        { code: 'e3039b73-26f9-4654-a23e-362f1478fa41', used: false, description: 'Tester Code 050' },
        { code: 'c669fe57-9c1e-48b4-992d-e8f1ec31dc4b', used: false, description: 'Tester Code 051' },
        { code: '958ba7ac-c837-44be-9eeb-dedb1e4eabac', used: false, description: 'Tester Code 052' },
        { code: '42b863fa-dc29-4ebb-b1e0-a7f802658cd1', used: false, description: 'Tester Code 053' },
        { code: '69d9d3da-92ec-462a-8b84-64ed2c1a26e1', used: false, description: 'Tester Code 054' },
        { code: 'c0ec5874-3003-4a22-b7e0-9b364ba73533', used: false, description: 'Tester Code 055' },
        { code: '40e0cded-1546-46cc-9350-f4160f053ce1', used: false, description: 'Tester Code 056' },
        { code: '262c9cfd-1dbf-4edd-9fbf-7097045339f0', used: false, description: 'Tester Code 057' },
        { code: '83e123ef-f7d2-4b74-ac12-5c03f1e9cdc0', used: false, description: 'Tester Code 058' },
        { code: '7f5a755d-5cf9-4ce2-b278-3ced2040df63', used: false, description: 'Tester Code 059' },
        { code: '832f525c-81f9-4765-98cd-eb8f90c22e25', used: false, description: 'Tester Code 060' },
        { code: 'da9284e3-db1d-491e-9a07-5c9687e63417', used: false, description: 'Tester Code 061' },
        { code: '2af9179e-1198-4265-8cbc-d3f5234bf7cb', used: false, description: 'Tester Code 062' },
        { code: '0250619b-7fe4-4093-83be-a54649fc04ae', used: false, description: 'Tester Code 063' },
        { code: '5b2086a6-0734-4a51-adbd-294b9636c10c', used: false, description: 'Tester Code 064' },
        { code: '1bcfa1f9-c90b-417e-8600-3625acebbdfd', used: false, description: 'Tester Code 065' },
        { code: '18808a2c-28aa-492d-ad1e-b1641885de68', used: false, description: 'Tester Code 066' },
        { code: '72b51561-3208-4694-b1d8-06a820fccf81', used: false, description: 'Tester Code 067' },
        { code: 'fdfc2102-774e-4345-acb2-6ffc610f4ecd', used: false, description: 'Tester Code 068' },
        { code: '6c19d62c-f1ea-4e30-8bac-e4b2e4caf179', used: false, description: 'Tester Code 069' },
        { code: '581610cd-8fa0-4eee-951c-99bd88c93327', used: false, description: 'Tester Code 070' },
        { code: '548c7d36-46e7-455c-867c-5cbf00a67e89', used: false, description: 'Tester Code 071' },
        { code: '1e6c2381-d9aa-4a9a-a5db-b22b69378b73', used: false, description: 'Tester Code 072' },
        { code: '0ce611b6-6b14-4947-a54d-daa75733f4d4', used: false, description: 'Tester Code 073' },
        { code: '91be7c1f-7e20-4b40-9a51-5954ea7d3865', used: false, description: 'Tester Code 074' },
        { code: 'b36502de-7663-4553-b4da-2c53f9825c19', used: false, description: 'Tester Code 075' },
        { code: '3023b6ed-e441-4013-a507-ddf931ee059a', used: false, description: 'Tester Code 076' },
        { code: 'bd5c5e22-ffae-406e-8892-b61e0c8b3c02', used: false, description: 'Tester Code 077' },
        { code: '701f7e35-c292-487e-a0b3-f3bd7b675751', used: false, description: 'Tester Code 078' },
        { code: '0140f41a-bbac-4128-9477-882d8d20e110', used: false, description: 'Tester Code 079' },
        { code: '0c1cb34b-3847-4a71-a7eb-fb3c1ead2b04', used: false, description: 'Tester Code 080' },
        { code: '4f5db968-8d11-4447-9990-85c3d9905f0a', used: false, description: 'Tester Code 081' },
        { code: 'd6188148-05c7-446c-9fd9-018e980c90c7', used: false, description: 'Tester Code 082' },
        { code: 'dbd57e54-3b0a-466c-aa2e-4f9f34a4a0a8', used: false, description: 'Tester Code 083' },
        { code: '4c796d91-fb7d-46d2-82ac-ec5949f5a026', used: false, description: 'Tester Code 084' },
        { code: '5f3da7f3-2769-421c-aab1-5783184fa86b', used: false, description: 'Tester Code 085' },
        { code: 'dfc5dd0f-ac06-4474-b3dd-9da3530f9551', used: false, description: 'Tester Code 086' },
        { code: '88e17d42-b385-4381-8d94-a95b261926e1', used: false, description: 'Tester Code 087' },
        { code: '8d261288-9c05-48ec-98c4-85f4351c7e66', used: false, description: 'Tester Code 088' },
        { code: '716730c1-6079-4d4d-b687-c992c7b85638', used: false, description: 'Tester Code 089' },
        { code: '60eb2364-aa4b-45c3-ba91-949f594c636f', used: false, description: 'Tester Code 090' },
        { code: 'db5fda9b-1e5c-4841-a70b-8e049db50592', used: false, description: 'Tester Code 091' },
        { code: 'd75d004c-5fa2-4124-88b7-7e04c9785ffc', used: false, description: 'Tester Code 092' },
        { code: '5d221bd5-37f4-4218-abd6-7f4652ca9e0e', used: false, description: 'Tester Code 093' },
        { code: '1d951480-4a86-4e65-9f36-32cc0e9a16ea', used: false, description: 'Tester Code 094' },
        { code: '8a8af5a5-6056-47f3-8d85-2fdc4102afe4', used: false, description: 'Tester Code 095' },
        { code: '39d96262-44ab-48af-8111-bd2487bb379f', used: false, description: 'Tester Code 096' },
        { code: '511a9097-4597-4c27-b21a-d51f996ae9d6', used: false, description: 'Tester Code 097' },
        { code: 'c75e9d4d-8c09-44a6-b241-05ea12feb0ac', used: false, description: 'Tester Code 098' },
        { code: 'd8661af5-ce30-4112-86d7-4f6d789735e7', used: false, description: 'Tester Code 099' },
        { code: 'eebdca7d-f2e8-4db4-ab09-560ac4cb3869', used: false, description: 'Tester Code 100' }
    ]
};

