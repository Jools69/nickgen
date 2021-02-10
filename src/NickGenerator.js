import React, { useEffect } from 'react';
import chroma from 'chroma-js';
import './styles/NickGenerator.css';
import ColoursSlider from './ColoursSlider';
import ColourPickers from './ColourPickers';
import CodedNick from './CodedNick';
import Character from './Character';
import CheckBox from './CheckBox';
import useLocalStorageState from './hooks/useLocalStorageState';
import useLocalStorageReducer from './hooks/useLocalStorageReducer';


function globalStylesReducer(state, action) {
    switch (action.type) {
        case 'field':
            return {...state, [action.field]: action.value};
        case  'name':
            return state;
        default:
            return state;
    }
}

const globalStyleState = {
    bold: false,
    underline: false,
    strikethrough: false,
    italic: false,
};

function NickGenerator() {

    let initialNick = [
        {
            bold: false,
            strikethrough: false,
            underline: false,
            magic: false,
            char: 'N',
            colour: '#ffffff'
        },
        {
            bold: false,
            strikethrough: false,
            underline: false,
            magic: false,
            char: 'i',
            colour: '#ffffff'
        },
        {
            bold: false,
            strikethrough: false,
            underline: false,
            magic: false,
            char: 'c',
            colour: '#ffffff'
        },
        {
            bold: false,
            strikethrough: false,
            underline: false,
            magic: false,
            char: 'k',
            colour: '#ffffff'
        }
    ];

    const [colours, setColours] = useLocalStorageState('colours', ['#ff00ff', '#00ff00']);
    const [numberOfColours, setNumberOfColours] = useLocalStorageState('numOfColours', 2);
    const [name, setName] = useLocalStorageState('name', initialNick);
    const maxColours = 5;

    // const [state, dispatch] = useReducer(globalStylesReducer, globalStyleState);
    const [state, dispatch] = useLocalStorageReducer('globalStyles', globalStyleState, globalStylesReducer);

    let gradient = chroma.scale(colours).mode('lab');

    let characters = name.map((c, i) => {
        return (<Character key={i} 
                           colour={c.colour} 
                           value={c.char} 
                           bold={c.bold} 
                           italic={c.italic}
                           strikethrough={c.strikethrough}
                           underline={c.underline}/>);
    });

    const updateNumberOfColours = (e) => {
        setNumberOfColours(e);
        const newColours = [...colours].concat(['#ffffff', '#ffffff']).splice(0, e);
        setColours(newColours);
    };

    const updateColour = (index, newColour) => {
        const newColours = [...colours];
        newColours[index] = newColour;
        setColours(newColours);
    }

    const handleCheckedChange = (e) => {
        const value = e.target.checked;
        const field = e.target.name;
        dispatch({type: 'field', field, value});
    
        let tempName = [...name];
        tempName = mapAttrToName(tempName, e.target.name, value);
        setName(tempName);
    }

    const handleKeyDown = (e) => {
        // we need to ensure that any spaces the user enters are ignored.
        if(e.key === " ")
            e.preventDefault();
    }

    const handleNickChange = (e) => {
        // Pull out the updated name from the input
        const newName = e.target.value;

        // Create a copy of the current name array
        let tempName = [...name];

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
                    colour: '#ffffff'
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

        // and update the state.
        tempName = mapGradientToName(tempName);
        setName(tempName);
    }

    const mapGradientToName = (n) => {
        // Copy the current name object into a temp placeholder.
        const tempName = n.map((c, i) => {
            const offset = (1.0 / (n.length - 1)) * i;
            return ({ ...c, colour: gradient(offset) });
        });
        return tempName;
    }

    const mapAttrToName = (n, attr, val) => {
        return n.map(c => ({...c, [attr]:val}));
    }

    useEffect(() => {
        setName(mapGradientToName(name));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [colours]);

    return (
        <div className="container">
            <div className="controlPanel">
                <h6>Styles</h6>
                <CheckBox label='All Bold' name='bold' handleChange={handleCheckedChange} checked={state.bold} />
                <CheckBox label='All Underline' name='underline' handleChange={handleCheckedChange} checked={state.underline} />
                <CheckBox label='All Strikethrough' name='strikethrough' handleChange={handleCheckedChange} checked={state.strikethrough} />
                <CheckBox label='All Italic' name='italic' handleChange={handleCheckedChange} checked={state.italic} />
                <h6>Colour</h6>
            </div>
            <div className="NickGenerator">
                <div className="nameInput">
                    <div><label for="name">Enter your nick:</label></div>
                    <input
                        maxLength="16"
                        type="text"
                        id="name"
                        value={name.map(c => c.char).join('')}
                        placeholder="nick"
                        onChange={handleNickChange} 
                        onKeyDown={handleKeyDown}/>
                </div>
                <div className="Colours">
                    {characters}
                </div>
                <ColoursSlider
                    numberOfColours={numberOfColours}
                    maxNumOfColours={maxColours}
                    handleSliderChange={updateNumberOfColours} />
                <div>
                    <ColourPickers colours={colours} numberOfPickers={numberOfColours} updateColour={updateColour} />
                </div>
                <CodedNick nick={name} />
            </div>
        </div>
    );
}

export default NickGenerator;