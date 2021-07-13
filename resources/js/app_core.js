require('./bootstrap');
require('./actions/actions');
require('./audio/bouncecontroller');
require('./components/metronome');
require('./components/timeLayout');
require('./project');
require('./components/mixer');
require('./actions/cutRecordings');
require('./components/gridselector');

import { grid } from './components/generalgrid';
import drawGrid from './ui/ui_grid';
import drawLayout from './ui/ui_layout';
import { cursor } from './components/cursor';
import SoundController from './audio/soundcontroller';
import recordcontroller from './audio/recordcontroller';
import { sessionProgress } from './project';

export const play = document.querySelector('#play-button'),
    record = document.querySelector('#record-button'),
    stop = document.querySelector('#stop-button'),
    cutButton = document.querySelector('#cut_function'),
    normalButton = document.querySelector('#normal_function'),
    is = { playing: false };

stop.disabled = true;
normalButton.style.background = "red";
normalButton.disabled = true;


/////////////////////////////////////
/////////////dawCloud///////////////
////////////////////////////////////

//se inicia audio context
export const audioCtx = new (window.AudioContext ||
    window.webkitAudioContext)();


//llamo al controlador de sonido
export const soundcontroller = new SoundController(audioCtx);

//Animación de tiempo de carga
export const loading = () => {
    const text = document.querySelector('.a_title');
    const ventana = document.querySelector('.loading');
    const signup = document.querySelector('#signup_now');
    text.style.color = 'white';
    document.body.style.background = 'black';
    ventana.classList.toggle('visible');
    if (signup) signup.style.color = 'white';
    setTimeout(function () {
        if (signup) signup.style.color = 'black';
        ventana.classList.toggle('visible');
        document.body.style.background = '#b9edf1';
        text.style.color = 'black';
        document.body.style.transition = 'background 0.7s'
        if (signup) signup.style.transition = 'color 0.7s';
        ventana.style.transition = 'display 0.7s, visibility 0.7s'
        text.style.transition = 'color 0.7s'
    }, 3500);
};

const appStart = () => {

    //prepara el grid
    grid.prepareGrid();
    grid.addTracks();
    setTimeout(drawGrid, 0);
    //dibuja cursor inicial
    cursor.draw();
    //dibuja layout
    drawLayout();
    //Eventos de reproducción
    play.addEventListener('click', ePlay);
    stop.addEventListener('click', eStop);
    document.addEventListener('keypress', function (e) {
        const inputs = document.querySelectorAll('input');
        if (e.key === ' ') {
            for (const input of inputs)
                if (e.target == input) return;
            e.preventDefault();
            is.playing ? eStop() : ePlay();
        }
    });

    /////////////
    recordcontroller();
    ////////////

    //Guarda en sesión el progreso cada 10 minutos
    setInterval(sessionProgress, 600000);

};

//reproducir
function ePlay() {
    cursor.play();
    soundcontroller.playSound();
    soundcontroller.metronome();
    stop.disabled = false;
    play.disabled = true;
    is.playing = true;
}

//stop
export function eStop() {
    cursor.stop();
    soundcontroller.stopSound();
    play.disabled = false;
    stop.disabled = true;
    is.playing = false;
}


///////////
appStart();
///////////
