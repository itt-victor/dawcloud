import { stop } from '../app_core';
import { grid } from './generalgrid';
import { timeSpace } from '../timeSpace';
import { times } from 'lodash';

var interval;
let zoomIn = document.getElementById("zoomin");
let zoomOut = document.getElementById("zoomout");

const layout = document.querySelector('#layout');
export var cursor = {
    canvas: document.getElementById("cursor"),
    draw: function () {
        this.canvas.width = 3;
        this.canvas.height = 70 * grid.howMany + 30;  //70 por pista + 30 de time layout
        this.canvas.style.left = 0//grid.canvas.getBoundingClientRect().x + 'px';//'620px'; '611px';
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
            this.cursor.style.left = timeSpace.widthAtPause + 'px';
        }, timeSpace.zoom * 1000)
    stop.addEventListener('click', function clr() {
        clearInterval(interval);
    });
    zoomIn.addEventListener('click', function () {
        clearInterval(interval);
    });
    zoomOut.addEventListener('click', function () {
        clearInterval(interval);
    });
    },
    moveAtClick: function () {
        this.canvas.style.left = timeSpace.pointedWidth + 'px';
        timeSpace.widthAtPause = timeSpace.pointedWidth; 
    }
}
