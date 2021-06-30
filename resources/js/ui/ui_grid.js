import { grid } from '../components/generalgrid';
import { timeSpace } from '../timeSpace';

export default function drawGrid() {
    let ctx = grid.canvas.getContext('2d'),
     	zoomSetUp = timeSpace.zoom * timeSpace.compas * timeSpace.bpm,
     	compasDivision;

    ctx.globalAlpha = 1;
    ctx.fillStyle = "#8accd1";
    ctx.clearRect(0, 0, grid.canvas.width, grid.canvas.height);
    ctx.fillRect(0, 0, grid.canvas.width, grid.canvas.height);
    ctx.lineWidth = 0.6;
    ctx.globalCompositeOperation = 'darken';

    if (timeSpace.compas == 2) compasDivision = 4;
    else if (timeSpace.compas == 1.5) compasDivision = 3;

    for (let i = 0; i < grid.canvas.width; i += (zoomSetUp / compasDivision)) {

        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.moveTo(i * compasDivision, 560);
        ctx.lineTo(i * compasDivision, 0);
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
        ctx.moveTo(i / 2, 560);
        ctx.lineTo(i / 2, 0);
        ctx.closePath();
        ctx.stroke();
    }
}
