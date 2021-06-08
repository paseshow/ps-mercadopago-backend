const socketIo = require('socket.io');

class SocketService {
   constructor(server) {
     this.io = socketIo(server);
     this.io.on('connection', socket => {
        console.log(`CONECTION - ${socket.handshake.address}`);
   });
 } 

  emiter(event, body) {
    console.log('Reserva exportada: ' + body);
    
    if(body) this.io.emit(event, body);
  }
}

module.exports = SocketService;