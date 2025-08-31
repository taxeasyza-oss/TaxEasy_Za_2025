// js/analytics/performance-monitor.js
class PerformanceMonitor {
  constructor() {
    this.metrics = [];
    this.init();
  }
  
  init() {
    this.measureLoadTime();
    console.log('Performance monitoring active');
  }
  
  measureLoadTime() {
    window.addEventListener('load', () => {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      console.log(`Page load time: ${loadTime}ms`);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.performanceMonitor = new PerformanceMonitor();
});
