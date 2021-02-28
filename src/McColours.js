import React, { useState } from 'react';
import { mcDefaultColours } from './data/mcDefaultColours';
import './styles/McColours.css';

function McColours(props) {
    const [palleteShown, setPalleteShown] = useState(false);

    const { height, width, defaultColour, updateColour } = props;

    const blockStyles = {
        display: palleteShown ? 'flex' : 'none',
        width: '25%',
        height: '25%',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '10px',
    };

    const topStyles = {
        width: palleteShown ? width : '0.5em',
        height: palleteShown ? height : '0.6em',
        backgroundColor: defaultColour,
        transition: 'all 0.2s',
        "&:hover": {
            cursor: 'pointer',
            boxShadow: '#222 5px 5px 10px',
        }
    };

    const handleClick = (e) => {
        setPalleteShown(!palleteShown);
    }

    const handleColourClick = (e) => {
        updateColour(e.target.id);
    }
 
    const blocks = mcDefaultColours.map(c => {
        const styles = {...blockStyles, backgroundColor: c.colour};
        return (
            <div className='McColourBlock' style={styles} id={c.colour} onClick={handleColourClick}>
                {/* {c.name} */}
            </div>
        );        
    });

    return (
        <div className='McColours' style={topStyles} onClick={handleClick}>
            {palleteShown && blocks}
        </div>
    );
}

export default McColours;