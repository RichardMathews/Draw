const express= require('express');
const app = express();
const http = require('http');
const server = http.createServer(app)
const socketIo = require('socket.io');
const io = socketIo.listen(server);

server.listen(3000, () => {
  console.log('Executando...')
});

app.use(express.static(__dirname + "/public"))

const historico = []

io.on('connection', (socket) => {
  console.log('Nova Conexão');

  historico.forEach(linha => {
    socket.emit('desenhar', linha)
  });

  socket.on('desenhar', (linha) => {
    historico.push(linha)
    io.emit('desenhar', linha)
  })
})