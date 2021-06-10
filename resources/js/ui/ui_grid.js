import { grid } from '../components/generalgrid';
import { timeSpace } from '../timeSpace';

export default function drawGrid () {
	let paint = true;
	let ctx = grid.canvas.getContext('2d')
	let zoomSetUp = 1 / timeSpace.zoom * timeSpace.compas * timeSpace.bpm;

	ctx.globalAlpha = 1;
	ctx.fillStyle = /*'#80b9ba';*/"#8accd1";
	ctx.clearRect(0, 0, grid.canvas.width, grid.canvas.height)
	ctx.fillRect(0, 0, grid.canvas.width, grid.canvas.height);

	ctx.lineWidth = 0.6;
	ctx.globalCompositeOperation = 'darken';

	for (let i = 0; i < grid.canvas.width; i += (zoomSetUp/4)) {
		//ctx.strokeRect(i, 0, 1, 560);
		ctx.strokeStyle = "black";
		ctx.beginPath();
		ctx.moveTo(i*4, 560);
		ctx.lineTo(i*4, 0);
		ctx.closePath();
		ctx.stroke();

		ctx.strokeStyle = "grey";
		ctx.beginPath();
		ctx.moveTo(i, 560);
		ctx.lineTo(i, 0);
		ctx.closePath();
		ctx.stroke();

		ctx.strokeStyle = "darkgray";
		ctx.beginPath();
		ctx.moveTo(i/2, 560);
		ctx.lineTo(i/2, 0);
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
