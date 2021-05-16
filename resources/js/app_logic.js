import { soundcontroller } from './app_core';
import { grid } from './components/generalgrid';
import { timeSpace } from './timeSpace';
import { ui_draw } from './ui/ui_draw';
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

//Cambiar nombre de pista
function changeTrackName() {
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
changeTrackName();

//Cargar una canción --- desde el pc del usuario o desde una base remote????
function loadSong() {
    let button = document.getElementById('load_sound');
    button.addEventListener('click', function () {
        let trcknr = document.querySelector('[data-selected] > canvas').id;
        let url;
        soundcontroller.loadSound(url, trcknr, 0);
    })
}

function zoom() {
    let zoomIn = document.getElementById("zoomin");
    let zoomOut = document.getElementById("zoomout");
    zoomIn.addEventListener('click', function () {
        timeSpace.zoom -= 0.05; //hay que hacer una funci´pon para que el número se mueva porcentualmente
        for (var i = 0; i < grid.recordings.length; i++) {
            ui_draw.drawRecording(grid.recordings[i]);
        }
        if (soundStatuses.isPlaying === true) {
            clearInterval(interval);
            cursor.play();
        }
    });
    zoomOut.addEventListener('click', function () {
        timeSpace.zoom += 0.05;
        for (var i = 0; i < grid.recordings.length; i++) {
            ui_draw.drawRecording(grid.recordings[i]);
        }
        if (soundStatuses.isPlaying === true) {
            clearInterval(interval);
            cursor.play();
        }
    })
}
zoom();


function mute() {
    let button = document.getElementsByClassName('track_mute');
    for (let a = 0; a < button.length; a++) {
        button[a].addEventListener('click', function () {
            this.classList.toggle('track_mute_on');
            //pon aqui funcion de mutear, ponla en sound controller
        });
    }
}
mute();

function solo() {
    let button = document.getElementsByClassName('track_solo');
    for (let a = 0; a < button.length; a++) {
        button[a].addEventListener('click', function () {
            this.classList.toggle('track_solo_on');
        });
    }
}
solo();
