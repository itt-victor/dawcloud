import { grid } from './components/generalgrid';

export var timeSpace = {
    timeAtPause: 0,
    pxIncrement: 0,
    pointedWidth: 0, // o 611
    widthAtPause : 0,//620, // o 611  - al meterle en el grid, ahora está atado a 0
    zoom: 0.050,//0.2    //habrá que poner límite que revienta si acercas mucho
    bpm: 1,          // 120 = 1   60 = 2
    compas: 2        //2 es 4/4 1 es 3/4
};
