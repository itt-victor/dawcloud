import { grid } from '../app_core';
import { timeSpace } from '../timeSpace';

let interval: number;

export const cursor = {
    canvas: document.getElementById("cursor") as HTMLCanvasElement,

    draw () {
        this.canvas.width = 5;
        this.canvas.height = 60 * grid.howMany + 30;
        this.canvas.style.left = '0';
        this.canvas.style.zIndex = '10';
        const ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        ctx.fillStyle = 'black';
        ctx.globalCompositeOperation = 'destination-over';
        ctx.globalAlpha = 0.8;
        ctx.fillRect(0, 0, 5, this.canvas.height);
    },
    play () {
        let start = performance.now(), canvas = this.canvas,
         	increase = 0, progress,	fps;

        const step = (now: number) => {
            progress = now - start;
            fps = Math.round(1000 / (progress / ++increase) * 100) / 100;
            timeSpace.space += timeSpace.zoom * 1/fps;
            canvas.style.left = `${timeSpace.space}px`;
            interval = requestAnimationFrame(step);
        }
        interval = requestAnimationFrame(step);
    },

    stop () {
        window.cancelAnimationFrame(interval);
    },

    moveAtZoom (oldZoom: number) {
        timeSpace.space *=  (timeSpace.zoom / oldZoom);
        this.canvas.style.left = `${timeSpace.space}px`;
    },

    moveAtClick () {
        this.canvas.style.left = `${timeSpace.space}px`;
    }
}
