const fs = require('fs');

console.log('🚀 FINAL RENDER.COM DEPLOYMENT VALIDATION\n');

const criticalChecks = [
    { file: 'package.json', required: true, test: (c) => JSON.parse(c).scripts.start },
    { file: 'backend/server.js', required: true, test: (c) => c.includes('app.listen') },
    { file: 'index.html', required: true, test: (c) => c.includes('wizard') },
    { file: 'render.yaml', required: true, test: (c) => c.includes('services:') }
];

let ready = true;

criticalChecks.forEach(check => {
    if (fs.existsSync(check.file)) {
        const content = fs.readFileSync(check.file, 'utf8');
        const passed = check.test(content);
        console.log(`${passed ? '✅' : '❌'} ${check.file}: ${passed ? 'READY' : 'NEEDS FIX'}`);
        if (!passed) ready = false;
    } else if (check.required) {
        console.log(`❌ ${check.file}: MISSING`);
        ready = false;
    }
});

console.log(`\n${ready ? '🎉 READY FOR DEPLOYMENT!' : '❌ FIX ISSUES BEFORE DEPLOYING'}`);

if (ready) {
    console.log('\n🚀 NEXT STEPS:');
    console.log('1. git push origin main');
    console.log('2. Go to render.com');
    console.log('3. Connect your repository');
    console.log('4. Deploy!');
}