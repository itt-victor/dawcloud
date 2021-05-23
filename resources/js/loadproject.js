var toWav = require('audiobuffer-to-wav')

import { audioCtx } from './app_core';
import { timeSpace } from './timeSpace';
import { grid } from './components/generalgrid';
import { ui_draw } from './ui/ui_draw';
import { dragRecording } from './ui/ui_dragRecordings';
import drawLayout from './ui/ui_layout';
import { cursor } from './components/cursor';



class Project {
    constructor(timeSpace, recordings, audioBuffers, tracksGainValues, tracksY) {
        this.timeSpace = timeSpace;
        this.recordings = recordings;
        this.audioBuffers = audioBuffers;
        this.audioReferences = [];  //almacenas los nombres de los wav para recuperarlos
        this.tracksGainValues = tracksGainValues;
        this.tracksY = tracksY;
    }
}

const loadbtn = document.getElementById('load_project');
const savebtn = document.getElementById('save_project');
const bpmButton = document.getElementById('bpm_button');

var project;
var projectName;

function saveProject() {
    var saveWindow = document.getElementById('save_dialogue');
    saveWindow.children[1].addEventListener('keyup', function (e) {

        if (e.keyCode === 13) {
            e.preventDefault();
            projectName = saveWindow.children[1].value;
            saveWindow.style.display = 'none';
            saveWindow.style.visibility = 'hidden';

            var tracksGainValues = [];
            var audioBuffers = [];
            var tracksY = [];

            //Se guardan los valores de gain de cada pista
            for (let i = 0; i < grid.tracks.length; i++) {
                tracksGainValues.push(grid.tracks[i].gainNode.gainValue);
                tracksY.push(grid.tracks[i].fader.Y);
            }

            //creo objeto proyecto
            project = new Project(timeSpace, grid.recordings, audioBuffers, tracksGainValues, tracksY);

            //Se convierten los audioBuffers en wav, se convierten a su vez en blob, y se genera una URL del mismo
            for (let i = 0; i < grid.recordings.length; i++) {
                var blob = new window.Blob([new DataView(toWav(grid.recordings[i].audioBuffer))], {
                    type: 'audio/wav'
                });

                var formdata = new FormData();
                formdata.append('audio-blob', blob);
                formdata.append('recording-id', grid.recordings[i].id);
                formdata.append('project-name', projectName);
                /*$.ajaxSetup({
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    }
                });*/
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
                project.audioReferences.push(projectName + '_' + grid.recordings[i].id);
            }

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
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                }
            });
        }
    });
}

//setTimeout(function() {saveProject();}, 5000);

//hum, igual es mejor hacerlo por backend
function loadProject() {
    var loadWindow = document.getElementById('load_dialogue');
    loadWindow.children[1].addEventListener('keyup', function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            projectName = loadWindow.children[1].value;
            loadWindow.style.display = 'none';
            loadWindow.style.visibility = 'hidden';
            $.ajax({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                type: 'GET',
                url: 'loadproject/' + projectName,
                dataType: 'json',
                success: function (response, request) {
                    project = JSON.parse(response);
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

                    //var newGrid = new Grid([], project.recordings);
                    grid.recordings = project.recordings;
                    for (let i = 0; i < grid.recordings.length; i++) {
                        //grid.recordings[i].audioBuffer =
                        const request = new XMLHttpRequest();
                        request.open("GET", 'loadsound/' + projectName + '/' + project.audioReferences[i], true);
                        request.responseType = "arraybuffer";
                        request.onload = function () {
                            let undecodedAudio = request.response;
                            audioCtx.decodeAudioData(undecodedAudio, (data) => {
                                var audioBuffer = data;
                                grid.recordings[i].audioBuffer = audioBuffer;
                                grid.recordings[i].canvas = document.createElement('canvas');
                                grid.recordings[i].canvasCtx = grid.recordings[i].canvas.getContext('2d');
                                //grid.tracks[grid.recordings[i].tracknumber].recordings.push(grid.recordings[i]);
                                grid.tracks[grid.recordings[i].tracknumber].trackDOMElement.appendChild(grid.recordings[i].canvas);
                                ui_draw.drawRecording(grid.recordings[i]);
                            });
                        };
                        request.send();
                    }
                    for (let i = 0; i < grid.tracks.length; i++){
                        let fader = grid.tracks[i].fader;
                        grid.tracks[i].gainNode.gainValue = project.tracksGainValues[i];
                        fader.firstChild.nextSibling.style.top = project.tracksY[i] + 'px';
                        grid.tracks[i].gainNode.gain.setValueAtTime(grid.tracks[i].gainNode.gainValue, audioCtx.currentTime);
                    }
                    setTimeout(dragRecording, 1000);

                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log(errorThrown);
                }
            });
        }
    });
}

loadbtn.addEventListener('click', function (e) {
    var loadWindow = document.getElementById('load_dialogue');
    loadWindow.style.display = 'block';
    loadWindow.style.visibility = 'visible';
    loadProject()
});
savebtn.addEventListener('click', function (e) {
    var saveWindow = document.getElementById('save_dialogue');
    saveWindow.style.display = 'block';
    saveWindow.style.visibility = 'visible';
    /*window.addEventListener('click', function br(a) {
        if (!a.target.contains(e.target)) {
            saveWindow.style.display = 'none';
            saveWindow.style.visibility = 'hidden';
            this.removeEventListener('click', br);
        }
    });*/
    saveProject()
});



//BUENO, A VER, LA COSA ESTÁ EN QUE PARA HAXCERLO BIEN, ESTOS JSON HABRÁN DE REFERENCIAR TAMBIÉN LA LISTA DE AUDIOS ASOCIADOS
//AL PROYECTO,
