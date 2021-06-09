import { grid } from '../components/generalgrid';
import { timeSpace } from '../timeSpace';

export default function drawGrid () {
	let paint = true;
	let ctx = grid.canvas.getContext('2d')
	ctx.globalAlpha = 1;
	let zoomSetUp = 1 / timeSpace.zoom * timeSpace.compas * timeSpace.bpm;

	ctx.fillStyle = /*'#80b9ba';*/"#8accd1";
	ctx.fillRect(0, 0, grid.canvas.width, grid.canvas.height);

	ctx.strokeStyle = "black";
	ctx.lineWidth = 0.3;

	for (let i = 0; i < grid.canvas.width; i += (zoomSetUp/2)) {
		//ctx.strokeRect(i, 0, 1, 560);

		ctx.beginPath();
		ctx.moveTo(i, 560);
		ctx.lineTo(i, 0);
		ctx.closePath();
		ctx.stroke();

		/*ctx.fillStyle = '#6aacad';
		if (paint) {
			ctx.fillRect(i, 0, zoomSetUp/4, 560);
			paint = false;
		} else {
			paint = true;
		}*/
	}
}
