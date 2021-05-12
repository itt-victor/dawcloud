require('./bootstrap');
require('./app_ui');

import {tracks} from './components/tracks';
import {cursor} from './components/cursor';

import SoundController from './soundcontroller';


import { audioCtx } from './soundcontroller';
import Record from './record';
/*import { drawTrack } from './canvas';
import { startCursor } from './canvas';
import { moveCursor } from './canvas';
import { drawTrackWhileRecording } from './canvas';*/

import WaveSurfer from 'wavesurfer.js';

export const play = document.querySelector('#play-button'),
    record = document.querySelector('#record-button'),
    stop = document.querySelector('#stop-button'),
    timeLayout = document.querySelector('#time-layout');
const addTrack = document.querySelector('#add-track'),
    removeTrack = document.querySelector('#remove-track'),
    audioctxbutton = document.querySelector('#audioctx');

export var timeSpace = { pointedWidth: 610, newWidth: 610, pxAtPause: 0, timeAtPause: 0 };
var soundStatuses = { isPlaying: false, hasStopped: true }
var startRecordingOffset = 0;
var source = [];

//default la 1a pista, botón stop apagado by default
jQuery(".track:first").attr("data-selected", '');
stop.disabled = true;

///////////////////////////////////////
var soundcontroller = new SoundController(audioCtx);
//buffer vacío para conextualizar la escala de tiempo
var loopguide = soundcontroller.loopGuide()
//se carga array de audioBuffers
var audioBufferArray = soundcontroller.getAudioBufferArray();

///////////////////////////////////
//cargo temas para desarrollo
/*soundcontroller.loadSound("storage/sound/z1.mp3");
soundcontroller.loadSound("storage/sound/zdgnjadgn.mp3")*/

//Se rellenan las pistas según hayan archivos (REVISAR EN EL FUTURO, eso no debe hacerse así)
///////ESTO ES IMPORTANTÍSIMO, PARA HACERLO BIEN HAY QUE HACER //
///////QUE CADA SONIDO SEA UN OBJETO Y PASARLO BIEN POR AQUI////
/*setTimeout(function () {
    var actTime = 0;//?????
    var track;
    var trackId;
    for (var i = 1; i < audioBufferArray.length; i++) {
        trackId = 'track-' + [i];
        track = document.getElementById(trackId)
        drawTrack(audioBufferArray[i], track, actTime);
    }
}, 500);*/
cursor.draw();
console.log(cursor.ctx);

/////////////////////////////////////
///////////recordSound//////////////
////////////////////////////////////

function recordSound() {
    if (navigator.mediaDevices.getUserMedia) {
        const constraints = { audio: true };
        let chunks = [];

        let onSuccess = function (stream) {
            const mediaRecorder = new MediaRecorder(stream);

            record.onclick = function () {
                mediaRecorder.ondataavailable = event => chunks.push(event.data);
                mediaRecorder.start();
                startCursor();
                drawTrackWhileRecording(timeSpace.timeAtPause);
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
                    record.style.background = "";
                    record.style.color = "";
                    stop.disabled = true;
                    record.disabled = false;
                    play.disabled = false;
                    soundStatuses.hasStopped = true;
                    soundStatuses.isPlaying = false;
                }
                else {
                    timeSpace.timeAtPause = timeSpace.pxAtPause / 5;
                    for (var i = 0; i < audioBufferArray.length; i++) {
                        soundcontroller.stopSound(source[i]);
                    }
                    play.disabled = false;
                    stop.disabled = true;
                    soundStatuses.hasStopped = true;
                    soundStatuses.isPlaying = false;
                    source = [];
                }
            }
            stop.addEventListener('click', eStop);
            /*window.addEventListener('keyup', function(e){
                if (e.keyCode === 32) {
                    e.preventDefault();
                    eStop();
                }
            })*/

            ///////////////////THIS
            mediaRecorder.onstop = function () {
                const blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
                chunks = [];
                const audioURL = window.URL.createObjectURL(blob);
                drawTrackWhileRecording()
                var arrayBuffer;
                var loaded;
                var pist;
                blob.arrayBuffer().then(arrayBuffer => {
                    audioCtx.decodeAudioData(arrayBuffer, (audioBuffer) => {
                        loaded = audioBuffer
                        var tracks = document.getElementsByClassName('track');
                        for (var i = 0; i < tracks.length; i++) {
                            if (tracks[i].hasAttribute("data-selected")) {
                                pist = tracks[i].children[0]
                            }
                        }
                        audioBufferArray.push(loaded);
                        drawTrack(loaded, pist, timeSpace.timeAtPause/*audioCtx.currentTime*/);
                        //timeSpace.timeAtPause = timeSpace.pxAtPause / 5;
                    });
                })
                return arrayBuffer;
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
    startCursor();
    for (var i = 0; i < audioBufferArray.length; i++) {
        source.push(soundcontroller.playSound(audioBufferArray[i], 0, timeSpace.timeAtPause));
    }
    stop.disabled = false;
    play.disabled = true;
    soundStatuses.isPlaying = true;
    soundStatuses.hasStopped = false;
    source.onended = function () {
        play.disabled = false;
        stop.disabled = true;
        soundStatuses.isPlaying = false;
        soundStatuses.hasStopped = true;
        source = [];
    }
    return true;
}

play.addEventListener('click', ePlay);
window.addEventListener('keyup', function (e) {
    if (e.keyCode === 32) {
        e.preventDefault();
        ePlay();
    }
});

recordSound();

//Interacción con el layout de tiempo
timeLayout.addEventListener('click', function (event) {
    timeSpace.pointedWidth = event.clientX;
    timeSpace.pxAtPause = event.clientX - 610;
    timeSpace.timeAtPause = timeSpace.pxAtPause / 5;
    moveCursor(timeSpace.pointedWidth);
    if (soundStatuses.isPlaying == true && soundStatuses.hasStopped == false) {
        for (var i = 0; i < audioBufferArray.length; i++) {
            soundcontroller.stopSound(source[i]);
            console.log(source[i])
        }
        ePlay();
    }
});

window.onresize = function () {

}

window.onresize();
