
import { soundcontroller } from './app_core';
import { audioCtx } from './app_core'
import { grid } from './components/generalgrid';
import drawGrid from './ui/ui_grid';
import { timeSpace } from './timeSpace';
import { ui_draw } from './ui/ui_draw';
import drawLayout from './ui/ui_layout';
import { cursor } from './components/cursor';
import { soundStatuses } from './app_core';
import { eStop } from './app_core';
import { generateRecordingId } from './utils';

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
                let trcknr = document.querySelector('[data-selected]').id.charAt(6);
                audioCtx.decodeAudioData(e.target.result).then(function (buffer) {
                    grid.tracks[trcknr].addRecord(generateRecordingId(), timeSpace.time(), buffer, 0, buffer.duration);
                });
            }
            if (button.files[0]) {
                reader.readAsArrayBuffer(button.files[0]);
            }
        }
    }
}
setTimeout(loadSong, 0);


//zoom
function zoom() {
    let zoomIn = document.getElementById("zoomin");
    let zoomOut = document.getElementById("zoomout");
    let oldZoom;

    function zIn() {
        oldZoom = timeSpace.zoom;
        timeSpace.zoom = Math.round(timeSpace.zoom * 1.25);
        if (timeSpace.zoom >= 889) {timeSpace.zoom = 889}
        for (var i = 0; i < grid.recordings.length; i++) {
			let offset = grid.recordings[i].offset * timeSpace.zoom;
			let duration = grid.recordings[i].duration * timeSpace.zoom;
            ui_draw.printRecording(grid.recordings[i],
                grid.recordings[i].offscreenCanvas[timeSpace.zoom],
				offset, duration);
        }
		drawGrid();
        drawLayout();
        cursor.moveAtZoom(oldZoom);
    }
    function zOut() {
        oldZoom = timeSpace.zoom;
        timeSpace.zoom = Math.round(timeSpace.zoom / 1.25);
        if (timeSpace.zoom <= 5) {timeSpace.zoom = 5}
        for (var i = 0; i < grid.recordings.length; i++) {
			let offset = grid.recordings[i].offset * timeSpace.zoom;
			let duration = grid.recordings[i].duration * timeSpace.zoom;
            ui_draw.printRecording(grid.recordings[i],
                grid.recordings[i].offscreenCanvas[timeSpace.zoom],
				offset, duration);
        }
		drawGrid();
        drawLayout();
        cursor.moveAtZoom(oldZoom);
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
                bpmButton.innerHTML = this.value + '  bpm';
                input.remove();
				drawGrid();
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
			drawGrid();
            drawLayout()
        } else {
            metricButton.innerHTML = '4/4';
            timeSpace.compas = 2;
			drawGrid();
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
    recording.canvas.addEventListener('mousedown', function arrr(e) {
        for (var i = 0; i < grid.recordings.length; i++) {
			let offset = grid.recordings[i].offset * timeSpace.zoom;
			let duration = grid.recordings[i].duration * timeSpace.zoom;
            ui_draw.printRecording(grid.recordings[i],
				grid.recordings[i].offscreenCanvas[timeSpace.zoom], offset, duration);
        }
		let offset = recording.offset * timeSpace.zoom;
		let duration = recording.duration * timeSpace.zoom;
        ui_draw.printRecording(recording,
			recording.offscreenSelectedCanvas[timeSpace.zoom], offset, duration);

        window.addEventListener('keyup', function rra(a) {
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
