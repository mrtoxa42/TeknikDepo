import { io } from 'socket.io-client';

// In dev with proxy or in production served from same origin
const URL = window.location.hostname === 'localhost' && window.location.port === '5173'
  ? 'http://localhost:3000'
  : '/';

export const socket = io(URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000
});
