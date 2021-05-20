import { soundcontroller } from './app_core';
import { grid } from './components/generalgrid';
import { timeSpace } from './timeSpace';
import { ui_draw } from './ui/ui_draw';
import drawLayout from './ui/ui_layout';
import { interval } from './components/cursor';
import { cursor } from './components/cursor';
import { soundStatuses } from './app_core';


//Seleccionar pista
function selectTrack() {
    var tracks = document.getElementsByClassName("track");
    var trackNames = document.getElementsByClassName("track_name");
    var index;
    for (var i = 0; i < tracks.length; i++) {
        tracks[i].addEventListener('mousedown', function (e) {
            for (var i = 0; i < tracks.length; i++) {
                tracks[i].removeAttribute('data-selected');
            }
            this.setAttribute('data-selected', '');
        })
        trackNames[i].addEventListener('click', function (e) {
            index = this.id.substr(11, 1);
            for (var i = 0; i < tracks.length; i++) {
                tracks[i].removeAttribute('data-selected');
            }
            tracks[index].setAttribute('data-selected', '');
        })
    }
}
selectTrack();


//Cambiar nombre de pista  - NO ME CONVENCE NO ES NECESARIO
/*function changeTrackName() {
    var tracksNames = document.getElementsByClassName('select');
    var prr = document.getElementsByClassName('input');
    for (var i = 0; i < prr.length; i++) {
        prr[i].style.display = 'none';
        prr[i].style.visibility = 'hidden';
    }
    for (var i = 0; i < tracksNames.length; i++) {
        tracksNames[i].addEventListener('dblclick', function dbl(e) {
            var box = this.nextSibling.nextSibling;
            var text = this;
            console.log(box, text);
            text.style.display = 'none';
            text.style.visibility = 'hidden';
            box.style.display = 'block';
            box.style.visibility = 'visible';
            window.addEventListener('click', function (a) {
                if (a.target.contains(e.target)) {
                    box.style.display = 'none';
                    box.style.visibility = 'hidden';
                    text.style.display = 'block';
                    text.style.visibility = 'visible';
                }
            });
            box.addEventListener('keyup', function (e) {
                if (e.keyCode === 13) {
                    e.preventDefault();
                    text.innerHTML = box.value;
                    box.style.display = 'none';
                    box.style.visibility = 'hidden';
                    text.style.display = 'block';
                    text.style.visibility = 'visible';
                }
            });
        });
    }
}
changeTrackName();*/

//Cargar una canción --- desde el pc del usuario o desde una base remote????
function loadSong() {
    let button = document.getElementById('load_sound');
    button.addEventListener('click', function () {
        let trcknr = document.querySelector('[data-selected] > canvas').id;
        let url;
        soundcontroller.loadSound(url, trcknr, 0);
    })
}

//zoom!!!
function zoom() {
    let zoomIn = document.getElementById("zoomin");
    let zoomOut = document.getElementById("zoomout");

    function zIn() {
        timeSpace.zoom /= 1.3

        for (var i = 0; i < grid.recordings.length; i++) {
            ui_draw.drawRecording(grid.recordings[i]);
        }
        drawLayout();
        if (soundStatuses.isPlaying === true) {
            cursor.play();
        }
    }
    function zOut() {
        timeSpace.zoom *= 1.3;
        for (var i = 0; i < grid.recordings.length; i++) {
            ui_draw.drawRecording(grid.recordings[i]);
        }
        drawLayout();
        if (soundStatuses.isPlaying === true) {
            /*soundcontroller.stopSound();
            soundcontroller.playSound();*/
            cursor.stop();
            cursor.play();
        }
    }
    zoomIn.addEventListener('click', zIn);
    zoomOut.addEventListener('click', zOut);

    window.addEventListener('keyup', function (e) {
        if (e.keyCode === 72) {
            zIn();
        }
    });
    window.addEventListener('keyup', function (r) {
        if (r.keyCode === 71) {
            zOut();
        }
    });
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

//cambia el compás, ya se añadiran
function metric() {
    let metricButton = document.getElementById('metric_button');
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
    let button = document.getElementsByClassName('track_mute');
    for (let a = 0; a < button.length; a++) {
        button[a].addEventListener('click', function () {
            this.classList.toggle('track_mute_on');
            if (this.parent.muteButton.toggle === false) {
                soundcontroller.mute(this.parent.gainNode);
                this.parent.muteButton.toggle = true;
            } else {
                soundcontroller.solo(this.parent.gainNode);
                this.parent.muteButton.toggle = false;
            }
        });
    }
}
mute();

//solea la pista                    MIRATE ESTO
function solo() {
    let button = document.getElementsByClassName('track_solo');
    for (let a = 0; a < button.length; a++) {
        button[a].addEventListener('click', function () {
            this.classList.toggle('track_solo_on');
            if (this.parent.soloButton.toggle === false) {
                for (let b = 0; b < button.length; b++) {
                    soundcontroller.mute(button[b].parent.gainNode);
                }
                soundcontroller.solo(this.parent.gainNode);
            } else {
                for (let b = 0; b < button.length; b++) {
                    soundcontroller.solo(button[b].parent.gainNode);
                }
                //soundcontroller.solo(this.parent.gainNode);
            }

            /*    if (this.parent.soloButton.toggle === false) {
                    soundcontroller.solo(this.parent.gainNode);
                    this.parent.soloButton.toggle = true;
                } else {
                    soundcontroller.solo(this.parent.gainNode);
                    this.parent.soloButton.toggle = false;
                }*/
        });
    }
}
solo();

//elimina la grabación
function removeRecording() {
    let recording;
    for (var i = 0; i < grid.recordings.length; i++) {
        grid.recordings[i].canvas.addEventListener('mouseup', function arrr(e) {
            recording = this.parent;
            for (var i = 0; i < grid.recordings.length; i++) {
                ui_draw.drawRecording(grid.recordings[i]);
            }
            ui_draw.clickAtRecording(recording);
            window.addEventListener('keyup', function (a) {
                if (a.keyCode === 46) {
                    a.preventDefault();
                    if (!soundStatuses.hasStopped) { soundcontroller.stopSingleSound(recording); }
                    if (recording != undefined) { recording.deleteRecording(); }
                    e.target.removeEventListener('click', arrr)
                }
            })
        });
    }
}
setTimeout(removeRecording, 3000);
