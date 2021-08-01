/* import { audioCtx } from '../app_core';


//audiobuffer
const drawRecording = async (arraybuffers: Array<ArrayBuffer>, zoom: number, selected: boolean) => {

    let audioBufferL = await audioCtx.decodeAudioData(arraybuffers[0]);
    let audioBufferR;

    if (arraybuffers.length == 2) audioBufferR = await audioCtx.decodeAudioData(arraybuffers[1]);

    let width = audioBufferL.duration * (zoom + 0.15), //Ese 0.15 corrige descompensación
        height = 58;
    const offCanvas = new OffscreenCanvas(width, height);
    offCanvas.width = audioBufferL.duration * zoom;
    offCanvas.height = height;
    const canvasCtx = offCanvas.getContext('2d') as OffscreenCanvasRenderingContext2D;

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

    if (arraybuffers.length == 2) {  //si es estereo..
        const dataL = audioBufferL.getChannelData(0);
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
        const dataR = (audioBufferR as AudioBuffer).getChannelData(1);
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
    } else if (arraybuffers.length == 1) {  // si es mono..
        const data = audioBufferL.getChannelData(0);
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
}

onmessage = async e => {
    const offcanvas = await drawRecording(e.data[0], e.data[1], e.data[2]);
    postMessage(offcanvas, '*');
}
 */
