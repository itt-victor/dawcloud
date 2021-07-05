
import { audioCtx, soundcontroller, is, eStop, loading } from './app_core';
import { grid } from './components/generalgrid';
import drawGrid from './ui/ui_grid';
import { timeSpace } from './timeSpace';
import { ui_draw } from './ui/ui_draw';
import drawLayout from './ui/ui_layout';
import { cursor } from './components/cursor';
import { generateRecordingId } from './utils';

//toggle registrarse para uruarios no registrados
(function toggleSignUp() {
    let signup = document.querySelector('#signup_now');
    let signupReminder = document.querySelector('#signup_reminder');
    let xButton = document.querySelector('.x-button');
    if (signup) {
        signup.addEventListener('click', () => {
            signupReminder.style.display = 'flex';
        });
    }
    if (xButton) {
        xButton.addEventListener('click', () => {
            signupReminder.style.display = 'none';
        });
    }
})();

//Seleccionar pista
(function selectTrack() {
    const tracks = document.getElementsByClassName("track");
    const trackNames = document.getElementsByClassName("track_name");
    for (let track of tracks) {
        track.addEventListener('mousedown', e => {
            for (let unTrack of tracks)
                unTrack.removeAttribute('data-selected');
            e.currentTarget.setAttribute('data-selected', '');
        });
    }
    for (let name of trackNames) {
        name.addEventListener('click', e => {
            let index = e.currentTarget.id.charAt(11);
            for (let track of tracks)
                track.removeAttribute('data-selected');
            tracks[index].setAttribute('data-selected', '');
        });
    }

})();

//cambia nombre de la pista
(function changeTrackName() {
    let names = document.querySelectorAll('.select');
    for (let name of names) {
        name.addEventListener('dblclick', e => {
            let name = e.target;
            name.style.display = 'none';
            let input = name.parentNode.getElementsByTagName('input')[0];
            input.style.display = 'block';
            input.focus();
            let trackId = name.parentNode.id.charAt(11);
            window.addEventListener('keypress', i => {
                if (i.key === 'Enter') {
                    name.innerHTML = input.value;
                    name.style.display = 'block';
                    input.style.display = 'none';
                    grid.tracks[trackId].name = input.value;
                }
            })
            window.addEventListener('click', a => {
                if (a.target != input) {
                    name.style.display = 'block';
                    input.style.display = 'none';
                }
            })
        });
    }
})();

//Cargar una canción desde el pc del usuario
(function loadSong() {
    const button = document.getElementById('load_sound_hidden');
    if (button) {
        button.onchange = a => {
            loading(); eStop();
            let reader = new FileReader();
            reader.onload = e => {
                let trcknr = document.querySelector('[data-selected]').id.charAt(6);
                audioCtx.decodeAudioData(e.target.result).then(buffer =>
					grid.tracks[trcknr].addRecord(generateRecordingId(), timeSpace.time(), buffer, 0, buffer.duration)
                );
            }
            if (a.target.files.length > 0)
                reader.readAsArrayBuffer(a.target.files[a.target.files.length -1]);
        }
    }
})();

//zoom
(function zoom() {
    const zoomIn = document.getElementById("zoomin"),
    	zoomOut = document.getElementById("zoomout"),
    	inputs = document.querySelectorAll('input');
    let oldZoom;

    function zIn() {
        oldZoom = timeSpace.zoom;
        timeSpace.zoom = Math.round(timeSpace.zoom * 1.25);
        if (timeSpace.zoom >= 889) timeSpace.zoom = 889;
        zDraw();
    }
    function zOut() {
        oldZoom = timeSpace.zoom;
        timeSpace.zoom = Math.round(timeSpace.zoom / 1.25);
        if (timeSpace.zoom <= 5) timeSpace.zoom = 5;
        zDraw();
    }
    function zDraw() {
        grid.recordings.forEach(recording => {
            let offset = recording.offset * timeSpace.zoom,
            	duration = recording.duration * timeSpace.zoom,
             	offCanvas = (recording.canvas.selected)
                	? recording.offSelectedCanvas[timeSpace.zoom]
                	: recording.offCanvas[timeSpace.zoom],
            	width = Math.ceil(duration - offset) + 1;
            ui_draw.printRecording(width, recording, offCanvas, offset, duration);
        });
        drawGrid(); drawLayout();
        cursor.moveAtZoom(oldZoom);
    }
    zoomIn.addEventListener('click', zIn);
    zoomOut.addEventListener('click', zOut);
    document.addEventListener('keypress', e => {
        if (e.key === 'h' || e.key === 'H') {
            for (const input of inputs)
                if (e.target == input) return;
            zIn();
        }
    });
    document.addEventListener('keypress', e => {
        if (e.key === 'g' || e.key === 'G') {
            for (const input of inputs)
                if (e.target == input) return;
            zOut();
        }
    });
})();

//establece el bpm
(function setBpm() {
    const bpmButton = document.getElementById('bpm_button');
    let input;
    bpmButton.innerHTML = Math.round(120 / timeSpace.bpm) + '  bpm';
    bpmButton.addEventListener('click', e => {
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
                bpmButton.innerHTML = Math.round(120 / timeSpace.bpm) + '  bpm';
                this.removeEventListener('click', br);
            }
        });
        input.addEventListener('keypress', o => {
            if (o.key === 'Enter') {
                o.preventDefault();
                timeSpace.bpm = 120 / o.target.value;
                bpmButton.innerHTML = Math.round(120 / timeSpace.bpm) + '  bpm';
                input.remove();
                drawGrid(); drawLayout();
            }
        });
    });
})();

//cambia el compás, ya se añadiran más
(function metric() {
    const metricButton = document.getElementById('metric_button');
    metricButton.innerHTML = '4/4';
    metricButton.addEventListener('click', ()=> {
        if (metricButton.textContent == '4/4') {
            metricButton.innerHTML = '3/4';
            timeSpace.compas = 1.5;
        } else {
            metricButton.innerHTML = '4/4';
            timeSpace.compas = 2;
        }
		drawGrid(); drawLayout();
    });
})();

//mutea la pista
(function mute() {
    const buttons = document.getElementsByClassName('track_mute'),
          soloButtons = document.getElementsByClassName('track_solo');

    for (const button of buttons) {
        button.addEventListener('click', function () {
            this.classList.toggle('track_mute_on');
            if (!this.toggle) {
                soundcontroller.mute(this.parent.gainNode);
                this.toggle = true;
            } else if (this.toggle) {
                soundcontroller.solo(this.parent.gainNode);
                this.toggle = false;
            }
            for (const soloButton of soloButtons)
                if (soloButton.toggle)
                    soundcontroller.mute(this.parent.gainNode);
        });
    }
})();

//solea la pista
(function solo() {
    const button = document.getElementsByClassName('track_solo');
    for (const btn of button) {
        btn.addEventListener('click', function () {
            this.classList.toggle('track_solo_on');
            for (let btn of button)
                (!btn.toggle) ?
                    soundcontroller.mute(btn.parent.gainNode) :
                    soundcontroller.solo(btn.parent.gainNode);
            if (!this.toggle) {
                for (let btn of button)
                    soundcontroller.mute(btn.parent.gainNode);
                soundcontroller.solo(this.parent.gainNode);
                this.toggle = true;
            } else {
                for (let btn of button)
                    if (!btn.parent.muteButton.toggle)
                        soundcontroller.solo(btn.parent.gainNode);
                this.toggle = false;
            }
        });
    }
})();

//elimina la grabación
export function removeRecording(recording) {
    recording.canvas.addEventListener('mousedown', e => {
        e.stopPropagation;
        if (!recording.canvas.selected) {
            grid.recordings.forEach( recording => {
                recording.canvas.selected = false;
                let offset = recording.offset * timeSpace.zoom,
                	duration = recording.duration * timeSpace.zoom,
                	width = Math.ceil(duration - offset) + 1;
                ui_draw.printRecording(
                    width,
                    recording,
                    recording.offCanvas[timeSpace.zoom],
                    offset,
                    duration
                );
            });

            recording.canvas.selected = true;
            let offset = recording.offset * timeSpace.zoom,
            	duration = recording.duration * timeSpace.zoom,
            	width = Math.ceil(duration - offset) +1;
            ui_draw.printRecording(
                width,
                recording,
                recording.offSelectedCanvas[timeSpace.zoom],
                offset,
                duration
            );
        }
    });
    window.addEventListener('keyup', a => {
        if (recording.canvas) {
            if (a.key === 'Delete' && recording.canvas.selected) {
                a.preventDefault();
                if (is.playing) soundcontroller.stopSingleSound(recording);
                recording.deleteRecording();
                grid.recordings.splice(grid.recordings.indexOf(recording), 1);
            }
        }
    });
}