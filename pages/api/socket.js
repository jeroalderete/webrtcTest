import { Server } from "socket.io";

// signaling

// creamos la api para conectar ambos dispositivos entre si
// luego establecemos context en el client
// 


const SocketHandler = (req, res) => {
   
    // DEBUG del servidor ha llamado a la API que maneja las conexiones de WebSocket.
    console.log(" called api WebSocket Handler succes ok")
    if (res.socket.server.io) {
        console.log("socket already running")
    } else {
        const io = new Server(res.socket.server)
        res.socket.server.io = io
    
        io.on('connection', (socket) => {

            // conexion a socket exitosa
            console.log("server is connected")

            // room de la meeting
            socket.on('join-room', (roomId, userId) => {
                console.log(`a new user ${userId} joined room ${roomId}`)
                socket.join(roomId)
                socket.broadcast.to(roomId).emit('user-connected', userId)
            })
            // audio de la meeting
            socket.on('user-toggle-audio', (userId, roomId) => {
                socket.join(roomId)
                socket.broadcast.to(roomId).emit('user-toggle-audio', userId)
            })

            socket.on('user-toggle-video', (userId, roomId) => {
                socket.join(roomId)
                socket.broadcast.to(roomId).emit('user-toggle-video', userId)
            })

            socket.on('user-leave', (userId, roomId) => {
                socket.join(roomId)
                socket.broadcast.to(roomId).emit('user-leave', userId)
            })
        })
    }
    res.end();
}


export default SocketHandler;

