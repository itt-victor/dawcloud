var toWav = require('audiobuffer-to-wav')

import { audioCtx } from './app_core';
import { timeSpace } from './timeSpace';
import { grid } from './components/generalgrid';
import drawLayout from './ui/ui_layout';
import { cursor } from './components/cursor';
import { numbers } from './utils';
import { loading } from './app_core';
import { eStop } from './app_core';

class Project {
    constructor(timeSpace, recordings, audioBuffers, tracksGainValues, trackspanValues, tracksY) {
        this.timeSpace = timeSpace;
        this.recordings = recordings;
        this.audioBuffers = audioBuffers;
        this.audioReferences = [];  //almacenas los nombres de los wav para recuperarlos
        this.tracksGainValues = tracksGainValues;
        this.trackspanValues = trackspanValues;
        this.tracksY = tracksY;
    }
}

const loadbtn = document.getElementById('load_project');
const savebtn = document.getElementById('save_project');
const bpmButton = document.getElementById('bpm_button');
const closeProjects = document.querySelector('#projects-close');
const closeSave = document.querySelector('#save-close');
const saveWindow = document.getElementById('save_dialogue');
const loadWindow = document.getElementById('load_dialogue');
const panButtons = document.getElementsByClassName('panner');

var project;
var projectName;

function saveProject() {
    if (saveWindow) {
        saveWindow.children[1].addEventListener('keyup', function (e) {

            if (e.keyCode === 13) {
                e.preventDefault();
                projectName = saveWindow.children[1].value;
                saveWindow.style.display = 'none';
                saveWindow.style.visibility = 'hidden';

                var audioBuffers = [];
                var tracksGainValues = [];
                var trackspanValues = [];
                var tracksY = [];
                if (!project === undefined) {
                    audioBuffers = project.audioBuffers;
                    tracksGainValues = project.tracksGainValues;
                    trackspanValues = project.trackspanValues;
                    tracksY = project.tracksY;
                    numbers.recordingId = project.audioReferences.length;

                    //Se guardan los valores de gain de cada pista
                    for (let i = 0; i < grid.tracks.length; i++) {
                        if (tracksGainValues[i] != grid.tracks[i].gainNode.gainValue) {
                            tracksGainValues[i] = grid.tracks[i].gainNode.gainValue;
                        }
                        if (tracksY[i] != grid.tracks[i].fader.Y) {
                            tracksY[i] = grid.tracks[i].fader.Y;
                        }
                        if (trackspanValues[i] != grid.tracks[i].pannerNode.pannerValue) {
                            trackspanValues[i] = grid.tracks[i].pannerNode.pannerValue;
                        }
                    }
                } else {
                    for (let i = 0; i < grid.tracks.length; i++) {
                        tracksGainValues.push(grid.tracks[i].gainNode.gainValue);
                        tracksY.push(grid.tracks[i].fader.Y);
                        trackspanValues.push(grid.tracks[i].pannerNode.pannerValue);
                    }
                }

                //creo objeto proyecto
                if (project === undefined) {
                    project = new Project(timeSpace, grid.recordings, audioBuffers, tracksGainValues, trackspanValues, tracksY);
                }
                else {
                    project.timeSpace = timeSpace;
                    project.recordings = grid.recordings;
                    project.tracksGainValues = tracksGainValues;
                    project.trackspanValues = trackspanValues;
                    project.tracksY = tracksY;
                    project.audioReferences = [];
                }

                //Se convierten los audioBuffers en wav, se convierten a su vez en blob, y se genera una URL del mismo
                for (let i = 0; i < grid.recordings.length; i++) {
                    var blob = new window.Blob([new DataView(toWav(grid.recordings[i].audioBuffer))], {
                        type: 'audio/wav'
                    });

                    var formdata = new FormData();
                    formdata.append('audio-blob', blob);
                    formdata.append('recording-id', grid.recordings[i].id);
                    formdata.append('project-name', projectName);

                    $.ajax({
                        headers: {
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                        },
                        type: 'POST',
                        url: 'savesound',
                        data: formdata,
                        processData: false,
                        contentType: false,
                        success: function (data) {
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                        }
                    });
                    if (project.audioReferences[i] === undefined) {
                        project.audioReferences.push(projectName + '_' + grid.recordings[i].id);
                    }
                }
                numbers.recordingId = project.audioReferences.length;

                var projectForm = new FormData();
                projectForm.append('project-name', projectName);
                projectForm.append('project', JSON.stringify(project));
                $.ajax({
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    },
                    type: 'POST',
                    url: 'saveproject',
                    data: projectForm,
                    processData: false,
                    contentType: false,
                    success: function (data) {
                        console.log('Project saved successfully');
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                    }
                });
            }
        });
    }
}


function loadProject() {

    const projects = document.getElementsByClassName('projects');

    for (let h = 0; h < projects.length; h++) {
        projects[h].addEventListener('dblclick', function ld(e) {
            projectName = this.id;
            loadWindow.style.display = 'none';
            loadWindow.style.visibility = 'hidden';

            loading();
            eStop();

            $.ajax({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                type: 'GET',
                url: 'loadproject/' + projectName,
                dataType: 'json',
                success: function (response, request) {

                    project = response;

                    timeSpace.timeAtPause = project.timeSpace.timeAtPause;
                    timeSpace.pxIncrement = project.timeSpace.pxIncrement;
                    timeSpace.pointedWidth = project.timeSpace.pointedWidth;
                    timeSpace.widthAtPause = project.timeSpace.widthAtPause;
                    timeSpace.zoom = project.timeSpace.zoom;
                    timeSpace.bpm = project.timeSpace.bpm;
                    timeSpace.compas = project.timeSpace.compas;
                    bpmButton.innerHTML = (120 / timeSpace.bpm) + '  bpm';
                    cursor.canvas.style.left = timeSpace.widthAtPause + 'px';

                    drawLayout();

                    //se elimina las pistas existentes si hubiesen
                    for (let i = 0; i < grid.recordings.length; i++) {
                        grid.recordings[i].canvasCtx.clearRect(0, 0, 4000, 70);
                        grid.recordings[i].deleteRecording();
                        delete grid.recordings[i].audioBuffer;
                    }
                    grid.recordings = [];
                    for (let i = 0; i < grid.tracks.length; i++) {
                        grid.tracks[i].recordings = [];
                    }

                    for (let i = 0; i < project.recordings.length; i++) {
                        const request = new XMLHttpRequest();
                        request.open("GET", 'loadsound/' + projectName + '/' + project.audioReferences[i], true);
                        request.responseType = "arraybuffer";
                        request.onload = function () {
                            let undecodedAudio = request.response;
                            audioCtx.decodeAudioData(undecodedAudio, (audioBuffer) => {
                                let track = grid.tracks[project.recordings[i].tracknumber];
                                track.addRecord(project.recordings[i].timeToStart, audioBuffer);
                            });
                        };
                        request.send();
                    }
                    //Se cargan los volúmenes de los faders
                    for (let i = 0; i < grid.tracks.length; i++) {
                        let fader = grid.tracks[i].fader;
                        grid.tracks[i].gainNode.gainValue = project.tracksGainValues[i];
                        fader.Y = project.tracksY[i];
                        fader.firstChild.nextSibling.style.top = project.tracksY[i] + 'px';
                        grid.tracks[i].gainNode.gain.setValueAtTime(grid.tracks[i].gainNode.gainValue, audioCtx.currentTime);
                    }
                    //Se carga el panorama
                    for (let f = 0; f < panButtons.length; f++) {
                        let ctxValue;
                        grid.tracks[f].pannerNode.pannerValue = project.trackspanValues[f];
                        panButtons[f].innerHTML = grid.tracks[f].pannerNode.pannerValue;
                        if (grid.tracks[f].pannerNode.pannerValue.toString().startsWith('L')) {
                            ctxValue = - + grid.tracks[f].pannerNode.pannerValue.slice(1) / 100;
                            grid.tracks[f].pannerNode.pan.setValueAtTime(ctxValue, audioCtx.currentTime);
                        }
                        else if (grid.tracks[f].pannerNode.pannerValue == 0
                            || grid.tracks[f].pannerNode.pannerValue.toString() == 'C') {
                            ctxValue = 0;
                            grid.tracks[f].pannerNode.pan.setValueAtTime(ctxValue, audioCtx.currentTime);
                        }
                        else if (grid.tracks[f].pannerNode.pannerValue.toString().startsWith('R')) {
                            ctxValue = grid.tracks[f].pannerNode.pannerValue.slice(1) / 100;
                            grid.tracks[f].pannerNode.pan.setValueAtTime(ctxValue, audioCtx.currentTime);
                        }
                    }

                    console.log('Project loaded successfully');
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log(errorThrown);
                }
            });
        });
    }
}
loadProject();
saveProject();




if (loadbtn) {
    loadbtn.addEventListener('click', function (e) {
        loadWindow.style.display = 'block';
        loadWindow.style.visibility = 'visible';
    });
    closeProjects.addEventListener('click', function (e) {
        loadWindow.style.display = 'none';
        loadWindow.style.visibility = 'invisible';
    });
}
if (savebtn) {
    savebtn.addEventListener('click', function (e) {
        saveWindow.style.display = 'block';
        saveWindow.style.visibility = 'visible';
    });
    closeSave.addEventListener('click', function (e) {
        saveWindow.style.display = 'none';
        saveWindow.style.visibility = 'invisible';
    });
}

