require('./bootstrap');
require('./actions/actions');
require('./audio/bouncecontroller');
require('./components/metronome');
require('./components/timeLayout');
require('./project');
require('./actions/cutRecordings');

import { Grid } from './components/generalgrid';
import drawGrid from './ui/ui_grid';
import { mixer } from './components/mixer';
import drawLayout from './ui/ui_layout';
import { cursor } from './components/cursor';
import { gridSelector } from './components/gridselector';
import SoundController from './audio/soundcontroller';
import recordController from './audio/recordcontroller';

export const play = document.querySelector('#play-button'),
    record = document.querySelector('#record-button'),
    stop = document.querySelector('#stop-button'),
    cutButton = document.querySelector('#cut_function'),
    normalButton = document.querySelector('#normal_function'),
    is = { playing: false };

stop.disabled = true;
normalButton.style.background = 'red';
normalButton.disabled = true;


/////////////////////////////////////
/////////////dawCloud///////////////
////////////////////////////////////

//se inicia audio context
export const audioCtx = new window.AudioContext ||
    window.webkitAudioContext;

//llamo al controlador de sonido
export const soundcontroller = new SoundController(audioCtx);

//Se genera el objeto grid
export const grid = new Grid();

const appStart = () => {

    //Se carga el mixer
    mixer.exe();
    //Se dibuja el grid
    drawGrid();
    //dibuja cursor inicial
    cursor.draw();
    //dibuja layout
    drawLayout();
    //Se carga el selector de grid
    gridSelector.exe();
    //se carga el controlador de grabación
    recordController();

    //Eventos de reproducción
    play.addEventListener('click', ePlay);
    stop.addEventListener('click', eStop);
    document.addEventListener('keypress', e => {
        const inputs = document.querySelectorAll('input');
        if (e.key === ' ') {
            for (const input of inputs)
                if (e.target == input) return;
            e.preventDefault();
            is.playing ? eStop() : ePlay();
        }
    });
};

function ePlay() {
    cursor.play();
    soundcontroller.playSound();
    soundcontroller.metronome();
    stop.disabled = false;
    play.disabled = true;
    is.playing = true;
}


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
