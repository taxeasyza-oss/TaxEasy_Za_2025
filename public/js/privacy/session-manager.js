// js/privacy/session-manager.js
class POPIACompliantSessionManager {
  constructor() {
    this.config = {
      sessionTimeout: 30 * 60 * 1000, // 30 minutes
      warningTime: 5 * 60 * 1000,     // 5 minutes before timeout
      maxInactivity: 15 * 60 * 1000,  // 15 minutes of inactivity
      dataRetention: 0,               // 0 = immediate deletion
      encryptionKey: this.generateEncryptionKey()
    };
    
    this.sessionData = new Map();
    this.timers = new Map();
    this.userConsentStatus = new Map();
    this.isUserActive = true;
    this.lastActivity = Date.now();
    
    this.init();
  }
  
  init() {
    this.setupSessionTracking();
    this.setupInactivityDetection();
    this.setupBeforeUnloadHandlers();
    this.setupStorageClearing();
    this.setupConsentManagement();
    this.displayPrivacyNotice();
    
    console.log('POPIA-compliant session manager initialized');
  }
  
  startSession() {
    const sessionId = this.generateSecureSessionId();
    const sessionStart = Date.now();
    
    const session = {
      id: sessionId,
      startTime: sessionStart,
      lastActivity: sessionStart,
      expiresAt: sessionStart + this.config.sessionTimeout,
      dataProcessingConsent: false,
      userLocation: this.detectUserLocation(),
      browserFingerprint: this.createMinimalFingerprint()
    };
    
    this.sessionData.set('current', session);
    this.startSessionTimer(sessionId);
    this.requestUserConsent();
    
    this.dispatchEvent('sessionStarted', { sessionId });
    return sessionId;
  }
  
  endSession(reason = 'user_initiated') {
    const session = this.sessionData.get('current');
    if (!session) return;
    
    console.log(`Ending session: ${reason}`);
    this.clearAllTimers();
    this.clearAllUserData();
    this.sessionData.clear();
    
    this.dispatchEvent('sessionEnded', { 
      sessionId: session.id, 
      reason,
      duration: Date.now() - session.startTime
    });
    
    this.showDataClearedNotification();
  }
  
  clearAllUserData() {
    this.clearLocalStorage();
    this.clearSessionStorage();
    this.clearCookies();
    this.clearFormData();
    this.clearApplicationState();
  }
  
  clearLocalStorage() {
    try {
      const keys = Object.keys(localStorage);
      const taxKeys = keys.filter(key => 
        key.includes('tax') || 
        key.includes('calc') || 
        key.includes('form') ||
        key.includes('user')
      );
      
      taxKeys.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
  
  clearSessionStorage() {
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error('Error clearing sessionStorage:', error);
    }
  }
  
  clearCookies() {
    try {
      document.cookie.split(';').forEach(cookie => {
        const [name] = cookie.split('=');
        document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      });
    } catch (error) {
      console.error('Error clearing cookies:', error);
    }
  }
  
  clearFormData() {
    document.querySelectorAll('input, select, textarea').forEach(element => {
      if (element.type === 'checkbox' || element.type === 'radio') {
        element.checked = false;
      } else {
        element.value = '';
      }
    });
  }
  
  clearApplicationState() {
    if (window.wizard) window.wizard.clearAllData();
    if (window.taxEngine) window.taxEngine.clearAllData();
  }
  
  requestUserConsent() {
    if (document.querySelector('.popia-consent-modal')) return;
    
    const modal = document.createElement('div');
    modal.className = 'popia-consent-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    
    modal.innerHTML = `
      <div style="background: white; padding: 30px; border-radius: 12px; max-width: 600px;">
        <h2 style="color: #1f2937; margin-bottom: 20px;">Data Processing Consent - POPIA Compliance</h2>
        <div style="margin-bottom: 20px; line-height: 1.6; color: #4b5563;">
          <p><strong>TaxEasy_ZA</strong> is committed to protecting your privacy in compliance with POPIA.</p>
          <ul>
            <li>Personal information processed only for tax calculation</li>
            <li>All data automatically deleted when session ends</li>
            <li>No permanent storage of personal information</li>
          </ul>
        </div>
        <div style="margin-bottom: 20px;">
          <label style="display: flex; align-items: center; margin-bottom: 10px;">
            <input type="checkbox" id="consentRequired" style="margin-right: 10px;">
            <span>I consent to processing my personal information for tax calculation</span>
          </label>
        </div>
        <div style="display: flex; gap: 15px; justify-content: flex-end;">
          <button id="acceptConsent" style="padding: 10px 20px; background: #059669; color: white; border: none; border-radius: 6px;" disabled>Accept & Continue</button>
        </div>
      </div>
    `;
    
    const requiredCheckbox = modal.querySelector('#consentRequired');
    const acceptButton = modal.querySelector('#acceptConsent');
    
    requiredCheckbox.addEventListener('change', () => {
      acceptButton.disabled = !requiredCheckbox.checked;
    });
    
    acceptButton.addEventListener('click', () => {
      this.userConsentStatus.set('required', true);
      modal.remove();
      this.dispatchEvent('consentGranted', { required: true });
    });
    
    document.body.appendChild(modal);
  }
  
  displayPrivacyNotice() {
    const notice = document.createElement('div');
    notice.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: #1f2937;
      color: white;
      padding: 10px 20px;
      font-size: 12px;
      text-align: center;
      z-index: 1000;
    `;
    notice.innerHTML = '🔒 POPIA Compliant: All data auto-deleted when session ends';
    document.body.appendChild(notice);
  }
  
  dispatchEvent(eventName, detail) {
    const event = new CustomEvent(`sessionManager:${eventName}`, { detail });
    document.dispatchEvent(event);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.sessionManager = new POPIACompliantSessionManager();
  window.sessionManager.startSession();
});

window.addEventListener('beforeunload', () => {
  if (window.sessionManager) {
    window.sessionManager.endSession('page_unload');
  }
});
