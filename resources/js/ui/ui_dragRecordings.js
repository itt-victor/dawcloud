require('./ui_draw');
import { grid } from '../components/generalgrid';


//drawRecording(recording, canvasCtx)
//MÍRATE EESTO BIEN
function dragRecording() {
    var trackNR = document.querySelector('[data-selected] > canvas').id;
    var track = grid.tracks[trackNR]
    var trackCanvas = track.canvas
    var ctx = track.canvasCtx
    var recording = track.recordings[0];
    var drag = false;
    var delta = new Object();
    var X = recording.timeToStart * 5;
    var Y = 0;

    function updateRecording(x, y, recording) {
        //var x = recording.timeToStart * 5;
        //var canvasCtx = canvasCtx;
        var width = recording.audioBuffer.duration * 5;                 //1000px son iguales a 200s, o 3min 20s -
        ctx.fillStyle = '#8254a7';                      //para cambiar el zoom puedes jugar con esto
        ctx.fillRect(x, 0, width, 77);                  //Por lo que en cada segundo se mueven 5px.
        ctx.strokeStyle = '#380166';
        ctx.strokeRect(x, 0, width, 77);
    }

    function oMousePos(canvas, evt) {
        var rect = trackCanvas.getBoundingClientRect();
        return { // devuelve un objeto
            x: Math.round(evt.clientX - rect.left),
            y: Math.round(evt.clientY - rect.top)
        };
    }

    trackCanvas.addEventListener("mousedown", function(evt) {
         var mousePos = oMousePos(trackCanvas, evt);
         updateRecording(X, Y, recording)
        //HABRA QUE MIRAR SI HAY QUE DIBUJAR DE OTRA MANERA if (ctx.isPointInPath(mousePos.x, mousePos.y)) {
             drag = true;
             delta.x = X - mousePos.x;
             delta.y = Y - mousePos.y;
        // }
    }, false);

    trackCanvas.addEventListener("mousemove", function(evt) {
        var mousePos = oMousePos(trackCanvas, evt);
        if (drag) {
              ctx.clearRect(0, 0, trackCanvas.width, trackCanvas.height);
              X = mousePos.x + delta.x, Y = mousePos.y + delta.y
              if (X < 0){ X= 0};
              updateRecording(X, Y, recording)
        }
    }, false);

    trackCanvas.addEventListener("mouseup", function(evt) {
        drag = false;
    }, false);

}



setTimeout( dragRecording, 1000);
