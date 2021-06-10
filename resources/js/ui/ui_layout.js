import { timeSpace } from '../timeSpace';

export default function drawLayout() {
    const layout = document.querySelector('#layout');
    layout.height = 30;
    layout.width = 4000;
    var layoutCtx = layout.getContext('2d');
    layoutCtx.clearRect(0, 0, layout.width, layout.height)
    layoutCtx.strokeStyle = '#7a2332';
	layoutCtx.lineWidth = 0.7;
    let text = 1;
    let zoomSetUp = 1 / timeSpace.zoom * timeSpace.compas * timeSpace.bpm;

    if (timeSpace.zoom <= 0.050001) {
        for (var i = 0; i < layout.width; i += zoomSetUp) {
            layoutCtx.beginPath();
            layoutCtx.moveTo(i, 29);
            layoutCtx.lineTo(i, 0);
            layoutCtx.closePath();
			layoutCtx.stroke();

			layoutCtx.strokeText(text, i + 7, 28)
            text += 1;
        }

		layoutCtx.lineWidth = 0.4;
		for (var i = 0; i < layout.width; i += (zoomSetUp/4)) {
            layoutCtx.beginPath();
            layoutCtx.moveTo(i, 7);
            layoutCtx.lineTo(i, 0);
            layoutCtx.closePath();
			layoutCtx.stroke();
        }

    } else {
		for (var i = 0; i < layout.width; i += (zoomSetUp)) {
			layoutCtx.beginPath();
			layoutCtx.moveTo(i, 30);
			layoutCtx.lineTo(i, 0);
			layoutCtx.closePath();
		    layoutCtx.stroke();

		    layoutCtx.strokeText(text, i + 10, 28)
			text += 1;
		}

    }
}
