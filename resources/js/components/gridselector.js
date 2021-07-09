import { grid } from './generalgrid';
import { timeSpace } from '../timeSpace';
import { snap } from '../ui/ui_snapToGrid';


export const gridSelector = {
    gridShade: document.querySelector('#grid-selector'),
    startMark: document.querySelector('#start-mark'),
    endMark: document.querySelector('#end-mark'),

    drawStartMark(mark) {
        const ctx = mark.getContext('2d');
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

    drawendMark(mark) {
        const ctx = mark.getContext('2d');
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

    drawGridSelector(start, end) {
        const ctx = this.gridShade.getContext('2d');
        let height = 510;
        this.gridShade.width = end - start;
        this.gridShade.height = height;
        this.gridShade.style.left = `${start}px`;
        ctx.fillStyle = 'rgb(0, 0, 0, 0.2)';
        ctx.fillRect(0, 30, end, height);
    },

    drawMarksatZoom(oldzoom) {
        this.startMark.style.left = `${parseFloat(this.startMark.style.left) * timeSpace.zoom / oldzoom}px`;
        this.endMark.style.left = `${parseFloat(this.endMark.style.left) * timeSpace.zoom / oldzoom}px`;
    }
}

const runEvents = (() => {

    let X = { start: 0, end: 0 };
    let delta;
    let dragStart = false;
    let dragEnd = false;
    let endNotZeroed = false;
    let bar;


    gridSelector.drawStartMark(gridSelector.startMark);
    gridSelector.drawStartMark(gridSelector.endMark);

    const onMousePos = (canvas, evt) => {
        let rect = canvas.getBoundingClientRect();
        return {
            x: Math.round(evt.clientX - rect.left),
            y: Math.round(evt.clientY - rect.top)
        };
    }

    gridSelector.startMark.addEventListener('mousedown', e => {
        dragStart = true;
        let mousePos = onMousePos(grid.canvas, e);
        X.start = timeSpace.getStartMark;
        delta = mousePos.x - X.start;
        if (snap.toggle) {
            snap.setup = timeSpace.zoom * timeSpace.compas * timeSpace.bpm * timeSpace.snap;
            bar = Math.ceil(X.start / snap.setup);
        }
    });

    gridSelector.endMark.addEventListener('mousedown', e => {
        dragEnd = true;
        let mousePos = onMousePos(grid.canvas, e);
        X.end = timeSpace.getEndMark;
        delta = mousePos.x - X.end + 15;
        if (snap.toggle) {
            snap.setup = timeSpace.zoom * timeSpace.compas * timeSpace.bpm * timeSpace.snap;
            bar = Math.round(X.end / snap.setup);
        }
    });

    window.addEventListener('mousemove', e => {
        let mousePos = onMousePos(grid.canvas, e);

        if (!endNotZeroed) {
            if (X.end != 0) {
                endNotZeroed = true;
                gridSelector.drawendMark(gridSelector.endMark);
            }
        }

        if (dragStart) {
            X.start = mousePos.x - delta;

            if (snap.toggle) {
                let barCount = Math.ceil(X.start / snap.setup);
                if (barCount > bar) {
                    X.start = barCount * snap.setup;
                    X.start >= X.end - 15 && (X.start = X.end);
                    timeSpace.setStartMark = X.start;
                    gridSelector.startMark.style.left = `${X.start}px`;
                    gridSelector.drawGridSelector(X.start, timeSpace.getEndMark);
                    bar++;
                }
                if (barCount < bar) {
                    X.start = barCount * snap.setup;
                    X.start <= 0 && (X.start = 0);
                    X.start >= X.end - 15 && (X.start = X.end);
                    timeSpace.setStartMark = X.start;
                    gridSelector.startMark.style.left = `${X.start}px`;
                    gridSelector.drawGridSelector(X.start, timeSpace.getEndMark);
                    bar--;
                }
            } else {
                X.start <= 0 && (X.start = 0);
                X.start >= X.end && (X.start = X.end);
                timeSpace.setStartMark = X.start;
                gridSelector.startMark.style.left = `${X.start}px`;
                gridSelector.drawGridSelector(X.start, timeSpace.getEndMark);
            }
        }
        if (dragEnd) {
            X.end = mousePos.x - delta;

            if (snap.toggle) {
                let barCount = Math.ceil(X.end / snap.setup);
                if (barCount > bar) {
                    X.end = barCount * snap.setup;
                    timeSpace.setEndMark = X.end;
                    gridSelector.endMark.style.left = `${X.end - 15}px`;
                    gridSelector.drawGridSelector(timeSpace.getStartMark, X.end);
                    bar++;
                }
                if (barCount < bar) {
                    X.end = barCount * snap.setup;
                    if (X.end <= 0) {
                        X.end = 0;
                        gridSelector.drawStartMark(gridSelector.endMark);
                        endNotZeroed = false;
                    }
                    if (X.end <= X.start + 15) return;
                    timeSpace.setEndMark = X.end;
                    gridSelector.endMark.style.left = `${X.end - 15}px`;
                    gridSelector.drawGridSelector(timeSpace.getStartMark, X.end);
                    bar--;
                }
            } else {
                X.end <= 0 && (X.end = 0);
                X.end <= X.start && (X.end = X.start);
                timeSpace.setEndMark = X.end + 15;
                gridSelector.endMark.style.left = `${X.end}px`;
                gridSelector.drawGridSelector(timeSpace.getStartMark, X.end + 15);
            }
        }
    });

    window.addEventListener('mouseup', () => dragStart = dragEnd = false);

})();
