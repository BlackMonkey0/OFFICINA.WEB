// Este script se incluirá en la página para sincronización
class SyncManager {
    constructor() {
        this.ws = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 3000; // 3 segundos
        this.initWebSocket();
    }

    initWebSocket() {
        try {
            // Cambia la URL por tu canal público de WebSocket (ejemplo: wss://ws.websocket.in/tu-canal)
            this.ws = new WebSocket('wss://ws.websocket.in/stock-taller?channel=global-sync');

            this.ws.onopen = () => {
                console.log('Conectado al servidor de sincronización GLOBAL');
                this.reconnectAttempts = 0;
                document.body.classList.add('sync-connected');
                document.body.classList.remove('sync-disconnected');
            };

            this.ws.onclose = () => {
                console.log('Desconectado del servidor de sincronización');
                document.body.classList.remove('sync-connected');
                document.body.classList.add('sync-disconnected');
                this.tryReconnect();
            };

            this.ws.onerror = (error) => {
                console.error('Error en la conexión WebSocket:', error);
            };

            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === 'update') {
                        this.handleUpdate(data);
                    }
                } catch (e) {
                    console.error('Error al procesar mensaje:', e);
                }
            };
        } catch (e) {
            console.error('Error al inicializar WebSocket:', e);
            document.body.classList.add('sync-disconnected');
        }
    }

    tryReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Intento de reconexión ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
            setTimeout(() => this.initWebSocket(), this.reconnectDelay);
        } else {
            console.log('Máximo número de intentos de reconexión alcanzado');
        }
    }

    handleUpdate(data) {
        if (data.key && data.value) {
            // Evitar bucles de actualización
            if (data.source !== this.getClientId()) {
                localStorage.setItem(data.key, data.value);
                // Disparar evento de actualización
                window.dispatchEvent(new CustomEvent('storage-sync', {
                    detail: { key: data.key, value: data.value }
                }));
            }
        }
    }

    sendUpdate(key, value) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
                type: 'update',
                key: key,
                value: value,
                source: this.getClientId()
            }));
        } else {
            // Si no está conectado, intenta reconectar y reintentar
            this.tryReconnect();
        }
    }

    getClientId() {
        if (!localStorage.getItem('clientId')) {
            localStorage.setItem('clientId', 'client_' + Math.random().toString(36).substr(2, 9));
        }
        return localStorage.getItem('clientId');
    }
}

// Crear instancia global del SyncManager
window.syncManager = new SyncManager();

// Interceptar cambios en localStorage
const originalSetItem = localStorage.setItem;
localStorage.setItem = function(key, value) {
    originalSetItem.call(this, key, value);
    window.syncManager.sendUpdate(key, value);
};