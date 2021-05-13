require('./bootstrap');
require('./app_logic');
require('./components/timeLayout');

import { grid } from './components/generalgrid';
import Recording from './components/recording';
import { cursor } from './components/cursor';
import { ui_recording } from './ui/ui_recording';
import { audioCtx } from './audio/soundcontroller';
import SoundController from './audio/soundcontroller';
import { timeSpace } from './timeSpace';
import timeLayout from './components/timeLayout';

import { audioBuffers, audioBufferSources } from './audio/soundcontroller';

import { generateTrackNumbers, generateRecordingNumbers } from './utils';

export const play = document.querySelector('#play-button'),
    record = document.querySelector('#record-button'),
    stop = document.querySelector('#stop-button');

const addTrack = document.querySelector('#add-track'),
    removeTrack = document.querySelector('#remove-track');

export var soundStatuses = { isPlaying: false, hasStopped: true }


//default la 1a pista, botón stop apagado by default
jQuery(".track:first").attr("data-selected", '');
stop.disabled = true;

setInterval(function(){console.log(audioCtx.currentTime)}, 400)
///////////////////////////////////////

export var soundcontroller = new SoundController(audioCtx);
//buffer vacío para conextualizar la escala de tiempo
soundcontroller.loopGuide()
//dibuja cursor inicial
cursor.draw();

///////////////////////////////////

//cargo temas para desarrollo
//esto no será necesario, ya que se cargará cada una por separado
setTimeout(function () { soundcontroller.loadSound("storage/sound/1.mp3", 0) }, 0);
setTimeout(function () { soundcontroller.loadSound("storage/sound/2.mp3", 1) }, 400);


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
                cursor.play();
                startTime = timeSpace.timeAtPause
                ui_recording.drawTrackWhileRecording(timeSpace.timeAtPause);
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
                    timeSpace.timeAtPause = timeSpace.pxAtPause / 5;
                }
                else {
                    timeSpace.timeAtPause = timeSpace.pxAtPause / 5;
                    soundcontroller.stopSound(audioBufferSources);
                    play.disabled = false;
                    stop.disabled = true;
                    soundStatuses.hasStopped = true;
                    soundStatuses.isPlaying = false;
                }
            }
            stop.addEventListener('click', eStop);
            /*window.addEventListener('keyup', function(e){
                if (e.keyCode === 32) {
                    e.preventDefault();
                    eStop();
                }
            })*/

            mediaRecorder.onstop = function recordSound() {

                const blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
                chunks = [];
                const audioURL = window.URL.createObjectURL(blob);
                let aB;
                blob.arrayBuffer().then(arrayBuffer => {
                    audioCtx.decodeAudioData(arrayBuffer, (audioBuffer) => {
                        aB = audioBuffer;
                        /*var tracks = document.getElementsByClassName('track');
                        for (var i = 0; i < tracks.length; i++) {
                            if (tracks[i].hasAttribute("data-selected")) {
                                trck = tracks[i].children[0]
                            }
                        }*/

                        console.log(timeSpace.timeAtPause)

                        var track = document.querySelector('[data-selected] > canvas').id;
                        console.log(startTime)
                        grid.tracks[track].addRecord(startTime, 0, aB);
                    });
                })
            }//recordSound(chunks);

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
    soundcontroller.playSound(grid.tracks, timeSpace.timeAtPause)
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
/*
function recordSound(chunks) {

    const blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
    chunks = [];
    const audioURL = window.URL.createObjectURL(blob);
    let aB;
    blob.arrayBuffer().then(arrayBuffer => {
        audioCtx.decodeAudioData(arrayBuffer, (audioBuffer) => {
            aB = audioBuffer;
            /*var tracks = document.getElementsByClassName('track');
            for (var i = 0; i < tracks.length; i++) {
                if (tracks[i].hasAttribute("data-selected")) {
                    trck = tracks[i].children[0]
                }
            }
            console.log(aB)
            console.log(track)
            console.log(timeSpace.timeAtPause)

            var track = document.querySelector('[data-selected] > canvas').id;
            grid.tracks[track].addRecord(timeSpace.timeAtPause, 0, aB);
        });
    })
}*/


/////////////
startApp();
////////////

window.onresize = function () {

}

window.onresize();
