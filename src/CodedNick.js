import { useContext } from 'react';
import { colourModes } from './data/colourModes';
import './styles/CodedNick.css';
import chroma from 'chroma-js';
import { NickGenContext } from './contexts/nickGen.context';
import { mcDefaultColours } from './data/mcDefaultColours';

function CodedNick(props) {

    const { nick } = props;
    const state = useContext(NickGenContext);
    const { colourMode, singleColour } = state;

    let codedString;

    const stylesCodeMap = {
        bold: { value: 1, code: '&l' },
        strikethrough: { value: 2, code: '&m' },
        underline: { value: 4, code: '&n' },
        italic: { value: 8, code: '&o' },
        magic: { value: 16, code: '&k' }
    };

    // This function will take a character object, and return a unique coded value that reflects the applied styles.
    const mapStyles = (char) => {
        return ((char.bold && stylesCodeMap.bold.value) +
            (char.strikethrough && stylesCodeMap.strikethrough.value) +
            (char.underline && stylesCodeMap.underline.value) +
            (char.italic && stylesCodeMap.italic.value) +
            (char.magic && stylesCodeMap.magic.value));
    }

    const getStyleCodes = (char) => {
        // This function returns the combined style codes in a string for the provided character object.
        return `${char.bold ? '&l' : ''}${char.strikethrough ? '&m' : ''}${char.underline ? '&n' : ''}${char.italic ? '&o' : ''}${char.magic ? '&k' : ''}`;
    }

    const getColourCode = (char) => {
        // This function returns the colour code of the provided character object, based on the current colourMode.
        switch (colourMode) {
            case colourModes.mcDefault:
                const defColour = mcDefaultColours.find(col => col.colour === chroma(char.colour._rgb).hex().toUpperCase());
                return defColour ? defColour.code : '&#ffffff';
            case colourModes.single:
                return `&${chroma(singleColour).hex()}`;
            default:
                return `&${chroma(char.colour._rgb).hex()}`;
        }
    }

    // This function takes the set of chars, and returns a string with the fewest command codes in.
    // Note: this is purely for when a single colour is used initially, which is added by the calling code, so
    // should be ignored here.
    const reduceStyles = (chars, includeColour = false) => {
        const reducedStr = chars.map((c, i, a) => {
            if (i === 0)
                if(includeColour)
                    return `${getColourCode(c)}${getStyleCodes(c)}${c.char}`;
                else
                    return `${getStyleCodes(c)}${c.char}`;
            else {
                const stylesMatch = mapStyles(c) === mapStyles(a[i - 1]);
                const coloursMatch = includeColour ? chroma(c.colour._rgb).hex() === chroma(a[i - 1].colour._rgb).hex() : true;
                const toAdd = [];
                if (stylesMatch && coloursMatch) {
                    // The current character has the same styles and colour as the previous character, so we just need to return the char.
                    return `${c.char}`;
                }
                else {
                    // There is a difference between the current character's styles/colour and the previous character's styles/colour.
                    // So we need to work out what commands to add to the current char.
                    const styleKeys = Object.keys(stylesCodeMap);
                    let resetRequired = false;

                    // If the colour is different, we need to return the full details for the current char.
                    if (!coloursMatch) {
                        return `${getColourCode(c)}${getStyleCodes(c)}${c.char}`;
                    }
                    else {
                        // The colour is the same (or unimportant for the current colourMode) so the styles
                        // must have changed between the current and previous characters.
                        for (const key of styleKeys) {
                            // Check if the current style is different to the previous char
                            // and the previous style is set (so has been removed)
                            if ((c[key] !== a[i - 1][key]) && a[i - 1][key]) {
                                // We have had a style removed, so we need a reset at this point.
                                resetRequired = true;
                                break;
                            }
                            // Check if the current style is different to previous, and the
                            // current style is set (so has been added)
                            else if ((c[key] !== a[i - 1][key]) && c[key]) {
                                // We need to add the current style to the char, so track the key in 
                                // the toAdd array.
                                toAdd.push(key);
                            }
                            // If we get here, then the current style we're looking at is the same as in the previous char, so we
                            // don't need to do anything.
                        }
                        // Do we need to reset the styles for this character?
                        if (resetRequired) {
                            // Yes so add the reset code, followed by the singleColour (else this gets reset too) and then the styles
                            return `&r${getColourCode(c)}${getStyleCodes(c)}${c.char}`;
                        }
                        else {
                            // A reset was not required, meaning that one or more styles have been added, and are in the
                            // toAdd array. So we need to return the string that makes up the relevant codes as well as the character.
                            let tempStr = '';
                            for (let taKey of toAdd) {
                                tempStr += stylesCodeMap[taKey].code;
                            }
                            tempStr += c.char;
                            return tempStr;
                        }
                    }
                }
            }
        });
        return reducedStr;
    }

    if (colourMode === colourModes.single) {
        codedString = `/nick &${chroma(singleColour).hex()}${reduceStyles(nick, false).join('')}`;
    }
    else if (colourMode === colourModes.mcDefault || colourMode === colourModes.individual) {
        codedString = '/nick ' + reduceStyles(nick, true).join('');
    }
    else
        codedString = '/nick ' + nick.map((c) => {
            return `${getColourCode(c)}${getStyleCodes(c)}${c.char}`
        }).join('');

    return (
        <div className="codedNick">
            <div className="commandString">
                <p>
                    {codedString}
                </p>
            </div>
            <button
                className="copyButton"
                onClick={(e) => {
                    navigator.clipboard.writeText(codedString);
                }}>
                Copy text
            </button>
        </div>
    );
}

export default CodedNick;