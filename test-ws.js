import https from 'https';

const options = {
  hostname: 'chat.tittoosss.workers.dev',
  path: '/ws/board_youtube-promotion?uid=test1234&name=TestUser',
  headers: {
    'Upgrade': 'websocket',
    'Connection': 'Upgrade',
    'Sec-WebSocket-Key': 'dGhlIHNhbXBsZSBub25jZQ==',
    'Sec-WebSocket-Version': '13'
  }
};

const req = https.request(options, (res) => {
  console.log('STATUS:', res.statusCode);
  console.log('HEADERS:', res.headers);
  res.on('data', (chunk) => console.log('BODY:', chunk.toString()));
});

req.on('error', (e) => console.error('ERROR:', e.message));
req.end();
