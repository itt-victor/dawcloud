import { soundcontroller } from './app_core';

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
    for (var i = 0; i < prr.length; i++){
        prr[i].style.display = 'none';
        prr[i].style.visibility = 'hidden';
    }
    for (var i = 0; i < tracksNames.length; i++) {
        tracksNames[i].addEventListener('dblclick', function dbl(e) {
            var box = this.nextSibling.nextSibling;
            var text = this;
            console.log(box,text );
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
    button.addEventListener('click', function(){
        let trcknr = document.querySelector('[data-selected] > canvas').id;
        let url;
        soundcontroller.loadSound(url, trcknr, 0);
    })
}
