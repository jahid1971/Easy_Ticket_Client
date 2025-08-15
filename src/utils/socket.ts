import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER_URL, {
    withCredentials: true,
    transports: ["websocket"],
});

export default socket;
