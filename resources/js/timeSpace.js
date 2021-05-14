import { grid } from './components/generalgrid';

export var timeSpace = {
    //pointedWidth: grid.tracks[0].canvas.getBoundingClientRect().x,
    //newWidth: grid.tracks[0].canvas.getBoundingClientRect().x,
    pxAtPause: 0,
    timeAtPause: 0
};

//los añado a posteriori ya que los canvases tardan unos ms en cargar
setTimeout(function () { timeSpace.pointedWidth = grid.tracks[0].canvas.getBoundingClientRect().x}, 0);
setTimeout(function () { timeSpace.newWidth = grid.tracks[0].canvas.getBoundingClientRect().x}, 0);
