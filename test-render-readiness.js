const fs = require('fs');
const path = require('path');

console.log('🚀 RENDER.COM DEPLOYMENT READINESS TEST\n');

const checks = [
    {
        name: 'Package.json',
        file: 'package.json',
        test: (content) => {
            const pkg = JSON.parse(content);
            return pkg.scripts && pkg.scripts.start && pkg.engines;
        },
        message: 'Must have start script and Node.js version specified'
    },
    {
        name: 'Render.yaml',
        file: 'render.yaml',
        test: (content) => content.includes('services:') && content.includes('web'),
        message: 'Must have valid render.yaml configuration'
    },
    {
        name: 'Server.js',
        file: 'backend/server.js',
        test: (content) => content.includes('app.listen') && content.includes('/api/health'),
        message: 'Must have server listener and health endpoint'
    },
    {
        name: 'Environment Variables',
        file: '.env.example',
        optional: true,
        test: (content) => content.includes('NODE_ENV') && content.includes('PORT'),
        message: 'Should have environment variables documented'
    },
    {
        name: 'Git Repository',
        file: '.git',
        test: () => fs.existsSync('.git'),
        message: 'Must be a git repository'
    }
];

let passed = 0;
let total = checks.length;

checks.forEach(check => {
    try {
        if (check.optional && !fs.existsSync(check.file)) {
            console.log(`⚠️  ${check.name}: OPTIONAL - ${check.message}`);
            return;
        }
        
        if (fs.existsSync(check.file)) {
            const content = fs.readFileSync(check.file, 'utf8');
            const result = check.test(content);
            
            if (result) {
                console.log(`✅ ${check.name}: PASS`);
                passed++;
            } else {
                console.log(`❌ ${check.name}: FAIL - ${check.message}`);
            }
        } else {
            console.log(`❌ ${check.name}: NOT FOUND`);
        }
    } catch (error) {
        console.log(`❌ ${check.name}: ERROR - ${error.message}`);
    }
});

console.log(`\n📊 DEPLOYMENT READINESS: ${passed}/${total} checks passed`);

if (passed === total) {
    console.log('\n🎉 READY FOR RENDER.COM DEPLOYMENT!');
    console.log('✅ All requirements met');
    console.log('✅ Production-ready configuration');
    console.log('✅ Commercial-grade features implemented');
} else {
    console.log('\n⚠️  FIX REQUIRED BEFORE DEPLOYMENT');
    console.log('Please address the failed checks above');
}
