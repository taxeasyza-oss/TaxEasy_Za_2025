# TaxEasy ZA 2025 - Bug Fixes & Deployment Todo

## Phase 3: Apply preservation-compliant fixes based on review feedback

### P0 Bug Fixes (Critical)

- [x] **Contrast/Readability**: Fix color contrast to meet WCAG 2.2 AA standards (≥4.5:1 light mode, ≥7:1 dark mode)
- [ ] **PDF Generator**: Implement working PDF generation endpoint with signed URL return
- [ ] **PayFast Integration**: Add PayFast sandbox integration with visible pricing (R 149.00)
- [x] **Remove Jozi Angels**: Global search and remove all references to "Jozi Angels"
- [ ] **PAYE/Provisional Tax**: Add fields for taxes already paid and update calculation
- [ ] **E-Filing Guide**: Ensure multilingual e-Filing guide is properly integrated
- [x] **Price Clarity**: Display "R 149.00 incl. VAT" clearly under buy button

### POPIA Compliance

- [x] Add POPIA consent checkbox (unchecked by default)
- [ ] Implement data retention policy (30-day TTL)
- [ ] Add "Delete my data" functionality
- [x] Ensure no data leaves browser until "Buy" is clicked

### UI/UX Requirements

- [x] Language switcher as sticky top-bar dropdown
- [x] Numeric inputs with proper mobile keyboard
- [x] Real-time validation with aria-live messages
- [x] Progress bar reflecting visible sections
- [x] Dark mode toggle with prefers-color-scheme support
- [x] Keyboard navigation and focus rings

### PWA & Performance

- [x] Create manifest.json with proper icons
- [x] Implement service worker for offline functionality
- [ ] Optimize for Lighthouse score ≥95

### Testing

- [ ] Create Jest tests for tax calculations
- [ ] Add accessibility testing with axe-core
- [ ] Test PayFast integration flow

## Preservation Guidelines Compliance

- [ ] Use injection-only workflow with guarded comments
- [ ] Create overrides.css for CSS changes
- [ ] Create patches.js for JavaScript additions
- [ ] Implement feature flags in config.js
- [ ] Document all changes with PRESERVE/NOPRESERVE commits

