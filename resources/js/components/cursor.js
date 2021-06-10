import { grid } from './generalgrid';
import { timeSpace } from '../timeSpace';

var interval;

export var cursor = {
    canvas: document.getElementById("cursor"),
    interval,
    draw: function () {
        this.canvas.width = 5;
        this.canvas.height = 70 * grid.howMany + 30;
        this.canvas.style.left = 0;
        this.canvas.style.zIndex = '10';
        this.ctx = this.canvas.getContext('2d');
        this.ctx.fillStyle = 'black';
        this.ctx.globalCompositeOperation = 'destination-over';
        this.ctx.globalAlpha = 0.8;
        this.ctx.fillRect(0, 0, 5, this.canvas.height);
    },
    play: function () {
        let start = performance.now();
        let canvas = this.canvas;
        let increase = 0;
        let progress;
        let fps;
        function step(now) {
            progress = now - start;
            fps = Math.round(1000 / (progress / ++increase) * 100) / 100;
            timeSpace.space += timeSpace.zoom * 1/fps;
            canvas.style.left = timeSpace.space + 'px';
            interval = requestAnimationFrame(step);
        }
        interval = requestAnimationFrame(step);
    },

    stop: function () {
        window.cancelAnimationFrame(interval);
    },

    moveAtZoom: function (oldZoom) {
        timeSpace.space *=  (timeSpace.zoom / oldZoom);
        this.canvas.style.left = timeSpace.space + 'px';
    },

    moveAtClick: function () {
        this.canvas.style.left = timeSpace.space + 'px';
    }
}
