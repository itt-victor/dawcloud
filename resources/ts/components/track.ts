import Recording from './recording';
import { grid, audioCtx, soundcontroller } from '../app_core';

export default class Track {

    private readonly _tracknumber: number;
    public get tracknumber(): number {
        return this._tracknumber;
    }

    public parent: this;

    trackDOMElement: Element;
    soloButton: HTMLButtonElement;
    soloToggle!: boolean;
    muteButton!: HTMLButtonElement;
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

        //MUTE
        this.muteButton.addEventListener('click', function () {
            const trck = grid.tracks[parseInt(this.id.charAt(5))];
            this.classList.toggle('track_mute_on');
            if (!trck.muteToggle) {
                soundcontroller.mute(trck.gainNode);
                trck.muteToggle = true;
            } else if (trck.muteToggle) {
                soundcontroller.solo(trck);
                trck.muteToggle = false;
            }
            for (const track of grid.tracks) {
                if (track.soloToggle) soundcontroller.mute(trck.gainNode);
            }
        });

        //SOLO
        const soloButtons = document.getElementsByClassName('track_solo') as HTMLCollectionOf<HTMLButtonElement>;
        const parentTrack = (element: HTMLElement) => grid.tracks[parseInt(element.id.charAt(5))];
        this.soloButton.addEventListener('click',  () =>{

            this.soloButton.classList.toggle('track_solo_on');
            this.soloToggle = this.soloToggle ? false : true;

            for (const btn of soloButtons) {
                if (parentTrack(btn).soloToggle) {
                    grid.solo = true;
                    break;
                }
                else grid.solo = false;
            }
            for (const btn of soloButtons) {
                if (grid.solo) {
                    (parentTrack(btn).soloToggle) ?
                        soundcontroller.solo(parentTrack(btn)) :
                        soundcontroller.mute(parentTrack(btn).gainNode);
                }
                else if (parentTrack(btn).muteToggle) return;
                else    soundcontroller.solo(parentTrack(btn));
            }
        });
    }

    addRecord({recordingId, timeToStart, audioBuffer, offset, duration, copy}: RecordArgs) {
        let recording = new Recording(recordingId, timeToStart, audioBuffer, this.tracknumber, offset, duration);
        grid.recordings.push(recording);
        this.trackDOMElement.appendChild(recording.canvas);
        return recording;
    };
}

export interface RecordArgs{
    recordingId: string,
    timeToStart: number,
    audioBuffer: AudioBuffer,
    offset: number,
    duration: number,
    copy: boolean
}


