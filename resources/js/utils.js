

//genera números de grabación en incremento
var tracknumber = 0;
var recordnumber = 0;
var tracknamenumber = 0;
var recordingId = -1;


export function generateTrackNumbers(){
    tracknumber++;
    return 'track_' + tracknumber;
}

export function generateRecordingNumbers(){
    recordnumber++;
    return 'recording_' + recordnumber;
}

export function generateTrackNameNumbers(){
    tracknamenumber++;
    return 'track_name_' + tracknamenumber;
}

export function generateRecordingId(){
    recordingId++
    return 'recording_' + recordingId;
}
