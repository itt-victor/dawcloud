

//genera números de grabación en incremento
var tracknumber = 0;
var recordnumber = 0;

export function generateTrackNumbers(){
    tracknumber++;
    return 'track_' + tracknumber;
}

export function generateRecordingNumbers(){
    recordnumber++;
    return 'recording_' + recordnumber;
}
