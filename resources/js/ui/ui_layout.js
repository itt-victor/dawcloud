import { timeSpace } from '../timeSpace';

export default function drawLayout() {
    const layout = document.querySelector('#layout');
    layout.height = 30, layout.width = 10000;
    const layoutCtx = layout.getContext('2d');
    layoutCtx.clearRect(0, 0, layout.width, layout.height)
    layoutCtx.strokeStyle = '#7a2332';
    layoutCtx.lineWidth = 0.7;
    let text = 1, compasDivision;
    let zoomSetUp = timeSpace.zoom * timeSpace.compas * timeSpace.bpm;

    if (zoomSetUp >= 35) {
        for (let i = 0; i < layout.width; i += zoomSetUp) {
            layoutCtx.beginPath();
            layoutCtx.moveTo(i, 29);
            layoutCtx.lineTo(i, 0);
            layoutCtx.closePath();
            layoutCtx.stroke();
            layoutCtx.strokeText(text, i + 7, 28)
            text += 1;
        }

        layoutCtx.lineWidth = 0.4;
        timeSpace.compas == 2 && (compasDivision = 4);
        timeSpace.compas == 1.5 && (compasDivision = 3);

        for (let i = 0; i < layout.width; i += (zoomSetUp / compasDivision)) {
            layoutCtx.beginPath();
            layoutCtx.moveTo(i, 7);
            layoutCtx.lineTo(i, 0);
            layoutCtx.closePath();
            layoutCtx.stroke();
        }

    } else if (zoomSetUp < 35) {
        for (let i = 0; i < layout.width; i += (zoomSetUp * 2)) {
            layoutCtx.beginPath();
            layoutCtx.moveTo(i, 29);
            layoutCtx.lineTo(i, 0);
            layoutCtx.closePath();
            layoutCtx.stroke();
            layoutCtx.strokeText(text, i + 7, 28)
            text += 2;
        }

        layoutCtx.lineWidth = 0.4;
        for (let i = 0; i < layout.width; i += (zoomSetUp)) {
            layoutCtx.beginPath();
            layoutCtx.moveTo(i, 7);
            layoutCtx.lineTo(i, 0);
            layoutCtx.closePath();
            layoutCtx.stroke();
        }
    }
}
