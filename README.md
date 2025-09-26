# TaxEasy ZA 2025 - Professional South African Tax Calculator

A comprehensive, multilingual tax calculator for South African taxpayers, fully compliant with SARS 2025 regulations and POPIA privacy requirements.

## 🌟 Features

- **SARS 2025 Compliant**: Up-to-date with latest South African tax brackets and regulations
- **Multilingual Support**: Available in English, Afrikaans, isiZulu, isiXhosa, and Sesotho
- **POPIA Compliant**: Full compliance with South Africa's Protection of Personal Information Act
- **Progressive Web App**: Installable, works offline, and provides native app experience
- **Accessibility**: WCAG 2.2 AA compliant with keyboard navigation and screen reader support
- **Dark Mode**: Automatic dark/light theme switching based on user preference
- **Professional Reports**: Detailed PDF reports with step-by-step calculations
- **Secure**: Client-side calculations with optional secure payment processing

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0.0 or higher
- Modern web browser with JavaScript enabled

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/TaxEasy_ZA_2025.git
cd TaxEasy_ZA_2025
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Static Deployment

For static hosting (GitHub Pages, Netlify, etc.):

1. Serve the `public` directory directly:
```bash
# Using Python
python3 -m http.server 8080 --directory public

# Using Node.js
npx serve public

# Using any static file server
```

## 📁 Project Structure

```
TaxEasy_ZA_2025/
├── public/                 # Static files for deployment
│   ├── css/               # Stylesheets
│   │   ├── styles.css     # Main styles
│   │   ├── wizard.css     # Form wizard styles
│   │   ├── branding.css   # Brand-specific styles
│   │   └── overrides.css  # Preservation-compliant overrides
│   ├── js/                # JavaScript files
│   │   ├── main.js        # Main application logic
│   │   ├── tax-engine-2025-fixed.js  # Tax calculation engine
│   │   ├── patches.js     # Preservation-compliant patches
│   │   └── translations.js # Translation system
│   ├── images/            # Static images
│   ├── translations/      # JSON translation files
│   ├── index.html         # Main application page
│   ├── manifest.json      # PWA manifest
│   └── sw.js             # Service worker
├── package.json           # Node.js dependencies and scripts
├── README.md             # This file
└── .gitignore           # Git ignore rules
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run linting
npm run lint

# Run security audit
npm run security:audit
```

### Manual Testing

1. Start the local server
2. Test all form inputs and validation
3. Verify multilingual functionality
4. Test dark/light mode switching
5. Verify POPIA consent flow
6. Test PWA installation
7. Verify offline functionality

## 🌍 Multilingual Support

The application supports five South African languages:

- **English** (en) - Default
- **Afrikaans** (af)
- **isiZulu** (zu)
- **isiXhosa** (xh)
- **Sesotho** (st)

### Adding New Languages

1. Create translation file in `public/translations/[language_code].json`
2. Add language option to the language switcher
3. Update the language system configuration

## 🔒 POPIA Compliance

This application is fully compliant with South Africa's Protection of Personal Information Act (POPIA):

- **Consent Management**: Clear consent banners and opt-in mechanisms
- **Data Minimization**: Only collects necessary information
- **Purpose Limitation**: Data used only for tax calculation purposes
- **Retention Limits**: Automatic data deletion after 30 days
- **User Rights**: Data deletion and access rights implemented
- **Security**: All data encrypted in transit and at rest

## 🎨 Customization

### Themes and Styling

The application uses a preservation-compliant styling approach:

- Original styles remain untouched in base CSS files
- All customizations are in `css/overrides.css`
- Dark mode styles are automatically applied
- Color contrast meets WCAG 2.2 AA standards

### Feature Flags

Configure features using the feature flag system in `js/patches.js`:

```javascript
window.TAX_EASY_FLAGS = {
    PAYFAST_LIVE: false,      // PayFast live mode
    PDF_GENERATION: true,     // PDF report generation
    NEW_CONTRAST: true,       // Enhanced contrast mode
    POPIA_COMPLIANCE: true,   // POPIA features
    DARK_MODE: true,          // Dark mode toggle
    ENHANCED_VALIDATION: true // Real-time validation
};
```

## 🚀 Deployment

### GitHub Pages

1. Push your code to a GitHub repository
2. Go to repository Settings > Pages
3. Select source branch (usually `main`)
4. Set folder to `/` (root) or `/public` if using subdirectory
5. Your site will be available at `https://username.github.io/repository-name`

### Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: `echo "Static site - no build required"`
3. Set publish directory: `public`
4. Deploy automatically on git push

### Render

1. Connect your GitHub repository to Render
2. Choose "Static Site" service
3. Set build command: `echo "Static site"`
4. Set publish directory: `public`
5. Deploy with automatic SSL and CDN

### Custom Server

For custom server deployment:

1. Upload the `public` directory to your web server
2. Configure your web server to serve static files
3. Ensure HTTPS is enabled for PWA functionality
4. Set up proper MIME types for all file extensions

## 🔧 Configuration

### Environment Variables

For production deployment, configure these environment variables:

```bash
# PayFast Configuration (when implemented)
PAYFAST_MERCHANT_ID=your_merchant_id
PAYFAST_MERCHANT_KEY=your_merchant_key
PAYFAST_PASSPHRASE=your_passphrase
PAYFAST_URL=https://www.payfast.co.za/eng/process

# Application Settings
NODE_ENV=production
PORT=3000
```

### PWA Configuration

The application is configured as a Progressive Web App:

- **Installable**: Users can install it on their devices
- **Offline Support**: Core functionality works without internet
- **App-like Experience**: Full-screen mode and native feel
- **Automatic Updates**: Service worker handles updates

## 📊 Performance

The application is optimized for performance:

- **Lighthouse Score**: Target 95+ on all metrics
- **First Contentful Paint**: < 1.8s on 3G
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3.8s

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Follow the preservation guidelines in the codebase
4. Make your changes in `overrides.css` and `patches.js` files
5. Test thoroughly
6. Commit your changes: `git commit -m 'Add amazing feature'`
7. Push to the branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

### Preservation Guidelines

This project follows strict preservation guidelines:

- **Golden Rule**: If it's not broken, don't touch it
- **Injection-Only**: All changes go in separate override files
- **Feature Flags**: New features must be toggleable
- **Testing**: All changes must pass existing tests
- **Documentation**: All changes must be documented

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- **Issues**: Use GitHub Issues for bug reports and feature requests
- **Documentation**: Check this README and inline code comments
- **Community**: Join our discussions in GitHub Discussions

## 🏆 Acknowledgments

- South African Revenue Service (SARS) for tax regulation guidelines
- South African government for POPIA compliance requirements
- Open source community for tools and libraries used
- Professional Tax Solutions team for development and maintenance

## 📈 Roadmap

### Completed Features
- ✅ SARS 2025 tax calculations
- ✅ Multilingual support (5 languages)
- ✅ POPIA compliance
- ✅ PWA functionality
- ✅ Dark mode support
- ✅ Accessibility compliance

### Upcoming Features
- 🔄 PayFast payment integration
- 🔄 PDF report generation
- 🔄 Advanced tax scenarios
- 🔄 Tax planning tools
- 🔄 Mobile app versions
- 🔄 API for third-party integration

---

**TaxEasy ZA 2025** - Making South African tax compliance simple, accessible, and professional.

*Professional Tax Solutions - Simplifying tax, one click at a time.*

