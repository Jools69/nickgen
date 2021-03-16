import React, { useState } from 'react';
import { mcDefaultColours } from './data/mcDefaultColours';
import './styles/McColours.css';

function McColours(props) {
    const [showClass, setShowClass] = useState('');

    // Destructure props
    const { height, width, defaultColour, updateColour, defaultPalleteShown, toggleDefaultPalleteShown } = props;

    const handleClick = (e) => {
        // If a default pallete is already displayed, but our showClass isn't set to show
        // then another character is already showing the pallete - we only want one instance
        // of the pallete to be displayed at a time, so do nothing.
        if (defaultPalleteShown && showClass !== 'show')
            return;

        // Otherwise, we need to toggle the class to show/hide the pallete, and toggle
        // the main state's pallete shown flag.
        setShowClass(showClass === 'fade' || showClass === '' ? 'show' : 'fade');
        toggleDefaultPalleteShown();
    }

    const handleColourClick = (e) => {
        updateColour(e.target.id);
    }

    const blocks = mcDefaultColours.map(c => {
        const styles = { backgroundColor: c.colour };
        return (
            <div className='McColourBlock' style={styles} id={c.colour} onClick={handleColourClick}>
            </div>
        );
    });

    return (
        <div className='McColours' style={{ backgroundColor: defaultColour }} onClick={handleClick}>
            <div className={`McColoursContainer ${showClass}`} style={{ width: width, height: height }}>
                {blocks}
            </div>
        </div>
    );
}

export default McColours;