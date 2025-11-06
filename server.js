const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

// Crear servidor WebSocket en el puerto 3000
const wss = new WebSocket.Server({ port: 3000 });

// Almacenar estado actual
let currentState = {};

// Cargar estado inicial si existe
try {
    const savedState = fs.readFileSync('state.json');
    currentState = JSON.parse(savedState);
} catch (e) {
    console.log('No hay estado previo guardado');
}

// Manejar conexiones de clientes
wss.on('connection', function connection(ws) {
    console.log('Nuevo cliente conectado');
    
    // Enviar estado actual al nuevo cliente
    ws.send(JSON.stringify({
        type: 'init',
        data: currentState
    }));

    // Recibir actualizaciones del cliente
    ws.on('message', function incoming(message) {
        try {
            const update = JSON.parse(message);
            
            // Actualizar estado
            currentState = {...currentState, ...update.data};
            
            // Guardar en disco
            fs.writeFileSync('state.json', JSON.stringify(currentState));
            
            // Broadcast a todos los clientes excepto al que envió
            wss.clients.forEach(function each(client) {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        type: 'update',
                        data: update.data
                    }));
                }
            });
        } catch (e) {
            console.error('Error procesando mensaje:', e);
        }
    });
});

console.log('Servidor de sincronización iniciado en puerto 3000');