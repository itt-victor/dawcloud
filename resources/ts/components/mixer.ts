import { grid, audioCtx } from '../app_core';
import { onMousePos } from '../utils';
import Track from './track';

export const mixer = {

    //GANANCIA DE CADA PISTA
    setChannelGain : () => {
        let fader: HTMLElement, gainNode: Track["gainNode"], gainValue: number, trckNr: number, Y;
        const drag = Array(8).fill(false),
            delta = {y: 0};

        for (const track of grid.tracks) {
            (track.fader.querySelector('a') as HTMLElement).addEventListener("mousedown", function (evt) {
                fader = this.parentNode as HTMLElement;
                trckNr = parseInt(fader.id.charAt(6));
                gainNode = grid.tracks[trckNr].gainNode;
                gainValue = grid.tracks[trckNr].gainValue;
                Y = grid.tracks[trckNr].Y;
                const mousePos = onMousePos(fader, evt);
                if (mousePos.y <= 280 &&
                    mousePos.y >= 20) {
                    drag[trckNr] = true;
                    delta.y = Y - mousePos.y;
                }
            }, false);

            window.addEventListener("mousemove", evt => {
                let gainValue;
                if (drag[trckNr]) {
                    const mousePos = onMousePos(fader, evt);
                    Y = mousePos.y + delta.y
                    if (Y < 20) Y = 20;
                    if (Y > 260) Y = 260;
                    grid.tracks[trckNr].Y = Y;
                    (fader.querySelector('a') as HTMLElement).style.top = `${Y}px`;

                    gainValue = Math.log10(1 / ((Y + 5) / 260));
                    if (gainValue > 1) gainValue = 1;
                    if (gainValue < 0) gainValue = 0;
                    gainValue = gainValue;

                    if (!grid.tracks[trckNr].muteToggle)
                        gainNode.gain.setValueAtTime(gainValue, audioCtx.currentTime);
                }
            }, false);

            window.addEventListener("mouseup", () => drag[trckNr] = false);
        }
    },

    //MASTER GAIN
    setMasterGain : () => {
        const fader = document.getElementById('master_fader') as HTMLElement;
        let gain = grid.gainNode, gainValue, Y,
            drag = false;
        const delta = {y: 0};

        (fader.firstChild as HTMLElement).addEventListener("mousedown", evt => {
            Y = grid.faderY;
            const mousePos = onMousePos(fader, evt);
            if (mousePos.y <= 280 &&
                mousePos.y >= 20) {
                drag = true;
                delta.y = Y - mousePos.y;
            }
        }, false);

        window.addEventListener("mousemove", evt => {
            const mousePos = onMousePos(fader, evt);
            if (drag) {
                Y = mousePos.y + delta.y;
                if (Y < 20) Y = 20;
                if (Y > 260) Y = 260;

                (fader.firstChild as HTMLElement).style.top = `${Y}px`;
                gainValue = Math.log10(1 / ((Y + 5) / 260));
                if (gainValue > 1) gainValue = 1;
                if (gainValue < 0) gainValue = 0;

                grid.gainValue = gainValue;
                grid.faderY = Y;
                gain.gain.setValueAtTime(gainValue, audioCtx.currentTime);
            }
        }, false);

        window.addEventListener("mouseup", () => drag = false);
    },

    //PANORAMA DE CADA PISTA
    setPan : () => {
        const panButton = document.querySelectorAll('.panner');
        let newValue: HTMLInputElement;
        let trackNR: number;
        for (const [i, track] of grid.tracks.entries()) {
            (panButton[i] as HTMLButtonElement).addEventListener('click', function (e) {
                trackNR = parseInt(this.id.charAt(7));
                e.stopPropagation();
                if (!document.getElementById('pan-value')) {
                    newValue = document.createElement('input');
                    newValue.id = 'pan-value';
                    newValue.setAttribute('placeholder', 'set L-R value');
                    this.appendChild(newValue);
                    newValue.focus();
                }
                window.addEventListener('click', function br(a) {
                    if (!(a.target as HTMLElement).contains(e.currentTarget as HTMLElement)) {
                        newValue.remove();
                        newValue.innerHTML = track.pannerValue;
                        this.removeEventListener('click', br);
                    }
                });
                newValue.addEventListener('keyup', function (o) {
                    if (o.key === 'Enter') {
                        o.preventDefault();
                        let ctxValue: number;
                        const execPan = () => {
                            grid.tracks[trackNR].pannerNode.pan.setValueAtTime(ctxValue, audioCtx.currentTime);
                            newValue.remove();
                            (e.target as HTMLElement).innerHTML = track.pannerValue = this.value.toUpperCase();
                        }
                        if (this.value.toUpperCase().startsWith('L')) {
                            ctxValue = - + parseFloat(this.value.slice(1)) / 100;
                            if (ctxValue <= -1) ctxValue = -1;
                            execPan();
                        }
                        else if (parseInt(this.value) == 0 || this.value.toUpperCase() == 'C') {
                            ctxValue = 0;
                            execPan();
                        }
                        else if (this.value.toUpperCase().startsWith('R')) {
                            ctxValue = parseFloat(this.value.slice(1)) / 100;
                            if (ctxValue >= 1) ctxValue = 1;
                            execPan();
                        } else {
                            newValue.value = '';
                            newValue.setAttribute('placeholder', 'Invalid value!');
                        }
                    }
                });
            });
        }
    },

    exe() {
        this.setChannelGain();
        this.setMasterGain();
        this.setPan();
    }
}
