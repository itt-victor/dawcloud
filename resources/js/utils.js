

//genera números de grabación en incremento
export const numbers = {
    tracknumber : 0,
    recordnumber : 0,
    tracknamenumber : 0,
    recordingId : -1
};


export const generateTrackNumbers = () => {
    numbers.tracknumber++;
    return 'track_' + numbers.tracknumber;
}

export const generateRecordingNumbers = () =>{
    numbers.recordnumber++;
    return 'recording_' + numbers.recordnumber;
}

export const generateTrackNameNumbers = () =>{
    numbers.tracknamenumber++;
    return 'track_name_' + numbers.tracknamenumber;
}

export const generateRecordingId = () =>{
    numbers.recordingId++
    return 'recording_' + numbers.recordingId;
}

export const onMousePos = (context, evt) => {
    const rect = context.getBoundingClientRect();
    return {
        x: Math.round(evt.clientX - rect.left),
        y: Math.round(evt.clientY - rect.top)
    };
}
