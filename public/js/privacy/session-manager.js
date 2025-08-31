export class SessionManager {
  constructor() {
    this.timeout = 1500000; // 25 minutes
    this.setupListeners();
  }
  
  setupListeners() {
    document.addEventListener('mousemove', this.resetTimer.bind(this));
    document.addEventListener('keypress', this.resetTimer.bind(this));
  }
  
  resetTimer() {
    clearTimeout(this.timer);
    this.timer = setTimeout(this.logoutUser, this.timeout);
  }
  
  logoutUser() {
    // GDPR/POPIA compliant logout logic
    sessionStorage.clear();
    window.location.href = '/?session=expired';
  }
}