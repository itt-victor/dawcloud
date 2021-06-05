import { grid } from './generalgrid';
import { timeSpace } from '../timeSpace';

var interval;

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
            timeSpace.space++;
            this.cursor.style.left = timeSpace.space + 'px';
        }, timeSpace.zoom * 1000)
    },

    stop: function () {
        clearInterval(interval);
    },

    moveAtZoom: function (oldZoom) {
        timeSpace.space = (timeSpace.space * (1 / timeSpace.zoom)) / (1 / oldZoom);
        this.canvas.style.left = timeSpace.space + 'px';
    },

    moveAtClick: function () {
        this.canvas.style.left = (timeSpace.space -1 )+ 'px';
    }
}
