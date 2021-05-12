import {tracks} from './tracks';

export var cursor = {
    canvas : document.getElementById("cursor"),
    draw : function() {
        this.canvas.width = 10;
        this.canvas.height = 80 * tracks.howMany + 20;  //80 por pista + 20 de time layout
        this.canvas.style.left = '610px';
        this.canvas.style.zIndex = '10';
        this.ctx = this.canvas.getContext('2d');
        this.ctx.fillStyle = 'black';
        this.ctx.lineWidth = '10px';
        this.ctx.globalCompositeOperation = 'destination-over';
        this.ctx.globalAlpha = 0.8
        this.ctx.fillRect(0, 0, 3, 660); //80 por pista de height +20 del time layer
    }
    /*play : function() {
      var interval = setInterval(function () {
          timeSpace.pxAtPause++;
          timeSpace.newWidth++
          cursor.style.left = timeSpace.newWidth + 'px';
      }, 200)
      stop.addEventListener('click', function () {
          clearInterval(interval);
      })
    }*/
    //LA FUNCIÓN DE MOVERSE DEBERÍA SER SOLO
}
