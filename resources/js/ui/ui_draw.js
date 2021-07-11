import { stop } from '../app_core';
import { timeSpace } from '../timeSpace';

export const ui_draw = {
    drawTrackWhileRecording() {
        let width = 0, height = 58,
            x = timeSpace.space;
        const track = document.querySelector('[data-selected]'),
            canvas = document.createElement('canvas');
        track.appendChild(canvas);
        const canvasCtx = canvas.getContext('2d');
        canvas.width = 10000;
        canvas.height = 60;
        canvasCtx.fillStyle = '#2ed9a5';
        let start = performance.now(), increase = 0,
            progress, fps, interval;

        function step(now) {
            progress = now - start;
            fps = Math.round(1000 / (progress / ++increase) * 100) / 100;
            width += timeSpace.zoom * 1 / fps;
            canvasCtx.fillRect(x, 0, width, height);
            interval = requestAnimationFrame(step);
        }
        interval = requestAnimationFrame(step);
        stop.addEventListener('click', () => {
            window.cancelAnimationFrame(interval);
            canvas.remove();
        });
        document.addEventListener('keypress', e => {
            if (e.key === ' ') {
                if (e.target == project_name) return;
                window.cancelAnimationFrame(interval);
                canvas.remove();
            }
        });

    },

    drawRecording(recording, zoom, selected) {
        const offCanvas = document.createElement('canvas');
        let width = recording.audioBuffer.duration * (zoom + 0.15), //Ese 0.15 corrige descompensación
            height = 58;
        offCanvas.width = recording.audioBuffer.duration * zoom;
        offCanvas.height = height;
        const canvasCtx = offCanvas.getContext('2d');

        canvasCtx.fillStyle = selected ? '#20453a' : '#2ed9a5';
        canvasCtx.beginPath();
        canvasCtx.moveTo(0, 0);
        canvasCtx.lineTo(width, 0);
        canvasCtx.lineTo(width, 58);
        canvasCtx.lineTo(0, 58);
        canvasCtx.fill();
        canvasCtx.closePath()
        canvasCtx.strokeStyle = '#380166';
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeRect(0, 0, width - 2, height);
        canvasCtx.fillStyle = selected ? '#2ed9a5' : '#20453a';

        if (recording.audioBuffer.numberOfChannels === 2) {  //si es estereo..
            const dataL = recording.audioBuffer.getChannelData(0);
            const stepL = Math.ceil(dataL.length / width);
            const amp = height / 4;
            for (let i = 0; i < width; i++) {
                let min = 1.0;
                let max = -1.0;
                for (let j = 0; j < stepL; j++) {
                    const datum = dataL[(i * stepL) + j];
                    if (datum < min) min = datum;
                    if (datum > max) max = datum;
                }
                canvasCtx.fillRect(i, (1 + min) * amp, 1, Math.max(1, (max - min) * amp));
            }
            const dataR = recording.audioBuffer.getChannelData(1);
            const stepR = Math.ceil(dataR.length / width);
            for (let i = 0; i < width; i++) {
                let min = 1.0;
                let max = -1.0;
                for (let j = 0; j < stepR; j++) {
                    const datum = dataR[(i * stepR) + j];
                    if (datum < min)
                        min = datum;
                    if (datum > max)
                        max = datum;
                }
                canvasCtx.fillRect(i, (1 + min) * amp + height / 2, 1, Math.max(1, (max - min) * amp));
            }
        } else if (recording.audioBuffer.numberOfChannels === 1) {  // si es mono..
            const data = recording.audioBuffer.getChannelData(0);
            const step = Math.ceil(data.length / width);
            const amp = height / 2;
            for (let i = 0; i < width; i++) {
                let min = 1.0;
                let max = -1.0;
                for (let j = 0; j < step; j++) {
                    const datum = data[(i * step) + j];
                    if (datum < min)
                        min = datum;
                    if (datum > max)
                        max = datum;
                }
                canvasCtx.fillRect(i, (1 + min) * amp, 1, Math.max(1, (max - min) * amp));
            }
        }
        return offCanvas;
    },

    printRecording(width, recording, offCanvas, offset, duration) {
        const height = 58, x = (recording.timeToStart * timeSpace.zoom) + offset;
        recording.canvas.width = width;
        recording.canvas.height = height;
        recording.canvasCtx.clearRect(0, 0, width, height);
        recording.canvasCtx.drawImage(offCanvas, offset, 0, duration, height, 0, 0, duration, height);
        recording.canvas.style.left = `${x}px`;
    },

    printRecordingCrop(width, recording, offCanvas, offset, duration) {
        const height = 58;
        recording.canvas.width = width + 2;
        recording.canvas.height = height;
        recording.canvasCtx.clearRect(0, 0, width, height);
        recording.canvasCtx.drawImage(offCanvas, 0, 0);
        recording.canvasCtx.clearRect(0, 0, offset, height);
        recording.canvasCtx.clearRect(duration, 0, width - duration, height);
    },

    printCutRecording(width, recording, offCanvas, offset, duration) {
        const height = 58, x = (recording.timeToStart * timeSpace.zoom);
        recording.canvas.width = width;
        recording.canvas.height = height;
        recording.canvasCtx.clearRect(0, 0, width, height);
        recording.canvasCtx.drawImage(offCanvas, offset, 0, duration, height, 0, 0, duration, height);
        recording.canvas.style.left = `${x}px`;
    }
}
