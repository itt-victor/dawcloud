require('./bootstrap');
require('./app_logic');
require('./components/timeLayout');
require('./ui/ui_dragRecordings');
require('./ui/ui_layout');

import { grid } from './components/generalgrid';
import drawLayout from './ui/ui_layout'
import { cursor } from './components/cursor';
import { ui_draw } from './ui/ui_draw';
import SoundController from './audio/soundcontroller';
import { timeSpace } from './timeSpace';
import { audioBufferSources } from './audio/soundcontroller';
import { dragRecording } from './ui/ui_dragRecordings';

export const play = document.querySelector('#play-button'),
    record = document.querySelector('#record-button'),
    stop = document.querySelector('#stop-button');
export var soundStatuses = { isPlaying: false, hasStopped: true };

const addTrack = document.querySelector('#add-track'),
    removeTrack = document.querySelector('#remove-track');


stop.disabled = true;

//se inicia audio context
export const audioCtx = new (window.AudioContext ||
    window.webkitAudioContext);

///////////////////////////////////////

//llamo al controlador de sonido
export var soundcontroller = new SoundController(audioCtx);

//prepara el grid
grid.prepareCanvas();
grid.addTracks(grid.howMany);
//dibuja cursor inicial
cursor.draw();
//dibuja layout
drawLayout();

///////////////////////////////////



//cargo temas para desarrollo
setTimeout(function () { soundcontroller.loadSound("storage/sound/1.mp3", 0, 0) }, 0);
setTimeout(function () { soundcontroller.loadSound("storage/sound/2.mp3", 1, 20) }, 400);
//setTimeout(function () { soundcontroller.loadSound("storage/sound/3.mp3", 2) }, 800);

/////////////////////////////////////
///////////recordSound//////////////
////////////////////////////////////

function startApp() {
    if (navigator.mediaDevices.getUserMedia) {
        const constraints = { audio: true };
        let chunks = [];
        let startTime;

        let onSuccess = function (stream) {
            const mediaRecorder = new MediaRecorder(stream);

            record.onclick = function () {
                mediaRecorder.ondataavailable = event => chunks.push(event.data);
                mediaRecorder.start();
                if (soundStatuses.hasStopped === true && soundStatuses.isPlaying === false) {
                    cursor.play();
                    soundcontroller.playSound();
                    startTime = timeSpace.pxIncrement * timeSpace.zoom;
                } else {
                    startTime = timeSpace.pxIncrement * timeSpace.zoom;
                }
                ui_draw.drawTrackWhileRecording(startTime);
                console.log(mediaRecorder.state);
                record.style.background = "red";
                stop.disabled = false;
                record.disabled = true;
                play.disabled = true;
            }

            function eStop() {
                if (mediaRecorder.state == 'recording') {
                    mediaRecorder.stop();
                    console.log(mediaRecorder.state);
                    soundcontroller.stopSound(audioBufferSources);
                    timeSpace.timeAtPause = timeSpace.pxIncrement * timeSpace.zoom; //es necesario aquí?
                    record.style.background = "";
                    record.style.color = "";
                    stop.disabled = true;
                    record.disabled = false;
                    play.disabled = false;
                    soundStatuses.hasStopped = true;
                    soundStatuses.isPlaying = false;
                }
                else {
                    soundcontroller.stopSound(audioBufferSources);
                    play.disabled = false;
                    stop.disabled = true;
                    soundStatuses.hasStopped = true;
                    soundStatuses.isPlaying = false;
                }
            }
            stop.addEventListener('click', eStop);
            window.addEventListener('keyup', function (e) {
                if (e.keyCode === 32) {
                    e.preventDefault();
                    eStop();
                }
            });

            mediaRecorder.onstop = function recordSound() {
                const blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
                chunks = [];
                const audioURL = window.URL.createObjectURL(blob);
                let aB;
                blob.arrayBuffer().then(arrayBuffer => {
                    audioCtx.decodeAudioData(arrayBuffer, (audioBuffer) => {
                        aB = audioBuffer;
                        var track = document.querySelector('[data-selected]').id;
                        grid.tracks[track].addRecord(startTime, aB);
                        dragRecording();
                    });
                })
            }
        }
        let onError = function (err) {
            console.log('The following error occured: ' + err);
        }
        navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
    } else {
        alert('getUserMedia not supported on your browser!');
    }
}

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
window.addEventListener('keyup', function (e) {
    if (e.keyCode === 32) {
        e.preventDefault();
        ePlay();
    }
});


/////////////
startApp();
////////////


window.onresize = function () {
}

window.onresize();

