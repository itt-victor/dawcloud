import { grid } from '../components/generalgrid';
import { ui_draw } from '../ui/ui_draw';
import { cursor } from '../components/cursor';
import { timeSpace } from '../timeSpace';
import { audioBufferSources } from './soundcontroller';
import { dragRecording } from '../ui/ui_dragRecordings';
import { removeRecording } from '../app_logic';
import { soundcontroller } from '../app_core';
import { soundStatuses } from '../app_core';
import { audioCtx } from '../app_core';

import { play, record, stop } from '../app_core';

export default function recordController() {
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

            function rStop() {
                if (mediaRecorder.state == 'recording') {
                    mediaRecorder.stop();
                    console.log(mediaRecorder.state);
                    timeSpace.timeAtPause = timeSpace.pxIncrement * timeSpace.zoom; //es necesario aquí?
                    record.style.background = "";
                    record.style.color = "";
                    record.disabled = false;
                }
            }
            stop.addEventListener('click', rStop);
            window.addEventListener('keyup', function (e) {
                if (e.keyCode === 32) {
                    e.preventDefault();
                    rStop();
                }
            });

            mediaRecorder.onstop = function recordSound() {
                const blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
                chunks = [];
                blob.arrayBuffer().then(arrayBuffer => {
                    audioCtx.decodeAudioData(arrayBuffer, (audioBuffer) => {
                        var track = document.querySelector('[data-selected]').id;
                        grid.tracks[track].addRecord(startTime, audioBuffer);
                        setTimeout(dragRecording, 20);
                        setTimeout(removeRecording, 20);
                        //modify
                        //cut
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
