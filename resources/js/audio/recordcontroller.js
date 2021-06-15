import { grid } from '../components/generalgrid';
import { ui_draw } from '../ui/ui_draw';
import { cursor } from '../components/cursor';
import { timeSpace } from '../timeSpace';
import { soundcontroller } from '../app_core';
import { soundStatuses } from '../app_core';
import { audioCtx } from '../app_core';
import { generateRecordingId } from '../utils';
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
                startTime = timeSpace.time();
                if (soundStatuses.hasStopped === true && soundStatuses.isPlaying === false) {
                    cursor.play();
                    soundcontroller.playSound();
                }
                ui_draw.drawTrackWhileRecording();
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
                    record.style.background = "";
                    record.style.color = "";
                    record.disabled = false;
                    cursor.stop();
                }
            }
            stop.addEventListener('click', rStop);

            mediaRecorder.onstop = function recordSound() {
                const blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
                chunks = [];
                blob.arrayBuffer().then(arrayBuffer => {
                    audioCtx.decodeAudioData(arrayBuffer, (audioBuffer) => {
                        let track = document.querySelector('[data-selected]').id.charAt(6);
                        grid.tracks[track].addRecord(generateRecordingId(), startTime, audioBuffer, 0, audioBuffer.duration);
                    });
                });
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
