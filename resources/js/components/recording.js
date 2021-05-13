

export default class Recording {
    constructor(timeToStart, offSet, audioBuffer) {

        this.timeToStart = timeToStart;
        this.offSet = offSet;
        this.audioBuffer = audioBuffer;
        this.drawing = drawRecording();

    }
}

function drawRecording(audioBuffer, track, actualTime) {
    var x = actualTime * 1000 / 200;
    var canvasCtx = track.getContext('2d');
    var width = audioBuffer.duration * 1000 / 200;
    //1000px son iguales a 200s, o 3min 20s - para cambiar el zoom puedes jugar con esto
    //Por lo que en cada segundo se mueven 5px.
    canvasCtx.fillStyle = '#380166';
    canvasCtx.fillRect(x, 0, width, 77);
    audioBuffer = null;
}
