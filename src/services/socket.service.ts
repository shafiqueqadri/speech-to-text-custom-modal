import { environment } from "../environments";
import { io } from 'socket.io-client';

export const socket = io(environment.base_url);
