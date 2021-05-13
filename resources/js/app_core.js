require('./bootstrap');
require('./app_ui');

import { trackGrid } from './components/trackGrid';
import { cursor } from './components/cursor';

import ui_recording from './ui/ui_recording';

import SoundController from './audio/soundcontroller';
import { audioCtx } from './audio/soundcontroller';

import recording from './components/recording';

export const play = document.querySelector('#play-button'),
    record = document.querySelector('#record-button'),
    stop = document.querySelector('#stop-button'),
    timeLayout = document.querySelector('#time-layout');
const addTrack = document.querySelector('#add-track'),
    removeTrack = document.querySelector('#remove-track');

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
soundcontroller.loadSound("storage/sound/z1.mp3");
soundcontroller.loadSound("storage/sound/zdgnjadgn.mp3")

//Se rellenan las pistas según hayan archivos (REVISAR EN EL FUTURO, eso no debe hacerse así)
///////ESTO ES IMPORTANTÍSIMO, PARA HACERLO BIEN HAY QUE HACER //
///////QUE CADA SONIDO SEA UN OBJETO Y PASARLO BIEN POR AQUI////
setTimeout(function () {
    var actTime = 0;//?????
    var track;
    var trackId;
    for (var i = 1; i < audioBufferArray.length; i++) {
        trackId = 'track-' + [i];
        track = document.getElementById(trackId)
        drawTrack(audioBufferArray[i], track, actTime);
    }
}, 500);
cursor.draw();
console.log(cursor.ctx);

/////////////////////////////////////
///////////recordSound//////////////
////////////////////////////////////

function startApp() {
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
            mediaRecorder.onstop = recordSound(chunks);

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

function recordSound(chunks) {

    const blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
    chunks = [];
    const audioURL = window.URL.createObjectURL(blob);
    drawTrackWhileRecording()
    var arrayBuffer;
    var aB;
    var trck;
    blob.arrayBuffer().then(arrayBuffer => {
        audioCtx.decodeAudioData(arrayBuffer, (audioBuffer) => {
            aB = audioBuffer;
            var tracks = document.getElementsByClassName('track');
            for (var i = 0; i < tracks.length; i++) {
                if (tracks[i].hasAttribute("data-selected")) {
                    trck = tracks[i].children[0]
                }
            }
            audioBufferArray.push(loaded);//esto se va claro, se une en los objetos
            // recording = new Recording(aB, etc)
            drawTrack(aB, trck, timeSpace.timeAtPause);//esto se va y se hace desde la ui a partir del objeto recording
            //timeSpace.timeAtPause = timeSpace.pxAtPause / 5;
        });
    })
}

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

/////////////
startApp();
////////////

window.onresize = function () {

}

window.onresize();
