const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const salasRouter = require('./routes/salas');
const reservasRouter = require('./routes/reservas');

// Crear la instacia Express
const app = express();

// crear el servidor http
const server = http.createServer(app);

// Crear el servidor WebSocket
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors());
app.use(express.json());


const broadcastMessage = (type, data) => {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type, data }));
        }
    });
};

// Conexion WS
wss.on('connection', (ws) => {
    console.log('Nuevo cliente conectado');

    const initialData = {
        salas: globalThis.salas || [],
        reservas: globalThis.reservas || []
    };
    ws.send(JSON.stringify({ type: 'initial', data: initialData }));

    ws.on('error', console.error);

    ws.on('close', () => {
        console.log('Cliente desconectado');
    });
});

globalThis.broadcastUpdate = broadcastMessage;

// Rutas
app.use('/salas', salasRouter);
app.use('/reservas', reservasRouter);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server on http://localhost:${PORT}`);
});