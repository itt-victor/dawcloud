import { grid } from './generalgrid';
import { audioCtx } from '../app_core';


function setChannelGain() {
    var fader;
    var gain;
    var track;
    var trckNr;
    var drag = [false, false, false, false, false, false, false, false];
    var delta = new Object();
    var X;
    var Y;

    function onMousePos(context, evt) {
        var rect = context.getBoundingClientRect();
        return {
            x: Math.round(evt.clientX - rect.left),
            y: Math.round(evt.clientY - rect.top)
        };
    }

    for (var i = 0; i < grid.tracks.length; i++) {
        grid.tracks[i].fader.firstChild.nextSibling.addEventListener("mousedown", function (evt) {
            fader = this.parentNode;
            trckNr = fader.id.charAt(6);
            Y = fader.Y;
            gain = grid.tracks[trckNr].gainNode;
            var mousePos = onMousePos(fader, evt);
            if (mousePos.y <= 280 &&
                mousePos.y >= 20) {
                drag[trckNr] = true;
                delta.x = X - mousePos.x;
                delta.y = Y - mousePos.y;
            }
        }, false);

        grid.tracks[i].fader.firstChild.nextSibling.addEventListener("mousemove", function a(evt) {
            fader = this.parentNode;
            track = grid.tracks[trckNr];
            trckNr = fader.id.charAt(6);
            gain = grid.tracks[trckNr].gainNode;
            var mousePos = onMousePos(fader, evt);
            var gainValue;
            if (drag[trckNr]) {
                X = mousePos.x + delta.x, Y = mousePos.y + delta.y
                if (Y < 20) { Y = 20 };
                if (Y > 260) { Y = 260 };
                fader.Y = Y;
                this.style.top = Y + 'px';
                gainValue = Math.log10(1 / ((Y + 5) / 260));
                track.gainNode.gainValue = gainValue;
                if (gainValue > 1) { gainValue = 1 };
                if (gainValue < 0) { gainValue = 0 };

                if (track.muteButton.toggle) { }
                else {
                    gain.gain.setValueAtTime(gainValue, audioCtx.currentTime);
                }
                if (X < fader.getBoundingClientRect.x) { drag[trckNr] = false; }
                if (X < (fader.getBoundingClientRect.x + 45)) { drag[trckNr] = false; };
            }
        }, false);

        window.addEventListener("mouseup", function (evt) {
            drag[trckNr] = false;
        }, false);
    }
}
setTimeout( setChannelGain, 500);

function setMasterGain() {
    var fader = document.getElementById('master_fader');
    var gain = grid.gainNode;
    var gainValue;
    var drag = false;
    var delta = new Object();
    var X;
    var Y;
    function onMousePos(context, evt) {
        var rect = context.getBoundingClientRect();
        return {
            x: Math.round(evt.clientX - rect.left),
            y: Math.round(evt.clientY - rect.top)
        };
    }
    fader.firstChild.addEventListener("mousedown", function (evt) {
        Y = this.getAttribute('data-y')
        var mousePos = onMousePos(fader, evt);
        if (mousePos.y <= 280 &&
            mousePos.y >= 20) {
            drag = true;
            delta.x = X - mousePos.x;
            delta.y = Y - mousePos.y;
        }
    }, false);

    fader.firstChild.addEventListener("mousemove", function a(evt) {
        var mousePos = onMousePos(fader, evt);
        if (drag) {
            X = mousePos.x + delta.x, Y = mousePos.y + delta.y
            if (Y < 20) { Y = 20 };
            if (Y > 260) { Y = 260 };
            this.setAttribute('data-y', Y);
            this.style.top = Y + 'px';
            gainValue = Math.log10(1 / ((Y + 5) / 260));
            if (gainValue > 1) { gainValue = 1 };
            if (gainValue < 0) { gainValue = 0 };
            gain.gain.setValueAtTime(gainValue, audioCtx.currentTime);
            if (X < fader.getBoundingClientRect.x) { drag = false; }
            if (X < (fader.getBoundingClientRect.x + 45)) { drag = false; };
        }
    }, false);

    window.addEventListener("mouseup", function (evt) {
        drag = false;
    }, false);
}

setTimeout( setMasterGain, 500);
