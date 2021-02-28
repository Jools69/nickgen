import React, { useEffect, useContext, Fragment } from 'react';
import chroma from 'chroma-js';
import './styles/NickGenerator.css';
import ColoursSlider from './ColoursSlider';
import ColourPickers from './ColourPickers';
import CodedNick from './CodedNick';
import Character from './Character';
import CheckBox from './CheckBox';
import { colourModes } from './data/colourModes';
import { useFirstRender } from './hooks/useFirstRender';
import { NickGenContext, DispatchContext } from './contexts/nickGen.context';

function NickGenerator() {

    const maxColours = 5;

    const state = useContext(NickGenContext);
    const dispatch = useContext(DispatchContext);

    const { colours, numberOfColours, name, colourMode, singleColour } = state;
    const { bold, strikethrough, underline, italic } = state.globalStyles;

    const firstRender = useFirstRender();

    const toggleLock = (i) => {
        dispatch({ type: 'toggleLock', index: i });
    }

    const lockAll = () => {
        dispatch({ type: 'lockAll' });
    }

    const unlockAll = () => {
        dispatch({ type: 'unlockAll' });
    }

    const toggleLocks = () => {
        dispatch({ type: 'toggleLocks' })
    }

    const updateCharColour = (i, colour) => {
        dispatch({ type: 'updateCharColour', index: i, colour: chroma(colour) });
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
            toggleLock={toggleLock}
            updateCharColour={updateCharColour} />);
    });

    const updateNumberOfColours = (e) => {
        dispatch({ type: 'changeNumberOfColours', to: e });
    };

    const updateColour = (index, newColour) => {
        dispatch({ type: 'updateColour', index: index, to: newColour });
    }

    const updateSingleColour = (i, newColour) => {
        dispatch({type: 'updateSingleColour', to: newColour});
    }

    const handleCheckedChange = (e) => {
        const value = e.target.checked;
        const field = e.target.name;
        dispatch({ type: 'globalStyle', field, value });
        dispatch({ type: 'applyStyleToName', field, value })
    }

    const handleRadioChange = (e) => {
        dispatch({ type: 'changeColourMode', mode: e.target.value });
    }

    const handleKeyDown = (e) => {
        // we need to ensure that any spaces the user enters are ignored.
        if (e.key === " ")
            e.preventDefault();
    }

    const handleNickChange = (e) => {
        dispatch({ type: 'updateNick', newName: e.target.value });
    }

    const handleReset = () => {
        // This function needs to reset all locks to unlocked, and remove
        // all global styles, and clear the checkboxes.
        dispatch({ type: 'resetStyles' });
    }

    useEffect(() => {
        if (!firstRender)
            dispatch({ type: 'applyColours' });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [colours, singleColour]);

    return (
        <div className="container">
            <div className="controlPanel">
                <h6>Styles</h6>
                <CheckBox label='All Bold' name='bold' handleChange={handleCheckedChange} checked={bold} />
                <CheckBox label='All Underline' name='underline' handleChange={handleCheckedChange} checked={underline} />
                <CheckBox label='All Strikethrough' name='strikethrough' handleChange={handleCheckedChange} checked={strikethrough} />
                <CheckBox label='All Italic' name='italic' handleChange={handleCheckedChange} checked={italic} />
                <button type='button' className='resetButton' onClick={handleReset}>Reset All</button>
                <h6>Colour Mode</h6>
                <div className='radioContainer'>
                    <div className='colourMode'>
                        <input type='radio'
                            name='colourType'
                            id='gradient'
                            value='gradient'
                            checked={colourMode === colourModes.gradient}
                            onChange={handleRadioChange}></input>
                        <label for='gradient'>Gradient</label>
                    </div>
                    <div className='colourMode'>
                        <input type='radio'
                            name='colourType'
                            id='individual'
                            value='individual'
                            checked={colourMode === colourModes.individual}
                            onChange={handleRadioChange}></input>
                        <label for='individual'>Individual</label>
                    </div>
                    <div className='colourMode'>
                        <input type='radio'
                            name='colourType'
                            id='single'
                            value='single'
                            checked={colourMode === colourModes.single}
                            onChange={handleRadioChange}></input>
                        <label for='single'>Single</label>
                    </div>
                    <div className='colourMode'>
                        <input type='radio'
                            name='colourType'
                            id='default'
                            value='mcDefault'
                            checked={colourMode === colourModes.mcDefault}
                            onChange={handleRadioChange}></input>
                        <label for='default'>Basic</label>
                    </div>
                </div>
                {/* <h6>Reset</h6> */}
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
                <div className="Preview">
                    {characters}
                </div>
                <div className="LockControls">
                    <div className="control" onClick={lockAll}>
                        <span>Lock All: </span>
                        <object class="icon" type="image/svg+xml" data="lock.svg" />
                    </div>
                    <div className="control" onClick={unlockAll}>
                        <span>Unlock All: </span>
                        <object class="icon" type="image/svg+xml" data="unlock.svg" />
                    </div>
                    <div className="control" onClick={toggleLocks}>
                        <span>Toggle Locks: </span>
                        <object class="icon" type="image/svg+xml" data="toggle.svg" />
                    </div>
                </div>
                {colourMode === colourModes.gradient &&
                    <Fragment>
                        <ColoursSlider
                            className="ColourSlider"
                            numberOfColours={numberOfColours}
                            maxNumOfColours={maxColours}
                            handleSliderChange={updateNumberOfColours} />
                        <div>
                            <ColourPickers colours={colours} numberOfPickers={numberOfColours} updateColour={updateColour} />
                        </div>
                    </Fragment>}
                {colourMode === colourModes.single &&
                    <div>
                        <ColourPickers colours={[singleColour]} numberOfPickers={1} updateColour={updateSingleColour}/>
                    </div>
                }
                <CodedNick nick={name} />
            </div>
        </div>
    );
}

export default NickGenerator;