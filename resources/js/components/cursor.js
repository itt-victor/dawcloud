import { stop } from '../app_core';
import { grid } from './generalgrid';
import { timeSpace } from '../timeSpace';
import { times } from 'lodash';

export var interval;

export var cursor = {
    canvas: document.getElementById("cursor"),
    draw: function () {
        this.canvas.width = 3;
        this.canvas.height = 70 * grid.howMany + 30;  //70 por pista + 20 de time layout
        this.canvas.style.left = '611px';
        this.canvas.style.zIndex = '10';
        this.ctx = this.canvas.getContext('2d');
        this.ctx.fillStyle = 'black';
        this.ctx.lineWidth = '10px';
        this.ctx.globalCompositeOperation = 'destination-over';
        this.ctx.globalAlpha = 0.8
        this.ctx.fillRect(0, 0, 3, this.canvas.height); //70 por pista de height +20 del time layer
    },
    play: function () {
            interval = setInterval(function () {
            timeSpace.widthAtPause++
            timeSpace.pxIncrement++
            this.cursor.style.left = timeSpace.widthAtPause + 'px';
        }, timeSpace.zoom * 1000)
        stop.addEventListener('click', function () {
            clearInterval(interval);
        })
    },
    moveAtClick: function() {
        this.canvas.style.left = timeSpace.pointedWidth + 'px';
        timeSpace.widthAtPause = timeSpace.pointedWidth;
    }
}
