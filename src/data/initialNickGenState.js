import chroma from 'chroma-js';
import { colourModes } from './colourModes';

const nickGenState = {
    globalStyles: {
        bold: false,
        underline: false,
        strikethrough: false,
        italic: false,
        magic: false,
    },
    name: [
        {
            bold: false,
            strikethrough: false,
            underline: false,
            magic: false,
            char: 'N',
            colour: chroma('#ffffff'),
            locked: false,
        },
        {
            bold: false,
            strikethrough: false,
            underline: false,
            magic: false,
            char: 'i',
            colour: chroma('#ffffff'),
            locked: false,
        },
        {
            bold: false,
            strikethrough: false,
            underline: false,
            magic: false,
            char: 'c',
            colour: chroma('#ffffff'),
            locked: false,
        },
        {
            bold: false,
            strikethrough: false,
            underline: false,
            magic: false,
            char: 'k',
            colour: chroma('#ffffff'),
            locked: false,
        }
    ],
    colourMode: colourModes.gradient,
    colours: ['#ff00ff', '#00ff00'],
    numberOfColours: 2,
    singleColour: '#ff00ff',
}

export default nickGenState;