const fs = require('fs');
const https = require('https');
const path = require('path');

const url = 'https://raw.githubusercontent.com/sasaxang/Farsi_word_Builder/main/streamlit-app/data/affixes.json';
const dest = path.join(__dirname, '../data/affixes.json');

console.log('🔄 Syncing affixes.json from Streamlit repository...');

https.get(url, (res) => {
    if (res.statusCode !== 200) {
        console.error(`❌ Failed to fetch data. Status Code: ${res.statusCode}`);
        process.exit(1);
    }

    const file = fs.createWriteStream(dest);
    res.pipe(file);

    file.on('finish', () => {
        file.close();
        console.log('✅ affixes.json updated successfully!');
    });
}).on('error', (err) => {
    console.error('❌ Error fetching data:', err.message);
    process.exit(1);
});
