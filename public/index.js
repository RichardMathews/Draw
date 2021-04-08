document.addEventListener('DOMContentLoaded', () => {

  const socket = io.connect();

  const pincel = {
    ativo: false,
    movendo: false,
    position: {
      x: 0,
      y: 0,
    },
      positionAnterior: null
  }
  //Capturando o id e passando para a variavel tela
  const tela = document.querySelector('#tela');
  //Responsavel por realizar o desenho
  const context = tela.getContext('2d');

  tela.width = 700;
  tela.height = 500;

  // const drawLine = (line) {
  //    const line = {
  //      pos: {
  //        x: 350,
  //        y: 250,
  //        positionAnterior: {
  //          x: 10,
  //          y: 10,
  //        }
  //      }
  //    }
  // }
  const drawLine = (line) => {
    context.beginPath();
    context.moveTo(line.positionAnterior.x, line.positionAnterior.y);
    context.lineTo(line.position.x, line.position.y);
    context.stroke();
  }

  tela.onmousedown = (event) => { pincel.ativo = true };
  tela.onmouseup = (event) => { pincel.ativo = false };

  tela.onmousemove = (event) => {
    pincel.position.x = event.clientX
    pincel.position.y = event.clientY
    pincel.movendo = true;
  }

  socket.on('desenhar', (linha) => {
    drawLine(linha)
  });

  const ciclo = () => {
    if(pincel.ativo && pincel.movendo && pincel.positionAnterior) {
      socket.emit('desenhar', {position: pincel.position, positionAnterior: pincel.positionAnterior})
      pincel.movendo = false;
    }
    pincel.positionAnterior = { x: pincel.position.x, y: pincel.position.y }

    setTimeout(ciclo, 10);
  }

  ciclo();

})