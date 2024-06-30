import { io } from 'socket.io-client';

const URL = 'http://localhost:3000'; // Make sure this matches your backend URL
const socket = io(URL);

export default socket;
