# Taller Stock - Sincronización Global

## ¿Cómo funciona la sincronización?

La web utiliza WebSocket público (`wss://ws.websocket.in/stock-taller?channel=global-sync`) para que cualquier cambio en el inventario se refleje en tiempo real en todos los dispositivos conectados, incluso si la web está publicada en GitHub Pages.

### Requisitos
- No necesitas instalar nada en el servidor ni en tu PC.
- Solo necesitas publicar la web en GitHub Pages o cualquier hosting estático.

### ¿Cómo publicar en GitHub Pages?
1. Sube todos los archivos del proyecto a un repositorio de GitHub.
2. Ve a la configuración del repositorio y activa GitHub Pages (elige rama y carpeta raíz).
3. Accede a la URL pública que te da GitHub Pages.

### ¿Cómo probar la sincronización?
1. Abre la web en dos dispositivos diferentes (PC, móvil, etc.) usando la URL pública.
2. Realiza cualquier cambio (añadir material, modificar cantidad, etc.).
3. El cambio se reflejará automáticamente en todos los dispositivos conectados.

### Seguridad y privacidad
- El canal WebSocket es público, no almacena datos personales, solo sincroniza cambios de inventario.
- Si necesitas privacidad, puedes crear tu propio servidor WebSocket y cambiar la URL en `sync.js`.

### Personalización
- Para usar otro canal, cambia la URL en `sync.js`:
  ```js
  this.ws = new WebSocket('wss://ws.websocket.in/stock-taller?channel=global-sync');
  ```
- Puedes usar cualquier servicio WebSocket compatible con navegadores.

---

## Comentarios y soporte
Para dudas o mejoras, abre un issue en el repositorio de GitHub.
