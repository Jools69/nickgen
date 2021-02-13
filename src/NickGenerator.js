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


function NickGenerator() {

    function globalStylesReducer(state, action) {
        switch (action.type) {
            case 'field':
                return { ...state, [action.field]: action.value };
            case 'resetStyles':
                return action.value;
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

    const [state, dispatch] = useLocalStorageReducer('globalStyles', globalStyleState, globalStylesReducer);

    let gradient = chroma.scale(colours).mode('lab');

    const toggleLock = (i) => {
        let tempName = [...name];
        tempName[i].locked = !tempName[i].locked;
        //tempName = mapGradientToName(tempName);
        setName(tempName);
    }

    const lockAll = () => {
        let tempName = name.map(c => ({...c, locked: true}));
        setName(tempName);
    }

    const unlockAll = () => {
        let tempName = name.map(c => ({...c, locked: false}));
        //tempName = mapGradientToName(tempName);
        setName(tempName);
    }

    const toggleLocks = () => {
        let tempName = name.map(c => ({...c, locked: !c.locked}));
        setName(tempName);
    }
    
    let characters = name.map((c, i) => {
        return (<Character key={i}
            index={i}
            colour={c.colour}
            value={c.char}
            bold={c.bold}
            italic={c.italic}
            strikethrough={c.strikethrough}
            underline={c.underline}
            locked={c.locked}
            toggleLock={toggleLock} />);
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

    const mapAttrToName = (n, attr, val) => {
        return n.map(c => {
            return c.locked ? c : { ...c, [attr]: val };
        });
    }

    const handleCheckedChange = (e) => {
        const value = e.target.checked;
        const field = e.target.name;
        dispatch({ type: 'field', field, value });

        let tempName = [...name];
        tempName = mapAttrToName(tempName, e.target.name, value);
        setName(tempName);
    }

    const handleKeyDown = (e) => {
        // we need to ensure that any spaces the user enters are ignored.
        if (e.key === " ")
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
 
    const handleReset = () => {
        // This function needs to reset all locks to unlocked, and remove
        // all global styles, and clear the checkboxes.
        const clearedStyles = {
            bold: false,
            underline: false,
            strikethrough: false,
            italic: false,
        };
        dispatch({ type: 'resetStyles', value: clearedStyles });
        
        // clear all of the styles in the name object.
        let tempName = name.map(c => ({...c, ...clearedStyles, locked: false}));
        //tempName = mapGradientToName(tempName);
        setName(tempName);
    }
    
    const mapGradientToName = (n, override = false) => {
        // Copy the current name object into a temp placeholder.
        const tempName = n.map((c, i) => {
            const offset = (1.0 / (n.length - 1)) * i;
            return (c.locked && !override) ? c : { ...c, colour: gradient(offset) };
        });
        return tempName;
    }

    useEffect(() => {
        setName(mapGradientToName(name));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [colours]);

    // This is to apply the colours read from local storage when the app runs for the first time.
    useEffect(() => {
        setName(mapGradientToName(name, true));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="container">
            <div className="controlPanel">
                <h6>Styles</h6>
                <CheckBox label='All Bold' name='bold' handleChange={handleCheckedChange} checked={state.bold} />
                <CheckBox label='All Underline' name='underline' handleChange={handleCheckedChange} checked={state.underline} />
                <CheckBox label='All Strikethrough' name='strikethrough' handleChange={handleCheckedChange} checked={state.strikethrough} />
                <CheckBox label='All Italic' name='italic' handleChange={handleCheckedChange} checked={state.italic} />
                {/* <h6>Colour</h6> */}
                {/* <h6>Reset</h6> */}
                <button type='button' className='resetButton' onClick={handleReset}>Reset All</button>
            </div>
            <div className="NickGenerator">
                <div className="nameInput">
                    <div><label htmlFor="name">Enter your nick:</label></div>
                    <input
                        maxLength="16"
                        type="text"
                        id="name"
                        value={name.map(c => c.char).join('')}
                        placeholder="nick"
                        onChange={handleNickChange}
                        onKeyDown={handleKeyDown} />
                </div>
                <div className="Colours">
                    {characters}
                </div>
                <div className="LockControls">
                    <div className="control" onClick={lockAll}>
                        <span>Lock All: </span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-lock" viewBox="0 0 16 16">
                            <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
                        </svg>
                    </div>
                    <div className="control" onClick={unlockAll}>
                        <span>Unlock All: </span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-unlock" viewBox="0 0 16 16">
                            <path d="M11 1a2 2 0 0 0-2 2v4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5V3a3 3 0 0 1 6 0v4a.5.5 0 0 1-1 0V3a2 2 0 0 0-2-2zM3 8a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1H3z" />
                        </svg>
                    </div>
                    <div className="control" onClick={toggleLocks}>
                        <span>Toggle Locks: </span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-toggles" viewBox="0 0 16 16">
                            <path d="M4.5 9a3.5 3.5 0 1 0 0 7h7a3.5 3.5 0 1 0 0-7h-7zm7 6a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm-7-14a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zm2.45 0A3.49 3.49 0 0 1 8 3.5 3.49 3.49 0 0 1 6.95 6h4.55a2.5 2.5 0 0 0 0-5H6.95zM4.5 0h7a3.5 3.5 0 1 1 0 7h-7a3.5 3.5 0 1 1 0-7z" />
                        </svg>
                    </div>
                </div>
                <ColoursSlider
                    className="ColourSlider"
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