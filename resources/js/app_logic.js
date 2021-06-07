require('./bootstrap');
var toWav = require('audiobuffer-to-wav');

import { soundcontroller } from './app_core';
import { audioCtx } from './app_core'
import { grid } from './components/generalgrid';
import { timeSpace } from './timeSpace';
import { ui_draw } from './ui/ui_draw';
import drawLayout from './ui/ui_layout';
import { cursor } from './components/cursor';
import { soundStatuses } from './app_core';
import { eStop } from './app_core';


//toggle registrarse para uruarios no registrados
function toggleSignUp() {
    let signup = document.querySelector('#signup_now');
    let signupReminder = document.querySelector('#signup_reminder');
    let xButton = document.querySelector('.x-button');
    if (signup) {
        signup.addEventListener('click', function () {
            signupReminder.style.display = 'flex';
            signupReminder.style.visibility = 'visible';
        });
    }
    if (xButton) {
        xButton.addEventListener('click', function () {
            signupReminder.style.display = 'none';
            signupReminder.style.visibility = 'hidden';
        });
    }
}
toggleSignUp();


//Seleccionar pista
function selectTrack() {
    const tracks = document.getElementsByClassName("track");
    const trackNames = document.getElementsByClassName("track_name");
    var index;
    for (var i = 0; i < tracks.length; i++) {
        tracks[i].addEventListener('mousedown', function (e) {
            for (var i = 0; i < tracks.length; i++) {
                tracks[i].removeAttribute('data-selected');
            }
            this.setAttribute('data-selected', '');
        })
        trackNames[i].addEventListener('click', function (e) {
            index = this.id.charAt(11);
            for (var i = 0; i < tracks.length; i++) {
                tracks[i].removeAttribute('data-selected');
            }
            tracks[index].setAttribute('data-selected', '');
        })
    }
}
selectTrack();


//Cargar una canción desde el pc del usuario
function loadSong() {
    const button = document.getElementById('load_sound_hidden');
    if (button) {
        button.onchange = function () {
            eStop();
            var reader = new FileReader();
            reader.onload = function (e) {
                let trcknr = document.querySelector('[data-selected]').id;
                audioCtx.decodeAudioData(e.target.result).then(function (buffer) {
                    grid.tracks[trcknr].addRecord(timeSpace.time(), buffer);
                });
            }
            if (button.files[0]) {
                reader.readAsArrayBuffer(button.files[0]);
            }
        }
    }
}
setTimeout(loadSong, 0);

//Exportar el proyecto
function exportSong() {

    if (grid.recordings.length > 0) {
        let maxLength = 0;
        let pannerValue;
        let ctxValue;

        for (let i = 0; i < grid.recordings.length; i++) {
            if (maxLength < (grid.recordings[i].audioBuffer.length
                + (grid.recordings[i].timeToStart * 48000))) {
                maxLength = grid.recordings[i].audioBuffer.length
                    + (grid.recordings[i].timeToStart * 48000);
            };
        }

        const offlineCtx = new OfflineAudioContext({
            numberOfChannels: 2,
            length: maxLength,
            sampleRate: 48000,
        });

        let mastergain = offlineCtx.createGain();
        mastergain.connect(offlineCtx.destination);
        let pannerNodes = [];

        for (let i = 0; i < grid.tracks.length; i++) {
            let panner = offlineCtx.createStereoPanner();
            pannerNodes.push(panner);
            let gain = offlineCtx.createGain();
            pannerValue = grid.tracks[i].pannerNode.pannerValue;

            if (pannerValue.startsWith('L')) {
                ctxValue = - + pannerValue.slice(1) / 100;
                panner.pan.setValueAtTime(ctxValue, 0);
            }
            else if (pannerValue == 0 || pannerValue == 'C') {
                ctxValue = 0;
                panner.pan.setValueAtTime(ctxValue, 0);
            }
            else if (pannerValue.startsWith('R')) {
                ctxValue = pannerValue.slice(1) / 100;
                panner.pan.setValueAtTime(ctxValue, 0);
            }
            gain.gain.setValueAtTime(grid.tracks[i].gainNode.gainValue, 0);
            panner.connect(gain);
            gain.connect(mastergain);
        }

        for (let h = 0; h < grid.recordings.length; h++) {
            const source = offlineCtx.createBufferSource();
            source.buffer = grid.recordings[h].audioBuffer;
            source.connect(pannerNodes[grid.recordings[h].tracknumber]);
            var start = Math.max((grid.recordings[h].timeToStart), 0);
            source.start(start, 0);
        }

        offlineCtx.startRendering().then(function (renderedBuffer) {
            let filename = 'project.wav'
            const a = document.createElement('a');
            var blob = new window.Blob([new DataView(toWav(renderedBuffer))], {
                type: 'audio/wav'
            });
            a.href = URL.createObjectURL(blob);
            a.download = filename;
            a.click();
            URL.revokeObjectURL(a.href);
        });
    }
}
export_sound.addEventListener('click', exportSong);



//zoom
function zoom() {
    let zoomIn = document.getElementById("zoomin");
    let zoomOut = document.getElementById("zoomout");
    let oldZoom;

    function zIn() {
        oldZoom = timeSpace.zoom;
        timeSpace.zoom = parseFloat((timeSpace.zoom * (1 / 1.25)).toFixed(8));

        for (var i = 0; i < grid.recordings.length; i++) {
            ui_draw.drawRecording(grid.recordings[i]);
        }
        drawLayout();
        cursor.moveAtZoom(oldZoom);
        if (soundStatuses.isPlaying) {
            cursor.stop();
            cursor.play();
        }
    }
    function zOut() {
        oldZoom = timeSpace.zoom;
        timeSpace.zoom = parseFloat((timeSpace.zoom / (1 / 1.25)).toFixed(8));
        for (var i = 0; i < grid.recordings.length; i++) {
            ui_draw.drawRecording(grid.recordings[i]);
        }
        drawLayout();
        cursor.moveAtZoom(oldZoom);
        if (soundStatuses.isPlaying) {
            cursor.stop();
            cursor.play();
        }
    }
    zoomIn.addEventListener('click', zIn);
    zoomOut.addEventListener('click', zOut);
}
zoom();

//establece el bpm
function setBpm() {
    const bpmButton = document.getElementById('bpm_button');
    let input;
    bpmButton.innerHTML = (120 / timeSpace.bpm) + '  bpm';
    bpmButton.addEventListener('click', function (e) {
        e.stopPropagation();
        if (!document.getElementById('bpm_value')) {
            bpmButton.innerHTML = '';
            input = document.createElement('input');
            input.id = 'bpm_value';
            input.style.width = '80px';
            input.setAttribute('placeholder', 'set tempo');
            bpmButton.appendChild(input);
            input.focus();
        }
        window.addEventListener('click', function br(a) {
            if (!a.target.contains(e.currentTarget)) {
                input.remove();
                bpmButton.innerHTML = (120 / timeSpace.bpm) + '  bpm';
                this.removeEventListener('click', br);
            }
        });
        input.addEventListener('keyup', function (o) {
            if (o.keyCode === 13) {
                o.preventDefault();
                timeSpace.bpm = 120 / this.value;
                bpmButton.innerHTML = (120 / timeSpace.bpm) + '  bpm';
                input.remove();
                drawLayout();
            }
        });
    });
}
setBpm();

//cambia el compás, ya se añadiran más
function metric() {
    const metricButton = document.getElementById('metric_button');
    metricButton.innerHTML = '4/4';
    metricButton.addEventListener('click', function (e) {
        if (metricButton.textContent == '4/4') {
            metricButton.innerHTML = '3/4';
            timeSpace.compas = 1.5;
            drawLayout()
        } else {
            metricButton.innerHTML = '4/4';
            timeSpace.compas = 2;
            drawLayout()
        }
    });
}
metric();

//mutea la pista
function mute() {
    const button = document.getElementsByClassName('track_mute');
    const soloButton = document.getElementsByClassName('track_solo');

    for (let a = 0; a < button.length; a++) {
        button[a].addEventListener('click', function () {
            this.classList.toggle('track_mute_on');
            if (!this.toggle) {
                soundcontroller.mute(this.parent.gainNode);
                this.toggle = true;
            } else if (this.toggle) {
                soundcontroller.solo(this.parent.gainNode);
                this.toggle = false;
            }
            for (let b = 0; b < soloButton.length; b++) {
                if (soloButton[b].toggle) {
                    soundcontroller.mute(this.parent.gainNode);
                }
            }
        });
    }
}
mute();

//solea la pista
function solo() {
    const button = document.getElementsByClassName('track_solo');
    for (let a = 0; a < button.length; a++) {
        button[a].addEventListener('click', function () {
            this.classList.toggle('track_solo_on');
            for (let b = 0; b < button.length; b++) {
                if (!button[b].toggle) {
                    soundcontroller.mute(button[b].parent.gainNode);
                } else {
                    soundcontroller.solo(button[b].parent.gainNode);
                }
            }
            if (!this.toggle) {
                for (let b = 0; b < button.length; b++) {
                    soundcontroller.mute(button[b].parent.gainNode);
                }
                soundcontroller.solo(this.parent.gainNode);
                this.toggle = true;
            } else {
                for (let b = 0; b < button.length; b++) {
                    if (!button[b].parent.muteButton.toggle) {
                        soundcontroller.solo(button[b].parent.gainNode);
                    }
                }
                this.toggle = false;
            }
        });
    }
}
solo();

//elimina la grabación
export function removeRecording(recording) {

    recording.canvas.addEventListener('click', function arrr(e) {

        for (var i = 0; i < grid.recordings.length; i++) {
            if (grid.recordings[i].audioBuffer != undefined) {
                ui_draw.drawRecording(grid.recordings[i]);
            }
        }
        ui_draw.clickAtRecording(recording);
        window.addEventListener('keyup', function (a) {
            if (a.keyCode === 46) {
                a.preventDefault();
                if (recording.audioBuffer) {
                    if (!soundStatuses.hasStopped) {
                        soundcontroller.stopSingleSound(recording);
                    }
                    recording.deleteRecording();
                    grid.recordings.splice(grid.recordings.indexOf(recording), 1);
                }
                e.target.removeEventListener('click', arrr);
            }
        });
    });
}
