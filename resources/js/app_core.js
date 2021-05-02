require('./bootstrap');

import Wad from 'web-audio-daw';
import WaveSurfer from 'wavesurfer.js';
import TimeLine from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min';





const play = document.querySelector('#play-button');
const record = document.querySelector('#record-button');
const stop = document.querySelector('#stop-button');
const soundClips = document.querySelector('.sound-clips');
const mainSection = document.querySelector('#buttonpad');
const audioCtx = new AudioContext();
let wavesurfer;
let waveforms = [];
let digit = 0;
let audioURLs = [];
let durations = [];


// disable stop button while not recording

stop.disabled = true;


//main block for doing the audio recording

if (navigator.mediaDevices.getUserMedia) {

  const constraints = { audio: true };
  let chunks = [];

  let onSuccess = function(stream) {
    const mediaRecorder = new MediaRecorder(stream);

    //visualize(stream);

    record.onclick = function() {
        mediaRecorder.start();
        console.log(mediaRecorder.state);
        record.style.background = "red";

        stop.disabled = false;
        record.disabled = true;
        play.disabled = true;

        var trackContainer = document.createElement('div')
        digit++
        trackContainer.setAttribute("id", digit)
        trackContainer.className = 'trackContainer'
        tracks.appendChild(trackContainer)

        var track = document.createElement('div')
        track.setAttribute("id", digit)
        track.className = 'track'
        trackContainer.appendChild(track)

        var timeline = document.createElement('div')
        timeline.setAttribute("id", digit)
        timeline.className = 'timeline'
        trackContainer.appendChild(timeline)

        wavesurfer = WaveSurfer.create({
            container: $(".track:last")[0],
            waveColor: 'green',
            progressColor: 'green',
            audioContext: audioCtx,
            drawingContextAttributes: {desynchronized: true},
            //fillParent: false,
            mediaControls: true,
            plugins: [
                TimeLine.create({
                    container: $(".timeline:last")[0]
                })
            ],
        });
        wavesurfer.empty()
    }

    stop.onclick = function() {
        if (mediaRecorder.state == 'recording'){
            mediaRecorder.stop();

            console.log(mediaRecorder.state);
            record.style.background = "";
            record.style.color = "";
            // mediaRecorder.requestData();

            stop.disabled = true;
            record.disabled = false;
            play.disabled = false;


        }
        else /*if(stop.disabled == true)*/ {
            for (var i in waveforms) {
                waveforms[i].stop();  //pause??
                stop.disabled = true;
                play.disabled = false;
            }
        }
    }

    mediaRecorder.onstop = function(e) {

        const blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
        chunks = [];
        const audioURL = window.URL.createObjectURL(blob);



        wavesurfer.on('ready', function () {
            play.onclick = function(){

                for (var i in waveforms){
                    waveforms[i].play();
                }
                stop.disabled = false;
                play.disabled = true;
            }
            /*stop.onclick = function () {
                for (var i in waveforms){
                    waveforms[i].pause();
                    stop.disabled = true;
                    play.disabled = false;
                }
            }*/

        });

        audioURLs.push(audioURL);

        wavesurfer.load(audioURL);


        waveforms.push(wavesurfer)
    }


    mediaRecorder.ondataavailable = function(e) {
      chunks.push(e.data);
    }
  }

  /*play.onclick = function(){
    for (var i in waveforms){
        waveforms[i].play();
    }
    stop.disabled = false;
    play.disabled = true;
}*/

/*stop.onclick = function () {
    for (var i in waveforms){
        waveforms[i].pause();
        stop.disabled = true;
        play.disabled = false;
    }
}*/

  let onError = function(err) {
    console.log('The following error occured: ' + err);
  }

  navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);

} else {
   alert('getUserMedia not supported on your browser!');
}


window.onresize = function() {
  //track.width = mainSection.offsetWidth;
}

window.onresize();

