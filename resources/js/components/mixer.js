import { grid } from './generalgrid';


function setGain() {
    var fader;
    var gain;
    var trckNr;
    var drag = [false, false, false, false, false, false, false, false];
    var delta = [new Object(), new Object(), new Object(), new Object(), new Object(), new Object(), new Object(), new Object()];
    var X;
    var Y = 20;

    function onMousePos(context, evt) {
        var rect = context.getBoundingClientRect();
        return {
            x: Math.round(evt.clientX - rect.left),
            y: Math.round(evt.clientY - rect.top)
        };
    }

    for (var i = 0; i < grid.tracks.length; i++){
        grid.tracks[i].fader.firstChild.nextSibling.addEventListener("mousedown", function (evt) {
            fader = this.parentNode;
            trckNr = fader.id.charAt(6);
            //gain = fader.parent.gainNode;
            var mousePos = onMousePos(fader, evt);
            if (mousePos.y < 260 &&
                mousePos.y > 20){
            drag[trckNr] = true;
            delta[trckNr].x = X - mousePos.x;
            delta[trckNr].y = Y - mousePos.y;
            }
        }, false);

        grid.tracks[i].fader.firstChild.nextSibling.addEventListener("mousemove", function a(evt) {
            fader = this.parentNode;
            trckNr = fader.id.charAt(6);
          //  gain = this.parent.gainNode;
            var mousePos = onMousePos(fader, evt);
            if (drag[trckNr]) {
                //Y = fader.getAttribute('data-y');
                X = mousePos.x + delta.x, Y = mousePos.y + delta[trckNr].y
                fader.setAttribute('data-y', Y);
                if (Y < 20) { Y = 20 };
                if (Y > 260) { Y = 260 };
                this.style.top = Y + 'px';
                if (X < fader.getBoundingClientRect.x) { drag[trckNr]=false;}
                if (X < (fader.getBoundingClientRect.x +45)) { drag[trckNr]=false;};
            }
        }, false);

        window.addEventListener("mouseup", function (evt) {
            drag[trckNr] = false;
            console.log(delta);
        }, false);
    }
}
setTimeout( function() {setGain();},500);
