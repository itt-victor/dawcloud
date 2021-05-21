import { grid } from './generalgrid';


function setGain() {
    var fader;
    var gain;
    var drag = false;
    var delta = new Object();
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
        fader = grid.tracks[i].fader;
        gain = grid.tracks[i].gainNode;


        grid.tracks[i].fader.firstChild.nextSibling.addEventListener("mousedown", function (evt) {
            var mousePos = onMousePos(this.parentNode, evt);
            console.log(mousePos);
            if (mousePos.y < 260 &&
                mousePos.y > 20){
            drag = true;
            delta.x = X - mousePos.x;
            delta.y = Y - mousePos.y;
            }
        }, false);

        grid.tracks[i].fader.firstChild.nextSibling.addEventListener("mousemove", function a(evt) {
            var mousePos = onMousePos(this.parentNode, evt);
            if (drag) {
                Y = this.parentNode.getAttribute('data-y');
                X = mousePos.x + delta.x, Y = mousePos.y + delta.y
                if (Y < 20) { Y = 20 };
                if (Y > 280) { Y = 260 };
                this.style.top = Y + 'px';
                if (X < this.parentNode.getBoundingClientRect.x) { drag=false;}
                if (X < (this.parentNode.getBoundingClientRect.x +45)) { drag=false;};
                this.parentNode.setAttribute('data-y', Y);
            }
        }, false);

        grid.tracks[i].fader.firstChild.nextSibling.addEventListener("mouseup", function (evt) {
            drag = false;
        }, false);
    }
}
setTimeout( function() {setGain();},500);
