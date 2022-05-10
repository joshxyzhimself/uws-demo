// @ts-check

import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { default as uws } from 'uWebSockets.js';

const app = uws.App({});

app.get('/*', (response, request) => {
  response.writeHeader('content-type', 'text/html');
  response.end(fs.readFileSync('./index.html'));
});


app.ws('/*', {
  idleTimeout: 0,
  open: (ws) => {
    ws.subscribe('chatbox');
  },
  message: (ws, message_arraybuffer) => {
    const message_buffer = Buffer.from(message_arraybuffer);
    const message_string = message_buffer.toString();
    const message = JSON.parse(message_string);
    assert(typeof message.sender === 'string');
    assert(typeof message.message === 'string');
    /* You can do app.publish('sensors/home/temperature', '22C') kind of pub/sub as well */
    app.publish('chatbox', JSON.stringify(message));
  },
});


app.listen(8080, 1, (token) => {
  if (token) {
    console.log('Listen OK.');
    return;
  }
  throw Error('Listen failed.');
});