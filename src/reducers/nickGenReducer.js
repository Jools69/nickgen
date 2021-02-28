import { colourModes } from '../data/colourModes';
import chroma from 'chroma-js';

export function nickGenReducer(state, action) {
    const mapAttrToName = (n, attr, val) => {
        return n.map(c => {
            return c.locked ? c : { ...c, [attr]: val };
        });
    }

    const mapGradientToName = (name, override = false) => {
        // Create the gradient
        let gradient = chroma.scale(state.colours).mode('lab');
        // Copy the current name object into a temp placeholder.
        let unlockedName = name.map((c, i) => ({char: c, ogIndex: i})).filter(el => (!el.char.locked) || override);
        const tempName = unlockedName.map((el, index) => {
            const offset = (1.0 / (unlockedName.length - 1)) * index;
            return { ...el, char: {...el.char, colour: gradient(offset)}};
        });
        // Here, we have the unlocked chars in an array, with the gradient applied, with ogIndex
        // Now we need to map through the input name array, and if we have a matching ogIndex in
        // tempName, we need to return the tempName char, else the input char.
        const mappedName = name.map ((char, index) => {
            const unlockedIndex = tempName.findIndex(el => el.ogIndex === index);
            if(unlockedIndex > -1)
                return tempName[unlockedIndex].char;
            else
                return char;
        });
        return mappedName;
    }

    const mapColoursToName = (name) => {
        switch (state.colourMode) {
            case colourModes.gradient:
                return mapGradientToName(name);
            case colourModes.single:
                return name.map(c => ({...c, colour: chroma(state.singleColour)}));
        }
    }

    let tempName;
    let newColours;
    
    switch (action.type) {
        case 'toggleLock':
            tempName = state.name.map((c, i) => (i === action.index ? {...c, locked: !c.locked} : c));
            return { ...state, name: tempName };
        case 'lockAll':
            tempName = state.name.map(c => ({ ...c, locked: true }));
            return { ...state, name: tempName };
        case 'unlockAll':
            tempName = state.name.map(c => ({ ...c, locked: false }));
            return { ...state, name: tempName }; 
        case 'toggleLocks':
            tempName = state.name.map(c => ({...c, locked: !c.locked}));
            return { ...state, name: tempName };
        case 'changeNumberOfColours':
            newColours = [...state.colours].concat(['#ffffff', '#ffffff']).splice(0, action.to);
            return { ...state, numberOfColours: action.to, colours: newColours};
        case 'updateColour':
            newColours = [...state.colours];
            newColours[action.index] = action.to;
            return { ...state, colours: newColours};
        case 'updateNick':
            tempName = [...state.name];
            let newName = action.newName;

            // If the new name is less than the current name, we need to truncate the copy to match;
            if (newName.length < tempName.length)
                tempName = tempName.slice(0, newName.length);
            else if (newName.length > tempName.length) {
                // We need to append instances of the char object onto tempName until it's the correct length.
                while (newName.length > tempName.length) {
                    tempName.push({
                        bold: state.bold,
                        strikethrough: state.strikethrough,
                        underline: state.underline,
                        italic: state.italic,
                        magic: false,
                        char: '',
                        colour: '#ffffff',
                        locked: false,
                    });
                }
            }
            // At this point, tempName = the correct length of newName.
            // Now we need to map the characters from the new name into the tempName object
            tempName = tempName.map((c, i) => {
                return (
                    { ...c, char: newName.charAt(i) }
                );
            });
    
            // and update the colour mappings.
            tempName = mapColoursToName(tempName);
            return {...state, name: tempName};
        case 'name':
            return { ...state, name: action.name };
        case 'globalStyle':
            return { ...state, globalStyles: {...state.globalStyles, [action.field]: action.value }};
        case 'applyStyleToName':
            tempName = mapAttrToName(state.name, action.field, action.value);
            return {...state, name: tempName};
        case 'resetStyles':
            const clearedStyles = {
                bold: false,
                underline: false,
                strikethrough: false,
                italic: false,
            };
            return {...state, globalStyles: clearedStyles, name: state.name.map(c => ({...c, ...clearedStyles, locked: false}))};
        case 'applyColours':
            tempName = [...state.name];
            tempName = mapColoursToName(tempName);
            return {...state, name: tempName};
        case 'updateCharColour':
            tempName = [...state.name];
            tempName[action.index].colour = action.colour;
            return {...state, name: tempName};
        case 'changeColourMode':
            return {...state, colourMode: colourModes[action.mode]};
        case 'updateSingleColour':
            return {...state, singleColour:action.to};
        default:
            return state;
    }
}

