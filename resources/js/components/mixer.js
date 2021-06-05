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

                if (gainValue > 1) { gainValue = 1 };
                if (gainValue < 0) { gainValue = 0 };

                track.gainNode.gainValue = gainValue;

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
setTimeout(setChannelGain, 500);

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
        Y = grid.faderY;
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

            this.style.top = Y + 'px';
            gainValue = Math.log10(1 / ((Y + 5) / 260));
            if (gainValue > 1) { gainValue = 1 };
            if (gainValue < 0) { gainValue = 0 };

            grid.gainValue = gainValue;
            grid.faderY = Y;

            gain.gain.setValueAtTime(gainValue, audioCtx.currentTime);
            if (X < fader.getBoundingClientRect.x) { drag = false; }
            if (X < (fader.getBoundingClientRect.x + 45)) { drag = false; };
        }
    }, false);

    window.addEventListener("mouseup", function (evt) {
        drag = false;
    }, false);
}

setTimeout(setMasterGain, 500);

function setPan() {
    const panButton = document.getElementsByClassName('panner');
    let newValue;
    let trackNR;
    for (let i = 0; i < panButton.length; i++) {
        panButton[i].addEventListener('click', function (e) {
            trackNR = this.id.charAt(7);
            e.stopPropagation();
            if (!document.getElementById('pan-value')) {
                newValue = document.createElement('input');
                newValue.id = 'pan-value';
                newValue.setAttribute('placeholder', 'set L-R value');
                this.appendChild(newValue);
            }
            window.addEventListener('click', function br(a) {
                if (!a.target.contains(e.currentTarget)) {
                    newValue.remove();
                    newValue.innerHTML = grid.tracks[i].pannerValue;
                    this.removeEventListener('click', br);
                }
            });
            newValue.addEventListener('keyup', function (o) {
                if (o.keyCode === 13) {
                    o.preventDefault();
                    grid.tracks[i].pannerNode.pannerValue = this.value.toUpperCase();
                    e.target.innerHTML = this.value.toUpperCase();
                    let ctxValue;
                    if (this.value.toUpperCase().startsWith('L')) {
                        ctxValue = - + this.value.slice(1) / 100;
                        grid.tracks[trackNR].pannerNode.pan.setValueAtTime(ctxValue, audioCtx.currentTime);
                        newValue.remove();
                    }
                    else if (this.value == 0 || this.value.toUpperCase() == 'C') {
                        ctxValue = 0;
                        grid.tracks[trackNR].pannerNode.pan.setValueAtTime(ctxValue, audioCtx.currentTime);
                        newValue.remove();
                    }
                    else if (this.value.toUpperCase().startsWith('R')) {
                        ctxValue = this.value.slice(1) / 100;
                        grid.tracks[trackNR].pannerNode.pan.setValueAtTime(ctxValue, audioCtx.currentTime);
                        newValue.remove();
                    } else {
                        newValue.setAttribute('placeholder', 'Invalid value!');
                    }
                }
            });
        });
    }
}
setTimeout(setPan, 500);
