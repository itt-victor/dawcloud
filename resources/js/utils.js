

//genera números de grabación en incremento
export var numbers = {
    tracknumber : 0,
    recordnumber : 0,
    tracknamenumber : 0,
    recordingId : -1
};

/*var tracknumber = 0;
var recordnumber = 0;
var tracknamenumber = 0;
export var recordingId = -1;*/


export function generateTrackNumbers(){
    numbers.tracknumber++;
    return 'track_' + numbers.tracknumber;
}

export function generateRecordingNumbers(){
    numbers.recordnumber++;
    return 'recording_' + numbers.recordnumber;
}

export function generateTrackNameNumbers(){
    numbers.tracknamenumber++;
    return 'track_name_' + numbers.tracknamenumber;
}

export function generateRecordingId(){
    numbers.recordingId++
    return 'recording_' + numbers.recordingId;
}
