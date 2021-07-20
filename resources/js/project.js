const toWav = require('audiobuffer-to-wav')

import { audioCtx, grid, loading, eStop } from './app_core';
import { timeSpace } from './timeSpace';
import drawLayout from './ui/ui_layout';
import drawGrid from './ui/ui_grid';
import { cursor } from './components/cursor';
import { numbers } from './utils';

class Project {

    constructor({ timeSpace, recordings, recordingId, trackNames, tracksGainValues,
        trackspanValues, tracksY, masterGainValue, masterY }) {
        this.timeSpace = timeSpace;
        this.recordings = recordings;
        this.recordingId = recordingId;
        this.trackNames = trackNames;
        this.tracksGainValues = tracksGainValues;
        this.trackspanValues = trackspanValues;
        this.tracksY = tracksY;
        this.masterGainValue = masterGainValue;
        this.masterY = masterY;
    }
}

const loadbtn = document.getElementById('load_project'),
    savebtn = document.getElementById('save_project'),
    saveAsBtn = document.getElementById('save_project_as'),
    bpmButton = document.getElementById('bpm_button'),
    metricButton = document.getElementById('metric_button'),
    Names = document.querySelectorAll('.select'),
    closeProjects = document.querySelector('#projects-close'),
    closeSave = document.querySelector('#save-close'),
    saveWindow = document.getElementById('save_dialogue'),
    loadWindow = document.getElementById('load_dialogue'),
    panButtons = document.getElementsByClassName('panner'),
    projects = document.getElementsByClassName('projects'),
    projectNameNode = document.getElementById('project_name'),
    projectTitle = document.getElementById('project-n'),
    token = { 'X-CSRF-TOKEN': document.head.querySelector('[name="csrf-token"]').content };

let project;
let projectName;

//STORE DATA IN SESSION
/* export const sessionProgress = () => {
    fetch('new-project', {
        method: 'POST',
        headers: {
            'X-CSRF-TOKEN': document.head.querySelector('[name="csrf-token"]').content
        },
    });
}; */

//STORE NEW AUDIO FILES
export const storeAudios = async () => {
    for (const recording of grid.recordings) {
        const blob = new window.Blob([new DataView(toWav(recording.audioBuffer))], { type: 'audio/wav' });
        const formData = new FormData();
        formData.append('audio-file', blob);
        formData.append('recording_id', recording.id);
        formData.append('filename', recording.filename);
        if (projectName) formData.append('project_name', projectName);
        await fetch('savesound', {
            method: 'POST',
            headers: token,
            body: formData
        }).then(response => response.text()).then(data => {
            if (!recording.filename) recording.filename = data;
        });
    }
};

//SAVE PROJECT
(() => {
    if (saveWindow && projectNameNode && savebtn) {
        projectNameNode.addEventListener('keypress', save);
        savebtn.addEventListener('click', (e) => {

            if (projectTitle.innerHTML != '') projectName = projectTitle.innerHTML;

            if (!projectName) {
                saveWindow.style.display = 'block';
                projectNameNode.focus();
            } else {
                document.querySelector('.dropdown-menu').classList.remove('show');
                save(e);
            }
        });

        async function save(e) {
            if (e.key === 'Enter' || e.type == 'click') {
                e.stopImmediatePropagation();
                e.preventDefault();

                if (!projectName) projectName = e.target.value;
                saveWindow.style.display = 'none';

                //Se envían los audios al servidor
                await storeAudios();

                const cache = {
                    trackNames: Array(grid.howMany),
                    tracksGainValues: [],
                    trackspanValues: [],
                    tracksY: [],
                    masterGainValue: grid.gainValue,
                    masterY: grid.faderY,
                    timeSpace,
                    recordings: grid.recordings,
                    recordingId: numbers.recordingId,

                    fill() {
                        for (const [i, track] of grid.tracks.entries()) {
                            this.trackNames[i] = track.name;
                            this.tracksGainValues.push(track.gainNode.gainValue);
                            this.tracksY.push(track.fader.Y);
                            this.trackspanValues.push(track.pannerNode.pannerValue);
                        }
                    }
                }
                cache.fill();

                //creo objeto proyecto
                if (project === undefined) project = new Project(cache);
                else Object.assign(project, cache);

                //Se envía el proyecto en JSON
                const projectForm = new FormData();
                projectForm.append('project-name', projectName);
                projectForm.append('project', JSON.stringify(project));
                fetch('saveproject', {
                    method: 'POST',
                    headers: token,
                    body: projectForm
                }).then(response => {
                    if (!response.ok) throw new Error('There has been an error!');
                    return console.log('Project saved successfully');
                }).catch(error => console.error(error));

                //Se imprime el proyecto en pantalla
                projectTitle.innerHTML = projectName;
            }
        };
    }
})();


//LOAD PROJECT
(() => {
    for (const projectBtn of projects) {
        projectBtn.addEventListener('dblclick', function ld(e) {
            e.stopPropagation;
            projectName = this.id;
            loadWindow.style.display = 'none';

            eStop();

            fetch(`loadproject/${projectName}`).then(response => {

                if (!response.ok) throw new Error('There has been an error!');

                console.log('Project loaded successfully');
                return response.json();

            }).then(response => {

                project = response;

                timeSpace.space = project.timeSpace.space;
                timeSpace.zoom = project.timeSpace.zoom;
                timeSpace.bpm = project.timeSpace.bpm;
                timeSpace.compas = project.timeSpace.compas;

                bpmButton.innerHTML = `${120 / timeSpace.bpm}  bpm`;
                metricButton.innerHTML = (timeSpace.compas == 2) ? '4/4' : '3/4';
                cursor.canvas.style.left = `${timeSpace.space}px`;
                numbers.recordingId = project.recordingId;

                drawLayout(); drawGrid(); loading();

                //se eliminan las pistas existentes si hubiesen
                grid.recordings.forEach((recording) => {
                    recording.canvasCtx.clearRect(0, 0, 4000, 70);
                    recording.deleteRecording();
                    delete recording.audioBuffer;
                });
                grid.recordings = [];

                //Se vacían los nombres de pista
                grid.tracks.forEach(track => {
                    delete track.name;
                });

                //Se imprime el proyecto en pantalla
                projectTitle.innerHTML = projectName;

                //Se cargan los audios
                for (const recording of project.recordings) {
                    fetch(`loadsound/${recording._filename}`)
                        .then(response => response.arrayBuffer())
                        .then(arrayBuffer => {
                            audioCtx.decodeAudioData(arrayBuffer, audioBuffer => {
                                const track = grid.tracks[recording.tracknumber];
                                const newrecording = track.addRecord(
                                    recording._id,
                                    recording.timeToStart,
                                    audioBuffer,
                                    recording.offset,
                                    recording.duration,
                                    false
                                );
                                newrecording.filename = recording._filename;
                            });
                        });
                }

                //Se cargan los nombres de pista
                for (const [i, track] of grid.tracks.entries()) {
                    track.name = project.trackNames[i];
                    if (track.name) Names[i].innerHTML = track.name;
                }
                //Se cargan los volúmenes de los faders
                for (const [i, track] of grid.tracks.entries()) {
                    let fader = track.fader;
                    track.gainNode.gainValue = project.tracksGainValues[i];
                    fader.Y = project.tracksY[i];
                    fader.querySelector('a').style.top = `${project.tracksY[i]}px`;
                    track.gainNode.gain.setValueAtTime(track.gainNode.gainValue, audioCtx.currentTime);
                }
                //Se carga el panorama
                for (const [i, track] of grid.tracks.entries()) {
                    track.pannerNode.pannerValue = project.trackspanValues[i];
                    panButtons[i].innerHTML = track.pannerNode.pannerValue;
                    let trackPanValue = track.pannerNode.pannerValue, ctxValue;
                    trackPanValue.toString().startsWith('L')
                        && (ctxValue = - + trackPanValue.slice(1) / 100);
                    trackPanValue == 0 || trackPanValue.toString() == 'C'
                        && (ctxValue = 0);
                    trackPanValue.toString().startsWith('R')
                        && (ctxValue = trackPanValue.slice(1) / 100);

                    track.pannerNode.pan.setValueAtTime(ctxValue, audioCtx.currentTime);
                }
                //Se carga el volumen master
                grid.gainValue = project.masterGainValue;
                grid.gainNode.gain.setValueAtTime(grid.gainValue, audioCtx.currentTime);
                grid.faderY = project.masterY;
                document.querySelector('#master_fader > a').style.top = `${grid.faderY}px`;

            }).catch(error => console.error(error));
        });
    }
})();

//DELETE PROJECT
(() => {
    for (let project of projects) {

        const dltConfirmation = document.getElementsByClassName('delete_confirmation')[0],
            delete_cancel = document.getElementById('delete_cancel'),
            delete_confirm = document.getElementById('delete_confirm');

        project.childNodes[1].addEventListener('click', function dlt(e) {
            const projectName = this.parentNode.id;
            dltConfirmation.classList.toggle('visible');
            delete_cancel.addEventListener('click', () => dltConfirmation.classList.remove('visible'));
            delete_confirm.addEventListener('click', () => {
                const form = new FormData();
                form.append('project', projectName);
                fetch('delete', {
                    method: 'POST',
                    headers: token,
                    body: form,
                }).then(response => {
                    if (!response.ok) throw new Error('There has been an error!');
                    console.log('Project deleted successfully');
                    dltConfirmation.classList.remove('visible');
                    document.getElementById(projectName).remove();
                }).catch(error => console.error(error));
            });
        });
    }
})();

if (loadbtn) {
    loadbtn.addEventListener('click', () => loadWindow.style.display = 'block');
    closeProjects.addEventListener('click', () => loadWindow.style.display = 'none');
}

if (saveAsBtn) {
    saveAsBtn.addEventListener('click', () => {
        saveWindow.style.display = 'block';
        projectNameNode.focus();
    });
    closeSave.addEventListener('click', () => saveWindow.style.display = 'none');
}
