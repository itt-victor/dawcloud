import { stop } from '../app_core';
import { grid } from './generalgrid';
import { timeSpace } from '../timeSpace';

var interval;

const layout = document.querySelector('#layout');
export var cursor = {
    canvas: document.getElementById("cursor"),
    interval,
    draw: function () {
        this.canvas.width = 3;
        this.canvas.height = 70 * grid.howMany;
        this.canvas.style.left = 0;
        this.canvas.style.zIndex = '10';
        this.ctx = this.canvas.getContext('2d');
        this.ctx.fillStyle = 'black';
        this.ctx.lineWidth = '10px';
        this.ctx.globalCompositeOperation = 'destination-over';
        this.ctx.globalAlpha = 0.8
        this.ctx.fillRect(0, 0, 3, this.canvas.height);
    },
    play: function () {
        interval = setInterval(function () {
            timeSpace.widthAtPause++
            timeSpace.pxIncrement++
            this.cursor.style.left = (timeSpace.widthAtPause) + 'px';
        }, timeSpace.zoom * 1000)
    },

    moveAtZoom: function (oldZoom) {
        timeSpace.widthAtPause = (timeSpace.widthAtPause * (1 / timeSpace.zoom)) / (1 / oldZoom);
        timeSpace.pxIncrement = (timeSpace.pxIncrement * (1 / timeSpace.zoom)) / (1 / oldZoom); //CUIDADO
        this.canvas.style.left = (timeSpace.widthAtPause) + 'px';
    },

    stop: function () {
        clearInterval(interval);
    },

    moveAtClick: function () {
        this.canvas.style.left = (timeSpace.pointedWidth - 1) + 'px';
        timeSpace.widthAtPause = timeSpace.pointedWidth;
    }
}
