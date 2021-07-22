import Recording from './recording';
import { grid, audioCtx } from '../app_core';
import { editRecording } from '../actions/editRecordings';
import { copyPaste } from '../actions/copyPaste';
import { removeRecording } from '../actions/actions';
import { cutRecording } from '../actions/cutRecordings';

export default class Track {

    private readonly _tracknumber: number;
    public get tracknumber(): number {
        return this._tracknumber;
    }

    public parent: this;

    trackDOMElement: Element;
    soloButton: HTMLButtonElement;
    soloToggle!: boolean;
    muteButton: HTMLButtonElement;
    muteToggle!: boolean;
    fader : HTMLElement;
    Y: number;

    private _pannerValue: string;
    public get pannerValue(): string {
        return this._pannerValue;
    }
    public set pannerValue(value: string) {
        this._pannerValue = value;
    }

    private _gainValue: number;
    public get gainValue(): number {
        return this._gainValue;
    }
    public set gainValue(value: number) {
        this._gainValue = value;
    }

    private _name!: string;
    get name(): string {
        return this._name;
    }
    set name(value: string) {
        this._name = value;
    }


    pannerNode = audioCtx.createStereoPanner();
    gainNode = audioCtx.createGain();

    constructor(tracknumber: number) {
        this._tracknumber = tracknumber;
        this.trackDOMElement = document.getElementsByClassName('track')[this.tracknumber];
        this._pannerValue = 'C';
        this._gainValue = 1;
        this.parent = this;
        this.soloButton = document.getElementById(`solo_${this.tracknumber}`) as HTMLButtonElement;
        this.muteButton = document.getElementById(`mute_${this.tracknumber}`) as HTMLButtonElement;
        this.fader = document.getElementById(`fader_${this.tracknumber}`) as HTMLInputElement;
        this.Y = 20;
    }
    addRecord(recordingId: string, timeToStart: number, audioBuffer: AudioBuffer, offset: number, duration: number, copy: boolean) {
        let recording = new Recording(recordingId, timeToStart, audioBuffer, this.tracknumber, offset, duration);
        grid.recordings.push(recording);
        this.trackDOMElement.appendChild(recording.canvas);
        recording.canvas.classList.add("recording");
        recording.canvas.id = recording.id.toString();
        if (!copy) recording.drawwaveforms();
        editRecording(recording);
        cutRecording(recording);
        copyPaste(recording);
        removeRecording(recording);

        return recording;
    };
}

