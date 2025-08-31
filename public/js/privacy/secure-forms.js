// js/privacy/secure-forms.js
class SecureFormHandler {
  constructor() {
    this.sensitiveFields = ['fullName', 'idNumber', 'email', 'basicSalary', 'bonus', 'commission', 'pensionFund', 'medicalAid'];
    this.init();
  }
  
  init() {
    this.setupSecureInputs();
    this.setupAutoClearing();
  }
  
  setupSecureInputs() {
    this.sensitiveFields.forEach(fieldId => {
      const field = document.getElementById(fieldId);
      if (field) {
        const indicator = document.createElement('span');
        indicator.style.cssText = 'margin-left: 5px; color: #059669; font-size: 12px;';
        indicator.innerHTML = '🔒';
        
        const label = field.parentNode.querySelector('label');
        if (label) label.appendChild(indicator);
      }
    });
  }
  
  setupAutoClearing() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.clearSensitiveFields();
      }
    });
  }
  
  clearSensitiveFields() {
    this.sensitiveFields.forEach(fieldId => {
      const field = document.getElementById(fieldId);
      if (field) field.value = '';
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new SecureFormHandler();
});
