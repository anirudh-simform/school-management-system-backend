import { Socket } from "socket.io";
export function onConnection(socket: Socket) {
    console.log("access token verification successful");
    console.log("User connected", socket.user);
    socket.emit("notify", "notification");
}
