import { timeSpace } from '../timeSpace';

export default function drawLayout() {
    const layout = document.querySelector('#layout');
    layout.height = 30;
    layout.width = 4000;
    var layoutCtx = layout.getContext('2d');
    layoutCtx.clearRect(0, 0, layout.width, layout.height)
    layoutCtx.strokeStyle = '#7a2332';
    layoutCtx.lineWidth = '10px';
    let text = 1;      //0.2
    let zoomSetUp = 1 / timeSpace.zoom * timeSpace.compas * timeSpace.bpm;  // <-- ese *2 es por compás 4/4
  //timeSpace.bpm: 120 //2 por segundo
//ASUMIENDO QUE ES COMPÁS 4/4 y a 120 BPM, un compás dura 2s
    if (timeSpace.zoom <= 0.050) {
        for (var i = 0; i < 4000; i += (zoomSetUp)) {
            layoutCtx.beginPath();
            layoutCtx.moveTo(i, 30);
            layoutCtx.lineTo(i, 22);
            layoutCtx.closePath();
            layoutCtx.stroke();
            if (text < 10) {
                layoutCtx.strokeText(text, i - 2, 18)
            } else {
                layoutCtx.strokeText(text, i - 6, 18)
            }
            text += 1;
        }
    } else {
        for (var i = 0; i < 4000; i += (zoomSetUp * 2)) {
            layoutCtx.beginPath();
            layoutCtx.moveTo(i, 30);
            layoutCtx.lineTo(i, 22);
            layoutCtx.closePath();
            layoutCtx.stroke();
            if (text < 10) {
                layoutCtx.strokeText(text, i - 2, 18)
            } else {
                layoutCtx.strokeText(text, i - 6, 18)
            }
            text += 2;
        }

        for (var i = zoomSetUp; i < 4000; i += (zoomSetUp * 2)) {
            layoutCtx.beginPath();
            layoutCtx.moveTo(i, 30);
            layoutCtx.lineTo(i, 27);
            layoutCtx.closePath();
            layoutCtx.stroke();
        }
    }
}
