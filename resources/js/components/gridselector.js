import { grid } from './generalgrid';
import { timeSpace } from '../timeSpace';
import { snap } from '../ui/ui_snapToGrid';

const gridSelector = (() => {
    const gridShade = document.querySelector('#grid-selector');
    const startMark = document.querySelector('#start-mark');
    const endMark = document.querySelector('#end-mark');
    let X = { start: 0, end: 0 };
    let delta;
    let dragStart = false;
    let dragEnd = false;
    let endNotZeroed = false;
    let bar;

    const drawStartMark = mark => {
        const ctx = mark.getContext('2d');
        mark.width = 15;
        mark.height = 15;
        mark.style.left = `${timeSpace.startMark}px`;
        ctx.fillStyle = 'yellow';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(15, 0);
        ctx.lineTo(0, 15);
        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.fill();
    }

    const drawEndMark = mark => {
        const ctx = mark.getContext('2d');
        mark.width = 15;
        mark.height = 15;
        mark.style.left = `${timeSpace.endMark}px`;
        ctx.clearRect(0, 0, 15, 15);
        ctx.fillStyle = 'yellow';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(15, 0);
        ctx.lineTo(15, 15);
        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.fill();
    }
    drawStartMark(startMark); drawStartMark(endMark);

    const drawGridSelector = (start, end) => {
        const ctx = gridShade.getContext('2d');
        let height = 510;
        gridShade.width = end - start;
        gridShade.height = height;
        gridShade.style.left = `${start}px`;
        ctx.fillStyle = 'rgb(0, 0, 0, 0.4)';
        ctx.fillRect(0, 30, end, height);
    }

    const onMousePos = (canvas, evt) => {
        let rect = canvas.getBoundingClientRect();
        return {
            x: Math.round(evt.clientX - rect.left),
            y: Math.round(evt.clientY - rect.top)
        };
    }

    startMark.addEventListener('mousedown', e => {
        dragStart = true;
        let mousePos = onMousePos(grid.canvas, e);
        X.start = timeSpace.startMark;
        delta = mousePos.x - X.start;
        if (snap.toggle) {
            snap.setup = timeSpace.zoom * timeSpace.compas * timeSpace.bpm * timeSpace.snap;
            bar = Math.ceil(X.start / snap.setup);
        }
    });

    endMark.addEventListener('mousedown', e => {
        dragEnd = true;
        let mousePos = onMousePos(grid.canvas, e);
        X.end = timeSpace.endMark - 15;
        delta = mousePos.x - X.end;
        if (snap.toggle) {
            snap.setup = timeSpace.zoom * timeSpace.compas * timeSpace.bpm * timeSpace.snap;
            bar = Math.ceil(X.end / snap.setup);
        }
    });

    window.addEventListener('mousemove', e => {
        let mousePos = onMousePos(grid.canvas, e);

        if (dragStart) {
            X.start = mousePos.x - delta;

            if (snap.toggle) {
                let barCount = Math.ceil(X.start / snap.setup);
                if (barCount > bar) {
                    X.start += snap.setup;
                    X.start <= 0 && (X.start = 0);
                    timeSpace.startMark = X.start;
                    startMark.style.left = `${X.start}px`;
                    drawGridSelector(X.start, timeSpace.endMark);
                    bar++;
                }
                if (barCount < bar) {
                    X.start -= snap.setup;
                    X.start <= 0 && (X.start = 0);
                    timeSpace.startMark = X.start;
                    startMark.style.left = `${X.start}px`;
                    drawGridSelector(X.start, timeSpace.endMark);
                    bar--;
                }
            } else {
                X.start <= 0 && (X.start = 0);
                timeSpace.startMark = X.start;
                startMark.style.left = `${X.start}px`;
                drawGridSelector(X.start, timeSpace.endMark);
            }
        }
        if (dragEnd) {
            X.end = mousePos.x - delta;

            if (snap.toggle) {
                let barCount = Math.ceil(X.end / snap.setup);
                if (barCount > bar) {
                    X.end += snap.setup;
                    X.end <= 0 && (X.end = 0);
                    timeSpace.endMark = X.end;
                    endMark.style.left = `${X.end}px`;
                    drawGridSelector(timeSpace.startMark, X.end + 15);
                    bar++;
                }
                if (barCount < bar) {
                    X.end -= snap.setup;
                    X.end <= 0 && (X.end = 0);
                    timeSpace.endMark = X.end;
                    endMark.style.left = `${X.end}px`;
                    drawGridSelector(timeSpace.startMark, X.end + 15);
                    bar--;
                }
            } else {
                X.end <= 0 && (X.end = 0);
                timeSpace.endMark = X.end;
                endMark.style.left = `${X.end}px`;
                drawGridSelector(timeSpace.startMark, X.end + 15);
            }

            if (!endNotZeroed) {
                if (X.end != 0) {
                    endNotZeroed = true;
                    drawEndMark(endMark);
                }
            }
        }
    });

    window.addEventListener('mouseup', () => {
        dragStart = dragEnd = false;
        timeSpace.startMark = X.start
        timeSpace.endMark = X.end + 15;
    })
})();

