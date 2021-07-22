
const snap_ratio = document.querySelector('#snap_ratio') as HTMLSelectElement;

export const timeSpace = {
    space: 0,
    time: function () {
        let time = this.space / this.zoom;
        return time;
    },
    zoom: 20,        //px por segundo
    bpm: 1,          // 120 = 1   60 = 2
    compas: 2,        //2 es 4/4 1.5 es 3/4
    snap: parseFloat(snap_ratio.value),
    startMark: 0,
    endMark: 0,

    get getStartMark() {
        return this.startMark * this.zoom;
    },
    set setStartMark(input: number) {
        this.startMark = input / this.zoom;
    },

    get getEndMark() {
        return this.endMark * this.zoom;
    },
    set setEndMark(input: number) {
        this.endMark = input / this.zoom;
    }
};

export interface TimeSpace {
    space: number;
    time: () => number;
    zoom: number;
    bpm: number;
    compas: number;
    snap: number;
    startMark: number;
    endMark: number;
}
