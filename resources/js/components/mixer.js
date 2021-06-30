import { grid } from './generalgrid';
import { audioCtx } from '../app_core';


function setChannelGain() {
    let fader, gainNode, track, trckNr, Y,
     	drag = Array(8).fill(false),
     	delta = new Object();

    function onMousePos(context, evt) {
        let rect = context.getBoundingClientRect();
        return {
            x: Math.round(evt.clientX - rect.left),
            y: Math.round(evt.clientY - rect.top)
        };
    }

    for (let track of grid.tracks) {
        track.fader.firstChild.nextSibling.addEventListener("mousedown", evt => {
            fader = evt.target.parentNode;
            trckNr = fader.id.charAt(6);
            gainNode = grid.tracks[trckNr].gainNode;
            Y = fader.Y;
            let mousePos = onMousePos(fader, evt);
            if (mousePos.y <= 280 &&
                mousePos.y >= 20) {
                drag[trckNr] = true;
                delta.y = Y - mousePos.y;
            }
        }, false);

        window.addEventListener("mousemove", evt => {
            let gainValue;
            if (drag[trckNr]) {
                let mousePos = onMousePos(fader, evt);
                Y = mousePos.y + delta.y
                if (Y < 20) Y = 20;
                if (Y > 260) Y = 260;
                fader.Y = Y;
                fader.firstChild.nextSibling.style.top = Y + 'px';

                gainValue = Math.log10(1 / ((Y + 5) / 260));
                if (gainValue > 1) gainValue = 1;
                if (gainValue < 0) gainValue = 0;
                gainNode.gainValue = gainValue;

                if (!grid.tracks[trckNr].muteButton.toggle)
                    gainNode.gain.setValueAtTime(gainValue, audioCtx.currentTime);
            }
        }, false);

        window.addEventListener("mouseup", () => drag[trckNr] = false);
    }
}
setTimeout(setChannelGain, 500);

function setMasterGain() {
    let fader = document.getElementById('master_fader'),
     	gain = grid.gainNode, gainValue, Y,
     	drag = false,
     	delta = new Object();

    function onMousePos(context, evt) {
        let rect = context.getBoundingClientRect();
        return {
            x: Math.round(evt.clientX - rect.left),
            y: Math.round(evt.clientY - rect.top)
        };
    }
    fader.firstChild.addEventListener("mousedown", evt => {
        Y = grid.faderY;
        let mousePos = onMousePos(fader, evt);
        if (mousePos.y <= 280 &&
            mousePos.y >= 20) {
            drag = true;
            delta.y = Y - mousePos.y;
        }
    }, false);

    window.addEventListener("mousemove", evt => {
        let mousePos = onMousePos(fader, evt);
        if (drag) {
            Y = mousePos.y + delta.y;
            if (Y < 20) Y = 20;
            if (Y > 260) Y = 260;

            fader.firstChild.style.top = Y + 'px';
            gainValue = Math.log10(1 / ((Y + 5) / 260));
            if (gainValue > 1) gainValue = 1;
            if (gainValue < 0) gainValue = 0;

            grid.gainValue = gainValue;
            grid.faderY = Y;
            gain.gain.setValueAtTime(gainValue, audioCtx.currentTime);
        }
    }, false);

    window.addEventListener("mouseup", () => drag = false);
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
                newValue.focus();
            }
            window.addEventListener('click', function br(a) {
                if (!a.target.contains(e.currentTarget)) {
                    newValue.remove();
                    newValue.innerHTML = grid.tracks[i].pannerValue;
                    this.removeEventListener('click', br);
                }
            });
            newValue.addEventListener('keyup', function (o) {
                if (o.key === 'Enter') {
                    o.preventDefault();
                    e.target.innerHTML = grid.tracks[i].pannerNode.pannerValue = this.value.toUpperCase();
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
