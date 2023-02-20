import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);
    ws.jwt = 'asdasd';
  ws.on('message', function message(data) {
    console.log('received: %s', data);
    wss.clients.forEach(client => {
        if(client.OPEN && client !== ws){
            client.send(data.toString());
        }
    });
  });
});