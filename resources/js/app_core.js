require('./bootstrap');
require('./app_logic');
require('./audio/recordcontroller');
require('./components/timeLayout');
require('./ui/ui_dragRecordings');
require('./ui/ui_layout');
require('./loadproject');
require('./components/mixer');

import { Grid } from './components/generalgrid';
import { grid } from './components/generalgrid';
import drawLayout from './ui/ui_layout'
import { cursor } from './components/cursor';
import SoundController from './audio/soundcontroller';
import recordcontroller from './audio/recordcontroller';

export const play = document.querySelector('#play-button'),
    record = document.querySelector('#record-button'),
    stop = document.querySelector('#stop-button');
export var soundStatuses = { isPlaying: false, hasStopped: true };

stop.disabled = true;

//se inicia audio context
export const audioCtx = new (window.AudioContext ||
    window.webkitAudioContext);

///////////////////////////////////////

//llamo al controlador de sonido
export var soundcontroller = new SoundController(audioCtx);


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

function tomaYaStart() {
    //prepara el grid
    grid.prepareGrid();
    grid.addTracks(grid.howMany);
    //dibuja cursor inicial
    cursor.draw();
    //dibuja layout
    drawLayout();

    ///////////////////////////////////



    //cargo temas para desarrollo
    //setTimeout(function () { soundcontroller.loadSound("storage/sound/1.mp3", 0, 0) }, 0);
    //setTimeout(function () { soundcontroller.loadSound("storage/sound/2.mp3", 1, 20) }, 400);
    //setTimeout(function () { soundcontroller.loadSound("storage/sound/zz.wav", 4, 0) }, 800);

    /////////////////////////////////////
    ///////////recordSound//////////////
    ////////////////////////////////////

    function ePlay() {
        cursor.play();
        soundcontroller.playSound();
        stop.disabled = false;
        play.disabled = true;
        soundStatuses.isPlaying = true;
        soundStatuses.hasStopped = false;
        return true;
    }

    play.addEventListener('click', ePlay);

    //teclas play stop
    window.addEventListener('keyup', function (e) {
        if (soundStatuses.hasStopped === true &&
            soundStatuses.isPlaying === false) {
            if (e.keyCode === 32) {
                //e.preventDefault();
                ePlay();
            }

        }
        else {
            if (e.keyCode === 32) {
                e.preventDefault();
                eStop();
            }
        }
    });

    function eStop() {
        soundcontroller.stopSound();
        play.disabled = false;
        stop.disabled = true;
        soundStatuses.hasStopped = true;
        soundStatuses.isPlaying = false;
    }
    stop.addEventListener('click', eStop);



    /////////////
    recordcontroller();
    ////////////


    window.onresize = function () {
    }

    window.onresize();

}



tomaYaStart()
