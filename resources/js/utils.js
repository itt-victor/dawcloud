

//genera números de grabación en incremento
var number = 0;
export function generateTrackNumbers(){
    number++;
    return 'record_' + number;
}
