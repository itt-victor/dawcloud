import { cursor } from './cursor';

export var trackGrid = {
    howMany: 4,
    cursor: cursor,
    soundBuffers: [],
    tracks: 2,



    /**
     * @param {any} trackBuffers
     */
    set addSoundBuffers(trackBuffers) { this.soundBuffers.push(...trackBuffers) }



    //interval: setInterval(update)
};
//incluye aquí el interval que sea general para todos los componentes
