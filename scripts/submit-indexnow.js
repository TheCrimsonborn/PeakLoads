const https = require('node:https');

const host = 'peakloads.com';
const key = process.env.INDEXNOW_KEY;

if (!key) {
  console.error('Error: INDEXNOW_KEY environment variable is missing.');
  process.exit(1);
}

const keyLocation = `https://${host}/${key}.txt`;
const urlList = [
  'https://peakloads.com/',
  'https://peakloads.com/privacy',
  'https://peakloads.com/terms',
];

const payload = JSON.stringify({
  host,
  key,
  keyLocation,
  urlList,
});

const options = {
  hostname: 'api.indexnow.org',
  port: 443,
  path: '/indexnow',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload),
  },
};

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 200 || res.statusCode === 202) {
      console.log('Successfully submitted URLs to IndexNow.');
      console.log('--- IMPORTANT INSTRUCTIONS ---');
      console.log(`Please ensure you have created a text file named '${key}.txt' in the root directory of your website (where index.html resides).`);
      console.log(`The file should contain exactly the following text: ${key}`);
      console.log('This is required by search engines to verify your ownership.');
    } else {
      console.error(`Error: Received status code ${res.statusCode} from IndexNow.`);
      console.error(`Response data: ${data}`);
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error(`Error sending request to IndexNow: ${error.message}`);
  process.exit(1);
});

req.write(payload);
req.end();
