import io from 'socket.io-client';

const SOCKET_URL = `${process.env.EXPO_PUBLIC_BASE_URL}`;

class WSService {
    constructor() {
        this.socket = null;
    }

    initializeSocket = async () => {
        try {
            this.socket = io(SOCKET_URL, { transports: ['websocket'] });

            console.log("Initializing socket...");

            this.socket.on('connected', () => {
                console.log("=== Socket connected ===");
            });

            this.socket.on('disconnect', () => {
                console.log("=== Socket disconnected ===");
            });

            this.socket.on('error', (error) => {
                console.error("Socket error:", error);
            });

        } catch (error) {
            console.error("Socket initialization failed:", error);
        }
    }

    emit(event, data = {}) {
        if (!this.socket) {
            console.error("Socket not initialized. Call initializeSocket() first.");
            return;
        }
        this.socket.emit(event, data);
    }

    on(event, cb) {
        if (!this.socket) {
            console.error("Socket not initialized.");
            return;
        }
        this.socket.on(event, cb);
    }

    off(event, cb) {
        if (!this.socket) {
            console.error("Socket not initialized!");
            return;
        }
        this.socket.off(event, cb);
    }
}

const socketServices = new WSService();
export default socketServices;
