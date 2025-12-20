// Quick test to verify API endpoint
const http = require('http');

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/results',
    method: 'GET'
};

console.log('Testing API endpoint: http://localhost:3000/api/results\n');

const req = http.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
        data += chunk;
    });
    
    res.on('end', () => {
        console.log('Status:', res.statusCode);
        console.log('Response:');
        try {
            const json = JSON.parse(data);
            console.log(JSON.stringify(json, null, 2));
            
            if (json.latest) {
                console.log('\n✅ Latest result found!');
                console.log('   Draw:', json.latest.drawNumber);
                console.log('   Numbers:', json.latest.numbers);
            } else {
                console.log('\n⚠️  No latest result found');
            }
            
            if (json.previous && json.previous.length > 0) {
                console.log(`\n✅ Found ${json.previous.length} previous results`);
            } else {
                console.log('\n⚠️  No previous results found');
            }
        } catch (e) {
            console.log('Raw response:', data);
        }
    });
});

req.on('error', (e) => {
    console.error('Error:', e.message);
    console.log('\nMake sure the API server is running: npm start');
});

req.end();

