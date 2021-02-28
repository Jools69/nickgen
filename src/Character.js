import React, { useContext } from 'react';
import './styles/Character.css';
import chroma from 'chroma-js';
import { NickGenContext } from './contexts/nickGen.context';
import { colourModes } from './data/colourModes';
import McColours from './McColours';

function Character(props) {

const { index, colour, value, bold, strikethrough, italic, underline, locked, toggleLock, updateCharColour } = props;

    const state = useContext(NickGenContext);
    const { colourMode } = state;
    const fontWeight = bold ? 700 : 400;
    const textDec = `${strikethrough?'line-through ':''}${underline?'underline ':''}`;
    const fontStyle = `${italic?'italic':'normal'}`;
    return (
        < div className="CharacterContainer">
            <div className="Character" 
                style={{ 
                        color: chroma(...colour._rgb), 
                        fontWeight: fontWeight,
                        fontStyle: fontStyle,
                        textDecoration: textDec }}
            >{value}</div>
            { colourMode === colourModes.individual && 
            <div>
                <input 
                    key={index} 
                    id={index} 
                    type="color"
                    value={chroma(colour._rgb)}
                    className="charColourPicker"
                    onChange={(e) => updateCharColour(index, e.target.value)}/>
            </div>}
            {colourMode === colourModes.mcDefault &&
                <McColours width={100} height={100} defaultColour={chroma(...colour._rgb)} updateColour={(colour) => updateCharColour(index, colour)}/>}
            <div className="CharacterLock" onClick={() => toggleLock(index)}>
                {locked ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-lock" viewBox="0 0 16 16">
                    <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/>
                </svg> :
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-unlock" viewBox="0 0 16 16">
                <path d="M11 1a2 2 0 0 0-2 2v4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5V3a3 3 0 0 1 6 0v4a.5.5 0 0 1-1 0V3a2 2 0 0 0-2-2zM3 8a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1H3z"/>
              </svg>}
                
            </div>
        </div>
    );
}

export default Character;