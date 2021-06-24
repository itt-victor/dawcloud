
export var timeSpace = {
    space: 0,
    time: function () {
        var time = this.space / this.zoom;
        return time;
    },
    zoom: 20,        //px por segundo
    bpm: 1,          // 120 = 1   60 = 2
    compas: 2,        //2 es 4/4 1.5 es 3/4
    snap: parseFloat(snap_ratio.value)
};
