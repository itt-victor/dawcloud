import {timeSpace}  from '../timeSpace';
/*import Track from './track';
import grid from './generalgrid';*/

export default class Recording {
    constructor(timeToStart, offSet, audioBuffer, canvasCtx) {

        this.timeToStart = timeToStart;
        this.offSet = offSet;
        this.audioBuffer = audioBuffer;
        this.canvasCtx = canvasCtx;

    }

    drawRecording() {
        var x = this.timeToStart * 1000 / 200;
        var canvasCtx = canvasCtx;
        var width = this.audioBuffer.duration * 1000 / 200;        //1000px son iguales a 200s, o 3min 20s -
        this.canvasCtx.fillStyle = '#380166';                      //para cambiar el zoom puedes jugar con esto
        this.canvasCtx.fillRect(x, 0, width, 77);                  //Por lo que en cada segundo se mueven 5px.
    };
}



