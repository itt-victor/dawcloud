import { grid } from '../app_core';
import { timeSpace } from '../timeSpace';
import { snap } from '../ui/ui_snapToGrid';
import { onMousePos } from '../utils';

export const gridSelector = {
    gridShade: document.querySelector('#grid-selector') as HTMLCanvasElement,
    startMark: document.querySelector('#start-mark') as HTMLCanvasElement,
    endMark: document.querySelector('#end-mark') as HTMLCanvasElement,

    drawStartMark(mark: HTMLCanvasElement) {
        const ctx = (mark.getContext('2d') as CanvasRenderingContext2D);
        mark.width = 15;
        mark.height = 15;
        mark.style.left = `${timeSpace.getStartMark}px`;
        ctx.fillStyle = 'yellow';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(15, 0);
        ctx.lineTo(0, 15);
        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.fill();
    },

    drawendMark(mark: HTMLCanvasElement) {
        const ctx = (mark.getContext('2d') as CanvasRenderingContext2D);
        mark.width = 15;
        mark.height = 15;
        mark.style.left = `${timeSpace.getEndMark}px`;
        ctx.clearRect(0, 0, 15, 15);
        ctx.fillStyle = 'yellow';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(15, 0);
        ctx.lineTo(15, 15);
        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.fill();
    },

    drawGridSelector(start: number, end: number) {
        const ctx = (this.gridShade.getContext('2d') as CanvasRenderingContext2D);
        let height = 510;
        this.gridShade.width = end - start;
        this.gridShade.height = height;
        this.gridShade.style.left = `${start}px`;
        ctx.fillStyle = 'rgb(0, 0, 0, 0.2)';
        ctx.fillRect(0, 30, end, height);
    },

    drawMarksatZoom(oldzoom: number) {
        this.startMark.style.left = `${parseFloat(this.startMark.style.left) * timeSpace.zoom / oldzoom}px`;
        this.endMark.style.left = `${parseFloat(this.endMark.style.left) * timeSpace.zoom / oldzoom}px`;
    },

    exe() {

        let X = { start: 0, end: 0 };
        let delta: number;
        let dragStart = false;
        let dragEnd = false;
        let endNotZeroed = false;
        let bar: number;


        this.drawStartMark(this.startMark);
        this.drawStartMark(this.endMark);

        this.startMark.addEventListener('mousedown', e => {
            dragStart = true;
            const mousePos = onMousePos(grid.canvas, e);
            X.start = timeSpace.getStartMark;
            delta = mousePos.x - X.start;
            if (snap.toggle) {
                snap.setup = timeSpace.zoom * timeSpace.compas * timeSpace.bpm * timeSpace.snap;
                bar = Math.ceil(X.start / snap.setup);
            }
        });

        this.endMark.addEventListener('mousedown', e => {
            dragEnd = true;
            const mousePos = onMousePos(grid.canvas, e);
            X.end = timeSpace.getEndMark;
            delta = mousePos.x - X.end + 15;
            if (snap.toggle) {
                snap.setup = timeSpace.zoom * timeSpace.compas * timeSpace.bpm * timeSpace.snap;
                bar = Math.round(X.end / snap.setup);
            }
        });

        window.addEventListener('mousemove', e => {
            const mousePos = onMousePos(grid.canvas, e);

            if (!endNotZeroed) {
                if (X.end != 0) {
                    endNotZeroed = true;
                    this.drawendMark(this.endMark);
                }
            }

            if (dragStart) {
                X.start = mousePos.x - delta;

                if (snap.toggle) {
                    let barCount = Math.ceil(X.start / snap.setup);
                    if (barCount > bar) bar++;
                    if (barCount < bar) bar--;
                    X.start = barCount * snap.setup;
                }

                X.start >= X.end - 15 && (X.start = X.end);
                X.start <= 0 && (X.start = 0);
                X.start >= X.end && (X.start = X.end);
                timeSpace.setStartMark = X.start;
                this.startMark.style.left = `${X.start}px`;
                this.drawGridSelector(X.start, timeSpace.getEndMark);
            }
            if (dragEnd) {
                X.end = mousePos.x - delta;

                if (snap.toggle) {
                    let barCount = Math.ceil(X.end / snap.setup);
                    if (barCount > bar) bar++;
                    if (barCount < bar) bar--;
                    X.end = barCount * snap.setup;

                    if (X.end <= 0) {
                        X.end = 0;
                        this.drawStartMark(this.endMark);
                        endNotZeroed = false;
                    }
                    if (X.end <= X.start + 15) return;

                    timeSpace.setEndMark = X.end;
                    this.endMark.style.left = `${X.end - 15}px`;
                    this.drawGridSelector(timeSpace.getStartMark, X.end);
                } else {
                    X.end <= 0 && (X.end = 0);
                    X.end <= X.start && (X.end = X.start);
                    timeSpace.setEndMark = X.end + 15;
                    this.endMark.style.left = `${X.end}px`;
                    this.drawGridSelector(timeSpace.getStartMark, X.end + 15);
                }
            }
        });

        window.addEventListener('mouseup', () => dragStart = dragEnd = false);
    }
}
