const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    // Base URL for the application
    baseUrl: 'http://localhost:8000',
    
    // Viewport settings
    viewportWidth: 1280,
    viewportHeight: 720,
    
    // Test files location
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    
    // Support file
    supportFile: 'cypress/support/e2e.js',
    
    // Screenshots and videos
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    video: true,
    screenshotOnRunFailure: true,
    
    // Test settings
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 30000,
    
    // Retry settings
    retries: {
      runMode: 2,
      openMode: 0
    },
    
    // Environment variables
    env: {
      // PayFast test card details
      testCard: {
        number: '4111111111111111',
        expiry: '12/25',
        cvv: '123'
      },
      
      // Test user data
      testUser: {
        name: 'John Test User',
        email: 'test@example.com',
        idNumber: '8001015009087'
      }
    },
    
    setupNodeEvents(on, config) {
      // Task for generating test reports
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
        
        // Task for file operations
        readFile(filename) {
          return new Promise((resolve, reject) => {
            const fs = require('fs');
            fs.readFile(filename, 'utf8', (err, data) => {
              if (err) {
                reject(err);
              } else {
                resolve(data);
              }
            });
          });
        }
      });
      
      // Plugin for generating HTML reports
      require('cypress-mochawesome-reporter/plugin')(on);
      
      return config;
    },
  },
  
  component: {
    devServer: {
      framework: 'create-react-app',
      bundler: 'webpack',
    },
  },
  
  // Reporter configuration
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,
    reportPageTitle: 'TaxEasy ZA 2025 - Test Results',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
  },
});

