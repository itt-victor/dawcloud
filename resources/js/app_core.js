require('./bootstrap');
require('./app_logic');
require('./audio/recordcontroller');
require('./components/timeLayout');
require('./ui/ui_layout');
require('./loadproject');
require('./components/mixer');

import { grid } from './components/generalgrid';
import drawLayout from './ui/ui_layout';
import { cursor } from './components/cursor';
import SoundController from './audio/soundcontroller';
import recordcontroller from './audio/recordcontroller';

export const play = document.querySelector('#play-button'),
    record = document.querySelector('#record-button'),
    stop = document.querySelector('#stop-button');
export var soundStatuses = { isPlaying: false, hasStopped: true };

stop.disabled = true;




    /////////////////////////////////////
    /////////////dawCloud///////////////
    ////////////////////////////////////

//se inicia audio context
export const audioCtx = new (window.AudioContext ||
    window.webkitAudioContext);


//llamo al controlador de sonido
export var soundcontroller = new SoundController(audioCtx);

//Animación de tiempo de carga
export function loading() {
    let text = document.querySelector('.a_title');
    let ventana = document.querySelector('.loading');
    let signup = document.querySelector('#signup_now');
    text.style.color = 'white';
    document.body.style.background = 'black';
    ventana.style.display = 'block';
    ventana.style.visibility = 'visible';
    if (signup) { signup.style.color = 'white'; }
    setTimeout(function () {
        if (signup) { signup.style.color = 'black'; }
        ventana.style.display = 'none';
        ventana.style.visibility = 'hidden';
        document.body.style.background = '#b9edf1';
        text.style.color = 'black';
        document.body.style.transition = 'background 0.7s'
        if (signup) { signup.style.transition = 'color 0.7s'; }
        ventana.style.transition = 'display 0.7s, visibility 0.7s'
        text.style.transition = 'color 0.7s'
    }, 3500);
}

loading();

function appStart() {

    //prepara el grid
    grid.prepareGrid();
    grid.addTracks(grid.howMany);
    //dibuja cursor inicial
    cursor.draw();
    //dibuja layout
    drawLayout();

    play.addEventListener('click', ePlay);
    stop.addEventListener('click', eStop);

    //teclas play stop
    /*window.addEventListener('keyup', function (e) {
        if (soundStatuses.hasStopped === true &&
            soundStatuses.isPlaying === false) {
            if (e.keyCode === 32) {
                //e.preventDefault();
                ePlay();
            }
        } else {
            if (e.keyCode === 32) {
                e.preventDefault();
                eStop();
            }
        }
    });*/

    /////////////
    recordcontroller();
    ////////////

    window.onresize = function () {
    }
    window.onresize();
}

//reproducir
function ePlay() {
    cursor.play();
    soundcontroller.playSound();
    stop.disabled = false;
    play.disabled = true;
    soundStatuses.isPlaying = true;
    soundStatuses.hasStopped = false;
    return true;
}

//stop
export function eStop() {
    cursor.stop();
    soundcontroller.stopSound();
    play.disabled = false;
    stop.disabled = true;
    soundStatuses.hasStopped = true;
    soundStatuses.isPlaying = false;
}


///////////
appStart();
///////////
