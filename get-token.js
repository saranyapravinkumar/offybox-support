// Get token and save to file
fetch('https://api.offybox.com/v1/support/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        email: 'admin@offybox.com',
        password: 'Admin@123'
    })
})
    .then(response => response.json())
    .then(data => {
        const fs = require('fs');
        const token = data.token;

        // Save just the token
        fs.writeFileSync('my-token.txt', token, 'utf-8');

        // Update .env file
        const envContent = `VITE_OFFYBOX_API_URL=https://api.offybox.com/v1\nVITE_OFFYBOX_TOKEN=${token}\n`;
        fs.writeFileSync('.env', envContent, 'utf-8');

        console.log('✅ Token saved successfully!');
        console.log('✅ .env file updated!');
        console.log('\n🔑 Your token (first 50 chars):', token.substring(0, 50) + '...');
        console.log('\n⚠️  IMPORTANT: Restart your dev server now!');
        console.log('   Press Ctrl+C to stop, then run: npm run dev');
    })
    .catch(error => {
        console.error('❌ Login failed:', error.message);
    });
