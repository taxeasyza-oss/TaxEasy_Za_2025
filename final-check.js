const fs = require('fs');

console.log('🎯 FINAL DEPLOYMENT VALIDATION:');
const checks = [
    { file: 'package.json', test: (c) => JSON.parse(c).scripts.start },
    { file: 'backend/server.js', test: (c) => c.includes('taxEngine') && c.includes('app.listen') },
    { file: 'index.html', test: (c) => c.includes('wizard') && c.includes('language') },
    { file: 'render.yaml', test: (c) => c.includes('services:') && c.includes('web') }
];

let ready = true;
checks.forEach(check => {
    if (fs.existsSync(check.file)) {
        const content = fs.readFileSync(check.file, 'utf8');
        const passed = check.test(content);
        console.log(`${passed ? '✅' : '❌'} ${check.file}`);
        if (!passed) ready = false;
    } else {
        console.log(`❌ ${check.file} - MISSING`);
        ready = false;
    }
});

console.log(`\n${ready ? '🎉 READY FOR DEPLOYMENT!' : '⚠️  FIX ISSUES FIRST'}`);
