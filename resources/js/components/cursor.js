import { trackGrid } from './trackGrid';

export var cursor = {
    canvas: document.getElementById("cursor"),
    draw: function () {
        this.canvas.width = 10;
        this.canvas.height = 80 * trackGrid.howMany + 20;  //80 por pista + 20 de time layout
        this.canvas.style.left = '610px';
        this.canvas.style.zIndex = '10';
        this.ctx = this.canvas.getContext('2d');
        this.ctx.fillStyle = 'black';
        this.ctx.lineWidth = '10px';
        this.ctx.globalCompositeOperation = 'destination-over';
        this.ctx.globalAlpha = 0.8
        this.ctx.fillRect(0, 0, 3, this.canvas.height); //80 por pista de height +20 del time layer
    },
    //hay que sacar el intervalo de aquí
    play: function () {
        var interval = setInterval(function () {
            //timeSpace.pxAtPause++;
            //timeSpace.newWidth++
            cursor.style.left = timeSpace.newWidth + 'px';//Esto debería de venir de otro objeto y solo dejar esta linea
        }, 200)
        stop.addEventListener('click', function () {
            clearInterval(interval);
        })
    }
    /*

        function moveCursor(px) {
        cursor.style.left = px + 'px';
        timeSpace.newWidth = timeSpace.pointedWidth;
    }


    */
    //LA FUNCIÓN DE MOVERSE DEBERÍA SER SOLO
}
