import { grid } from './components/generalgrid';

export var timeSpace = {
    pxAtPause: 0,
    timeAtPause: 0
};

//los añado a posteriori ya que los canvases tardan unos ms en cargar
setTimeout(function () { timeSpace.pointedWidth = grid.canvas.getBoundingClientRect().x}, 0);
setTimeout(function () { timeSpace.newWidth = grid.canvas.getBoundingClientRect().x}, 0);

