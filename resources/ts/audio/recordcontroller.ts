import { ui_draw } from '../ui/ui_draw';
import { cursor } from '../components/cursor';
import { timeSpace } from '../timeSpace';
import { soundcontroller, audioCtx, grid, play, record, stop, is } from '../app_core';
import { generateRecordingId } from '../utils';

export default function recordController() {
    if (navigator.mediaDevices.getUserMedia) {
        const constraints = { audio: true };
        let chunks: any[] = [], startTime: number;

        let onSuccess = (stream: any) => {
            const mediaRecorder = new MediaRecorder(stream);

            record.onclick = () => {
                mediaRecorder.ondataavailable = (event: { data: any; }) => chunks.push(event.data);
                mediaRecorder.start();
                startTime = timeSpace.time();
                if (!is.playing) {
                    cursor.play();
                    soundcontroller.playSound();
                    is.playing = true;
                }
                ui_draw.drawTrackWhileRecording();  ///ESTO
                console.log(mediaRecorder.state);
                record.style.background = 'red';
                stop.disabled = false;
                record.disabled = true;
                play.disabled = true;
            }

            const rStop = () => {
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
            document.addEventListener('keypress', e => {
                const project_name = document.querySelector('#project-n');
                if (e.key === ' ') {
                    if (e.target == project_name) return;
                    rStop();
                }
            });

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
                chunks = [];
                blob.arrayBuffer().then(arrayBuffer =>
                    audioCtx.decodeAudioData(arrayBuffer, audioBuffer => {
                        const track = parseInt((document.querySelector('[data-selected]') as HTMLElement).id.charAt(6));
                        const latency = 0.150; //LATENCIA, HAY QUE MIRAR ESTO BIEN
                        grid.tracks[track].addRecord(generateRecordingId(), startTime - latency,
                            audioBuffer, 0, audioBuffer.duration, false);
                    })
                );
            }
        }
        let onError = (err: string) => {
            console.log('The following error occured: ' + err);
        }
        navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
    } else {
        alert('getUserMedia not supported on your browser!');
    }
}
